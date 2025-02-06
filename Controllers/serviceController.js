const serviceService = require("../Services/serviceService");

const getServices = async (req, res) => {
    const {
        status,
        message,
        data
    } = await serviceService.getServices();

    res.status(200).send({
        status,
        message,
        data
    });
};

module.exports = {
    getServices
};
