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

    //Get the technical model RSI
    app.get('/advisor/rsi/:symbol', Advisor.getRsi);

    //Get the technical model CCI
    app.get('/advisor/cci/:symbol', Advisor.getCci);

    //Get the technical model STOCH
    app.get('/advisor/stoch/:symbol', Advisor.getStoch);

    //Get the technical model ULTOSCH
    app.get('/advisor/ultosc/:symbol', Advisor.getUltosc);

    //Get the technical model CCI
    app.get('/advisor/adx/:symbol', Advisor.getAdx);

}