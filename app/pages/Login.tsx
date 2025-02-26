import React from 'react';

export default function Login() {
    return (
        <div className="account-form">
            <form>
                <label>Username:</label>
                <br />
                <input id="username" type="text" placeholder="Username or email"/>
                <br />
                <label>Password:</label>
                <br />
                <input id="password" type="password" placeholder="Password"/>
                <br />
                <input type="submit" value="Log in"/>
            </form>
        </div>
    )
}