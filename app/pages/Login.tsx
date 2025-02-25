import React from 'react';

export default function Login() {
    return (
        <div className="account-form">
            <form>
                <label>Email:</label>
                <br />
                <input id="username" type="text" />
                <br />
                <label>Password:</label>
                <br />
                <input id="password" type="password" />
                <br />
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}