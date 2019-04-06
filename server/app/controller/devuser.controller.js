const db = require('../config/db.config.js');
const nodemailer = require('nodemailer');
const User = db.users;
const Token = db.tokens;

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'fiatseneca@gmail.com',
		pass: 'fiatseneca123'
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
				"isVerified" : false
			}).then(users => {
				//create random verification hash
				rand=Math.floor((Math.random() * 100) + 54);

				//store token in the db
				Token.create({
					"hash": rand,
					"username": req.body.username
				}).catch(err => {
					res.status(500).json({msg: "error", details: err});
				});

				//create the link
    		host=req.get('host');
				link="http://"+req.get('host')+"/verify?id="+rand;		
				
				//send from fiatseneca to supplied email
				const mailOptions = {
					from: 'fiatseneca@gmail.com',
					to: req.body.email,
					subject: 'FIAT - Validate your email',
					html : "Hello, " + req.body.firstname + "<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
				};

				//attempt the send
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

exports.verify = (req,res) => {
	Token.findByPk(req.query.id).then(Hash => {
		User.update(
			{isVerified: true},
			{where: {username: Hash.username}}
		).then(result =>
			res.redirect('http://myvmlab.senecacollege.ca:6350/home')
		).catch(err =>
			console.log(err)
		)
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
}
 
// Find a User by Id
exports.findById = (req, res) => {	
	User.findById(req.params.username).then(User => {
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
	console.log(req.body.username);
	User.findByPk(req.body.username).then(User => {
		if (User && req.body.password == User.password && User.isVerified == true){
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

/* 
 This function takes 2 parameters, a field name and a value.
 It will search the users table in the DB
 It will count how many $value objects are returned from the $field 
 It will return a single number
*/
exports.checkUserName = (req, res) => {
	const field = req.params.field
	const value = req.params.value

	db.sequelize
		.query('select count(*) from users where ' + field + '=\'' + value + '\';')
			.then(obj => {
				// Send All TransactionObjects to Client
				res.json(obj[0][0].count);
				console.log("we are checking to see if asset exists = " + obj[0][0].count);
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

