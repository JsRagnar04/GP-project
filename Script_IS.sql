
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS preyecto_is;
USE proyecto_is;

-- Crear la tabla RESPONSABLES
CREATE TABLE RESPONSABLES (
    ID_RESPONSABLE VARCHAR(50) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    NOMBRE VARCHAR(100) NOT NULL,
    ROL VARCHAR(50) NOT NULL,
    PRIMARY KEY (ID_RESPONSABLE)
);

-- Crear la tabla EDIFICIOS
CREATE TABLE EDIFICIOS (
    ID_EDIFICIO VARCHAR(50) NOT NULL,
    NOMBRE VARCHAR(100) NOT NULL,
    PRIMARY KEY (ID_EDIFICIO)
);

-- Crear la tabla SALONES
CREATE TABLE SALONES (
    ID_SALON VARCHAR(50) NOT NULL,
    ID_EDIFICIO VARCHAR(50) NOT NULL,
    PISO INT NOT NULL,
    CAPACIDAD INT NOT NULL,
    PRIMARY KEY (ID_SALON, ID_EDIFICIO),  -- Doble clave primaria
    FOREIGN KEY (ID_EDIFICIO) REFERENCES EDIFICIOS(ID_EDIFICIO) ON DELETE CASCADE
);

-- Crear la tabla EQUIPOS
CREATE TABLE EQUIPOS (
    ID_EQUIPO VARCHAR(50) NOT NULL,
    TIPO VARCHAR(50) NOT NULL,
    PRIMARY KEY (ID_EQUIPO)
);

-- Crear la tabla SALON_EQUIPOS
CREATE TABLE SALON_EQUIPOS (
    ID_SALON VARCHAR(50) NOT NULL,
    ID_EQUIPO VARCHAR(50) NOT NULL,
    PRIMARY KEY (ID_SALON, ID_EQUIPO),
    FOREIGN KEY (ID_SALON) REFERENCES SALONES(ID_SALON),
    FOREIGN KEY (ID_EQUIPO) REFERENCES EQUIPOS(ID_EQUIPO)
);

-- Crear la tabla RESERVACIONES
CREATE TABLE RESERVACIONES (
    ID_RESERVACION INT NOT NULL AUTO_INCREMENT,
    SALON VARCHAR(50) NOT NULL,
    ID_RESPONSABLE VARCHAR(50) NOT NULL,
    FECHA DATETIME NOT NULL,
    HORARIO_ENTRADA TIME NOT NULL,
    HORARIO_SALIDA TIME NOT NULL,
    ASUNTO VARCHAR(255) NOT NULL,
    STATUS VARCHAR(50) NOT NULL,
    PRIMARY KEY (ID_RESERVACION),
    FOREIGN KEY (SALON) REFERENCES SALONES(ID_SALON),
    FOREIGN KEY (ID_RESPONSABLE) REFERENCES RESPONSABLES(ID_RESPONSABLE)
);


-- Insertar los responsables
INSERT INTO RESPONSABLES (ID_RESPONSABLE, PASSWORD, NOMBRE, ROL) 
VALUES 
    ('l21280568', 'adminOrcl', 'Juan Hernandez', 'admin'),
    ('l21280548', '1234', 'Cesar Cervantes', 'user'),
    ('l21280534', 'armdn01', 'Armando Morales', 'user'),
    ('l21280570', 'werapass', 'Andrea Fernandez', 'user');


-- Insertar los edificios
INSERT INTO EDIFICIOS (ID_EDIFICIO, NOMBRE) 
VALUES 
    ('T', 'Sistemas'),
    ('B', 'Industrial');
    
   
   
-- Insertar salones en el edificio T
-- Piso 1
INSERT INTO SALONES (ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD) 
VALUES 
    ('TLC-1', 'T', 1, 25),   -- TLC-1
    ('TLC-2', 'T', 1, 20),   -- TLC-2
    ('TLC-3', 'T', 1, 30),   -- TLC-3
    ('TLC-4', 'T', 1, 28);   -- TLC-4

-- Piso 2
INSERT INTO SALONES (ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD) 
VALUES 
    ('T-5', 'T', 2, 22),   -- TLC-5
    ('T-6', 'T', 2, 26),   -- TLC-6
    ('T-7', 'T', 2, 24),   -- TLC-7
    ('T-8', 'T', 2, 21);   -- TLC-8

-- Piso 3
INSERT INTO SALONES (ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD) 
VALUES 
    ('T-9', 'T', 3, 27),   -- TLC-9
    ('T-10', 'T', 3, 30),  -- TLC-10
    ('T-11', 'T', 3, 23),  -- TLC-11
    ('T-12', 'T', 3, 29);  -- TLC-12
    
    
    
    
INSERT INTO SALONES (ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD) 
VALUES 
    ('B-1', 'B', 1, 25),   -- B-1
    ('B-2', 'B', 1, 22),   -- B-2
    ('B-3', 'B', 1, 20);   -- B-3

