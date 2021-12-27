const BCrypt = require('bcryptjs');

// todo: link users to accounts

async function Authenticate(username, password, callback) {
    let passwordMatched = false;

    //let user = await data.UserGetUsername(username);
    let user = {id: 1000, username: 'generic_user'}

    if(user) {
        passwordMatched = true;
        //passwordMatched = await BCrypt.compare(password, user.passwordhash);
    }
    
    if(passwordMatched) {
        return callback(null, user);
    }
    else {
        return callback(null, false, {message: 'Incorrect username or Password.'});
    }
}

async function Register(req, username, password, callback) {
    //let hash = await BCrypt.hash(password, 10);
    //let user = await data.UserCreate(username, hash);   
    let user = {id: 1001, username: 'generic_user'}
    
    if(user) {
        return callback(null, user);
    }
    else {
        return callback(null, false, {message: 'An error occured while trying to create the user.'});
    }
}

async function Serialize(user, done) {
    done(null, user.id);
}

async function Deserialize(id, done) {
    let user = {id: id ? id : 0};
    done(null, user);
}

module.exports = {
    Authenticate,
    Register,
    Serialize,
    Deserialize
};