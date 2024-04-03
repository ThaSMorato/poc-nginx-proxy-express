import express from "express"
import mysql from "mysql"
import { promisify } from "node:util"

const app = express()
app.use(express.json());

const con = mysql.createConnection("mysql://db:3306/fcdb?user=docker&password=docker");

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado!");
  const tableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'fcdb' AND table_name = 'users';";
  con.query(tableSql, (err, result) => {
    if (err) throw err;
    if (result[0]['COUNT(*)'] > 0) {
      console.log('Tabela existe.');
    } else {
      console.log('Tabela não existe.');
      const createTableSql = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY (id)
      );`

      con.query(createTableSql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
      });
    }
  })
});

con.query = promisify(con.query)


app.get("/users", async (req, res) => {
  const { name } = req.query

  try {
    await con.query(`INSERT INTO users (name) VALUES ('${name ?? "Full Cycle"}');`);
    const users = await con.query("SELECT * FROM users;")

    return res.send(
      `<h1>Full Cycle</h1>\n${users.map(user => `<p>${user.id} - ${user.name}</p>`).join('\n')}`
    )

  } catch (error) {
    console.warn(error)

    return res.status(400).json({ error })
  }
})

app.listen(3456, () => console.log('listening on 3456'))