-- Piso 2
INSERT INTO SALONES (ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD) 
VALUES 
    ('B-4', 'B', 2, 27),   -- B-4
    ('B-5', 'B', 2, 24),   -- B-5
    ('B-6', 'B', 2, 26);   -- B-6
    
    
 -- Insertar PCs (PC-1 a PC-100)
INSERT INTO EQUIPOS (ID_EQUIPO, TIPO) 
VALUES 
    ('PC-1', 'PC'), ('PC-2', 'PC'), ('PC-3', 'PC'), ('PC-4', 'PC'), ('PC-5', 'PC'),
    ('PC-6', 'PC'), ('PC-7', 'PC'), ('PC-8', 'PC'), ('PC-9', 'PC'), ('PC-10', 'PC'),
    ('PC-11', 'PC'), ('PC-12', 'PC'), ('PC-13', 'PC'), ('PC-14', 'PC'), ('PC-15', 'PC'),
    ('PC-16', 'PC'), ('PC-17', 'PC'), ('PC-18', 'PC'), ('PC-19', 'PC'), ('PC-20', 'PC'),
    ('PC-21', 'PC'), ('PC-22', 'PC'), ('PC-23', 'PC'), ('PC-24', 'PC'), ('PC-25', 'PC'),
    ('PC-26', 'PC'), ('PC-27', 'PC'), ('PC-28', 'PC'), ('PC-29', 'PC'), ('PC-30', 'PC'),
    ('PC-31', 'PC'), ('PC-32', 'PC'), ('PC-33', 'PC'), ('PC-34', 'PC'), ('PC-35', 'PC'),
    ('PC-36', 'PC'), ('PC-37', 'PC'), ('PC-38', 'PC'), ('PC-39', 'PC'), ('PC-40', 'PC'),
    ('PC-41', 'PC'), ('PC-42', 'PC'), ('PC-43', 'PC'), ('PC-44', 'PC'), ('PC-45', 'PC'),
    ('PC-46', 'PC'), ('PC-47', 'PC'), ('PC-48', 'PC'), ('PC-49', 'PC'), ('PC-50', 'PC'),
    ('PC-51', 'PC'), ('PC-52', 'PC'), ('PC-53', 'PC'), ('PC-54', 'PC'), ('PC-55', 'PC'),
    ('PC-56', 'PC'), ('PC-57', 'PC'), ('PC-58', 'PC'), ('PC-59', 'PC'), ('PC-60', 'PC'),
    ('PC-61', 'PC'), ('PC-62', 'PC'), ('PC-63', 'PC'), ('PC-64', 'PC'), ('PC-65', 'PC'),
    ('PC-66', 'PC'), ('PC-67', 'PC'), ('PC-68', 'PC'), ('PC-69', 'PC'), ('PC-70', 'PC'),
    ('PC-71', 'PC'), ('PC-72', 'PC'), ('PC-73', 'PC'), ('PC-74', 'PC'), ('PC-75', 'PC'),
    ('PC-76', 'PC'), ('PC-77', 'PC'), ('PC-78', 'PC'), ('PC-79', 'PC'), ('PC-80', 'PC'),
    ('PC-81', 'PC'), ('PC-82', 'PC'), ('PC-83', 'PC'), ('PC-84', 'PC'), ('PC-85', 'PC'),
    ('PC-86', 'PC'), ('PC-87', 'PC'), ('PC-88', 'PC'), ('PC-89', 'PC'), ('PC-90', 'PC'),
    ('PC-91', 'PC'), ('PC-92', 'PC'), ('PC-93', 'PC'), ('PC-94', 'PC'), ('PC-95', 'PC'),
    ('PC-96', 'PC'), ('PC-97', 'PC'), ('PC-98', 'PC'), ('PC-99', 'PC'), ('PC-100', 'PC');
   
   
   -- Insertar proyectores (C-1 a C-20)
INSERT INTO EQUIPOS (ID_EQUIPO, TIPO) 
VALUES 
    ('C-1', 'Proyector'), ('C-2', 'Proyector'), ('C-3', 'Proyector'), ('C-4', 'Proyector'), ('C-5', 'Proyector'),
    ('C-6', 'Proyector'), ('C-7', 'Proyector'), ('C-8', 'Proyector'), ('C-9', 'Proyector'), ('C-10', 'Proyector'),
    ('C-11', 'Proyector'), ('C-12', 'Proyector'), ('C-13', 'Proyector'), ('C-14', 'Proyector'), ('C-15', 'Proyector'),
    ('C-16', 'Proyector'), ('C-17', 'Proyector'), ('C-18', 'Proyector'), ('C-19', 'Proyector'), ('C-20', 'Proyector');


