const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cors = require('cors');
const {UserModel, TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "sh@sw@th04a";
const bcryptjs = require('bcryptjs');
const { authenticateJwt } = require('./middleware/auth');

mongoose.connect('mongodb+srv://admin:DglBOA6An0PTKfEc@cluster0.3o1o3.mongodb.net/todo-app-database')


app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
    console.log("📥 Received request:", req.method, req.url, req.body);
    next();
});

app.post('/signup',async function(req, res) {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcryptjs.hash(password, 10);


    
   await UserModel.create({
        username : username,
        email : email,
        password : hashedPassword
    })
    res.json({
        message : "user is signed up"
    })

})

app.post('/signin', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email : email,
    })

    if (user && await bcryptjs.compare(password, user.password)){
        const token = jwt.sign({
            id: user._id
        },JWT_SECRET);
        res.json({
            token: token
        });
    }else{
        res.status(403).json({
            message : "Incorrect credential"
        })
    }

})


app.get('/todo', authenticateJwt,async(req,res)=> {
    try {
        const todos = await TodoModel.find({ userId: req.user.id }); // ✅ Only this user's todos
        res.json(todos);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch todos" });
      }
});

app.post('/todo', authenticateJwt, async(req, res) => {
    try {
        const { text } = req.body;
        const newTodo = await TodoModel.create({
            text,
            completed: false,
            favorite: false,
            important: false,
            optional: false,
            userId: req.user.id // ✅ Correct: Uses the logged-in user's _id from JWT
        });
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: "Failed to save todo" });
    }
});

app.patch('/complete/:id', authenticateJwt,async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await TodoModel.findOne({ 
          _id: id, 
          userId: req.user.id // ✅ Verify the todo belongs to the user
        });
        if (!todo) return res.status(404).json({ error: "Todo not found" });
    
        todo.completed = !todo.completed;
        await todo.save();
        console.log("Updated todo:", todo);
        res.json(todo);
      } catch (error) {
        res.status(500).json({ error: "Failed to update todo" });
      }
});

// ✅ Toggle only `favorite`
app.patch('/favorite/:id',authenticateJwt, async(req, res) => {
    try {
        const { id } = req.params;
       const todo = await TodoModel.findOne({
        _id: id, 
          userId: req.user.id 
       });
       if (!todo) return res.status(404).json({ error: "Todo not found" });
       todo.favorite = !todo.favorite;
       await todo.save();
       res.json(todo);
        console.log("⭐ Toggled favorite:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/important/:id',authenticateJwt, async(req, res) => {
    try {
        const { id } = req.params;
       const todo = await TodoModel.findOne({
        _id: id, 
          userId: req.user.id 
       });
       if (!todo) return res.status(404).json({ error: "Todo not found" });
       todo.important = !todo.important;
       await todo.save();
       res.json(todo);
        console.log("⭐ Toggled Important:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/optional/:id',authenticateJwt, async(req, res) => {
    try {
        const { id } = req.params;
       const todo = await TodoModel.findOne({
        _id: id, 
          userId: req.user.id 
       });
       if (!todo) return res.status(404).json({ error: "Todo not found" });
       todo.optional = !todo.optional;
       await todo.save();
       res.json(todo);
        console.log("⭐ Toggled optional:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/delete/:id',authenticateJwt, async(req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await TodoModel.findOneAndDelete({
            _id: id, 
            userId: req.user.id 
        });
        if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

        const todos = await TodoModel.find({ userId: req.user.id });
        res.json(todos);
    } catch (error) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
