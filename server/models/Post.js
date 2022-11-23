const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'This fild is required.'
    },
    subtitulo: {
        type: String,
        required: 'This fild is required.'
    },
    description: {
        type: String,
        required: 'This fild is required.'
    },
    keywords: {
        type: Array,
        required: 'This fild is required.'
    },
    category: {
        type: String,
       // enum: ['Poder-Animal', 'Tarot-Cigano', 'Cristais', 'Mexican', 'Indian'],
        required: 'This fild is required.'
    },
    image: {
        type: String,
        required: 'This fild is required.'
    },
}); 

// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });
postSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Post', postSchema);