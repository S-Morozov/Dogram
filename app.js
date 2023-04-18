const express = require('express');
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dog_social_network'
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database');
});

const app = express();
app.use(express.json());

// Get all dogs
app.get('/dogs', (req, res) => {
    connection.query('SELECT * FROM dogs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a specific dog
app.get('/dogs/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM dogs WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Create a new dog
app.post('/dogs', (req, res) => {
    const { name, breed, age } = req.body;
    connection.query('INSERT INTO dogs (name, breed, age) VALUES (?, ?, ?)', [name, breed, age], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, name, breed, age });
    });
});

// Update a dog
app.put('/dogs/:id', (req, res) => {
    const id = req.params.id;
    const { name, breed, age } = req.body;
    connection.query('UPDATE dogs SET name = ?, breed = ?, age = ? WHERE id = ?', [name, breed, age, id], (err, result) => {
        if (err) throw err;
        res.json({ id, name, breed, age });
    });
});

// Delete a dog
app.delete('/dogs/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM dogs WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: `Dog with id ${id} deleted` });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});




