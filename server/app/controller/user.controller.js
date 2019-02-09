const db = require('../config/db.config.js');
const User = db.users;
 
// Post a User
exports.create = (req, res) => {	
	// Save to PostgreSQL database
	User.create({
				"username": req.body.username, 
				"password": req.body.password, 
				"firstname": req.body.firstname, 
				"lastname": req.body.lastname, 
				"email": req.body.email,
				"recoveryQuestion" : req.body.recoveryQuestion,
				"recoveryAnswer": req.body.recoveryAnswer, 
			}).then(users => {		
			// Send created user to client
			res.json(users);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Find a User by Id
exports.findById = (req, res) => {	
	User.findById(req.params.username).then(User => {
			res.json(User);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

// Find a User by Id
exports.login = (req, res) => {	
	User.findById(req.params.username).then(User => {
			if (req.params.password == User.password){
				//add token
				res.json(User);
			}	
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Update a User
exports.update = (req, res) => {
	const username = req.body.username;
	User.update( req.body, 
			{ where: {username: username} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> User Id = " + username } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};
 
// Delete a User by Id
exports.delete = (req, res) => {
	const username = req.params.username;
	User.destroy({
			where: { username: username }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> User Id = ' + username } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};