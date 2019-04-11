'use strict';

let BearerStrategy 	= require('passport-http-bearer').Strategy;
let exception		= require('../errors');
let ExtractJwt 		= require('passport-jwt').ExtractJwt;
let jwt 			= require('jsonwebtoken');
let passport 		= require('passport');

module.exports.authenticateJWT = (req, res, next) => {

	passport.authenticate('bearer', { session: false }, (err, token) => {
		if (err) next(err);

		if (!token)
			next(new exception.Unauthorized());

		req.token = token;
		return next();
	})(req, res, next);
};

module.exports.getToken = (user) => {
	let payload = { 'id': user.id };
	let token = jwt.sign(payload, process.env.APP_JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION_TIME
	});

	return token;
};

module.exports.setPassportStrategy = (passport) => {
	let opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		passReqToCallback: true,
		secretOrKey: process.env.APP_JWT_SECRET
	};

	passport.use(new BearerStrategy(opts, (req, jwtPayload, done) => {

		let decoded = jwt.verify(jwtPayload, process.env.APP_JWT_SECRET);
		
		// validate token
		try {
			if (!decoded)
				throw new exception.Unauthorized();	
			done(null, jwtPayload);
		} catch (error) {
			done(exception.getKnownError(error), false);
		}

	}));
};