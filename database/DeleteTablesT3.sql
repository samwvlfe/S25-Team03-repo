USE GoodDriverIncentiveT3;

-- Disable foreign key checks to prevent constraint errors during deletion
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist
DROP TABLE IF EXISTS AuditLog;
DROP TABLE IF EXISTS PointTransactions;
DROP TABLE IF EXISTS Purchases;
DROP TABLE IF EXISTS ProductCatalog;
DROP TABLE IF EXISTS Driver;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS SponsorUser;
DROP TABLE IF EXISTS Sponsor;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Applications;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
