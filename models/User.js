const { mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    name: {type: String},
    contactNumber: {type: String},
    otp: {type: String}
})

userSchema.pre('save', async function (next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
    
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
    
          user.password = hash;
          next();
        });
      });
    });


module.exports = mongoose.model('User', userSchema);
    