-- Asignar 25 PCs al salón TLC-1
INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('TLC-1', 'PC-1'), ('TLC-1', 'PC-2'), ('TLC-1', 'PC-3'), ('TLC-1', 'PC-4'), ('TLC-1', 'PC-5'),
    ('TLC-1', 'PC-6'), ('TLC-1', 'PC-7'), ('TLC-1', 'PC-8'), ('TLC-1', 'PC-9'), ('TLC-1', 'PC-10'),
    ('TLC-1', 'PC-11'), ('TLC-1', 'PC-12'), ('TLC-1', 'PC-13'), ('TLC-1', 'PC-14'), ('TLC-1', 'PC-15'),
    ('TLC-1', 'PC-16'), ('TLC-1', 'PC-17'), ('TLC-1', 'PC-18'), ('TLC-1', 'PC-19'), ('TLC-1', 'PC-20'),
    ('TLC-1', 'PC-21'), ('TLC-1', 'PC-22'), ('TLC-1', 'PC-23'), ('TLC-1', 'PC-24'), ('TLC-1', 'PC-25');

-- Asignar 25 PCs al salón TLC-2
INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('TLC-2', 'PC-26'), ('TLC-2', 'PC-27'), ('TLC-2', 'PC-28'), ('TLC-2', 'PC-29'), ('TLC-2', 'PC-30'),
    ('TLC-2', 'PC-31'), ('TLC-2', 'PC-32'), ('TLC-2', 'PC-33'), ('TLC-2', 'PC-34'), ('TLC-2', 'PC-35'),
    ('TLC-2', 'PC-36'), ('TLC-2', 'PC-37'), ('TLC-2', 'PC-38'), ('TLC-2', 'PC-39'), ('TLC-2', 'PC-40'),
    ('TLC-2', 'PC-41'), ('TLC-2', 'PC-42'), ('TLC-2', 'PC-43'), ('TLC-2', 'PC-44'), ('TLC-2', 'PC-45'),
    ('TLC-2', 'PC-46'), ('TLC-2', 'PC-47'), ('TLC-2', 'PC-48'), ('TLC-2', 'PC-49'), ('TLC-2', 'PC-50');

-- Asignar 25 PCs al salón TLC-3
INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('TLC-3', 'PC-51'), ('TLC-3', 'PC-52'), ('TLC-3', 'PC-53'), ('TLC-3', 'PC-54'), ('TLC-3', 'PC-55'),
    ('TLC-3', 'PC-56'), ('TLC-3', 'PC-57'), ('TLC-3', 'PC-58'), ('TLC-3', 'PC-59'), ('TLC-3', 'PC-60'),
    ('TLC-3', 'PC-61'), ('TLC-3', 'PC-62'), ('TLC-3', 'PC-63'), ('TLC-3', 'PC-64'), ('TLC-3', 'PC-65'),
    ('TLC-3', 'PC-66'), ('TLC-3', 'PC-67'), ('TLC-3', 'PC-68'), ('TLC-3', 'PC-69'), ('TLC-3', 'PC-70'),
    ('TLC-3', 'PC-71'), ('TLC-3', 'PC-72'), ('TLC-3', 'PC-73'), ('TLC-3', 'PC-74'), ('TLC-3', 'PC-75');

-- Asignar 25 PCs al salón TLC-4
INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('TLC-4', 'PC-76'), ('TLC-4', 'PC-77'), ('TLC-4', 'PC-78'), ('TLC-4', 'PC-79'), ('TLC-4', 'PC-80'),
    ('TLC-4', 'PC-81'), ('TLC-4', 'PC-82'), ('TLC-4', 'PC-83'), ('TLC-4', 'PC-84'), ('TLC-4', 'PC-85'),
    ('TLC-4', 'PC-86'), ('TLC-4', 'PC-87'), ('TLC-4', 'PC-88'), ('TLC-4', 'PC-89'), ('TLC-4', 'PC-90'),
    ('TLC-4', 'PC-91'), ('TLC-4', 'PC-92'), ('TLC-4', 'PC-93'), ('TLC-4', 'PC-94'), ('TLC-4', 'PC-95'),
    ('TLC-4', 'PC-96'), ('TLC-4', 'PC-97'), ('TLC-4', 'PC-98'), ('TLC-4', 'PC-99'), ('TLC-4', 'PC-100');


   
INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('TLC-1', 'C-1'), ('TLC-2', 'C-2'), ('TLC-3', 'C-3'), ('TLC-4', 'C-4'),
    ('T-5', 'C-5'), ('T-6', 'C-6'), ('T-7', 'C-7'), ('T-8', 'C-8'),
    ('T-9', 'C-9'), ('T-10', 'C-10'), ('T-11', 'C-11'), ('T-12', 'C-12');
   
   
 INSERT INTO SALON_EQUIPOS (ID_SALON, ID_EQUIPO)
VALUES 
    ('B-1', 'C-13'), ('B-2', 'C-14'), ('B-3', 'C-15'),
    ('B-4', 'C-16'), ('B-5', 'C-17'), ('B-6', 'C-18');
    

use proyecto_is;
   
SELECT ID_SALON, ID_EDIFICIO, PISO, CAPACIDAD, TIPO, COUNT(TIPO)
FROM SALONES join SALON_EQUIPOS se USING(ID_SALON)
join EQUIPOS e on se.ID_EQUIPO = e.ID_EQUIPO
where ID_SALON = 'TLC-1'   
group by ID_SALON, ID_EDIFICIO, PISO,CAPACIDAD, TIPO;



select * from responsables;

    