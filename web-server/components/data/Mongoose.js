const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function initializeConnection() {

    await mongoose.connect(process.env.MONGO_URL, {dbName: 'aetherium'});
    
}
initializeConnection();

const Users = new Schema({
    username: { type: String, unique : true, required : true },
    password: { type: String, required : false},
    discord_id: {type: String, required : false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

mongoose.model('User', Users);

module.exports = mongoose;