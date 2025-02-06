'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      service_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'services',
          key: 'service_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      service_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['TOPUP', 'PAYMENT']]
        }
      },
      total_amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_on: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};