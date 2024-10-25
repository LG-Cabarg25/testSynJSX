USE TestSync;

SELECT * FROM Users;
SELECT * FROM Projects;
SELECT * FROM Project_Roles;
SELECT * FROM Meetings;
SELECT * FROM Project_Assignments;

DESCRIBE Users;
DESCRIBE Projects;
DESCRIBE Project_roles;
DESCRIBE Project_Assignments;
SELECT * FROM Project_Assignments WHERE project_id = 13;

CALL procedure_to_list_user_projects(13);

CALL procedure_to_register_project_assignments(19, 13, 19, 'HJKL', 'LGJKLKK', 'In progress');

CALL procedure_to_get_project_assignments(8)