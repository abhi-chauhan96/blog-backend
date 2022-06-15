import User from "../model/User";
import bcrypt from "bcryptjs";

//ALL USERS

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

//SIGN UP

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUSer;
  try {
    existingUSer = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUSer) {
    return res
      .status(400)
      .json({ message: "User already exists, Try Logging In instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    user: [],
  });

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

//LOGIN

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUSer;
  try {
    existingUSer = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUSer) {
    return res
      .status(404)
      .json({ message: "User doesn't exist, please signup in order to login" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUSer.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Wrong Password" });
  }
  return res
    .status(200)
    .json({ message: "Login successful", user: existingUSer });
};
