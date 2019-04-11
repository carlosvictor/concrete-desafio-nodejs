'use strict';

let userController = require('./controllers/user-controller');
let jwtFunctions = require('./jwt/functions');

module.exports = function (router) {
	
	// default route
	router.get('/online', (req, res) => {
		return res.json(new Date());
	});

	router.get('/user/:id', jwtFunctions.authenticateJWT, userController.findById);

	router.post('/signin', userController.signIn);

	router.post('/signup', userController.signUp);
};