"use client";  // Mark as a client component

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About';
import Login from './pages/Login';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationSuccess from './pages/ApplicationSuccess';
import ReviewApplications from './pages/ReviewApplications';
import AdminDashboard from './pages/AdminDashboard';
import Menu from './pages/Menu';

export default function Navigation() {
    return (
        <Router>
            <header>
                <Link to="/">
                    <div className="logo">
                        <img src="/media/logo.svg" alt="Logo"/>
                        <p><b>AlienBaba</b>.com</p>
                    </div>
                </Link>
                <nav className="nav-bar">
                    <ul>
                        <li>
                            <Link to="/signin">
                                <img src="/media/signin.svg" alt="Sign In"/>
                                Sign In
                            </Link>
                        </li>
                        <li id="apply" className="account-button">
                            <Link to="/apply">Apply</Link>
                        </li>
                        <li id="revApps" className="account-button">
                            <Link to="/review">Review Applications</Link>
                        </li>
                        <li>
                            <Link to="/menu">Menu</Link> 
                        </li>
                    </ul>
                </nav>
            </header>
            <Routes>
                <Route path="/signin" element={<Login />} />
                <Route path="/apply" element={<ApplicationForm />} />
                <Route path="/apply-success" element={<ApplicationSuccess />} />
                <Route path="/review" element={<ReviewApplications />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<About/>} />
            </Routes>
        </Router>
    )
}