const JWT = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

function generateToken(user) {
    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    };
    const token = JWT.sign(payload, secret,{
        expiresIn: '7d',
    });
    return token;
}

function verifyToken(token) {
    const payload= JWT.verify(token, secret);
    return payload;
}

module.exports = {
    generateToken,
    verifyToken,
};