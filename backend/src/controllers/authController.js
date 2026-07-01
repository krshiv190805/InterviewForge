const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'interviewforge_secret_key_123', {
    expiresIn: '30d'
  });
};

const normalizeEmail = (email) => email.toLowerCase().trim();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const buildAuthResponse = (user) => ({
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

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.statusCode = 400;
      throw new Error('Please add all fields');
    }

    if (password.length < 6) {
      res.statusCode = 400;
      throw new Error('Password must be at least 6 characters long');
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');

    if (existingUser?.password) {
      res.statusCode = 400;
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const hashedPassword = await hashPassword(password);

    let user;
    if (existingUser) {
      // Recover accounts whose password was wiped by the earlier login bug
      user = await User.findByIdAndUpdate(
        existingUser._id,
        {
          name: name.trim(),
          password: hashedPassword,
          $unset: { resetPasswordToken: '', resetPasswordExpire: '' }
        },
        { new: true, runValidators: true }
      );
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });
    }

    res.status(existingUser ? 200 : 201).json(buildAuthResponse(user));
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

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.warn(`[Auth] Login attempt for non-existent email: ${normalizedEmail}`);
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    if (!user.password) {
      console.warn(`[Auth] Login blocked for passwordless account: ${normalizedEmail}`);
      res.statusCode = 401;
      throw new Error('Your account password is missing. Use Forgot Password or register again with the same email to recover it.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[Auth] Wrong password for email: ${normalizedEmail}`);
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? user.lastActiveDate.toDateString() : null;

    let nextStreak = user.streak;
    if (!lastActive) {
      nextStreak = 1;
    } else if (today !== lastActive) {
      const diffTime = Math.abs(new Date(today) - new Date(lastActive));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 1;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { streak: nextStreak, lastActiveDate: new Date() },
      { new: true }
    );

    res.json(buildAuthResponse(updatedUser));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.statusCode = 400;
      throw new Error('Please provide an email');
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.statusCode = 404;
      throw new Error('No account found with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken,
      resetPasswordExpire: Date.now() + 10 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Password reset token generated.',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.statusCode = 400;
      throw new Error('Password must be at least 6 characters long');
    }

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

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: { resetPasswordToken: '', resetPasswordExpire: '' }
    });

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
