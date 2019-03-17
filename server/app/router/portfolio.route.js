module.exports = function(app) {
    const Transaction = require('../controller/transactions.controller.js');
    const Portfolio = require('../controller/portfolio.controller.js');
 
    // Create a new portfolio
    app.post('/portfolio/create', Portfolio.create);

    app.get('/portfolio', Portfolio.findAll);
 
    // Retrieve a single portfolio by portfolioid
    app.get('/portfolio/get/:portfolioid', Portfolio.findById);
 
    // Update a portfolio with portfolioid
    app.put('/portfolio', Portfolio.update);
  
    // Delete a portfolio with portfolioid
    app.delete('/portfolio/:portfolioid', Portfolio.delete);

    /////////////////////////////////////////////////////////////////////
    /*
    // Create a new CurrentAsset
    capp.post('/portfolio/Transaction', Transaction.create);
 
    // Retrieve all CurrentAsset
    capp.get('/portfolio/Transaction', Transaction.findDistinct);

    // Retrieve all Transactions based on symbol of Asset
    capp.get('/portfolio/allAssetTransactions/:symbol', Transaction.findAllTransactionsByAsset);

    // Retrieve all Transactions based on symbol and transaction type of Asset
    capp.get('/portfolio/allAssetTypeTransactions/:transaction/:symbol', Transaction.findAllTransactionsByAssetAndType);

    // Update a CurrentAsset with Id
    capp.put('/portfolio/Transaction', Transaction.update);
 
    // Delete a CurrentAsset with Id
    capp.delete('/portfolio/Transaction/:id', Transaction.delete);

    // Retrieve all Transactions
    capp.get('/portfolio/allTransactions', Transaction.findAll);*/
}