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
export async function updatePoints(userDriverID: number, Points_inc: number, EditorUserID: number, reason: string): Promise<boolean> {
    try {
        const response = await fetch("http://localhost:2999/updatePoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userDriverID, Points_inc, EditorUserID, reason }),
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