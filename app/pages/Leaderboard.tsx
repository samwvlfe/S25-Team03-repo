import { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  Name: string;
  Username: string;
  TotalPoints: number;
}

const Leaderboard = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    axios.get("http://44.200.67.186:2999/api/leaderboard")
      .then(res => setDrivers(res.data))
      .catch(err => console.error("Failed to load leaderboard:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Top Drivers Leaderboard</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => (
            <tr key={driver.Username}>
              <td>{index + 1}</td>
              <td>{driver.Name}</td>
              <td>{driver.Username}</td>
              <td>{driver.TotalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;