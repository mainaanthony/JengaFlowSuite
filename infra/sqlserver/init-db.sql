-- Wait for SQL Server to be ready
WAITFOR DELAY '00:00:05';
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'$(DB_NAME)')
BEGIN
    CREATE DATABASE [$(DB_NAME)];
    PRINT 'Database $(DB_NAME) created successfully';
END
ELSE
BEGIN
    PRINT 'Database $(DB_NAME) already exists';
END
GO

-- Use the database
USE [$(DB_NAME)];
GO

-- Create schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'jengaFlow')
BEGIN
    EXEC('CREATE SCHEMA jengaFlow');
    PRINT 'Schema jengaFlow created successfully';
END
ELSE
BEGIN
    PRINT 'Schema jengaFlow already exists';
END
GO

-- Set default schema for sa user
ALTER USER sa WITH DEFAULT_SCHEMA = jengaFlow;
GO

PRINT 'Database initialization completed!';
GO
