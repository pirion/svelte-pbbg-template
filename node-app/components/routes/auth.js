const Express = require('express');
const Router = Express.Router();
const JsonWebToken = require('jsonwebtoken');
const Passport = require('passport');

const JsonWebTokenSecret = process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET;

Router.post('/login', function (req, res, next) {
    Passport.authenticate('LocalAuthenticate', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({success: false, message: 'INVALID_USER_OR_PASSWORD'});
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed json web token with the contents of user object and return it in the response
            const refreshToken = JsonWebToken.sign({id: user.id, username: user.username}, JsonWebTokenSecret, {expiresIn: '7d'});
            res.cookie('refresh',refreshToken);
            const token = JsonWebToken.sign({id: user.id, username: user.username}, JsonWebTokenSecret, {expiresIn: '1h'});
            return res.json({success: true, refresh_token: token});
        });
    })(req, res);
});


Router.post('/register', function (req, res, next) {
    Passport.authenticate('LocalRegister', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({success: false, message: 'INVALID_USER_OR_PASSWORD'});
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed json web token with the contents of user object and return it in the response
            const refreshToken = JsonWebToken.sign({id: user.id, username: user.username}, JsonWebTokenSecret, {expiresIn: '7d'});
            res.cookie('refresh',refreshToken);
            const token = JsonWebToken.sign({id: user.id, username: user.username}, JsonWebTokenSecret, {expiresIn: '1h'});
            return res.json({success: true, refresh_token: token});
        });
    })(req, res);
});

Router.post('/refresh', Passport.authenticate('JwtAuthenticate', { session: false }),
    function(req, res) {
        const token = JsonWebToken.sign({id: req.user.id, username: req.user.username}, JsonWebTokenSecret, {expiresIn: '1h'});
        return res.json({success: true, access_token: token});
    }
);

Router.get('/user', Passport.authenticate('JwtAuthenticate', { session: false }),
function(req, res) {
    const token = JsonWebToken.sign({id: req.user.id, username: req.user.username}, JsonWebTokenSecret, {expiresIn: '1h'});
    return res.json({success: true, user: {token: token, id: req.user.id, username: req.user.username}});
}
);

Router.post('/logout', Passport.authenticate('JwtAuthenticate', { session: false }),
    function(req, res) {
        return res.json({success: true});
    }
);


module.exports = Router;
