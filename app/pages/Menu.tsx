export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("Menu component loaded"); // Debugging line
    return (
        <div>
            <p>Menu</p>
            <p>Welcome, {user.username}</p>
            <p>User Type: {user.usertype}</p>
        </div>
    );
}
