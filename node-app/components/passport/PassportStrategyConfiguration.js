
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const PassportAccountHandler = require("./PassportAccountHandler");

const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['refresh'];
    return token;
};

function GetTokenJwtStrategy() {
    var opts = {};
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET;

    return new JwtStrategy(opts, function(jwt_payload, callback) {
        return callback(null, jwt_payload);
    });
}

function GetAuthenticateLocalStrategy() {
    return new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: false
    }, PassportAccountHandler.Authenticate);   
}

function GetRegisterLocalStrategy() {
    return new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, PassportAccountHandler.Register);
}

module.exports = {
    GetAuthenticateLocalStrategy,
    GetRegisterLocalStrategy,
    GetTokenJwtStrategy
};

