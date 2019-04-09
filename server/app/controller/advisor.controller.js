const db = require('../config/db.config.js');
const Advisor = db.advisors;
//const alpha = require('alphavantage')({ key: 'A4MNDIDEKI72ARZJ' });
const alpha = require('alphavantage')({ key: 'XSGLKDQT4V4TTZ6A' });

// Post a Advisor
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Advisor.create({
				"portfolioId": req.body.portfolioId, 
                "username": req.body.username, 
                "advisorName": req.body.advisorName,
                "macd": req.body.macd,
                "sma": req.body.sma,
                "ema": req.body.ema,
                "wma": req.body.wma,
                "rsi": req.body.rsi,
                "stochrsi": req.body.stochrsi,
                "stoch": req.body.stoch,
                "willr": req.body.willr,
                "ultosc": req.body.ultosc,
                "adxr": req.body.adxr,
                "mom": req.body.mom,
                "cci": req.body.cci
                
			}).then(advisor => {		
			// Send created advisor to client
			res.json(advisor);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Find a Advisor by Id
exports.findById = (req, res) => {	
    Advisor.findByPk(req.query.advisorId).then(Advisor => {
			console.log(Advisor);
			res.json(Advisor);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Update a Advisor
exports.update = (req, res) => {
	const advisorid = req.body.advisorid;
	Advisor.update( req.body, 
			{ where: {advisorid: advisorid} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> AdvisorID = " + advisorid } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};
 
// Delete a Advisor by Id
exports.delete = (req, res) => {
	const advisorid = req.params.advisorid;
	Advisor.destroy({
			where: { advisorid: advisorid }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> AdvisorID = ' + username } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Advisors
exports.findAll = (req, res) => {
	Advisor.findAll({ where: {username : req.query.username} }).then(Advisor => {
			// Send All Advisors to Client
			res.json(Advisor.sort(function(c1, c2){return c1.advisorName - c2.advisorName}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.getRsi = (req, res) => {
	const symbol = req.params.symbol;
	alpha.technical.rsi(symbol, 'daily', '14', 'open').then(data => {
		const polished = alpha.util.polish(data);
		res.json(polished);
		//console.log(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
};

exports.getCci = (req, res) => {
	const symbol = req.params.symbol;
	alpha.technical.cci(symbol, 'daily', '20').then(data => {
		const polished = alpha.util.polish(data);
		res.json(polished);
		//console.log(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	
};

exports.getStoch = (req, res) => {
	const symbol = req.params.symbol;
	alpha.technical.stoch(symbol, 'daily', '14', '3', '3', 'sma', 'sma').then(data => {
		const polished = alpha.util.polish(data);
		res.json(polished);
		//console.log(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	
};

exports.getUltosc = (req, res) => {
	const symbol = req.params.symbol;
	alpha.technical.ultosc(symbol, 'daily', '7', '14', '28').then(data => {
		const polished = alpha.util.polish(data);
		res.json(polished);
		//console.log(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	
};

exports.getAdx = (req, res) => {
	const symbol = req.params.symbol;
	alpha.technical.adx(symbol, 'daily', '14').then(data => {
		const polished = alpha.util.polish(data);
		res.json(polished);
		//console.log(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	
};