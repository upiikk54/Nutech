const authService = require("../Services/authService");

// ------------------------- Auth Register ------------------------- //
const handleRegister = async (req, res) => {
    const {
        email,
        first_name,
        last_name,
        password,
    } = req.body;

    const {
        status,
        statusCode,
        message,
        data
    } = await authService.handleRegister({
        email,
        first_name,
        last_name,
        password,
    });

    return res.status(statusCode).send({
        status,
        message,
        data
    });
};
// ------------------------- End Auth Register ------------------------- //

// ------------------------- Auth Login ------------------------- //
const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    const {
        status,
        message,
        data
    } = await authService.handleLogin({
        email,
        password
    });

    return res.status(200).send({
        status,
        message,
        data
    });
};
// ------------------------- End Auth Login ------------------------- //

// ------------------------- Get Profile ------------------------- //
const getProfile = async (req, res) => {
    const {
        status,
        message,
        data
    } = await authService.getProfile(req.user.id);

    return res.status(200).send({
        status,
        message,
        data
    });
};
// ------------------------- End Get Profile ------------------------- //

// ------------------------- Update Profile ------------------------- //
const updateProfile = async (req, res) => {
    const {
        first_name,
        last_name
    } = req.body;

    const {
        status,
        message,
        data
    } = await authService.updateProfile({
        userId: req.user.id,
        first_name,
        last_name
    });

    return res.status(200).send({
        status,
        message,
        data
    });
};
// ------------------------- End Update Profile ------------------------- //

// ------------------------- Update Profile Image ------------------------- //
const updateProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            status: false,
            message: "Image file is required",
            data: null
        });
    }

    const {
        status,
        message,
        data
    } = await authService.updateProfileImage({
        userId: req.user.id,
        imageFile: req.file
    });

    return res.status(200).send({
        status,
        message,
        data
    });
};
// ------------------------- End Update Profile Image ------------------------- //

module.exports = {
    handleRegister,
    handleLogin,
    getProfile,
    updateProfile,
    updateProfileImage
};