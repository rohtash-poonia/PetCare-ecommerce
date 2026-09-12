// Import the jsonwebtoken library for creating and verifying JWT tokens
const jwt = require("jsonwebtoken");
// Import the bcrypt library for hashing and comparing passwords
const bcrypt = require("bcrypt");
// Import the User model to interact with the users collection in the database
const userModel = require("../model/userModel");

// Define the authController object to hold authentication-related methods
const authController = {
  // Method to handle user registration
  registerUser: async (req, res) => {
    try {
      // Extract username, email, and password from the request body
      const { username, email, password } = req.body;

      // Check if any of the required fields are missing
      if (!username || !email || !password) {
        // Return a 400 Bad Request response with an error message
        return res.status(400).json({
          success: false, // Indicate that the request failed
          message:
            "Registration Error: Username, Email, and Password are required", // Provide the error detail
        });
      }

      // Check if a user already exists with the same email or username
      const existingUser = await userModel.findOne({
        // Use the $or operator to check for either matching condition
        $or: [{ email: email.toLowerCase() }, { username: username }], // Ensure email is checked in lowercase
      });

      // If a matching user is found
      if (existingUser) {
        // Return a 400 Bad Request response indicating the conflict
        return res.status(400).json({
          success: false, // Indicate failure
          message: "User with this email or username already exists", // Error message
        });
      }

      // Hash the provided password using bcrypt with a salt round of 10
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document in the database
      const newUser = await userModel.create({
        username, // Store the provided username
        email: email.toLowerCase(), // Store the email in lowercase to prevent duplicates
        password: hashedPassword, // Store the securely hashed password
      });

      // Convert the Mongoose document to a plain JavaScript object
      const userResponse = newUser.toObject();
      // Remove the password field from the response object for security
      delete userResponse.password;

      // Return a 201 Created response indicating successful registration
      return res.status(201).json({
        success: true, // Indicate success
        message: "User registered successfully", // Success message
        userData: userResponse, // Send the user data (excluding password)
      });
    } catch (error) {
      // Log any unexpected errors to the server console
      console.error(`Internal Error: Error in User Registration:`, error);
      // Return a 500 Internal Server Error response to the client
      return res.status(500).json({
        success: false, // Indicate failure
        message: `Internal Error in User Registration: ${error.message}`, // Provide the error message
      });
    }
  },

  // Method to handle user login
  loginUser: async (req, res) => {
    try {
      // Extract email and password from the request body
      const { email, password } = req.body;

      // Check if both email and password are provided
      if (!email || !password) {
        // Return a 400 Bad Request if validation fails
        return res.status(400).json({
          success: false, // Indicate failure
          message: "Email and password are required", // Error message
        });
      }

      // Find a user by their lowercase email address
      const user = await userModel.findOne({ email: email.toLowerCase() });
      // If no user is found with that email
      if (!user) {
        // Return a 400 Bad Request indicating the user doesn't exist
        return res.status(400).json({
          success: false, // Indicate failure
          message: "Login Error: User not found", // Error message
        });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      // If the passwords do not match
      if (!isMatch) {
        // Return a 400 Bad Request indicating incorrect credentials
        return res.status(400).json({
          success: false, // Indicate failure
          message: "Login Error: Incorrect password", // Error message
        });
      }

      // Retrieve the JWT secret from environment variables or use a default
      const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
      // Generate a JSON Web Token (JWT) containing user info
      const accesstoken = jwt.sign(
        { id: user._id, username: user.username, email: user.email }, // Payload
        secret, // Secret key
        { expiresIn: "7d" }, // Set the token to expire in 7 days
      );

      // Convert the Mongoose document to a plain JavaScript object
      const userObj = user.toObject();
      // Remove the password field from the response object for security
      delete userObj.password;

      // Set the token in an HTTP-only cookie for enhanced security
      res.cookie("accesstoken", accesstoken, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration set to 7 days (matching the JWT expiration)
      });

      // Return a 200 OK response indicating successful login
      return res.status(200).json({
        success: true, // Indicate success
        message: "Login successful", // Success message
        user: userObj, // Send the user data (excluding password)
        accesstoken: accesstoken, // Send the generated JWT token
      });
    } catch (error) {
      // Log any unexpected errors to the server console
      console.error(`Internal Error: Error in User Login:`, error);
      // Return a 500 Internal Server Error response to the client
      return res.status(500).json({
        success: false, // Indicate failure
        message: `Internal Error in User Login: ${error.message}`, // Provide the error message
      });
    }
  },
};

// Export the authController so it can be used in the routes file
module.exports = { authController };
