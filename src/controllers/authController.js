const twilio = require('twilio');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTH;

const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

exports.signUp = async (req, res) => {
    try{
        const user = new User(req.body);
        const existingUser = await User.findOne({email: user.email});

        if(existingUser){
            return  res.status(409).json({message: 'Email Is already Taken'});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            return res.status(400).json({ error: 'Invalid email' });
          }
        const hashPassword = await bcrypt.hash(user.password, 10);
        user.password = hashPassword;
          // Generate OTP
        const otp = generateOTP();
        user.otp = otp;
        await twilioClient.messages.create({
            body: `Your OTP for registration is: ${otp}`,
            from: twilioPhoneNumber,
            to: `+91${user.contactNumber}`, // Assuming you have a phoneNumber field in your User model
          });
        await user.save();
        res.status(200).json({ message: `Otp Sent to ${user.contactNumber}`, id: user._id });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

exports.verifyOtpAndRegister = async(req, res) => {
    try {
        const userId = req.params.id;
        const enteredOTP = req.body.otp;
    
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Compare the entered OTP with the one stored in the user document
        if (enteredOTP === user.otp) {
          // OTP is valid, perform registration
          await user.save();
          res.status(200).json({ message: 'Phone Number verified. User registered successfully!!' });
        } else {
          res.status(400).json({ message: 'Invalid OTP' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.sendPasswordResetOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const otp = generateOTP();
  
      // Save the generated OTP to the user document
      user.otp = otp;
      await user.save();
  
      // Send the OTP to the user's phone number
      await twilioClient.messages.create({
        body: `Your OTP for password reset is: ${otp}`,
        from: twilioPhoneNumber,
        to: `+91${user.contactNumber}`,
      });
  
      res.status(200).json({ message: `Password reset OTP sent to ${user.contactNumber}`, mail: user.email });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify the entered OTP
      if (otp !== user.otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Reset the password
      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword;
  
      // Clear the stored OTP
      user.otp = null;
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Password reset Successfully!!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.login = async (req, res) =>{
    try{
        const user = new User(req.body);
        const existingUser = await User.findOne({email: user.email});
        if(!existingUser){
            return res.status(409).json({message: 'Please Provide Valid Email'});
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(409).json({ message: 'Invalid password' });
        }

      const token = jwt.sign({ userId: existingUser._id , prefix: 'Bearer '}, "secret_key", { expiresIn: '1h' });
      res.json({ token , userType:existingUser.userType, id:existingUser._id,  message: "Login SuccessFull!!" });
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}