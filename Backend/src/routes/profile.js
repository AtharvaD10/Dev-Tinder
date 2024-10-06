const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const nodemailer = require('nodemailer');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Ensure this is imported
const bcrypt = require('bcrypt'); // Ensure this is imported
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Error sending email");
    }
};

profileRouter.get("/profile/view", userAuth, async (req, res) => { 
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.json({ 
            message: `${loggedInUser.firstName}, your profile has been updated successfully.`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.post('/profile/forgetPassword', async (req, res) => {
    const { emailId } = req.body; 

    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Generate a reset token
        const token = jwt.sign({ email: user.emailId }, process.env.JWT_TOKEN, { expiresIn: '1h' });

        // Send email with reset link
        const resetLink = `http://localhost:7777/resetPassword/${token}`;
        await sendEmail(user.emailId, 'Password Reset', `Click this link to reset your password: ${resetLink}`);

        res.send('Password reset email sent');
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
});

// Reset Password API
profileRouter.post('/profile/resetPassword/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ emailId: decoded.email }); 

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); 
        user.password = hashedPassword;
        await user.save();

        res.send('Password has been reset successfully');
    } catch (error) {
        res.status(400).send('Invalid token or error resetting password: ' + error.message);
    }
});

module.exports = profileRouter;
