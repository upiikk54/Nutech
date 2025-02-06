const userRepository = require("../Repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT } = require("../lib/const");
const fs = require('fs').promises;
const path = require('path');

const SALT_ROUND = 10;
const upperCaseLetters = /[A-Z]/g;
const numbers = /[0-9]/g;
const addEmail = /[@]/g;
const dotEmail = /[.]/g;
const spacing = /[\s]/;

class authService {
    // ------------------------- Register ------------------------- //
    static async handleRegister({
        email,
        first_name,
        last_name,
        password,
    }) {
        try {
            // ------------------------- Payload Validation ------------------------- //
            const passworUppercase = password.match(upperCaseLetters);
            const passworNumbers = password.match(numbers);
            const passwordSpacing = password.match(spacing);
            const validationAddEmail = email.match(addEmail);
            const validationDotEmail = email.match(dotEmail);

            if (!first_name) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "First name harus diisi.",
                    data: null
                };
            } else if (first_name.length >= 10) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "First name maksimal 10 karakter.",
                    data: null
                };
            }
            if (!last_name) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Last name harus diisi.",
                    data: null
                };
            } else if (last_name.length >= 10) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Last name maksimal 10 karakter.",
                    data: null
                };
            }

            if (!email) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Email harus diisi.",
                    data: null
                };
            } else if (!validationAddEmail) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Email harus memiliki @",
                    data: null
                };
            } else if (!validationDotEmail) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Email harus memiliki titik(.)",
                    data: null
                };
            }

            if (!password) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Password harus diisi.",
                    data: null
                };
            } else if (password.length < 8) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Password minimal 8 karakter.",
                    data: null
                };
            } else if (!passworUppercase) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Password harus mengandung huruf besar.",
                    data: null
                };
            } else if (!passworNumbers) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Password harus mengandung angka.",
                    data: null
                };
            } else if (passwordSpacing) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Password tidak boleh diberi spasi.",
                    data: null
                };
            }

            // Check if email already exists
            const getUserByEmail = await userRepository.getUsersByEmail({
                email
            });

            if (getUserByEmail) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Email telah digunakan.",
                    data: null
                };
            }

            // Hash password and create user
            const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
            const userId = await userRepository.handleRegister({
                email,
                first_name,
                last_name,
                password: hashedPassword,
            });

            // Create initial balance for new user
            await userRepository.createInitialBalance(userId);

            return {
                status: true,
                statusCode: 200,
                message: "Registrasi berhasil silahkan login",
                data: null
            };
        } catch (err) {
            return {
                status: false,
                statusCode: 400,
                message: "Parameter email tidak sesuai format",
                data: null
            };
        }
    };

    // ------------------------- Login ------------------------- //
    static async handleLogin({
        email,
        password
    }) {
        try {
            if (!email || !password) {
                return {
                    status: false,
                    message: "Email dan password harus diisi",
                    data: null
                };
            }

            const user = await userRepository.getUsersByEmail({ email });

            if (!user) {
                return {
                    status: false,
                    message: "Email atau password salah",
                    data: null
                };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return {
                    status: false,
                    message: "Email atau password salah",
                    data: null
                };
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT.SECRET,
                { expiresIn: JWT.EXPIRED }
            );

            return {
                status: true,
                message: "Login Berhasil",
                data: {
                    token
                }
            };
        } catch (err) {
            return {
                status: false,
                message: "Terjadi kesalahan pada server",
                data: null
            };
        }
    }

    // ------------------------- Get Profile ------------------------- //
    static async getProfile(userId) {
        try {
            const user = await userRepository.getUserById(userId);

            if (!user) {
                return {
                    status: false,
                    message: "User tidak ditemukan",
                    data: null
                };
            }

            return {
                status: true,
                message: "Get Profile Berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image ? `${process.env.BASE_URL}/uploads/${user.profile_image}` : null
                }
            };
        } catch (err) {
            return {
                status: false,
                message: "Terjadi kesalahan pada server",
                data: null
            };
        }
    }

    // ------------------------- Update Profile ------------------------- //
    static async updateProfile({
        userId,
        first_name,
        last_name
    }) {
        try {
            if (!first_name || !last_name) {
                return {
                    status: false,
                    message: "First name dan last name harus diisi",
                    data: null
                };
            }

            if (first_name.length > 10 || last_name.length > 10) {
                return {
                    status: false,
                    message: "First name dan last_name maksimal 10 karakter",
                    data: null
                };
            }

            const updatedUser = await userRepository.updateUser({
                userId,
                first_name,
                last_name
            });

            if (!updatedUser) {
                return {
                    status: false,
                    message: "User tidak ditemukan",
                    data: null
                };
            }

            return {
                status: true,
                message: "Update Profile berhasil",
                data: null
            };
        } catch (err) {
            return {
                status: false,
                message: "Terjadi kesalahan pada server",
                data: null
            };
        }
    }

    // ------------------------- Update Profile Image ------------------------- //
    static async updateProfileImage({
        userId,
        imageFile
    }) {
        try {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(imageFile.mimetype)) {
                // Delete uploaded file
                await fs.unlink(imageFile.path);
                return {
                    status: false,
                    message: "Format file tidak sesuai",
                    data: null
                };
            }

            // Validate file size (max 100KB)
            if (imageFile.size > 100 * 1024) {
                // Delete uploaded file
                await fs.unlink(imageFile.path);
                return {
                    status: false,
                    message: "Ukuran file terlalu besar (maksimal 100KB)",
                    data: null
                };
            }

            const user = await userRepository.getUserById(userId);

            // Delete old profile image if exists
            if (user.profile_image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', user.profile_image);
                try {
                    await fs.unlink(oldImagePath);
                } catch (error) {
                    console.error('Error deleting old profile image:', error);
                }
            }

            // Update user profile image in database
            const updatedUser = await userRepository.updateUser({
                userId,
                profile_image: imageFile.filename
            });

            if (!updatedUser) {
                // Delete uploaded file if update fails
                await fs.unlink(imageFile.path);
                return {
                    status: false,
                    message: "User tidak ditemukan",
                    data: null
                };
            }

            return {
                status: true,
                message: "Update Profile Image berhasil",
                data: null
            };
        } catch (err) {
            // Delete uploaded file if error occurs
            if (imageFile && imageFile.path) {
                try {
                    await fs.unlink(imageFile.path);
                } catch (error) {
                    console.error('Error deleting uploaded file:', error);
                }
            }

            return {
                status: false,
                message: "Terjadi kesalahan pada server",
                data: null
            };
        }
    }
}

module.exports = authService;