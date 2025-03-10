"use client";  // Mark as a client component

import React, {useState, useEffect, ReactEventHandler} from 'react';
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
import ViewUsers from './pages/ViewUsers';
import Menu from './pages/Menu';

import {handleSignOut, toggleNav} from '../script/toggle'

export default function Navigation() {

    useEffect(() => {
        toggleNav(); // Run function after component mounts
    }, []);
    
    const [menuState, setMenuState] = useState("none");

    const toggleMenu = (event: React.MouseEvent<HTMLImageElement>) => {
        if (menuState == "none") {
            setMenuState("block");
            return;
        }

        setMenuState("none");
    }

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
                        <li id="signin" style={{ display: "block" }}>
                            <Link to="/signin">
                                <img src="/media/signin.svg" alt="Sign In"/>
                                Sign In
                            </Link>
                        </li>
                        <li id="apply" style={{ display: "block" }} className="account-button">
                            <Link to="/apply">Apply</Link>
                        </li>
                        <li id="revApps">
                            <Link to="/review">Applications</Link>
                        </li>
                        <li id="adminID">
                            <Link to="/admin-dashboard">Admin</Link>
                        </li>
                        <li id="signout">
                            <img src="/media/default-alien.svg" onClick={ toggleMenu }/>
                            <div id="signoutMenu" style={{ display: menuState }}>
                                <button className="account-button" onClick={handleSignOut}>Sign Out</button>
                            </div>
                        </li>
                        <li id="goto">
                            <Link to="/menu">Go to Menu</Link>
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
                <Route path="/users" element={<ViewUsers adminID="admin123" />} />
                <Route path="/" element={<About/>} />
            </Routes>
        </Router>
    )
}