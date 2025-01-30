import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faComments, faInfoCircle, faKey  } from '@fortawesome/free-solid-svg-icons';
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
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <span className="menu-text">Users Management</span>
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faCog} className="icon" />
                    <span className="menu-text">Settings</span>
                </div>
            </div>
            {isAuthenticated && (
                <div className="menu-item">
                  <FontAwesomeIcon icon={faKey} className="icon" />
                  <Link
                    to="/updatePassword"
                    className="menu-text"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    Change Password
                  </Link>
                </div>
            )}
            <div className="bottom-section">
                <div className="menu-item">
                    <FontAwesomeIcon icon={faComments} className="icon" />
                    <span className="menu-text">Support</span>
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faInfoCircle} className="icon" />
                    <span className="menu-text">About Me</span>
                </div>
                {isAuthenticated && (
                    <div className="user-info">
                        <span className="username">Connected</span>
                        <button onClick={logout} className="logout-button" style={{ border: 'none', background: 'none' }}>
                            <img src={logoutIcon} alt="Logout" className="logout-icon" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
