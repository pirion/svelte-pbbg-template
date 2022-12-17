const DataConnector = require("../data/DataConnector");

function CleanUser(user) {
    return {id: user.id, username: user.username};
}

async function Authenticate(username, password, callback) {
    let user = await DataConnector.GetUserByUsernamePassword(username, password);

    if(user) {
        let clean_user = CleanUser(user);
        return callback(null, clean_user);
    }
    else {
        return callback(null, false, {message: 'Incorrect username or Password.'});
    }
}

async function AuthenticateDiscord(accessToken, refreshToken, profile, callback) {
    let user
    
    if(accessToken !== null) {
        user = await DataConnector.GetUserByField('discord_id', profile.id);

        if(!user) {
            user = await DataConnector.CreateProviderUser('discord', profile);
        }
    }

    if(user) {
        let clean_user = CleanUser(user);
        return callback(null, clean_user);
    }

    else {
        return callback(null, false, {message: 'Authentication Failed'});
    }
}

async function Register(req, username, password, callback) {
    let user

    if(username==='GUEST' && password === 'GUEST') {
        user = await DataConnector.CreateGuestUser(username);
    } else {
        user = await DataConnector.CreateUser(username, password);
    }
    
    if(user) {
        let clean_user = CleanUser(user);
        return callback(null, clean_user);
    }
    else {
        return callback(null, false, {message: 'An error occured while trying to create the user.'});
    }
}

async function Serialize(user, done) {
    done(null, user.user_id);
}

async function Deserialize(id, done) {
    let user = await DataConnector.GetUserByField('id', id);
    let clean_user = CleanUser(user);
    done(null, clean_user);
}

module.exports = {
    Authenticate,
    AuthenticateDiscord,
    Register,
    Serialize,
    Deserialize
};