const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route  GET /api/auth
// @desc   Test route
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -avatar');
        res.json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
    }
});

// @route  POST /api/auth
// @desc   Authenticate user
// @access Public
router.post(
    '/',
    [
      check('email', 'Please enter a valid email').isEmail(),
      check(
        'password',
        'Password is required'
      ).notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        //see if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        //send back jwt
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        // console.log(req.body);
        // res.send('User registered');
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
      }
    }
  );

module.exports = router;