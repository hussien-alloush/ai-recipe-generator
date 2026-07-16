import e from "cors";
import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);  
        const preferences = await UserPreferences.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                user,
                preferences
            }
        });
    } catch (err) {
        next(err);
    }
};

//update profile
export const updateProfile = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const user = await User.update(req.user.id, { username, email });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
    export const updatePreferences = async (req, res, next) => {
        try {
            const preferences = await UserPreferences.upsert(req.user.id, req.body);
            res.json({
                success: true,
                message: 'Preferences updated successfully',
                data: { preferences }
            });
        } catch (err) {
            next(err);  

        }
    };

    //change password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required'
            });
        }
        const user = await User.findByEmail(req.user.email);
        const isvalid = await User.verifyPassword(currentPassword, user.password_hash);
        if (!isvalid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        await User.updatePassword(req.user.id, newPassword);
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        next(err);
    }
};
//delete account
export const deleteAccount = async (req, res, next) => {
    try {        
        await User.delete(req.user.id);
        res.json({
            success: true,
            message: 'Account deleted successfully'
        }); 
    } catch (err) {
        next(err);
    }
};