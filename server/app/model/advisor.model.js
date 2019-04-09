module.exports = (sequelize, Sequelize) => {
	const myAdvisor = sequelize.define('advisor', {
		advisorId: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		portfolioId: {
			type: Sequelize.INTEGER
		},
        username: {
			type: Sequelize.STRING(18)
		},
		advisorName: {
			type: Sequelize.STRING(18)
		},
        macd: {
			type: Sequelize.BOOLEAN()
        },
        sma: {
			type: Sequelize.BOOLEAN()
        },
        ema: {
			type: Sequelize.BOOLEAN()
        },
        wma: {
			type: Sequelize.BOOLEAN()
        },
        rsi: {
			type: Sequelize.BOOLEAN()
        },
        stochrsi: {
			type: Sequelize.BOOLEAN()
        },
        stoch: {
			type: Sequelize.BOOLEAN()
        },
        willr: {
			type: Sequelize.BOOLEAN()
        },
        ultosc: {
			type: Sequelize.BOOLEAN()
        },
        adxr: {
			type: Sequelize.BOOLEAN()
        },
        mom: {
			type: Sequelize.BOOLEAN()
        },
        cci: {
			type: Sequelize.BOOLEAN()
		},
  	});
	
	return myAdvisor;
}