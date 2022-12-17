const mongoose = require('./Mongoose')
const BCrypt = require('bcryptjs');
const shortid = require('shortid');

const User = mongoose.model('User');

class DataConnector {

    async GetUserByField(field_name, field_value) {
        let userInstance;
        
        if(field_name === 'id'||field_name === '_id') {
            userInstance = await User.findById(field_value);
        } else {
            let filters = {}
            filters[field_name] = field_value;
            userInstance = await User.findOne(filters);
            console.log(userInstance)
        }
        return userInstance;
    }

    async GetUserByUsernamePassword(username, password) {
        let user = await this.GetUserByField('username', username);
        if(user) {
            let matches = await BCrypt.compare(password, user.password);
            if(matches) {
                return user;
            }
        }
        return null;
    }
    
    async CreateProviderUser(provider_name, payload) {
        let userInstance = new User();

        switch(provider_name) {
            case 'discord':
                userInstance.discord_id = payload.id;
                userInstance.username = payload.email;
                break;

            default:
                return null
        }

        try {
            await userInstance.save();
            return userInstance;       
        }
        catch (err) {
            console.log(`Save Error: ${err}`);
            return null;
        }
    }

    async CreateGuestUser() {
        let guest_id = shortid.generate();
        
        let userInstance = new User();
        userInstance.username = `GUEST-${guest_id}`;

        try {
            await userInstance.save();
            return userInstance;       
        }
        catch (err) {
            console.log(`Save Error: ${err}`);
            return null;
        }
        
    }

    async CreateUser(username, password) {
        let salt = await BCrypt.genSalt(12)
        let passhash = await BCrypt.hash(password, salt);

        try {

            let userInstance = new User();
            userInstance.username = username;
            userInstance.password = passhash;
            await userInstance.save();
            return userInstance;       
        }
        catch (err) {
            console.log(`Save Error: ${err}`);
            return null;
        }
    }

}

const singleton = new DataConnector();

module.exports = singleton