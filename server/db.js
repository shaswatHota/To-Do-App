const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    username: String,
    email   : {type : String,unique : true},
    password: String
});

const Todo = new Schema({
    text : String,
    description: String,
    priority: String,
    completed : Boolean,
    userId : ObjectId  

})

const Chat = new Schema({
  userId: { type: String, required: true },
  chatId: { type: String, required: true },
  role: { type: String, enum: ["user", "model"], required: true },
  parts: [{ text: { type: String, required: true } }],
  timestamp: { type: Date, default: Date.now },
});


const ChatModel = mongoose.model('chats', Chat);
const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    ChatModel,
    UserModel,
    TodoModel
}