const express = require('express');
const cors = require('cors');
const axios = require('axios');
const WebSocket = require('ws');
const http = require('http');
const util = require('util');
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);
const wss = new WebSocket.Server({ server });
const mysql = require('mysql');
const port = 3009;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'brc20dex'
});

app.get('/', (req, res) => {
    res.send("Subash");
});

app.get('/toptoken', (req, res) => {
    const query = 'SELECT * FROM toptokens';
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            return res.json(data);
        }
    });
});

app.post('/create', (req, res) => {
    const symbol = req.body.symbol;
    const name = req.body.name;
    const color = req.body.color;
    const marketCap = req.body.marketCap;
    const price = req.body.price;

    db.query(
        'INSERT INTO toptokens(symbol, name, color, marketCap, price) VALUES (?, ?, ?, ?, ?)',
        [symbol, name, color, marketCap, price],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.send('Your Data Saved');
            }
        }
    );
});

app.get('/toptoken/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM toptokens WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// PUT endpoint to update a token by ID
app.put('/toptoken/:id', (req, res) => {
    const id = req.params.id;
    const { symbol, name, color, marketCap, price } = req.body;

    db.query(
        'UPDATE toptokens SET symbol=?, name=?, color=?, marketCap=?, price=? WHERE id=?',
        [symbol, name, color, marketCap, price, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.send('Token updated successfully');
            }
        }
    );
});

// DELETE endpoint to delete a token by ID
app.delete('/toptoken/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM toptokens WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.send('Token deleted successfully');
        }
    });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
