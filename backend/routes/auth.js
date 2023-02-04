const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "Abhiram Krishna S";
const fetchuser = require('../middleware/fetchuser');
let success = false;
//ROUTE 1:Signup-requires login
router.post('/createUser',
  [body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Sorry,a user with same email already exists" });
      }
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured")
    }
  })

//ROUTE 2:Login Router
router.post('/login',
  [body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ success, authToken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }

  })

//ROUTE 3:
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id
    const user = await User.findById(userId).select("-password");
    console.log(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
})
module.exports = router