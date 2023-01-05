const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { uploadFile } = require('../utils/awsConnect');
const { isValidRequestBody, isValidObjectId, isValid, isValidEmail, isValidPassword, isValidMobile } = require('../utils/utils');
//const { isValidBody, isValidstring, isValidEmail, isValidphone, isValidPassword } = require("../utils/validator");




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++ Create User +++++++++++++++++++++++++++++++++++++++++++++++++++ */




const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, mag: " Enter data in body" })
        }

        let { name, email, mobile, profilePicture, password } = data

        if (!name || !email || !mobile || !profilePicture || !password) {
            return res.status(400).send({ status: false, mag: "please fill all field properly" })
        }

        if (!isValidstring(name)) {
            return res.status(400).send({ status: false, mag: " name should be in onlyalphabate" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, mag: " invalid Email" })
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, mag: " this email already exist" })
        }

        if (!isValidMobile(mobile)) {
            return res.status(400).send({ status: false, mag: " invalid phone" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: " password contain atleast one spacial character, Number, Alphabet, length should be 8 to 15 " })
        }

        data.password = bcrypt.hashSync(password, 10)

        let savedData = await userModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++ Login User +++++++++++++++++++++++++++++++++++++++++++++++++++ */




const loginUser = async (req, res) => {
    try {
        let credentials = req.body

        let { userName, password } = credentials
        password = password.trim()
        userName = userName.trim()
        if (!isValidBody(credentials)) {
            return res.status(400).send({ status: false, msg: "Body should not be empty" })
        }
        if (!userName || !password) {
            return res.status(400).send({ status: false, msg: "Enter userName and password" })
        }

        let user = await userModel.findOne({ email: userName })
        if (!user) {
            return res.status(400).send({ status: false, msg: "userName not exist" })
        }
        let valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return res.status(201).send({ status: false, msg: " userName or password wrong" })
        }

        let token = jwt.sign({
            _id: user._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 60 * 60 * 24  // 24 hours
        }, "cendrol-technologies")

        res.setHeader("axe-api-key", token)

        credentials.token = token
        delete credentials.password
        return res.status(200).send({ status: true, msg: "Login successfully", data: credentials })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++ Get Users +++++++++++++++++++++++++++++++++++++++++++++++++++ */



const getUser = async (req, res) => {
    try {

        let users = await userModel.find({userId});
        if (users.length == 0) return res.status(404).send({ status: false, message: "There are no user." });

        return res.status(200).send({ status: true, data: users });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}




/* ++++++++++++++++++++++++++++++++++++++++++++++++++++ Update User ++++++++++++++++++++++++++++++++++++++++++++++++++ */




const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!userId) return res.status(400).send({ status: false, message: 'pls give a userId in params' });
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'pls give a valid userId in params' });
        let user = await booksModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: 'sorry, No such user exists with this Id' });

        let body = req.body;
        let { name, email, mobile, profilePicture, password } = body;
        if (isValidRequestBody(body)) return res.status(400).send({ status: false, message: 'please enter body' });

        if (book && book.isDeleted == false) {
            user.name = name;
            user.email = email;
            user.mobile = mobile;
            user.profilePicture = profilePicture;
            user.password = password;

            user.save();
            return res.status(200).send({ status: true, data: book });
        } else {
            return res.status(404).send({ satus: false, message: 'No such user found or it is deleted' });
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};




/* ++++++++++++++++++++++++++++++++++++++++++++++++++++ Delete User ++++++++++++++++++++++++++++++++++++++++++++++++++ */




const deleteUser = async (req, res) => {
    try {

        let userId = req.params.userId;
        console.log(userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Give a valid user ObjectId" });

        let user = await userModel.findOne({ _id: userId, isDeleted: false });
        if (!user) return res.status(404).send({ status: false, message: "This user doesn't exists." });

        await userModel.findOneAndUpdate({ _id: id }, { isDeleted: true });

        return res.status(200).send({ status: true, message: "user deleted successfully." });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { createUser, loginUser, getUser, updateUser, deleteUser };