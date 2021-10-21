
const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');
const { exit } = require("process");
const { start } = require("repl");
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Hide sensitive information using dotenv and be sure to gitignore before commiting
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });


// Connection
connection.connect(function(err) {
    //if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});
// Start Prompt 
function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "Choose Desired Function.",
    name: "choice",
    // Easily grab user function
    choices: [
              "View All Employees", 
              "View Employees By Deparments",
              "View Employees By Role",
              "Add Department",
              "Add Role",
              "Add Employee", 
              "Update Employee",
              "Exit",
            ]
    }
    // Send desired user function to switch statement, then call appropriate function
]).then(function(val) {
        switch (val.choice) {
            case "View All Employees":
              viewAllEmployees();
            break;
    
          case "View Employees By Role":
              viewAllRoles();
            break;
          case "View Employees By Deparments":
              viewAllDepartments();
            break;
          
          case "Add Employee":
                addEmployee();
              break;

          case "Update Employee":
                updateEmployee();
              break;
      
            case "Add Role":
                addRole();
              break;
      
            case "Add Department":
                addDepartment();
              break;
              
            case "Exit":
                exitApp();
              break;

              default:
                exitApp();
                break;
    
            }
    })
}
// View All Employees Query
function viewAllEmployees() {
    connection.query(
      "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}
// View All Roles Query
function viewAllRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  function(err, res) {
  if (err) throw err
  console.table(res)
  startPrompt()
  })
}
// View All Employees Filtered By Department
function viewAllDepartments() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
  })
}

// Select Manager when Adding Employee
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

// Select Role when Adding Employee
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// Add Employee
function addEmployee() { 
    inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter their first name "
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter their last name "
        },
        {
          type: "list",
          name: "role",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
          type: "rawlist",
            name: "choice",
            message: "Whats their manager's name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      // Be sure to insert into proper index
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}
// Update Employee
  function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employee's new title? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName,
          role_id: roleId
        }, 
        
        function(err){
            //if (err) throw err
            console.table(val)
            startPrompt()
        })
  
    });
  });

  }
// Add Employee Role
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )

    });
  });
  }
// Add Department
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }
  // Exit application, or return to startPrompt
  function exitApp() {
    inquirer.prompt([
      {
        type: "list",
        name: "exit",
        message: "'Yes' to Exit, 'No' to Return to Start",
        choices: ["yes", "no"]
      }
    ]).then(function(ans) {
      if(ans.exit === "yes") {
        connection.end();
      } else {
        startPrompt();
      }
    })
  }