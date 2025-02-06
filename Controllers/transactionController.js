const transactionService = require("../Services/transactionService");

const getTransactionHistory = async (req, res) => {
    const {
        status,
        message,
        data
    } = await transactionService.getTransactionHistory(req.user.id);

    res.status(200).send({
        status,
        message,
        data
    });
};

const topup = async (req, res) => {
    const { top_up_amount } = req.body;
    
    const {
        status,
        message,
        data
    } = await transactionService.handleTopup({
        userId: req.user.id,
        amount: top_up_amount
    });

    res.status(200).send({
        status,
        message,
        data
    });
};

const transaction = async (req, res) => {
    const { service_code } = req.body;
    
    const {
        status,
        message,
        data
    } = await transactionService.handleTransaction({
        userId: req.user.id,
        serviceCode: service_code
    });

    res.status(200).send({
        status,
        message,
        data
    });
};

module.exports = {
    getTransactionHistory,
    topup,
    transaction
};
