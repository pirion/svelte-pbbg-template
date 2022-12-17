
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
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

function GetDiscordStrategy() {

    return new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ['identify', 'email']
    }, PassportAccountHandler.AuthenticateDiscord);
}

module.exports = {
    GetAuthenticateLocalStrategy,
    GetRegisterLocalStrategy,
    GetTokenJwtStrategy,
    GetDiscordStrategy
};

