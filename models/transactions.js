'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transactions.init({
    invoice_number: DataTypes.STRING,
    service_code: DataTypes.STRING,
    service_name: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    total_amount: DataTypes.INTEGER,
    created_on: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};