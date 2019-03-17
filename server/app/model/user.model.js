module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		username: {
			type:Sequelize.STRING,
			primaryKey: true,
		},
		password: {
			type:Sequelize.STRING,
		},
	  	firstname: {
			type: Sequelize.STRING,
	  	},
	  	lastname: {
			type: Sequelize.STRING,
	  	},
	  	email: {
			type: Sequelize.STRING,
	  	},
	  	recoveryQuestion: {
			type: Sequelize.STRING,
		},
		recoveryAnswer: {
			type: Sequelize.STRING,
		},
		isVerified: {
			type: Sequelize.BOOLEAN,
		}
	});
	
	return User;
}