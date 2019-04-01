module.exports = function(app) {
    const Advisor = require('../controller/advisor.controller.js');
 
    // Create a new Advisor
    app.post('/advisor/create', Advisor.create);

    app.get('/advisor', Advisor.findAll);
 
    // Retrieve a single Advisor by advisorId
    app.get('/advisor/get/:advisorid', Advisor.findById);
 
    // Update a advisor with advisorId
    app.put('/advisor', Advisor.update);
  
    // Delete a advisor with advisorId
    app.delete('/advisor/:advisorid', Advisor.delete);

}