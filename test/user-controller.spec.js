'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mock = require('./mocks/mock-user'); 
let mockCredentials = require('./mocks/mock-credentials');
let UserSchema = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let mocha = require('mocha');

let server = require('../app');

chai.use(chaiHttp);
chai.should();

mocha.describe('User - /POST signup', () => {
	mocha.beforeEach(async () => {
		await UserSchema.remove({});
	});

	mocha.it('it should signup the user', (done) => {
		let user = mock.user;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('token');
				done();
			});
	});

	mocha.it('it should not signup the user [invalid email]', (done) => {
		let user = mock.userWithInvalidEmail;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal(`${user.email} não é um email válido`);
				done();
			});
	});

	mocha.it('it should not signup the user [invalid telefones.numero]', (done) => {
		let user = mock.userWithInvalidTelefoneNumero;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal(`${user.telefones[0].numero} não é um número de telefone válido`);
				done();
			});
	});

	mocha.it('it should not signup the user [invalid telefones.ddd]', (done) => {
		let user = mock.userWithInvalidTelefoneDDD;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal(`${user.telefones[0].ddd} não é um número de ddd válido`);
				done();
			});
	});

	mocha.it('it should not signup the user [missing email]', (done) => {
		let user = mock.userWithoutEmail;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('email é um campo obrigatório');
				done();
			});
	});

	mocha.it('it should not signup the user [missing nome]', (done) => {
		let user = mock.userWithoutNome;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('nome é um campo obrigatório');
				done();
			});
	});

	mocha.it('it should not signup the user [missing senha]', (done) => {
		let user = mock.userWithoutSenha;
		chai.request(server).post('/signup')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('senha é um campo obrigatório');
				done();
			});
	});

	mocha.it('it should not signup the user [duplicated email]', (done) => {
		(async () => {
			let user = new UserSchema(mock.user);
			await user.save();
			chai.request(server).post('/signup')
				.send(mock.user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('mensagem');
					chai.expect(res.body.mensagem).to.equal('email já existente');
					done();
				});
		})();
	});
});

mocha.describe('User - /POST signin', () => {
	mocha.before(async () => {
		await UserSchema.remove({});
		let user = new UserSchema(mock.user);
		await user.save();
	});

	mocha.it('it should signin the user', (done) => {
		let credentials = mockCredentials.credentials;
		chai.request(server).post('/signin')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('token');
				done();
			});
	});

	mocha.it('it should not signin the user [email not registered]', (done) => {
		let credentials = mockCredentials.credentialsWithNotRegisteredEmail;
		chai.request(server).post('/signin')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('Usuário e/ou senha inválidos');
				done();
			});
	});

	mocha.it('it should not signin the user [senha not registered]', (done) => {
		let credentials = mockCredentials.credentialsWithNotRegisteredSenha;
		chai.request(server).post('/signin')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('Usuário e/ou senha inválidos');
				done();
			});
	});

	mocha.it('it should not signin the user [missing email]', (done) => {
		let credentials = mockCredentials.credentialsWithoutEmail;
		chai.request(server).post('/signin')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('Usuário e/ou senha inválidos');
				done();
			});
	});

	mocha.it('it should not signin the user [missing senha]', (done) => {
		let credentials = mockCredentials.credentialsWithoutSenha;
		chai.request(server).post('/signin')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				chai.expect(res.body.mensagem).to.equal('Usuário e/ou senha inválidos');
				done();
			});
	});

});

mocha.describe('User - /GET user/:id', () => {
	let savedUser = {};
	mocha.beforeEach(async () => {
		await UserSchema.remove({});
		let user = new UserSchema(mock.user);
		savedUser = await user.save();
	});

	mocha.it('it should get the user', (done) => {
		chai.request(server).get('/user/' + savedUser.id)
			.set('Authorization', 'bearer ' + savedUser.token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('token');
				done();
			});
	});

	mocha.it('it should not get the user [non-existent user identifier]', (done) => {
		chai.request(server).get('/user/59fbe35bec7e52694012da9b')
			.set('Authorization', 'bearer ' + savedUser.token)
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				done();
			});
	});

	mocha.it('it should not get the user [different user identifier]', (done) => {
		(async () => {
			let user = new UserSchema(mock.anotherUser);
			user = await user.save();
			chai.request(server).get('/user/' + user.id)
				.set('Authorization', 'bearer ' + savedUser.token)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('mensagem');
					done();
				});
		})();
	});

	mocha.it('it should not get the user [different user token]', (done) => {
		(async () => {
			let user = new UserSchema(mock.anotherUser);
			user = await user.save();
			chai.request(server).get('/user/' + savedUser.id)
				.set('Authorization', 'bearer ' + user.token)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('mensagem');
					done();
				});
		})();
	});

	mocha.it('it should not get the user [invalid user identifier]', (done) => {
		chai.request(server).get('/user/invalid')
			.set('Authorization', 'bearer ' + savedUser.token)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				done();
			});
	});	

	mocha.it('it should not get the user [missing Authorization token]', (done) => {
		chai.request(server).get('/user/' + savedUser.id)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				res.body.should.have.property('mensagem');
				done();
			});
	});	

});