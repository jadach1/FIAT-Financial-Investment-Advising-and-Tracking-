module.exports = function(capp) {
    const CurrentAssets = require('../controller/asset.controller.js');
 
    // Create a new CurrentAsset
    capp.post('/portfolio/currentassets', CurrentAssets.create);

    // Find a single asset
     capp.get('/portfolio/currentassets/:symbol', CurrentAssets.findAsset);

     // Find a single asset
     capp.get('/portfolio/currentassets/checkIfExist/:symbol', CurrentAssets.check);

    // Update a CurrentAsset with Id
    capp.put('/portfolio/currentassets', CurrentAssets.update);
 
    // Delete a CurrentAsset with Id
    capp.delete('/portfolio/currentassets/:id', CurrentAssets.delete);

    // Retrieve all Transactions
    capp.get('/portfolio/currentassets', CurrentAssets.findAll);
}
