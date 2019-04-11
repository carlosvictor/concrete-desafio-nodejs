'use strict';

let bcrypt 				= require('bcrypt');
let jwtFunctions		= require('../jwt/functions');
let mongoose 			= require('mongoose');
let SALT_FACTOR 		= 10;
let unique				= require('mongoose-unique-validator');
let validators 			= require('mongoose-validators');

var userSchema = new mongoose.Schema(
	{
		nome: {type: String, required: [true, '{PATH} é um campo obrigatório']},
		email: { 
			type: String, unique: true, 
			required: [true, '{PATH} é um campo obrigatório'],
			validate: validators.isEmail({message: '{VALUE} não é um {PATH} válido'})
		},
		senha: {type: String, required: [true, '{PATH} é um campo obrigatório']},
		telefones: [
			{
				numero: { type: String, validate: [
					validators.isNumeric({message: '{VALUE} não é um número de telefone válido'}), 
					validators.isLength({message: '{VALUE} não é um número de telefone válido'}, 8,9)]},
				ddd: { type: String, validate: [
					validators.isNumeric({message: '{VALUE} não é um número de {PATH} válido'}), 
					validators.isLength({message: '{VALUE} não é um número de {PATH} válido'}, 2,2)]}
			}],
		ultimo_login: Date,
		token: String
	}, {timestamps: true});

userSchema.plugin(unique, { message: '{PATH} já existente' });

userSchema.pre('save', function(next) {
	var user = this;
	
	user.ultimo_login = user.updatedAt;
	user.token = jwtFunctions.getToken(user);

	if (!user.isModified('senha')) return next();

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.senha, salt, function(err, hash) {
			if (err) return next(err);

			user.senha = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword) {

	return bcrypt.compare(candidatePassword || '', this.senha);
};

module.exports = mongoose.model('User', userSchema);