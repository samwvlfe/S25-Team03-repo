"use client";  // Mark as a client component

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Support from './pages/Support';
import ApplicationForm from './pages/ApplicationForm';

export default function Navigation() {
    return (
        <Router>
            <header>
                <Link to="/">
                    <div className="logo">
                        <img src="/media/signin.svg" alt="Logo"/>
                        <p><b>AlienBaba</b>.com</p>
                    </div>
                </Link>
                <nav className="nav-bar">
                    <ul>
                        <li>
                            <Link to="/support">Support</Link>
                        </li>
                        <li>
                            <Link to="/signin">
                                <img src="/media/signin.svg" alt="Sign In"/>
                                Sign In
                            </Link>
                        </li>
                        <li className="account-button">
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li className="account-button">
                            <Link to="/apply">Apply</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <Routes>
                <Route path="/support" element={<Support/>} />
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/apply" element={<ApplicationForm />} />
                <Route path="/" element={<About/>} />
            </Routes>
        </Router>
    )
}
