const db = require('../config/db.config.js');
const TransactionObject = db.transactions;

// Post a TransactionObject
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	TransactionObject.create({
				"portfolioId":         req.body.portfolioId,
				"symbol": 			   req.body.symbol, 
				"shares": 			   req.body.shares,
				"price": 			   req.body.price,
        		"buydate": 			   req.body.buydate,
				"transaction": 		   req.body.transaction,
				"currency":            req.body.currency
			}).then(TransactionObject => {		
			console.log("Creating Transaction");	
			// Send created TransactionObject to client
			res.json(TransactionObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// FETCH All Transactions
exports.findAll = (req, res) => {
	console.log(req.query.portfolioId);
	TransactionObject.findAll({ where: {portfolioId : req.query.portfolioId} }).then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions by symbol
exports.findAllTransactionsByAsset = (req, res) => {
	const symbol = 	req.params.symbol;
	TransactionObject.findAll({ where: {portfolioId: req.query.portfolioId, symbol : symbol}  })
		.then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All Transactions by transaction type and symbol
exports.findAllTransactionsByAssetAndType = (req, res) => {
	const symbol = 	req.params.symbol;
	const typeOfTransaction = req.params.transaction;
	TransactionObject.findAll({ where: {portfolioId: req.query.portfolioId, symbol : symbol, transaction: typeOfTransaction} })
		.then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// FETCH All TransactionObjects
exports.findDistinct = (req, res) => {
	db.sequelize
		.query('select symbol, sum(shares) as \"shares\", sum(total) / sum(shares) as \"price\", sum(total) as \"total\"' + 
		        'from transactions where transactions.portfolioId = \'' + req.query.portfolioId + '\' and transaction = true group by symbol;', { 
		  model: TransactionObject,
		  mapToModel: true // pass true here if you have any mapped fields
		}).then(TransactionObjects => {
			// Send All TransactionObjects to Client
			res.json(TransactionObjects);
			console.log("trasnaction is " + TransactionObjects);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// Find a TransactionObject by Id
exports.findById = (req, res) => {	
	TransactionObject.findById(req.params.id).then(TransactionObject => {
			res.json(TransactionObject);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Update a TransactionObject
exports.update = (req, res) => {
	const id = req.body.id;
	TransactionObject.update( req.body, 
			{ where: {id: id} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> TransactionObject Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};

// Delete a TransactionObject by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	TransactionObject.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> TransactionObject Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
