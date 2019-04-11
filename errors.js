'use strict';

module.exports.InvalidCredentials = function(message) {
	this.name = 'InvalidCredentials';
	this.message = message || 'Usuário e/ou senha inválidos';
	this.status = 401;
	this.stack = (new Error()).stack;
};

module.exports.ResourceNotFound = function(message) {
	this.name = 'ResourceNotFound';
	this.message = message || 'Não encontrado';
	this.status = 404;
	this.stack = (new Error()).stack;
};

module.exports.InvalidFields = function(message) {
	for(var errorKey in message.errors);
	this.name = 'InvalidFields';
	this.message = 'Campos inválidos';
	this.status = 400;
	this.stack = (new Error()).stack;
	if(errorKey)
		this.message = message.errors[errorKey].message;
};

module.exports.InvalidParams = function(message) {
	this.name = 'InvalidParams';
	this.message = message || 'Parâmetros inválidos';
	this.status = 400;
	this.stack = (new Error()).stack;
};

module.exports.InvalidSession = function(message) {
	this.name = 'InvalidSession';
	this.message = message || 'Sessão inválida';
	this.status = 401;
	this.stack = (new Error()).stack;
};

module.exports.Unauthorized = function(message) {
	this.name = 'Unauthorized';
	this.message = message || 'Não autorizado';
	this.status = 401;
	this.stack = (new Error()).stack;
};


module.exports.getKnownError = function(error) {
	let knownErrors = 
	{ 
		'CastError' : new this.InvalidParams(), 
		'JsonWebTokenError': new this.Unauthorized(), 
		'TokenExpiredError': new this.InvalidSession(), 
		'ValidationError': new this.InvalidFields(error)
	};

	return knownErrors[error.name] || error;
};

