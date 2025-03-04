// control what nav elements are shown based on user
export function toggleNav(){
    console.log("toggle func hit");

    // Get user data safely
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    // Check if elements exist before modifying them
    const signin = document.querySelector("#signin");
    const signout = document.querySelector("#signout");
    const revApps = document.querySelector("#revApps");
    const adminID = document.querySelector("#adminID");

    // if signed in, take away apply
    if(user){ if (signin) signin.style.display = "none";}
    // if driver, only show sign out
    if(user.usertype === "Driver"){
        if (signout) signout.style.display = "block";
    }
    // if sponsor, only show applications and sign out
    else if(user.usertype === "SponsorUser"){
        if (revApps) revApps.style.display = "block";
        if (signout) signout.style.display = "block";
    }
    // if admin, show everything 
    else if(user.usertype === "Admin"){
        if (adminID) adminID.style.display = "block";
        if (revApps) revApps.style.display = "block";
        if (signout) signout.style.display = "block";
    }
    // not signed in, take away all but sign in
    else{
        if (signin) signin.style.display = "block";
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
