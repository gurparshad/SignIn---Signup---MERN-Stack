const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/test", (req, res) => {
    res.send("Hello its working");
});


// register route.
router.post("/register", async (req, res) => {
    try{
        const { name, email, password, confirmPassword } = req.body;

        if(!name || !email || !password || !confirmPassword)
            return res.status(400).json({msg: "Not all fields have been entered."});
        
        if(password.length < 5 )
            return res.status(400).json({ msg: "The password needs to be least 5 characters long."});
    
        if(password !== confirmPassword)
            return res.status(400).json({ msg: "Password and confirm password fields are not same."});
        
        const existingUser = await userModel.findOne({email: email});

        if(existingUser)
            return res.status(400).json( {msg: "An account with this email already exists."});

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);

        }catch(err){
        res.status(500).json({ errorMessage: err.message });
    }
});


// login route.
router.post("/login", async(req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password )
            return res.status(400).json({ msg: "not all fields have been entered." });

        const user = await userModel.findOne({ email: email });
        if(!user)
            return res.status(400).json({ msg: "No account with this email found."});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "invalid Credentials" });

        // if the user credential are right then login user and return a token with user details.
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET); // return a signed token.
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
            },
        });
    }catch(err){

    }
});

// delete user route
// auth middleware will run beofore delete.
router.delete("/delete", auth, async(req, res) => {
    console.log(req.userId);
    try{
        const deletedUser = await userModel.findByIdAndDelete(req.userId);
        res.json(deletedUser);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// route to check if token is valid or not 
// can be used to show login or logout button.
router.post("/tokenIsValid", async(req, res) => {
    try{
        const token = req.header("x-auth-token");
        if(!token)
            return res.json(false);
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
            return res.json(false);

        const user = await userModel.findById(verified.id);
        if(!user)
            return res.json(false);

        return res.json(true);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// router to get info of logged in user
router.get("/", auth, async (req, res) => {
    const user = await userModel.findById(req.userId);
    res.json({
        userId : user._id,
        displayName : user.name,
    });
})



module.exports = router;