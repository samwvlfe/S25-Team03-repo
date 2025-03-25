// get points function
export async function fetchTotalPoints(driverID: number): Promise<number | null> {
    try {
        const response = await fetch(`http://localhost:2999/getTotalPoints?driverID=${driverID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch total points');
        }
        const data = await response.json();
        return data.totalPoints;
    } catch (error) {
        console.error('Error fetching total points:', error);
        return null;
    }
}

// update points function
export async function updatePoints(userDriverID: number, Points_inc: number, SponsorUserID: number, reason: string): Promise<boolean> {
    try {
        const response = await fetch("http://localhost:2999/updatePoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userDriverID, Points_inc, SponsorUserID, reason }),
        });

        if (!response.ok) {
            throw new Error("Failed to update points");
        }

        const data = await response.json();
        console.log("Update Points Response:", data);
        return true;
    } catch (error) {
        console.error("Error updating points:", error);
        return false; 
    }
}

// // // interface for transaction log
// export type PointHistoryRow = {
//     TransactionID: number;
//     DriverID: number;
//     PointChange: number;
//     SponsorUserID: number;
//     Timestamp: string;
//     reason: string;
//   };
//   // fetch transaction data
//   export async function getPointHistory(driverID: number): Promise<PointHistoryRow[] | null> {
//       try {
//           const response = await fetch(`http://localhost:2999/pointHistory/?driverID=${driverID}`);
//           if (!response.ok) {
//               throw new Error('Failed to fetch point history');
//           }
//           const data: PointHistoryRow[] = await response.json();
//           return data;
//       } catch (error) {
//           console.log('Error fetching transaction log: ', error);
//           return null;
//       }
//   }