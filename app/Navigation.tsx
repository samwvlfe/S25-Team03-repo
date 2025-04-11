"use client";  // Mark as a client component

import React, {useState, useEffect, ReactEventHandler, useRef} from 'react';
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
import ViewUsers from './pages/ViewUsers';
import Menu from './pages/Menu';
import FakeStore from "./pages/FakeStore";
import PasswordChange from "./pages/PasswordChange";
import PointTransaction from "./pages/PointTransaction";
import Cart from "./pages/Cart";
import CreateProduct from "./pages/CreateProduct";
import AddCompany from "./pages/AddCompany";
import SponsorRequestForm from './pages/SponsorRequestForm';
import ReviewDriverRequests from './pages/ReviewDriverRequests';
import CreateUser from './pages/CreateUser';
import UpdateDriverPoints from './pages/UpdateDriverPoints';
import DriverTransactions from './pages/DriverTransactions'
import DriverOrders from './pages/DriverOrders'
import CatalogPurchases from './pages/CatalogPurchases';
import Profile from './pages/Profile';



import {handleSignOut, toggleNav} from '../script/toggle'

export default function Navigation() {
    const [menuState, setMenuState] = useState("none");
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = (event: React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();

        if (menuState == "none") {
            setMenuState("block");
            return;
        }

        setMenuState("none");
    }

    useEffect(() => {
        toggleNav(); // Run function after component mounts

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuState("none");
            }
        };

        if (menuState == "block") {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [menuState]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profileImage = user.profileImageURL || "/media/default-alien.svg";

    return (
        <Router>
            <header>
                <Link to="/">
                    <div className="logo">
                        <img src="/media/logo.svg" alt="Logo" />
                        <p><b>AlienBaba</b>.com</p>
                    </div>
                </Link>
                <nav className="nav-bar">
                <ul>
        <li id="signin" style={{ display: "block" }}>
            <Link to="/signin">
                <img src="/media/signin.svg" alt="Sign In" />
                Sign In
            </Link>
        </li>
        <li id="apply" style={{ display: "block" }} className="account-button">
            <Link to="/apply">Apply</Link>
        </li>
        <li id="goto">
            <Link to="/menu">Dashboard</Link>
        </li>
        <li id="signout">
        <img
                src={profileImage}
                alt="User Avatar"
                onClick={toggleMenu}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/media/default-alien.svg";
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />
            <div id="signoutMenu" ref={menuRef} style={{ display: menuState }}>
                <button className="account-button" onClick={handleSignOut}>Sign Out</button>
            </div>
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
                <Route path="/users" element={<ViewUsers adminID="admin123" />} />
                <Route path="/fake-store" element={<FakeStore />} />
                <Route path="/password-change" element={<PasswordChange />} />
                <Route path="/point-transaction" element={<PointTransaction />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/add-company" element={<AddCompany />} />
                <Route path="/request-sponsor" element={<SponsorRequestForm />} />
                <Route path="/review-sponsor-requests" element={<ReviewDriverRequests />} />
                <Route path="/create-user" element={<CreateUser />}/>
                <Route path="/" element={<About />} />
                <Route path="/update-driver-pts" element={<UpdateDriverPoints />} />
                <Route path="/driver-transactions" element={<DriverTransactions />} />
                <Route path="/driver-orders" element={<DriverOrders />} />
                <Route path="/catalog-purchases" element={<CatalogPurchases />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}