var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  {useNewUrlParser: true}
);

var Todo = mongoose.model('Todo', {
  content: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  finished: {
    type: Boolean,
    default: false
  },
  sort: {
    type: Number,
    default: 0
  }
});

module.exports = {mongoose, Todo};
