
const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { generateToken } =require('../services/authentication');

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '../images/default.webp',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
    { timestamps: true }
);

UserSchema.pre("save", function () {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
});

UserSchema.static("matchpasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('user not found');
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHash) 
        throw new Error('Incorrect Password');
    const token = generateToken(user);
    return token;
});

const User = model('User', UserSchema);

module.exports = User;