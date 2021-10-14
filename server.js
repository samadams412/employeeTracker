// Import and require mysql2
const mysql = require('mysql2');
const queries = require("./lib/queries");

const PORT = process.env.PORT || 3001;

// Connect to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      password: 'sysPASS353^',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );
  
  connection.connect(function(err) {
      if(err) {
          throw err;
      }
      console.log("Connected at id " + connection.threadId + "\n");
  })

  exports.connection = connection;