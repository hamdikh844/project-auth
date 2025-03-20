const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

/*--------------------------------------
 * @desc Register New User  
 * @router /api/auth/register
 * @method POST
 * @access public
 ---------------------------------------*/
module.exports.RegisterUser = asynchandler(async (req, res) => {
    // 1. Validate request body
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 4. Create new user and save to database
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();

    // 5. Send response to client
    res.status(201).json({ message: "Your account has been created successfully" });
});

/*--------------------------------------
 * @desc Login User  
 * @router /api/auth/login
 * @method POST
 * @access public
 ---------------------------------------*/
module.exports.LoginUser = asynchandler(async (req, res) => {
    // 1. Validate request body
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // 3. Compare passwords
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Generate token (assuming `generateAuthToken` is a method on the user schema)
    const token = user.generateAuthToken();

    // 5. Send response to client
    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto, // Fixed typo: ProfilePhoto -> profilePhoto
        token,
    });
});