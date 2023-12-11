INSERT INTO department (department_name)
VALUES 
('Information Technology'),
('Marketing'),
('Human Resources'),
('Finance'),
('Research and Development'),
('Legal');


INSERT INTO role (title, salary, department_id)
VALUES 
('IT Manager', 135000, 1),
('Marketing Manager', 135000, 2),
('HR Director', 175000, 3),
('Finance Head', 155000, 4),
('R & D Manager ', 190000, 5),
('Legal Manager', 85000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('GINA', 'JAMES', 1, NULL),
('CAROL', 'POLLOCK', 2, 2),
('DASHA', 'SHUGART', 3, 3),
('LOIS', 'BALL', 4, 4),
('ANGIE', 'MARTIN', 5, 5),
('STEVEN', 'LEE', 6, 6);