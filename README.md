# Med-Tracker

## Description

Med-Tracker is a command-line application that allows users to manage and track employees within a company. This application is particularly geared towards managing employee roles, departments, and managers in a hospital setting. It uses Node.js, Inquirer, and MySQL to provide an interactive interface for users to perform various CRUD operations on the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation

1. **Clone the repository**:
    ```sh
    git clone git@github.com:PCast71/Med-tracker.git
    cd employee-tracker
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up MySQL Database**:
    - Start your MySQL server.
    - Create a database named `employee_tracker`:
        ```sql
        CREATE DATABASE employee_tracker;
        ```
    - Use the provided schema to create the necessary tables:
        ```sql
        USE employee_tracker;

        CREATE TABLE department (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) NOT NULL
        );

        CREATE TABLE role (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30) NOT NULL,
            salary DECIMAL(10, 2) NOT NULL,
            department_id INT,
            FOREIGN KEY (department_id) REFERENCES department(id)
        );

        CREATE TABLE employee (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INT,
            manager_id INT,
            FOREIGN KEY (role_id) REFERENCES role(id),
            FOREIGN KEY (manager_id) REFERENCES employee(id)
        );
        ```

4. **Configure the database connection**:
    - Update the `db` configuration in `index.js` with your MySQL credentials:
        ```javascript
        const db = mysql.createPool({
            host: 'localhost',
            user: 'your-username',
            password: 'your-password',
            database: 'employee_tracker'
        });
        ```

## Usage

1. **Run the application**:
    ```sh
    node index.js
    ```

2. **Follow the prompts**:
    - Choose an action from the list of options:
        - View departments
        - View employees
        - View roles
        - Add a department
        - Add a role
        - Add an employee
        - Add a manager
        - Update an employee role

3. **Perform actions**:
    - Follow the prompts to view, add, or update departments, roles, employees, and managers.

## Features

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Add a manager
- Update an employee role

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss what you would like to change.

## Questions

If you have any questions about the project, please open an issue or contact me directly at patrickc77hhs@gmail.com.
