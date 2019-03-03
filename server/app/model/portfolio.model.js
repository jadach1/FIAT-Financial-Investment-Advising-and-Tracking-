module.exports = (sequelize, Sequelize) => {
	const portfolio = sequelize.define('portfolio', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
        },
        username: {
			type: Sequelize.STRING(18)
		},
		portfolioName: {
			type: Sequelize.STRING(18)
		},
		portfolioType: {
			//true portfolio, false watchlist
			type: Sequelize.BOOLEAN()
		}	
  	});
	
	return portfolio;
}