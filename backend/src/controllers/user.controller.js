import User from "../models/user.model";
import errorHandler from "../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
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
export const update = async (req, res) => {
  const form = formidable({});
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.mimetype;
    }
    try {
      await user.save();

      user.photo = undefined;
      user.hashedPassword = undefined;
      user.salt = undefined;
      user.updated = Date.now();
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};
export const remove = async (req, res) => {
  try {
    const user = req.profile;
    const deletedUser = await User.findByIdAndDelete(user._id);
    deletedUser.hashedPassword = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
