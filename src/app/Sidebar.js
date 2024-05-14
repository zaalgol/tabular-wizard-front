import React, { useContext } from 'react';
import useLogout from '../authentication/useLogout';
import { AuthContext } from '../authentication/AuthContext';

import './Sidebar.css'; // Import the CSS for styling
import logoutIcon from '../icons/logout.svg'; // Import the logout icon, ensure to add this file

const Sidebar = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const logout = useLogout();
    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src="image.png" alt="WebAppUI Logo" className="logo" />
                <span className="menu-title">Menu</span>
            </div>
            <div className="search-container">
                <input type="text" placeholder="Search" />
            </div>
            <div className="menu-options">
                <div className="menu-item">
                    <span className="icon-home">&#8962;</span> {/* Replace with actual icon */}
                    <span className="menu-text">Menu Option 01</span>
                </div>
                <div className="menu-item">
                    <span className="icon-settings">&#9881;</span> {/* Replace with actual icon */}
                    <span className="menu-text">Menu Option 02</span>
                </div>
            </div>
            <div className="bottom-section">
                <div className="menu-item">
                    <span className="icon-support">&#128172;</span> {/* Replace with actual icon */}
                    <span className="menu-text">Support</span>
                </div>
                <div className="menu-item">
                    <span className="icon-settings">&#9881;</span> {/* Replace with actual icon */}
                    <span className="menu-text">Settings</span>
                </div>
                {isAuthenticated && (<div className="user-info">
                    <span className="username">Connected</span>
                    <button onClick={logout} className="logout-button" style={{ border: 'none', background: 'none' }}>
                        <img src={logoutIcon} alt="Logout" className="logout-icon" />
                    </button>
                </div>)}
                {/* {isAuthenticated && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )} */}
            </div>
        </div>
    );
}

export default Sidebar;
