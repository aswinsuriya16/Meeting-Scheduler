require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/['"]/g, '') : '';
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET.replace(/['"]/g, '') : '';

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET
};
