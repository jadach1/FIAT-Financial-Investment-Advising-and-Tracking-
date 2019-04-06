const db = require('../config/db.config.js');
const User = db.users;

var transporter = nodemailer.createTransport({
	service: 'mail',
	auth: {
		user: 'fiatseneca@mail.com',
		pass: 'fiatseneca'
	}
});
 
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
				var mailOptions = {
					from: 'fiatseneca@mail.com',
					to: req.body.email,
					subject: 'Sending Email using Node.js',
					text: 'That was easy!'
				};
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			// Send created user to client
			res.json(users);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
 
// Find a User by Id
exports.findById = (req, res) => {	
	User.findById(req.body.username).then(User => {
			res.json(User);
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

// Login user
exports.login = (req, res) => {	
	console.log("dsfdsffsd");
	User.findByPk(req.body.username).then(User => {
		if (User && req.body.password == User.password){
			console.log(User.username + " logged in");
			res.send(generateTokens());
		}else{
			res.status(500).json({msg: "login error", details: "boo"});
		}
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.refresh = (req, res) => {
	User.findById(req.params.username).then(User => {
		if (req.params.password == User.password){
			res.send(generateTokens());
		}
	})
}

// Return a true or false value to see if an Asset already exists
exports.checkUserName = (req, res) => {
	
	console.log("working check username");
	db.sequelize
		.query('select count(*) from users where username = \'admin\';')
			.then(count => {
				// Send All TransactionObjects to Client
				res.json(count);
				console.log("we are checking to see if asset exists " + count);
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};

function generateTokens() {
    return {
      accessToken: 'access-token-' + Math.random(),
      refreshToken: 'access-token-' + Math.random()
    };
}