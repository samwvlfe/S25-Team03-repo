// control what nav elements are shown based on user
export function toggleNav(){
    // Get user data safely
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    // Check if elements exist before modifying them
    const apply = document.querySelector("#apply");
    const signin = document.querySelector("#signin");
    const signout = document.querySelector("#signout");
    const revApps = document.querySelector("#revApps");
    const adminID = document.querySelector("#adminID");
    const goto = document.querySelector("#goto");
    const assume = document.querySelector("#prevUser");
    if (assume) assume.style.display = "block";


    // If signed in, hide apply and sign in elements and show goto
    if(user){ 
        if (goto) goto.style.display = "block";
        if (signin) signin.style.display = "none";
        if (apply) apply.style.display = "none";

        // Now that we know user exists, check the user type
        if(user.usertype === "Driver"){
            if (signout) signout.style.display = "flex";
        } else if(user.usertype === "SponsorUser"){
            if (revApps) revApps.style.display = "block";
            if (signout) signout.style.display = "flex";
        } else if(user.usertype === "Admin"){
            if (adminID) adminID.style.display = "block";
            if (revApps) revApps.style.display = "block";
            if (signout) signout.style.display = "flex";
        }
    }
    else {
        // Not signed in: show sign in and apply
        if (signin) signin.style.display = "block";
        if (apply) apply.style.display = "block";
    }
}


// Clear local storage and sign out
export function handleSignOut() {
    console.log("Signing out...");

    // Clear session storage and localStorage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to home page and refresh the app
    window.location.href = "/";
}
