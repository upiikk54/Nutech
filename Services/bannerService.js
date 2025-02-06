const { banners } = require("../models");

class bannerService {
    static async getBanners() {
        try {
            const allBanners = await banners.findAll({
                attributes: ['banner_name', 'banner_image', 'description']
            });

            return {
                status: true,
                message: "Success",
                data: {
                    banners: allBanners
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
}

module.exports = bannerService;
