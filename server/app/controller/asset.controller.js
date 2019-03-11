const db = require('../config/db.config.js');
const CurrentAsset = db.assets;

// Post a CurrentAsset
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	CurrentAsset.create({
				"symbol"		:req.body.symbol,
				"shares"		:req.body.shares,
				"avgprice"		:req.body.avgprice,
				"sharesSold"	:req.body.sharesSold,
				"avgpriceSold"	:req.body.avgpriceSold,
				"originalMoney"	:req.body.originalMoney,
				"totalMoneyIn"	:req.body.totalMoneyIn,
				"totalMoneyOut"	:req.body.totalMoneyOut,
				"realProfit"	:req.body.realProfit,
				"realMargin"	:req.body.realMargin,
				"unRealProfit"	:req.body.unRealProfit,
				"unRealMargin"	:req.body.unRealMargin,
				"price"			:req.body.price,
				"currentTotal"	:req.body.currentTotal
			}).then(CurrentAsset => {		
			console.log("Creating Asset");	
			// Send created CurrentAsset to client
			res.json(CurrentAsset);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// FETCH All Transactions
exports.findAll = (req, res) => {
	CurrentAsset.findAll().then(Asset => {
			// Send All CurrentAssets to Client
			res.json(Asset.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All TransactionObjects
exports.findAsset = (req, res) => {	
	const mySymbol = req.params.symbol;
	CurrentAsset.findOne({where: { symbol: mySymbol}}).then(Asset => {
		// Send All CurrentAssets to Client
		res.json(Asset);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error could not find asset", details: err});
	});
	};
 
// Update an Asset
exports.update = (req, res) => {
	const symbol = req.body.symbol;
	CurrentAsset.update( req.body, 
			{ where: {symbol: symbol} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> CurrentAsset Symbol = " + symbol } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};

// Delete a CurrentAsset by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	CurrentAsset.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> CurrentAsset Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// Return a true or false value to see if an Asset already exists
exports.check = (req, res) => {
	const symbol = req.params.symbol;
	console.log("");
	db.sequelize
		.query('select exists(select 1 from assets where symbol=\'' + symbol + '\');')
			.then(expires => {
				// Send All TransactionObjects to Client
				res.json(expires[0]);
				console.log("we are checking to see if asset exists " + expires[0]);
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};