const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connection to DB
const db = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: 'Hospital123!!',
        database: 'employee_tracker'
    });

const mainMenu = async () => {
    const { action } = await inquirer.createPromptModule([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do:',
            choices: [
                'View deparments',
                'View employees',
                'View employee roles',
                'Add a department',
                'Add an employee',
                'Update an employee role',
                "Exit"
            ]
        }
    ]);

    switch (action) {
        case 'View departments':
            await viewAllDepartments();
            break;
        case 'View roles':
            await viewRoles(); 
            break;
        case 'View employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add employee role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case "Update an employee role":
            await updateEmployeeRole();
            break;
        case 'Exit':
            await db.end();
            break;
    }

    if (action !== 'Exit') {
        mainMenu();
    }
};

const viewAllDepartments = async () => {
    try {
        const [results] = await db.query('SELECT * FROM department');
        console.table(results);
    } catch (err) {
        console.error(err);
    }
};

const viewRoles = async () => {
    try {
        const [results] = await db.query(`
        SELECT role.id, role.title, deparment.name AS deparment, role.salary FROM role LEFT JOIN department ON role.department_id = department.id
        `);
        console.table(results);
    } catch (err) {
        console.error(err);
    }
};

const addDepartment = async () => {
    try {
        const {name} = await inquirer.createPromptModule([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new Department?',
            }
        ]);
        await db.query('INSERT INTO department (name) Values (?)', [name]);
        console.log('Deparment added!');
    } catch (err) {
        console.error(err);
    }
};

const addRole = async () => {
    try {
        const [department] = await db.query('SELECT * FROM department');
        const answers = await inquirer.createPromptModule([
            {
                type: 'input',
                name: 'title',
                message: "Enter the title of the role you'd like to add."
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary for this role?"
            },
            {
                type:'list',
                name: 'department_id',
                message: 'Which department does this role belong to?',
                choices: department.map(deparment => ({
                    name: deparment.name,
                    value: deparment.id
                }))
            }
        ]);
        await db.query('INSERT INTO role (title, salary, deparment_id) VALUES (?, ?, ?'),
        console.log('Role has been added');
    } catch (err) {
        console.error(err);
    }
};

const addEmployee = async () => {
    try {
        const [roles] = await db.query('SELECT * FROM role');
        const [employees] = await db.query('SELECT * FROM employee');
        const answer = await inquirer.createPromptModule([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the first name of the employee"
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the last name of the employee"
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Choose a role for this employee',
                choices: roles.map((role) => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is the manager of this employee?',
                choices: [
                    { name: 'None', value: null },
                    ...employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }))
                ]
            }
        ]);
        await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log('Employee added!');
    } catch (err) {
        console.error(err);
    }
};