
INSERT INTO department (name)
VALUE 
    ("Marketing"),
    ("Research"),
    ("Finance"),
    ("Consulting");

INSERT INTO role (title, salary, department_id)
VALUE 
    ("Senior Marketing Executive", 200000, 1),
    ("Junior Research Intern", 50000, 2),
    ("Senior Accountant", 125000, 3),
    ("Sales Lead", 90000, 1),
    ("Salesperson", 50000, 1),
    ("Software Engineer", 150000, 2),
    ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Sam", "Adams", null, 1),
("Daisy", "May", null, 2),
("John","Doe",null,3),
("Jane", "Doe", 1, 4),
("Sarah", "Melbourne", 4, 5),
("Jason", "Bourne", 1, 6),
("Jose", "Velasquez", 2, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;