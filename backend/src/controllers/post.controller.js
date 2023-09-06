import formidable from "formidable";
import fs from "fs";
import Post from "../models/post.model";

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
