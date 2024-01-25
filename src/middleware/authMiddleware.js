const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  const actualToken = token.replace('Bearer ', '');

  // Verify the JWT token
  jwt.verify(actualToken,"secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach the decoded user ID to the request object for later use in route handlers
    req.userId = decoded.userId;
    // Call the next middleware or route handler
    next();
  });
};

// Export the middleware function for use in other files
module.exports = verifyToken;
