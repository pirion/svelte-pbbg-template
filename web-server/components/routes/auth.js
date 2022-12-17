const Express = require('express');
const Router = Express.Router();
const JsonWebToken = require('jsonwebtoken');
const Passport = require('passport');

const JsonWebTokenSecret = process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET;

let GetRefreshToken = ({id, username}) => {
    return JsonWebToken.sign({id, username}, JsonWebTokenSecret, {expiresIn: '7d'});
}

/** Standard Local Authentication
 * Basic register and login routes needed for local authentication. Register
 * is also used for Guest login by passing the USERNAME and PASSWORD 'GUEST'.
 * 
 * TODO: Allow converting a GUEST user to a real account.
 */

Router.post('/register', function (req, res, next) {
    Passport.authenticate('LocalRegister', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({success: false, message: 'Failed to register user'});
        }
        const refreshToken = GetRefreshToken(user);
        res.cookie('refresh',refreshToken);
        console.log(`done`);
        return res.status(200).json({success: true});
    })(req, res, next);
});

Router.post('/login', function (req, res, next) {
    Passport.authenticate('LocalAuthenticate', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({success: false, message: 'Invalid username or password'});
        }
        const refreshToken = GetRefreshToken(user);
        res.cookie('refresh',refreshToken);
        console.log(`done`);
        return res.status(200).json({success: true});
    })(req, res, next);
});



/** Discord OAuth Intergration
 * Using path <base>/auth/discord will redirect the user to a login page for discord.
 * This will in turn redirect the user back to <base>/auth/discord/callback in order 
 * to complete the tranaction. When this has completed, the profile.id will be saved 
 * as the token to remember this authentication by. If this is the first time, an is
 * created for the user. If this is not the first time, their existing account will
 * be logged into. 
 * 
 * TODO: Allow existing accounts to be linked to Discord if the user wishes to add it.
 * As this does not currently support linking an existing account to discord based 
 * authentication. To do this, a manual update via the database will need to be done.
 */
 Router.get('/discord', Passport.authenticate('Discord'));

 Router.get('/discord/callback', function (req, res, next) {
         Passport.authenticate('Discord', {
         failureRedirect: '/'
     },(err, user, info) => {
         if(!err && user) {
             const refreshToken = GetRefreshToken(user);
             res.cookie('refresh',refreshToken);
         }
         
         return res.redirect('/');
     })(req, res)
 });

 /** Game Specific Routes
  * These routes are used by the client SPA in order to perform basic functions such
  * as refresh their token, or terminate the local session.
  */


Router.get('/refresh', function (req, res, next) {
        Passport.authenticate('JwtAuthenticate', {
        failureRedirect: '/'
    },(err, user, info) => {
        if(!err && user) {
            const refreshToken = GetRefreshToken(user);;
            res.cookie('refresh',refreshToken);
        }
        return res.redirect('/');
    })(req, res)
});

Router.get('/logout', Passport.authenticate('JwtAuthenticate', { session: false }),
    function(req, res) {
        res.cookie('refresh','');
        return res.redirect('/')
    }
);

module.exports = Router;
