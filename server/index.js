const express = require('express');
const app = express();
const cors = require('cors');

let todolist = [];

app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
    console.log("📥 Received request:", req.method, req.url, req.body);
    next();
});
 

app.get('/',(req,res)=> res.json(todolist))

app.post('/',(req, res) => {
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
