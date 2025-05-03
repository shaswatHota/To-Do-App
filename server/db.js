const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    username: String,
    email   : {type : String,unique : true},
    password: String
});

const Todo = new Schema({
    text : String,
    completed : Boolean,
    favorite : Boolean,
    important : Boolean,
    optional : Boolean,
    userId : ObjectId  

})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}