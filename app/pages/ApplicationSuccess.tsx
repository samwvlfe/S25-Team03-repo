import React from 'react';

export default function ApplicationSuccess() {
    return (
        <div className="app-success">
            <div className="info-container">
                <h2>Application Received!</h2>
                <p>Your application has been received! Here's what to expect:</p>
                <ul>
                    <li>
                        🕙 Wait For Review
                        <hr />
                        Our sponsors are hard at work vetting the perfect candidate! Give them some time to review your application.
                    </li>
                    <li>
                        ✉️ Receive Decision
                        <hr />
                        Once they have made their decision, you will receive an email and/or notification regarding their decision!
                    </li>
                    <li>
                        📝 Keep Applying
                        <hr />
                        Whether you're just looking to get your name out there or have interest in multiple positons, we urge you to keep applying!
                    </li>
                </ul>
            </div>
        </div>
    )
}