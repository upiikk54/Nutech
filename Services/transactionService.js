const { transactions, services, balance } = require("../models");
const { v4: uuidv4 } = require('uuid');

class transactionService {
    static async getTransactionHistory(userId) {
        try {
            const history = await transactions.findAll({
                where: { user_id: userId },
                attributes: [
                    'invoice_number',
                    'transaction_type',
                    'service_name',
                    'total_amount',
                    'created_on'
                ],
                order: [['created_on', 'DESC']]
            });

            return {
                status: true,
                message: "Success",
                data: {
                    records: history
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

    static async handleTopup({ userId, amount }) {
        console.log(`Top Up Request - User ID: ${userId}, Amount: ${amount}`);
        try {
            if (!amount || amount < 10000 || amount > 1000000) {
                console.log(`Invalid amount: ${amount}`);
                return {
                    status: false,
                    message: "Nominal top up minimal 10.000 dan maksimal 1.000.000",
                    data: null
                };
            }

            const invoiceNumber = `INV${Date.now()}${uuidv4().substring(0, 8)}`;

            // Check if balance exists
            const existingBalance = await balance.findOne({ where: { user_id: userId } });

            if (!existingBalance) {
                // Initialize balance if not exists
                await balance.create({ user_id: userId, balance: 0 });
            }

            // Create transaction record
            await transactions.create({
                invoice_number: invoiceNumber,
                service_code: 'TOPUP',
                service_name: 'Top Up',
                transaction_type: 'TOPUP',
                total_amount: amount,
                user_id: userId
            });

            // Update balance
            const [updatedBalance] = await balance.increment('balance', {
                by: amount,
                where: { user_id: userId },
                returning: true
            });

            console.log(`Updated Balance: ${updatedBalance}`);
            return {
                status: true,
                message: "Top Up Balance berhasil",
                data: updatedBalance
            };
        } catch (err) {
            console.error(`Top Up Error: ${err.message}`);
            return {
                status: false,
                message: "Top Up Balance gagal",
                data: null
            };
        }
    }

    static async handleTransaction({ userId, serviceCode }) {
        try {
            // Get service details
            const service = await services.findOne({
                where: { service_code: serviceCode }
            });

            if (!service) {
                return {
                    status: false,
                    message: "Layanan tidak ditemukan",
                    data: null
                };
            }

            // Check user balance
            const userBalance = await balance.findOne({
                where: { user_id: userId }
            });

            if (!userBalance || userBalance.balance < service.service_tariff) {
                return {
                    status: false,
                    message: "Saldo tidak cukup",
                    data: null
                };
            }

            // Generate invoice number
            const invoiceNumber = `INV${Date.now()}${uuidv4().substring(0, 8)}`;

            // Create transaction record
            await transactions.create({
                invoice_number: invoiceNumber,
                service_code: service.service_code,
                service_name: service.service_name,
                transaction_type: 'PAYMENT',
                total_amount: service.service_tariff,
                user_id: userId
            });

            // Update balance
            await balance.decrement('balance', {
                by: service.service_tariff,
                where: { user_id: userId }
            });

            return {
                status: true,
                message: "Transaksi berhasil",
                data: null
            };
        } catch (err) {
            return {
                status: false,
                message: "Transaksi gagal",
                data: null
            };
        }
    }
}

module.exports = transactionService;
