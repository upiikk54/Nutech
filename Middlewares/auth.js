const jwt = require('jsonwebtoken');
const { JWT } = require('../lib/const');
const userRepository = require('../Repositories/userRepository');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid",
                data: null
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT.SECRET);
            const user = await userRepository.getUserById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: "Token tidak valid",
                    data: null
                });
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid",
                data: null
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null
        });
    }
};

module.exports = {
    authenticate
};