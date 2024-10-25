CREATE DATABASE TestSync;

USE TestSync;
#CHEQUEADA
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
#CHEQUEADA
CREATE TABLE Projects (
  project_id INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status ENUM('In Progress', 'Completed', 'Pending') DEFAULT 'Pending',
  pm_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pm_id) REFERENCES Users(user_id)
);
#CHEQUEADA
CREATE TABLE Project_Roles (
  project_role_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  role ENUM('PM', 'Tester', 'Developer', 'QA') NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);
#CHEQUEADA
CREATE TABLE Test_Plans (
  test_plan_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  plan_name VARCHAR(255),
  document LONGBLOB,
  status ENUM('Pending', 'In progress', 'Completed'),
  FOREIGN KEY (project_id) REFERENCES Projects(project_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
#CHEQUEADA
CREATE TABLE Test_Cases (
	  test_case_id INT PRIMARY KEY AUTO_INCREMENT,
	  test_plan_id INT NOT NULL,
	  project_role_id INT NOT NULL,  -- Referencia al ID del rol del proyecto
	  description TEXT,
	  status ENUM('Passed', 'Failed', 'Pending') DEFAULT 'Pending',
	  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',  -- Agregada la columna de prioridad
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  FOREIGN KEY (test_plan_id) REFERENCES Test_Plans(test_plan_id),
	  FOREIGN KEY (project_role_id) REFERENCES Project_Roles(project_role_id)  -- Referencia a Project_Roles
	);
#CHEQUEADA
CREATE TABLE commentsTestCase (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único del comentario
    test_case_id INT NOT NULL,  -- ID del caso de prueba relacionado
    comment_text TEXT NOT NULL,  -- El texto del comentario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha y hora en que se hizo el comentario
    FOREIGN KEY (test_case_id) REFERENCES Test_Cases(test_case_id)  -- Relación con la tabla Test_Cases
);
#CHEQUEADA
CREATE TABLE Test_Images (
	test_image_id INT PRIMARY KEY AUTO_INCREMENT,
    test_case_id INT NOT NULL,
    image LONGBLOB,
    FOREIGN KEY (test_case_id) REFERENCES Test_Cases(test_case_id)
);
#CHEQUEADA
CREATE TABLE Defects (
  defect_id INT PRIMARY KEY AUTO_INCREMENT,
  defect_description TEXT NOT NULL,
  severity ENUM('Low', 'Medium', 'High') NOT NULL,
  status ENUM('Returned', 'Approved', 'Rejected') DEFAULT 'Returned',
  test_case_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_case_id) REFERENCES Test_Cases(test_case_id)
);
#CHEQUEADA
CREATE TABLE Project_Assignments (
  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  project_role_id INT NOT NULL,
  name_task VARCHAR(255) NOT NULL,  -- Nuevo campo para el nombre de la tarea
  description TEXT NOT NULL,
  status ENUM('To do', 'In progress', 'In review', 'In testing', 'Approved', 'Returned', 'Rejected') NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (project_id) REFERENCES Projects(project_id),
  FOREIGN KEY (project_role_id) REFERENCES Project_Roles(project_role_id)
);
#CHEQUEADA
CREATE TABLE Project_Assignments_Comments (
  project_assignments_comments_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  assignment_id INT NOT NULL,
  comments TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Añadir la fecha de creación
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (assignment_id) REFERENCES Project_Assignments(assignment_id)
);
#CHEQUEADA
CREATE TABLE Meetings (
	meeting_id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_date DATE NOT NULL,
    meeting_start_time TIME NOT NULL,
    meeting_end_time TIME NOT NULL,
    meeting_status ENUM ('Pending', 'Completed') NOT NULL,
    meeting_description TEXT NOT NULL,
    meeting_link TEXT NOT NULL,
    project_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects (project_id)
);




CREATE TABLE Metrics (
  metric_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  test_coverage DECIMAL(5, 2),
  defect_rate DECIMAL(5, 2),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

CREATE TABLE Project_History (
  project_history_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  action_performed VARCHAR(255),
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  performed_by INT,
  FOREIGN KEY (project_id) REFERENCES Projects(project_id),
  FOREIGN KEY (performed_by) REFERENCES Users(user_id)
);

CREATE TABLE Defect_History (
  defect_history_id INT PRIMARY KEY AUTO_INCREMENT,
  defect_id INT NOT NULL,
  old_status ENUM('Open', 'In Progress', 'Closed'),
  new_status ENUM('Open', 'In Progress', 'Closed'),
  change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by INT,
  FOREIGN KEY (defect_id) REFERENCES Defects(defect_id),
  FOREIGN KEY (changed_by) REFERENCES Users(user_id)
);

CREATE TABLE Test_Case_History (
  test_case_history_id INT PRIMARY KEY AUTO_INCREMENT,
  test_case_id INT NOT NULL,
  old_status ENUM('Passed', 'Failed'),
  new_status ENUM('Passed', 'Failed'),
  change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by INT,
  FOREIGN KEY (test_case_id) REFERENCES Test_Cases(test_case_id),
  FOREIGN KEY (changed_by) REFERENCES Users(user_id)
);

CREATE TABLE Test_Results (
  test_result_id INT PRIMARY KEY AUTO_INCREMENT,
  test_plan_id INT NOT NULL,
  test_case_id INT NOT NULL,
  actual_result TEXT,
  result_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_plan_id) REFERENCES Test_Plans(test_plan_id),
  FOREIGN KEY (test_case_id) REFERENCES Test_Cases(test_case_id)
);

CREATE TABLE Project_Invitations (
  invitation_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  invited_user_id INT NOT NULL,
  invitation_status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
  invitation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_date TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES Projects(project_id),
  FOREIGN KEY (invited_user_id) REFERENCES Users(user_id)
);

