const { services } = require("../models");

class serviceService {
    static async getServices() {
        try {
            const allServices = await services.findAll({
                attributes: ['service_code', 'service_name', 'service_icon', 'service_tariff']
            });

            return {
                status: true,
                message: "Success",
                data: {
                    services: allServices
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

module.exports = serviceService;
