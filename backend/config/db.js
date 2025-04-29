import mysql from 'mysql2';
const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'defensa1'
}).promise(); 
export default pool;
