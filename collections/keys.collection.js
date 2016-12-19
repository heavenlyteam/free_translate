var keysCollection = function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    keysCollectionSchema = new Schema({
        owner_id: {
            type: Number,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        created_at: {
            type: Number,
            default: Math.floor(new Date().getTime())
        },
        translate_limit: {
            type: Number,
            required: false
        }
    });

    return mongoose.model('Key', keysCollectionSchema);
};

module.exports = keysCollection();