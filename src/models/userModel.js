let mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            require: true,
            unique: true
        },

        mobile: {
            type: Number,
            require: true

        },

        profilePicture: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            minlength: 8,
            require: true
        }
    }, { timestamps: true })

module.exports = mongoose.model("User", userSchema);