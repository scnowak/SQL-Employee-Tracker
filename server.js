const inquirer = require("inquirer");
require ("dotenv").config()
const mysql = require("mysql2");



// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // Add MySQL password here
        password: process.env.DB_PW,
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
            name: "option",
            message: "Select from the list below using the arrow keys?",
            choices: [
                {
                    name: "View all departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "View all roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "View all employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "Add a department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Add a role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Add an employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Update an employee role",
                    value: "UPDATE_DEPARTMENT"
                },
                {
                    name: "Exit Application",
                    value: "EXIT_APPLICATION"
                }
            ],
        })
        .then((answer) => {
            switch (answer.option) {
                case "VIEW_DEPARTMENTS":
                    db.query('SELECT * FROM department', function (err, results) {
                        console.table(results);
                        begin();
                    });
                    break;

                case "VIEW_ROLES":
                    db.query('SELECT * FROM role', function (err, results) {
                        console.table(results);
                        begin();
                    });
                    break;

                case "VIEW_EMPLOYEES":
                    db.query('SELECT * FROM employee', function (err, results) {
                        console.table(results);
                        begin();
                    });
                    break;

                case "ADD_DEPARTMENT":
                    inquirer
                        .prompt({
                            type: 'input',
                            message: 'Name of department to add:',
                            name: 'newDepartment'
                        })
                        .then((answer) => {
                            newDepartment = answer.newDepartment
                            db.query(`INSERT INTO department (department_name) VALUES ("${newDepartment}")`, function (err, resuolts) {
                                console.log(newDepartment + " has been added to the department table");
                                if (err) throw err;
                                console.log("success... 1 new dept record inserted")
                                begin();
                            });
                        })
                    break;


                case "ADD_ROLE":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "New Role Title to ADD:",
                                name: "newRole",

                            },
                            {
                                type: "input",
                                message: "New Role Salary:",
                                name: "newSalary",
                            },
                            {
                                type: "input",
                                message: "New Role Department Id:",
                                name: "newDepartmentId",
                            },
                        ])
                        .then((answer) => {
                            newRole = answer.newRole
                            newSalary = answer.newSalary
                            newDepartmentId = answer.newDepartmentId
                            db.query(`INSERT INTO role (title, salary, department_id)
                                            VALUES ("${newRole}", "${newSalary}", "${newDepartmentId}");`,
                                function (err, results) {
                                    console.log(newRole + " has been added to the new role table");
                                    if (err) throw err;
                                    console.log("success... 1 new role record inserted")
                                    begin();
                                });
                        })
                    break;

                case "ADD_EMPLOYEE":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "New Employee First Name to ADD:",
                                name: "newFirstName",

                            },
                            {
                                type: "input",
                                message: "New Employee Last Name to ADD:",
                                name: "newLastName",

                            },
                            {
                                type: "input",
                                message: "New Employee Role Id:",
                                name: "newRoleId",
                            },
                            {
                                type: "input",
                                message: "New Employee Manager Id:",
                                name: "newManagerId",
                            },
                        ])
                        .then((answer) => {
                            newFirstName = answer.newFirstName
                            newLastName = answer.newLastName
                            newRoleId = answer.newRoleId
                            newManagerId = answer.newManagerId
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                            VALUES ("${newFirstName}","${newLastName}", "${newRoleId}", "${newManagerId}");`,
                                function (err, results) {
                                    console.log(newFirstName + "  " + newLastName + " has been added to the employee table");
                                    if (err) throw err;
                                    console.log("success... 1 new employee record inserted")
                                    begin();
                                })
                        })
                    break;

                case "UPDATE_DEPARTMENT":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Enter the employee's ID you want to update:",
                                name: "employeeId",
                            },
                            {
                                type: "input",
                                message: "Enter the new role ID for the employee:",
                                name: "newRoleId",
                            },
                        ])
                        .then((answer) => {
                            const employeeId = answer.employeeId;
                            const newRoleId = answer.newRoleId;
                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                            db.query(sql, [newRoleId, employeeId], (err, result) => {
                                if (err) {
                                    console.error("Error updating employee role:", err);
                                } else {
                                    console.log(`Employee with ID ${employeeId} has been updated to the new role.`);
                                }

                                // Continue with the main menu
                                begin();
                            });
                        });
                        break;
            };
        })
        }
