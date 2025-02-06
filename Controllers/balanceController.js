const balanceService = require("../Services/balanceService");

const getBalance = async (req, res) => {
    const {
        status,
        message,
        data
    } = await balanceService.getBalance(req.user.id);

    res.status(200).send({
        status,
        message,
        data
    });
};

module.exports = {
    getBalance
};
