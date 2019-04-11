'use strict';

let exception 		= require('../errors');
let jwtFunctions 	= require('../jwt/functions');
let UserSchema 		= require('../models/user');

module.exports.findById = async (req, res, next) => {
	try {
		let user = await UserSchema.findById(req.params.id);

		// validate user
		if (!user)
			throw new exception.ResourceNotFound();

		// validate user token
		if (user.token != req.token)
			throw new exception.Unauthorized();

		return res.status(200).json(user);
	} catch (error) {
		next(exception.getKnownError(error));
	}
};

module.exports.signIn = async (req, res, next) => {
	try {
		let user = await UserSchema.findOne({'email': req.body.email});
		if(!user)
			throw new exception.InvalidCredentials();

		let isValidPassword = await user.comparePassword(req.body.senha);
		if(!isValidPassword)
			throw new exception.InvalidCredentials();

		user = await UserSchema.findByIdAndUpdate({ '_id': user.id }, 
			{ $set: 
				{ ultimo_login: Date.now(), token: jwtFunctions.getToken(user) }
			}, { new: true });

		return res.json(user);

	} catch(error)  {
		next(exception.getKnownError(error));
	}
};

module.exports.signUp = async (req, res, next) => {
	try {
		let user = new UserSchema(req.body);
		user = await user.save();
		return res.status(200).json(user);
	} catch(error) {
		next(exception.getKnownError(error));
	}
};

