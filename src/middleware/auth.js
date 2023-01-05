
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validator = require("../utils/validator");



/********************************************** AUTHENTICATION *******************************************/



const Authentication = async function (req, res, next) {
  try {
      let token = req.headers["x-api-key"]
      if (!token) req.headers["X-Api-Key"]
      if (!token) return res.status(400).send({ status: false, message: "Token must be present in header" })
      jwt.verify(token, "cendrol-technologies", { ignoreExpiration: true }, function (err, decoded) {
          if (err) { return res.status(400).send({ status: false, meessage: "token invalid" }) }
          else {
              //The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970
              if (Date.now() > decoded.exp * 1000) {
                  return res.status(401).send({ status: false, msg: "Session Expired! Please login again", });
              }
          }
          // req.userId = decoded.userId;
          // console.log(decoded.userId)
          next();
      });
  }
  catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}




/********************************************** AUTHORIZATION *******************************************/




const Authorization = async (req,res,next) =>{

  let userId = req.body.userId
  if(!validator.isValidObjectId(userId)) return res.status(404).send({status: false,message: "user Id not valid"})

  let user = await userModel.findById({_id:userId})
  if(!user)  return res.status(404).send({status: false,message: "customer Id not found"})

  if(user._id.toString()!==req.userId){
    return res.status(403).send({status: false,message: "Unauthorized access! customer's info doesn't match"})
  }
  next();
}

module.exports = {Authentication,Authorization}