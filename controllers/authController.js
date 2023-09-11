import userModel from "../models/userModel.js";
import userSchema from "../models/userModel.js";

// REGISTER CONTROLLER
export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validate the user inputs
    if (!name) {
      next("Name is required.!");
    }
    if (!email) {
      next("Email is required...!");
    }
    if (!password) {
      next("Password is required and should be greater than 6 characters.!");
    }

    // Check if user is already in the database
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      next("Email already registered please login.!");
    }

    // Create a new user in the database
    const user = await userSchema.create({ name, email, password });

    // Create user JWT
    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "User created successfully.!",
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

// loginController
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate the user inputs
    if (!email) {
      next("Please provide an email...!");
    }
    if (!password) {
      next("Please provide a password...!");
    }

    //find user by email
    const user = await userSchema.findOne({ email });
    if (!user) {
      next("Invalid Useraname or password");
    }

    // Compare password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      next("Invalid username or password...!");
    }
    const token = user.createJWT();
    res.status(200).json({
      success: true,
      message: "User login successfully...",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// getUserController
export const getUserController = async (req, res, next) => {
  try {
    const user = await userModel.findById({ _id: req.body.user.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User Not Found.!",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "User Data Collected Successfully...",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Auth error",
      error: error.message,
    });
  }
};
