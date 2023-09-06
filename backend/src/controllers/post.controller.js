import formidable from "formidable";
import fs from "fs";
import Post from "../models/post.model";
import _ from "lodash";
export const create = async (req, res) => {
  const form = formidable({});
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.filepath);
      post.photo.contentType = files.photo.mimetype;
    }
    try {
      post.updated = Date.now();
      await post.save();
      const postResult = await Post.findOne(post._id)
        .populate("postedBy", "_id name")
        .exec();
      postResult.photo = undefined;
      return res.json(postResult);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};
export const postById = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
      .populate("postedBy", "_id name")
      .populate("likes", "_id name")
      .populate("comments", "_id text created")
      .populate("comments.postedBy", "_id name")
      .exec();
    if (!post)
      return res.status(400).json({
        error: "Post not found",
      });
    post.photo = undefined;
    req.post = post;

    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve post",
    });
  }
};
export const read = async (req, res) => {
  return res.json(req.post);
};
export const getPostPhoto = async (req, res) => {
  const post = await Post.findById(req.post._id);
  if (post.photo.data) {
    res.set("Content-Type", post.photo.contentType);
    return res.send(post.photo.data);
  }
  return res.json({ error: "No photo available" });
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
    let post = req.post;
    post = _.extend(post, fields);
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.filepath);
      post.photo.contentType = files.photo.mimetype;
    }
    try {
      await post.save();

      post.photo = undefined;
      post.updated = Date.now();
      return res.json(post);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};
export const remove = async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.post._id);
    deletedPost.photo = undefined;
    await Post.findByIdAndDelete(req.post._id);
    return res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({ error: "couldn't delete post" });
  }
};
