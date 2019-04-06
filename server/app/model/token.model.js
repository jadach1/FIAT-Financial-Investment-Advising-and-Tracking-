module.exports = (sequelize, Sequelize) => {
	const Token = sequelize.define('token', {
		hash: {
			type:Sequelize.INTEGER,
			primaryKey: true,
		},
		username: {
			type:Sequelize.STRING,
		}
	});
	
	return Token;
}