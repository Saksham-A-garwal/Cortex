const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const {setUser} = require("../Services/authServices")

const handleCreateUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ msg: "Provide the Valid email" });

  const saltRounds = 12;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  await UserModel.create({
    fullname: fullname,
    email: email,
    password: hashPassword,
  });

  return res.status(201).json({ msg: "New User Created Successfully" });
};

const handleLoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ msg: "Provide a valid email" });

  // BUG 2 FIX: Use findOne and await
  const User = await UserModel.findOne({ email: email });

  // BUG 3 FIX: Check if user actually exists before comparing passwords
  if (!User) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const VerifyPassword = await bcrypt.compare(password, User.password);

  if (!VerifyPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = setUser(User);

  // BUG 4 FIX: Send token in JSON so React can easily grab it
  return res.status(200).json({
    msg: "Login Successful",
    token: token,
    user: { fullname: User.fullname, email: User.email },
  });
};

module.exports = {
  handleCreateUser,
  handleLoginUser,
};
