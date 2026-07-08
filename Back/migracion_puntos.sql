-- Migración: agrega la columna de puntos a la tabla Usuarios
-- Ejecutar una sola vez contra la base "2026_5INF_G15"

ALTER TABLE Usuarios
ADD COLUMN IF NOT EXISTS puntos INT NOT NULL DEFAULT 0;

-- (Opcional) Datos de prueba para ver el ranking funcionando:
-- UPDATE Usuarios SET puntos = 120 WHERE usuario = 'usuario1';
-- UPDATE Usuarios SET puntos = 80  WHERE usuario = 'usuario2';
-- UPDATE Usuarios SET puntos = 45  WHERE usuario = 'usuario3';
