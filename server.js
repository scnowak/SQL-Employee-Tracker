const inquirer = require("inquirer");
const express = require('express');
const mysql = require("mysql2");


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);


// connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    begin();
});


function begin() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "Select from the list below using the arrow keys?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role", 
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
            }
        });
}

// all departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
}

// view all roles
function viewAllRoles() {
    const query = "SELECT role.title, role.id, department.department_name, role.salary from role join department on role.department_id = department.id";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
}

// view all employees
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
}

// add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Add the new department name:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                begin();
                console.log(answer.name);
            });
        });
}

function addRole() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "New Role Title:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "New Role Salary:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "New Role Department:",
                    choices: res.map(
                        (department) => department.department_name),
                },
            ])
            .then((answers) => {
                const department = res.find((department) => department.name === answers.department);
                const query = "INSERT INTO role SET ?";
                connection.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Role Title ${answers.title} with a salary of ${answers.salary} was added to the ${answers.department} department in the SQL Employee Tracker database.`);
                        begin();
                    }
                );
            });
    });
}
