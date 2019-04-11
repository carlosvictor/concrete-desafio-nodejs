'use strict';

let exception = require('../errors');

module.exports.notFound = (req, res, next) => {
	return next(new exception.ResourceNotFound());
};

module.exports.serverError = (err, req, res, next) => {
	return res.status(err.status || 500).json({mensagem: err.message});
};