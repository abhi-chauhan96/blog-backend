import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

// GET ALL BLOGS

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "Blogs not found" });
  }
  return res.status(200).json({ blogs });
};

//ADD A NEW BLOG

export const addBlog = async (req, res, next) => {
  const { title, description, user, image } = req.body;
  let existingUSer;
  try {
    existingUSer = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUSer) {
    return res
      .status(400)
      .json({ message: "Unable to find user with this id" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save(session);
    existingUSer.blogs.push(blog);
    await existingUSer.save(session);
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};

// UPDATE AN EXISTING BLOG

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to update" });
  }
  return res.status(200).json({ blog });
};

// GET BLOG BY ID

export const getById = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  return res.status(200).json({ blog });
};

//DELETE A BLOG

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(400).json({ message: "Cannot delete" });
  }
  return res.status(200).json({ message: "Successfully deleted" });
};

// GET BLOG BY USER ID

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "Blog not found for this user id" });
  }
  return res.status(200).json({ user: userBlogs });
};
