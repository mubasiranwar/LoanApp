'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('loans', 'user_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });

        await queryInterface.addIndex('loans', ['user_id'], {
            name: 'loans_user_id_index'
        });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('loans', 'loans_user_id_index');
        await queryInterface.removeColumn('loans', 'user_id');
    }
};
