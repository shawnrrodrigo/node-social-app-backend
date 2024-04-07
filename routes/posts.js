const router = require("express").Router();
const Post = require("../model/post");
const User = require("../model/user")

//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      req.status(200).json("Post updated succesfully");
    } else {
      res.status(403).json("You can't update this post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Deleted successfully");
    } else {
      res.send(403).json("You are not allowed to delete this post");
    }
    await post.deleteOne({});
  } catch (err) {
    res.send(500).json(err);
  }
});
//like post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json("Invalid post");
    }
    console.log("post",post.userId);
    if (!post.likes.includes(req.body.userId)) {
        console.log("postinside");
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post has been desiliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get timeline posts
router.get("/timeline/all", async (req, res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const postsByUser = await Post.find({userId: currentUser._id});
        const postsByFriends = await Promise.all(
            currentUser.following.map((id)=>{
                 return Post.find({userId: id});
            })
        )
        res.status(200).json(postsByUser.concat(...postsByFriends));
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;
