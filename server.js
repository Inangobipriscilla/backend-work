app.get('/users', (req,res) => {
    db.query('SELECT * FROM Users', (err,results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

app.post('/users', (req,res) => {
    const {name,email,password} = req.body;
    db.query('INSERT INTO Users (name, email, password) VALUES (?,?,?)',[name,email,password], (err,results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

app.put('/users', (req,res) => {
    const {name,email,password} = req.body;
    db.query('UPDATE Users SET name = ?, email = ?, password = ?',[name,email,password], (err,results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

app.delete('/users', (req,res) => { 
    const {email} = req.body;
    db.query('DELETE FROM Users WHERE email = ?',[email], (err,results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});