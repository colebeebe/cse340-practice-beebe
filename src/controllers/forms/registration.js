import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import {
  emailExists,
  saveUser,
  getAllUsers,
} from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .pattern(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      'Name can only contain letters, spaces, hyphens and apostrophes',
    ),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email address is too long'),
  body('emailConfirm')
    .trim()
    .normalizeEmail()
    .custom((value, { req }) => value === req.body.email)
    .withMessage('Email addresses must match'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character'),
  body('passwordConfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),
];

/**
 * Display the registration form page
 */
const showRegistrationForm = (req, res) => {
  res.render('forms/registration/form', { title: 'User Registration' });
};

/**
 * Handle user registration with validation and password hashing
 */
const processRegistration = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log validation errors for developer debugging
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    // Redirect back to form without saving
    return res.redirect('/register');
  }

  // Extract validated data from request body
  const { name, email, password } = req.body;

  try {
    // Check if email already exists in database
    const exists = await emailExists(email);

    if (exists) {
      req.flash('warning', 'Email already registered');
      return res.redirect('/register');
    }

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database with hashed password
    saveUser(name, email, hashedPassword);

    req.flash('success', 'User created successfully');
    res.redirect('/register/list');
    // NOTE: Later when we add authentication, we'll change this to require login first
  } catch (error) {
    console.error('Error creating user:', error);
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
  // Initialize users as empty array
  let users = [];

  try {
    users = await getAllUsers();
  } catch (error) {
    console.error('Error getting users:', error);
    // users remains empty array on error
  }

  res.render('forms/registration/list', { title: 'Registered Users', users });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;
