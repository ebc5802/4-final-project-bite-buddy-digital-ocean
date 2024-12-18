import { body, validationResult } from "express-validator";

// Not used yet
// User validation rules
export const validateUser = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Recipe validation rules

export const validateRecipe = [
  body("userId")
    .isString()
    .withMessage("User ID must be a string"),
];

// Validation rules for updating user profile
export const validateUpdateProfile = [
  body("userId").isMongoId().withMessage("Valid user ID is required"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("age")
    .optional()
    .isInt({ min: 13 })
    .withMessage("Age must be at integer of at least 13"),
  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
];

// Activity duration check for int until implementation is changed from int to int array
// Validation rules for activity creation or update
export const validateActivity = [
  body("activity_name")
    .isString()
    .notEmpty()
    .withMessage("Activity name is required"),
  body("activity_description")
    .optional()
    .isString()
    .withMessage("Activity description must be a string"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("activity_duration")
    .isInt({ min: 0 })
    .withMessage("Activity duration must be a non-negative integer"),
    // .isArray()
    // .withMessage("Activity duration must be an array of numbers")
    // .custom((arr) => arr.every((num) => typeof num === "number"))
    // .withMessage("All items in activity duration must be numbers"),
];

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
