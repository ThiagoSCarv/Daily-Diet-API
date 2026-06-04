-- Runs only on first container init (empty volume). Creates the database used
-- by the test suite. The default `daily_diet` database is created via the
-- POSTGRES_DB environment variable in docker-compose.yml.
CREATE DATABASE daily_diet_test;
