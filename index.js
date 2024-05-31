const mysql = require('mysql2/promise');
const cTable = require('console.table');

// Connection to DB
const db = mysql.createPool(
    {
        host: 'localhost',
        user: 'med-tracker',
        password: 'Hospital123!!',
        database: 'employee_tracker'
    });

const mainMenu = async () => {
    const { default: inquirer } = await import('inquirer');
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do:',
            choices: [
                'View departments',
                'View employees',
                'View roles',
                'Add a department',
                'Add a role',
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
        case 'Add a role':
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
        SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id
        `);
        console.table(results);
    } catch (err) {
        console.error(err);
    }
};

const viewAllEmployees = async () => {
    try {
        const [results] = await db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager on employee.manager_id = manager.id
        `);
        console.table(results);
    } catch (err) {
        console.error(err);
    }
};
// Add Functions
const addDepartment = async () => {
    try {
        const { default: inquirer } = await import('inquirer');
        const {name} = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new Department?',
            }
        ]);
        await db.query('INSERT INTO department (name) Values (?)', [name]);
        console.log('department added!');
    } catch (err) {
        console.error(err);
    }
};

const addRole = async () => {
    try {
        const { default: inquirer } = await import('inquirer');
        const [department] = await db.query('SELECT * FROM department');
        const answers = await inquirer.prompt([
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
                choices: department.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]);
        const salary = answers.salary.replace(/,/g, '');
        await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department_id]);
        console.log('Role has been added');
    } catch (err) {
        console.error(err);
    }
};

const addEmployee = async () => {
    try {
        const { default: inquirer } = await import('inquirer');
        const [roles] = await db.query('SELECT * FROM role');
        const [employees] = await db.query('SELECT * FROM employee');
        const answers = await inquirer.prompt([
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

const updateEmployeeRole = async () => {
    try {
        const { default: inquirer } = await import('inquirer');
        const [employees] = await db.query('SELECT * FROM employee');
        const [roles] = await db.query('SELECT * FROM role');
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Which employee would you like to update?',
                choices: employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What's the new role for this employee?",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
            }))
        }
        ]);
        await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id]);
        console.log('Employee role updated successfully!');
    } catch (err) {
        console.error(err);
    }
};

mainMenu();