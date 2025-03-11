const db = (require('mysql2')).createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cse',
    connectionLimit: 10
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
module.exports = db;

db.query('SELECT * FROM Users', (err,results) => {
    if(err) {
        throw err;
    }
    console.log(results);
});
db.query('INSERT INTO Users (name, email, password) VALUES ("?","?","?")',[], (err,results) => {
    if(err) {
        throw err;
    }
    console.log(results);
});
db.query('UPDATE Users SET name = "?", email = "?", password = "?"',[], (err,results) => {
    if(err) {
        throw err;
    }
    console.log(results);
});
db.query('DELETE FROM Users WHERE email = "?"',[], (err,results) => {
    if(err) {
        throw err;
    }
    console.log(results);
});


db.end((err) => {
    if(err) {
        throw err;
    }
    console.log('Connection ended');
});