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
