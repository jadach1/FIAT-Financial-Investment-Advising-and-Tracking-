module.exports = (sequelize, Sequelize) => {
	const myTransaction = sequelize.define('transactions', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: Sequelize.STRING(18)
		},
		symbol: {
			type: Sequelize.STRING(6)
		},
		shares: {
			type: Sequelize.INTEGER
		},
		price: {
			type: Sequelize.DECIMAL(6,2)
		},
		buydate: {
				type: Sequelize.DATEONLY
		},
		transaction: {
				type: Sequelize.BOOLEAN
		}
  	});
	
	return myTransaction;
}