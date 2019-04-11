module.exports.user = {
	'nome': 'Carlos',
	'email': 'carlos@carlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

module.exports.anotherUser = {
	'nome': 'Carlos2',
	'email': 'carlos2@carlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

module.exports.userWithInvalidEmail = {
	'nome': 'Carlos',
	'email': 'carloscarlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

module.exports.userWithInvalidTelefoneNumero = {
	'nome': 'Carlos',
	'email': 'carlos@carlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '12312', 'ddd': '11' }]
};

module.exports.userWithInvalidTelefoneDDD = {
	'nome': 'Carlos',
	'email': 'carlos@carlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '111' }]
};

module.exports.userWithoutEmail = {
	'nome': 'Carlos',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

module.exports.userWithoutNome = {
	'email': 'carlos@carlos.com',
	'senha': '123456',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

module.exports.userWithoutSenha = {
	'nome': 'Carlos',
	'email': 'carlos@carlos.com',
	'telefones': [{ 'numero': '123456789', 'ddd': '11' }]
};

