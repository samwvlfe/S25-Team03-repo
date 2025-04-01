SELECT 
    D.DriverID, 
    D.Name,
    SUM(PH.PointChange) AS TotalPointsEarned
FROM Driver D
JOIN PointHistory PH ON D.DriverID = PH.DriverID
GROUP BY D.DriverID, D.Name
ORDER BY TotalPointsEarned DESC;

SELECT 
    D.CompanyID,
    D.DriverID,
    D.Name,
    MAX(PH.PointChange) AS MaxPointGain
FROM Driver D
JOIN PointHistory PH ON D.DriverID = PH.DriverID
WHERE PH.PointChange > 0
GROUP BY D.CompanyID, D.DriverID, D.Name
ORDER BY D.CompanyID, MaxPointGain DESC;

SELECT 
    PC.ProductID,
    PC.ProductName,
    COUNT(*) AS TimesPurchased
FROM CataPurchases CP
JOIN JSON_TABLE(CP.OrderItems, '$[*]' COLUMNS (
    ProductID INT PATH '$.productId'
)) AS OrderItems
JOIN ProductCatalog PC ON PC.ProductID = OrderItems.ProductID
GROUP BY PC.ProductID, PC.ProductName
ORDER BY TimesPurchased DESC
LIMIT 1;

SELECT 
    D.DriverID,
    D.Name,
    ABS(SUM(PH.PointChange)) AS TotalPointsLost
FROM Driver D
JOIN PointHistory PH ON D.DriverID = PH.DriverID
WHERE PH.PointChange < 0
GROUP BY D.DriverID, D.Name
ORDER BY TotalPointsLost DESC
LIMIT 1;

SELECT 
    D.DriverID, 
    D.Name,
    SUM(CASE WHEN PH.PointChange > 0 THEN PH.PointChange ELSE 0 END) AS TotalPointsEarned
FROM Driver D
JOIN PointHistory PH ON D.DriverID = PH.DriverID
GROUP BY D.DriverID, D.Name
ORDER BY TotalPointsEarned DESC;

-- 1. Total Points Earned by Each Driver
-- 2. Highest Point Gain by a Single Driver per Company
-- 3. Most Products Sold (by frequency of purchases)
-- Assuming OrderItems in CataPurchases is a JSON field listing product IDs
-- We'll use a JSON parser if supported; otherwise, a simplification
-- 4. Most Points Lost Due to Infractions (negative PointChange)
-- 5. Points Obtained per Driver.