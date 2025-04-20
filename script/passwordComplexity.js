export function isValidPassword(password) {
    if (typeof password !== "string") {
        return false; // Ensure input is a string
    }

    const hasNumber = /\d/.test(password); // Checks if there's at least one digit
    const isLongEnough = password.length > 6; // Checks if it's longer than 6 characters

    return hasNumber && isLongEnough;
}