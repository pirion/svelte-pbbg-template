const Passport = require('passport');

const PassportAccountHandler = require('./PassportAccountHandler');
const PassportStrategyConfiguration = require('./PassportStrategyConfiguration')

function HandlePassportAuthentication(app) {
    app.use(Passport.initialize());

    Passport.serializeUser(PassportAccountHandler.Serialize);
    Passport.deserializeUser(PassportAccountHandler.Deserialize);

    Passport.use('JwtAuthenticate', PassportStrategyConfiguration.GetTokenJwtStrategy());
    Passport.use('LocalAuthenticate', PassportStrategyConfiguration.GetAuthenticateLocalStrategy());
    Passport.use('LocalRegister', PassportStrategyConfiguration.GetRegisterLocalStrategy());
};

module.exports = HandlePassportAuthentication;