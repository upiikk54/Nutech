const bannerService = require("../Services/bannerService");

const getBanners = async (req, res) => {
    const {
        status,
        message,
        data
    } = await bannerService.getBanners();

    res.status(200).send({
        status,
        message,
        data
    });
};

module.exports = {
    getBanners
};
