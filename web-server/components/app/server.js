const Express = require('express');
const Path = require('path');
const Logger = require('morgan');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Http = require('http');

const DiscordLogger = require('../discord/DiscordLogger');
const ConfigurePassportAuthentication = require('../passport/ConfigurePassportAuthentication');
const ConfigureSocketListener = require('../sockets/ConfigureSocketListener');

const indexRouter = require('../routes/index');
const authRouter = require('../routes/auth');
const app = Express();

app.use(Logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, 'public')));

const server = Http.createServer(app);

ConfigurePassportAuthentication(app);
ConfigureSocketListener(server);

app.use('/', indexRouter);
app.use('/auth', authRouter);

DiscordLogger.Write(`API Server has started.`);

module.exports = server;
