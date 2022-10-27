const mongoose = require('mongoose');

/* const categorySchema = new mongoose.model('categorySchema', {
    name: {
        type: String,
        required: 'This fild is required.'
    },
    image: {
        type: String,
        required: 'This fild is required.'
    },
}); */

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This fild is required.'
    },
    image: {
        type: String,
        required: 'This fild is required.'
    },
}); 

module.exports = mongoose.model('Category', categorySchema);

//module.exports = categorySchema;