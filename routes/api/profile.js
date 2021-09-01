const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

// @route  GET /api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Profile does not exist' }] });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route  POST /api/profile
// @desc   Create or update user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').notEmpty(),
      check('skills', 'Skills is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      experience,
      education,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    try {
      let profileFields = {};
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      profileFields.status = status;
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

      profileFields.user = req.user.id;

      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route  GET /api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route  GET /api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).send('Profile not found');
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send('Profile not found');
    }
    res.status(500).send('Internal Server Error');
  }
});

// @route  DELETE /api/profile
// @desc   Delete profile, user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route  PUT /api/profile/experience
// @desc   Add experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('from', 'From Date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE /api/profile/experience/:exp_id
// @desc   Delete experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      (exp) => exp.id !== req.params.exp_id
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route  PUT /api/profile/education
// @desc   Add education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').notEmpty(),
      check('degree', 'Degree is required').notEmpty(),
      check('from', 'From Date is required').notEmpty(),
      check('fieldofstudy', 'Field of Study is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = { school, degree, fieldofstudy, from, to, current, description };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE /api/profile/education/:edu_id
// @desc   Delete education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (edu) => edu.id !== req.params.edu_id
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
