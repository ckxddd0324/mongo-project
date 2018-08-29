var mongoose = require('mongoose');

// Todo Model
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    completed_at: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
}