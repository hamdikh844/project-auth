const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 100,
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        /* Uncomment to enforce strong password rules
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ],
        */
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://www.istockphoto.com/photo/blue-user-3d-icon-person-profile-concept-isolated-on-white-background-with-social-gm1433039224-475084987?utm_source=pixabay&utm_medium=affiliate&utm_campaign=sponsored_photo&utm_content=srp_bottombanner_media&utm_term=user+avatar",
            publicId: null,
        },
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Method to generate JWT
UserSchema.methods.generateAuthToken = function () {
   /* if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }*/
    return jwt.sign(
        { id: this._id, isAdmin: this.isAdmin }, // Payload
        "privateKey123456789" ,// Secret key
        { expiresIn: "1h" } // Token expiration
    );
};

// User model
const User = mongoose.model("User", UserSchema);

// Validate register user
function validateRegisterUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}

// Validate login user
function validateLoginUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}

// Export the User model and validation functions
module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
};