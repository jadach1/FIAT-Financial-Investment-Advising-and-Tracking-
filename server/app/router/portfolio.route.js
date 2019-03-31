module.exports = function(app) {
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

    // Get all portfolio Names related to a user
    app.get('/portfolio/getNames/:username', Portfolio.getNames)
}