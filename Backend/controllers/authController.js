import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js'
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Register a new user
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const displayName = username || req.body.name || 'User';

        if (!displayName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        const user = await User.create(displayName, email, password);

        try {
            await UserPreferences.upsert(user.id, {
                dietary_restrictions: [],
                allergies: [],
                preferred_cuisines: [],
                default_servings: 4,
                measurement_units: 'metric'
            });
        } catch (prefErr) {
            console.error('Preference creation failed:', prefErr);
        }

        const token = generateToken(user);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        //check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        //check if password is correct
        const isPasswordMatch = await User.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        //generate token
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (err) {
        next(err);
    }
};
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};


//password reset
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await User.findByEmail(email);

        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent'
        });
    } catch (err) {
        next(err);
    }
};
