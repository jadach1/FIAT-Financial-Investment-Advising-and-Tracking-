module.exports = (sequelize, Sequelize) => {
	const myTransaction = sequelize.define('transactions', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		portfolioId: {
			type: Sequelize.INTEGER
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
		},
		currency: {
			type: Sequelize.BOOLEAN
	}
  	});
	
	return myTransaction;
}