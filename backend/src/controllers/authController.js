const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'interviewforge_secret_key_123', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.statusCode = 400;
      throw new Error('Please add all fields');
    }

    // Normalize email to lowercase to prevent case-sensitivity login issues
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.statusCode = 400;
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          readinessScore: user.readinessScore,
          streak: user.streak,
          weeklyGoal: user.weeklyGoal
        }
      });
    } else {
      res.statusCode = 400;
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.statusCode = 400;
      throw new Error('Please include email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      console.warn(`[Auth] Login attempt for non-existent email: ${email}`);
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[Auth] Wrong password for email: ${email}`);
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? user.lastActiveDate.toDateString() : null;

    if (!lastActive) {
      user.streak = 1;
    } else if (today !== lastActive) {
      const diffTime = Math.abs(new Date(today) - new Date(lastActive));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }
    user.lastActiveDate = new Date();

    // Unset password before save to ensure it is never accidentally re-processed
    user.password = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        readinessScore: user.readinessScore,
        streak: user.streak,
        weeklyGoal: user.weeklyGoal
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 444; // Send successful code or standard error
      throw new Error('No user with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    res.json({
      success: true,
      message: 'Email forgot password reset link simulated.',
      resetToken: resetToken // Expose token to frontend directly for testing convenience
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.statusCode = 400;
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe
};
