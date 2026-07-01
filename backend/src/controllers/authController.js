const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendResetEmail = async (email, resetToken, req) => {
  const host = req.get('x-forwarded-host') || req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;

  console.log('====================================');
  console.log(`PASSWORD RESET URL (Local Testing): ${resetUrl}`);
  console.log('====================================');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP settings are not configured. Email not sent.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"InterviewForge" <noreply@interviewforge.com>',
    to: email,
    subject: 'InterviewForge - Password Reset Request',
    text: `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">InterviewForge Password Reset</h2>
        <p>You requested a password reset for your InterviewForge account. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

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
      console.log(`[Forgot Password] Requested email not found: ${normalizedEmail}`);
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
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

    await sendResetEmail(user.email, resetToken, req);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
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

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.statusCode = 400;
      throw new Error('Google identity or access token is required');
    }

    let email, name;

    if (token.startsWith('eyJ')) {
      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      } catch (err) {
        console.error('[Google OAuth] ID Token verification failed:', err.message);
        res.statusCode = 400;
        throw new Error('Invalid Google sign-in token.');
      }
    } else {
      
      const axios = require('axios');
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        email = response.data.email;
        name = response.data.name;
      } catch (err) {
        console.error('[Google OAuth] Access Token verification failed:', err.message);
        res.statusCode = 400;
        throw new Error('Invalid Google access token.');
      }
    }

    if (!email) {
      res.statusCode = 400;
      throw new Error('Google account is missing an email address');
    }

    const normalizedEmail = normalizeEmail(email);

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: normalizedEmail,
        password: crypto.randomBytes(32).toString('hex')
      });
      console.log(`[Google OAuth] Created new user: ${normalizedEmail}`);
    } else {
      console.log(`[Google OAuth] Logged in existing user: ${normalizedEmail}`);
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  googleLogin
};
