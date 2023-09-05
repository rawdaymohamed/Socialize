import User from "../models/user.model";
import errorHandler from "../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
import mongoose from "mongoose";
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

export const defaultPhoto = (req, res) => {
  return res.sendFile("profile-pic.png", { root: "public" });
};
export const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};
export const addFollowing = async (req, res, next) => {
  if (req.params.userId == req.params.followId) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }
  try {
    const alreadyFollowing = await User.findById(req.params.userId)
      .populate("following", "_id")
      .exec();

    for (let following of alreadyFollowing.following) {
      if (following._id == req.params.followId)
        return res.status(400).json({ error: "Already following" });
    }
    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { following: req.params.followId },
      },
      { new: true }
    );

    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const addFollower = async (req, res) => {
  try {
    const alreadyFollowers = await User.findById(req.params.followId)
      .populate("followers", "_id")
      .exec();
    for (let follower of alreadyFollowers.followers) {
      if (follower._id == req.params.userId)
        return res.status(400).json({ error: "Already follower" });
    }
    await User.findByIdAndUpdate(
      req.params.followId,
      {
        $push: { followers: req.params.userId },
      },
      { new: true }
    );
    const userResult = await User.findById(req.params.userId)
      .populate("followers", "_id name")
      .populate("following", "_id name")
      .exec();
    userResult.hashedPassword = undefined;
    userResult.salt = undefined;
    return res.json(userResult);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const removeFollowing = async (req, res, next) => {
  if (req.params.userId == req.params.followId) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }
  try {
    await User.findByIdAndUpdate(req.params.followId, {
      $pull: { following: req.params.userId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const removeFollower = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.followId, {
      $pull: { followers: req.params.userId },
    });
    const userResult = await User.findOne({ _id: req.params.userId })
      .populate("followers", "_id name")
      .populate("following", "_id name")
      .exec();
    userResult.hashedPassword = undefined;
    userResult.salt = undefined;
    return res.json(userResult);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
