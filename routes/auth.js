const router = require("express").Router();
const user = require("../model/user");
const User = require("../model/user");
const bcrypt = require("bcrypt");

// router.get("/", (req, res)=>{
//     res.send("auth is this");
// })

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
    });

    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("Invalid email address");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json("Incorrect password");

        res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;
