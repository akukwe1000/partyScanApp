const express  = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');


// middleware  
app.use(cors());
app.use(express.json());


// routes 
// create a todo 
app.post('/todos', async(req, res) =>{
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1)", [description]);
        res.json(newTodo);
    } catch (err) {
        console.error(err.message)
    }
})

// get all todo basically to view the todo on the client side 
app.get('/todos', async(req, res) =>{
    try {
        // const allTodo = await pool.query('SELECT * FROM todo');
        const allTodo = await pool.query('SELECT * FROM todo ORDER BY todo_id ASC');  // i used this because after updating the table display changes and is not arranged well so this code helps arrange in ascending order
        res.json(allTodo);
    } catch (err) {
        console.error(err.message)
    }
})

//get a particular todo more like specific todo on the database using dynamic routing 
// app.get('/todos/:id', async(req,res) =>{
//     try {
//         const {id} = req.params;
//         const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id])
//     } catch (err) {
//         console.error(err.message);
//         res.json(todo);
//     }
// })
// get a particular todo by id
app.get('/todos/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id]);

        // If no todo found, send a message indicating so
        if (todo.rows.length === 0) {
            return res.status(404).json({message: "Todo not found"});
        }

        res.json(todo.rows[0]); // Send back the first todo from the result
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: "Server error"});
    }
});

// update a todo 
app.put('/todos/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const {description} = req.body;

        const updateTodo = pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2', [description, id]);
        res.json('Todo was updated');
    } catch (err ) {
        console.error(err.message);
    }
})
// delete a todo
app.delete('/todos/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        await pool.query(`
            WITH cte AS (
                SELECT todo_id, row_number() OVER (ORDER BY todo_id) AS new_id
                FROM todo
            )
            UPDATE todo
            SET todo_id = cte.new_id
            FROM cte
            WHERE todo.todo_id = cte.todo_id
        `);
        res.json('todo was deleted!!');
    } catch (err) {
        console.error(err.message);
    }
})




app.listen(5000, ()=> {
    console.log('server running on port 5000') 
})


