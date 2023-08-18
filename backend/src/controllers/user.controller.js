import User from "../models/user.model";
import errorHandler from "../helpers/dbErrorHandler";
export const create = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: "Email already exists" });
    user = new User(req.body);
    await user.save();
    return res.status(200).json({ message: "Successfully signed up" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    user.hashedPassword = undefined;
    user.salt = undefined;
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
export const list = async (req, res) => {
  try {
    const users = await User.find().select("name email updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const read = (req, res) => {
  req.profile.hashedPassword = undefined;
  req.profile.email = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
