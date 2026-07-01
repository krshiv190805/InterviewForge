require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewforge';
  const masked = uri.includes('@') ? uri.replace(/:([^:@/]+)@/, ':***@') : uri;
  console.log('Using DB:', masked);
  await mongoose.connect(uri);
  const users = await User.find({}).select('+password email name createdAt');
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log({
      email: u.email,
      hasPassword: Boolean(u.password),
      passwordLen: u.password ? u.password.length : 0,
      createdAt: u.createdAt
    });
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
