import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    host: "10.1.32.5",
    user: "b2caopuser",
    port: "5432",
    password: "a5hGdULEj3wEgx",
    database:"astraotoshop_b2"
})

client.connect();

client.query(`select * from customer.customers limit 1`,(err,resp) =>{
    if (!err) {
        console.log(res.rows);
    } else {
        console.log("Error occured: " + err.message)
    }
    client.end;
})