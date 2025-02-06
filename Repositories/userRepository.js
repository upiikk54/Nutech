const { users, balance } = require("../models");

class userRepository {
    // ------------------------- Get Users By Email ------------------------- //
    static async getUsersByEmail({
        email
    }) {
        try {
            const [rows] = await users.sequelize.query(
                'SELECT * FROM users WHERE email = ?',
                { 
                    replacements: [email]
                }
            );

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error executing query for email ${email}:`, error);
            throw new Error(`Failed to retrieve user by email: ${error.message}`);
        }
    };
    // ------------------------- End Get Users By Email ------------------------- //

    // ------------------------- Get User By Id ------------------------- //
    static async getUserById(userId) {
        try {
            const [rows] = await users.sequelize.query(
                'SELECT * FROM users WHERE id = ?',
                { 
                    replacements: [userId]
                }
            );

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error executing query for user ID ${userId}:`, error);
            throw new Error(`Failed to retrieve user by ID: ${error.message}`);
        }
    }
    // ------------------------- End Get User By Id ------------------------- //

    // ------------------------- Handle Register ------------------------- //
    static async handleRegister({
        email,
        first_name,
        last_name,
        password,
    }) {
        try {
            const query = `
                INSERT INTO users (email, first_name, last_name, password, "createdAt", "updatedAt")
                VALUES (:email, :first_name, :last_name, :password, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING id
            `;
            
            const [[result]] = await users.sequelize.query(query, {
                replacements: { email, first_name, last_name, password },
                type: users.sequelize.QueryTypes.INSERT
            });

            return result.id;
        } catch (error) {
            console.error('Error in handleRegister:', error);
            throw new Error(`Failed to register user: ${error.message}`);
        }
    };
    // ------------------------- End Handle Register ------------------------- //

    // ------------------------- Update User ------------------------- //
    static async updateUser({
        userId,
        first_name,
        last_name,
        profile_image
    }) {
        try {
            let updateFields = [];
            let replacements = { userId };

            if (first_name !== undefined) {
                updateFields.push('first_name = :first_name');
                replacements.first_name = first_name;
            }

            if (last_name !== undefined) {
                updateFields.push('last_name = :last_name');
                replacements.last_name = last_name;
            }

            if (profile_image !== undefined) {
                updateFields.push('profile_image = :profile_image');
                replacements.profile_image = profile_image;
            }

            if (updateFields.length === 0) {
                return null;
            }

            const query = `
                UPDATE users 
                SET ${updateFields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP
                WHERE id = :userId
                RETURNING *
            `;

            const [updatedUser] = await users.sequelize.query(query, {
                replacements,
                type: users.sequelize.QueryTypes.UPDATE
            });

            return updatedUser ? users.build(updatedUser) : null;
        } catch (error) {
            console.error(`Error updating user ${userId}:`, error);
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }
    // ------------------------- End Update User ------------------------- //

    // ------------------------- Create Initial Balance ------------------------- //
    static async createInitialBalance(userId) {
        try {
            const query = `
                INSERT INTO balance (user_id, balance, "createdAt", "updatedAt")
                VALUES (:userId, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            await balance.sequelize.query(query, {
                replacements: { userId },
                type: balance.sequelize.QueryTypes.INSERT
            });

            return true;
        } catch (error) {
            console.error(`Error creating initial balance for user ${userId}:`, error);
            throw new Error(`Failed to create initial balance: ${error.message}`);
        }
    }
    // ------------------------- End Create Initial Balance ------------------------- //
}

module.exports = userRepository;