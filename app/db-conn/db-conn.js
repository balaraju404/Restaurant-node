const mysql = require('mysql2')
console.log(HOST,PASSWORD);

const conn = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME
})

conn.connect(((error) => {
    if (error) {
        return console.log(error);
    }
    console.log(DB_NAME,' DB Connected');
}))

module.exports = conn;
