const { balance } = require("../models");

class balanceService {
    static async getBalance(userId) {
        try {
            const userBalance = await balance.findOne({
                where: { user_id: userId },
                attributes: ['balance']
            });

            return {
                status: true,
                message: "Get Balance Berhasil",
                data: {
                    balance: userBalance ? userBalance.balance : 0
                }
            };
        } catch (err) {
            return {
                status: false,
                message: "Get Balance gagal",
                data: null
            };
        }
    }
}

module.exports = balanceService;
