import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
    try {
        // Get the properties of the user
        const { name, email, lastname, location } = req.body;

        // Check if user insert all the fields
        if (!name || !email || !lastname || !location) {
            next('All fields are required...!')
        }

        // Check the user in the database
        const user = await userModel.findOne({ _id: req.user.userId });

        // Update the user properties
        user.name = name;
        user.email = email;
        user.lastname = lastname;
        user.location = location;

        // Save the updated data in the database
        await user.save();

        // Generate "User Token"
        const token = user.createJWT();

        // Send success response
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                name: user.name,
                email: user.email,
                location: user.location,
                lastname: user.lastname
            },
            token
        })
    } catch (error) {
        next(error)
    }
}