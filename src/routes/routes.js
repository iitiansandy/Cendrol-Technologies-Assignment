const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const Authentication = require('../middleware/auth').Authentication;
const Authorization = require('../middleware/auth').Authorization;

// User APIs ->
router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", Authentication, userController.getUser);
router.put("/user", Authentication, Authorization, userController.updateUser);
router.delete("/user", Authentication, Authorization, userController.deleteUser);


module.exports = router;