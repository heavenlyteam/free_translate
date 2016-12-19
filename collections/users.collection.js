var userCollection = function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var userCollectionSchema = new Schema({
        id: Number,
        name: String,
        email: String,
        password: String,
        created_at: {
            type: Number,
            default: new Date().getTime()
        },
        key: String
    });
    return mongoose.model('User', userCollectionSchema);
};

module.exports = userCollection();