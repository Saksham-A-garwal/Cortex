const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      fullname: user.fullname,
      role : user.role
    },
    process.env.JWT_SECRET_KEY,
  );
};

const VerifyUser = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = { setUser, VerifyUser };
