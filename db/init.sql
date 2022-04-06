CREATE DATABASE IF NOT EXISTS project_hub;
CREATE DATABASE IF NOT EXISTS project_hub_etherpad;
CREATE USER etherpad IDENTIFIED BY 'etherpadPWD';
GRANT ALL PRIVILEGES ON project_hub_etherpad . * TO etherpad;
USE project_hub;