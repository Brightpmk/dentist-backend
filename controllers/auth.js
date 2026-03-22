// controllers/auth.js

const User = require('../models/User');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {

  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};


// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { name, telephoneNumber, email, password } = req.body;
    // Create user
    const user = await User.create({
      name,
      telephoneNumber,
      email,
      password
    });
    sendTokenResponse(user,200,res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {

  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please provide an email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({
      success: false,
      msg: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      msg: 'Invalid credentials'
    });
  }
  sendTokenResponse(user,200,res
  );

};

// @desc    Logout user (client should delete token)
// @route   GET /api/v1/auth/logout
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out'
  });
};

// @desc      Update current logged in user profile
// @route     PUT /api/v1/auth/me
// @access    Private
exports.updateMe = async (req, res) => {
  try {
    // อนุญาตให้แก้เฉพาะ 2 field นี้ (กัน user แก้ role/password เอง)
    const fieldsToUpdate = {
      name: req.body.name,
      telephoneNumber: req.body.telephoneNumber
    };

    // ลบ key ที่เป็น undefined ออก (ถ้าส่งมาไม่ครบจะได้ไม่ทับค่าเดิม)
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] === undefined) delete fieldsToUpdate[key];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false, message: 'Update profile failed' });
  }
};

// At the end of file

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });

};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};