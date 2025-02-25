import React from 'react';

export default function Signup() {
    return (
        <div className="account-form">
            <form>
                <img src="/media/default-alien.svg"/>
                <label>Email:</label>
                <br />
                <input id="username" type="text" />
                <br />
                <label>Password:</label>
                <br />
                <input id="password" type="password" />
                <label>Confirm Password:</label>
                <br />
                <input id="confirmPassword" type="password" />
                <br />
                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}