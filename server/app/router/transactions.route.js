module.exports = function(capp) {
    const Transaction = require('../controller/transactions.controller.js');
 
    // Create a new CurrentAsset
    capp.post('/portfolio/Transaction', Transaction.create);
 
    // Retrieve all CurrentAsset
    capp.get('/portfolio/Transaction', Transaction.findDistinct);

    // Retrieve all Transactions based on symbol of Asset
    capp.get('/portfolio/allAssetTransactions/:symbol', Transaction.findAllTransactionsByAsset);

    // Retrieve all Transactions based on symbol of Asset
    capp.get('/portfolio/allAssetTypeTransactions/:transaction/:symbol', Transaction.findAllTransactionsByAssetAndType);

    // Update a CurrentAsset with Id
    capp.put('/portfolio/Transaction', Transaction.update);
 
    // Delete a CurrentAsset with Id
    capp.delete('/portfolio/Transaction/:id', Transaction.delete);

    // Retrieve all Transactions
    capp.get('/portfolio/allTransactions', Transaction.findAll);

}
