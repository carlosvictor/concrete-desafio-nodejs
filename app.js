'use strict';

let bodyParser 		= require('body-parser');
let dotenv			= require('dotenv');
let express 		= require('express');
let handlers 		= require('./middlewares/handlers');
let jwtFunctions 	= require('./jwt/functions');
let mongoose		= require('mongoose');
let morgan 			= require('morgan');
let passport		= require('passport');
let routes 			= require('./routes');

let app 		= express();
let router		= express.Router();

dotenv.config();
routes(router);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

// avoid morgan logs if is test environment
if(process.env.NODE_ENV != 'test') {
	app.use(morgan(process.env.LOGGER_LEVEL));
}

app.use(bodyParser.json());
app.use('/', router);

app.use(handlers.notFound);
app.use(handlers.serverError);

app.use(passport.initialize());
app.use(passport.session());
jwtFunctions.setPassportStrategy(passport);

app.listen(process.env.PORT);

module.exports = app;



