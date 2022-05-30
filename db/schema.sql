CREATE TABLE todos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  day varchar DEFAULT NULL,
  month varchar DEFAULT NULL,
  year varchar DEFAULT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false
);





