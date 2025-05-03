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

let todolist = [];

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


app.get('/todo', authenticateJwt,(req,res)=> res.json(todolist))

app.post('/todo', authenticateJwt,(req, res) => {
    try {
        const { text } = req.body;
    const newTodo = { id: Date.now(), text, completed: false , favorite : false, important: false, optional: false };
    todolist.push(newTodo);
    res.json(newTodo);
    console.log(newTodo);
    } catch (error) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/complete/:id', (req, res) => {
    try {
        const { id } = req.params;
        todolist = todolist.map(todo =>
            todo.id == id ? { ...todo, completed: !todo.completed } : todo
        );
        res.json(todolist);
        console.log("✔️ Toggled completed:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Toggle only `favorite`
app.patch('/favorite/:id', (req, res) => {
    try {
        const { id } = req.params;
        todolist = todolist.map(todo =>
            todo.id == id ? { ...todo, favorite: !todo.favorite } : todo
        );
        res.json(todolist);
        console.log("⭐ Toggled favorite:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/important/:id', (req, res) => {
    try {
        const { id } = req.params;
        todolist = todolist.map(todo =>
            todo.id == id ? { ...todo, important: !todo.important } : todo
        );
        res.json(todolist);
        console.log(" Toggled important:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/optional/:id', (req, res) => {
    try {
        const { id } = req.params;
        todolist = todolist.map(todo =>
            todo.id == id ? { ...todo, optional: !todo.optional } : todo
        );
        res.json(todolist);
        console.log(" Toggled optional:", id);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        todolist = todolist.filter(todo => todo.id != id );
        res.json(todolist);
    } catch (error) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
