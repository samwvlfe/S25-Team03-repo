CREATE DATABASE IF NOT EXISTS GoodDriverIncentiveT3;
USE GoodDriverIncentiveT3;

-- Tables
-- Sponsor (Company)
CREATE TABLE IF NOT EXISTS Sponsor (
    CompanyID INT AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL,
    ProductCatalogID INT NULL,
    PointsInfo TEXT NULL
);

-- Sponsor User
CREATE TABLE IF NOT EXISTS SponsorUser (
    SponsorUserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CompanyID INT,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- Admin User
CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Driver User
CREATE TABLE IF NOT EXISTS Driver (
    DriverID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NULL,
    TotalPoints INT DEFAULT 0,
    CompanyID INT,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- All Users
CREATE TABLE IF NOT EXISTS AllUsers (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Email VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    UserType ENUM('Driver', 'Sponsor', 'Admin') NOT NULL,
    Name VARCHAR(255) NULL,  -- Only for Drivers
    TotalPoints INT DEFAULT 0, -- Only for Drivers
    CompanyID INT NULL,  -- Only for Sponsors and Drivers
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE SET NULL
);

-- Product Catalog
CREATE TABLE IF NOT EXISTS ProductCatalog (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    -- CompanyID INT,
    ProductName VARCHAR(255) NOT NULL,
    PriceInPoints INT NOT NULL,
    Availability BOOLEAN DEFAULT TRUE,
    Description TEXT NULL,
    ImageURL VARCHAR(512) NULL,
    -- FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- Purchases
CREATE TABLE IF NOT EXISTS Purchases (
    PurchaseID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT,
    ProductID INT,
    PurchaseDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES ProductCatalog(ProductID) ON DELETE CASCADE
);

-- Point Transactions
CREATE TABLE IF NOT EXISTS PointTransactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT,
    SponsorID INT,
    AdminID INT NULL,
    AmountChanged INT NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Reason TEXT NULL,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE SET NULL
);

-- Audit Log
CREATE TABLE IF NOT EXISTS AuditLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    UserType ENUM('Driver', 'SponsorUser', 'Admin') NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Action TEXT NOT NULL,
    Details TEXT NULL
);

-- Applications Table (For Driver & Sponsor Applications)
CREATE TABLE IF NOT EXISTS Applications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    ApplicantName VARCHAR(255) NOT NULL,
    ApplicantType ENUM('Driver', 'Sponsor') NOT NULL,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Email VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CompanyID INT NULL,  -- Only applicable for sponsor applications
    ApplicationStatus ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    SubmissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Review Columns
    ReviewedByAdminID INT NULL,  -- Used when a sponsor application is approved by an admin
    ReviewedBySponsorID INT NULL,  -- Used when a driver application is approved by a sponsor
    ReviewDate TIMESTAMP NULL,

    -- Foreign Keys
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE SET NULL,
    FOREIGN KEY (ReviewedByAdminID) REFERENCES Admin(AdminID) ON DELETE SET NULL,
    FOREIGN KEY (ReviewedBySponsorID) REFERENCES SponsorUser(SponsorUserID) ON DELETE SET NULL
);

-- Orders Table (For Drivers and Sponsors)
CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT,
    SponsorID INT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalPointsSpent INT NOT NULL,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- DriverSponsorRequests table
CREATE TABLE IF NOT EXISTS DriverSponsorRequests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT NOT NULL,
    SponsorCompanyID INT NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    RequestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (SponsorCompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);