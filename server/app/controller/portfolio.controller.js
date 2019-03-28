

const db = require('../config/db.config.js');
const Portfolio = db.portfolios;
 
// Post a portfolio
exports.create = (req, res) => {	

	// Save to PostgreSQL database
	Portfolio.create({
                "username": req.body.username, 
                "portfolioName": req.body.portfolioName, 
                "portfolioType": req.body.portfolioType
			}).then(portfolio => {		
			// Send created portfolio to client
			res.json(portfolio);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Find a Portfolio by Id
exports.findById = (req, res) => {	
	    Portfolio.findByPk(req.query.portfolioId).then(Portfolio => {
			res.json(Portfolio);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Update a Portfolio
exports.update = (req, res) => {
	const portfolioid = req.body.portfolioid;
	Portfolio.update( req.body, 
			{ where: {portfolioid: portfolioid} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> PortfolioID = " + portfolioid } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};
 
// Delete a Portfolio by Id
exports.delete = (req, res) => {
	const portfolioid = req.params.portfolioid;
	Portfolio.destroy({
			where: { portfolioid: portfolioid }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> PortfolioID = ' + username } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Portfolios
exports.findAll = (req, res) => {
	Portfolio.findAll({ where: {username : req.query.username} }).then(Portfolio => {
			// Send All Portfolios to Client
			res.json(Portfolio.sort(function(c1, c2){return c1.portfolioName - c2.portfolioName}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// Fetch all portfolio names associated with a username
exports.getNames = (req, res) => {
	let arrayOfNames = []

	db.sequelize.query('select distinct \"portfolioName\", \"portfolioId\" from portfolios where username = \'' + req.params.username + '\';')
		.then( obj => {
			obj[1]['rows'].forEach(element => {
				arrayOfNames.push({id: element.portfolioId, name: element.portfolioName})	
			})
		}).then( obj => {
			res.json(arrayOfNames)
			console.log(arrayOfNames)
		}).catch( err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		})
}