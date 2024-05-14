import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import './Header.css'; // Assuming you'll place your CSS rules here
// import { TrainModelIcon, UserModelIcon } from './AppComponents';
import {UserModelIcon} from '../icons/UserModelIcon'
import {TrainModelIcon} from '../icons/TrainModelIcon'
import {MenuIcon} from '../icons/MenuIcon'

function Header() {
  return (
    <div className="header">
      <div className="menu-icon">
        <MenuIcon/>
      </div>
      <div className="title">Tabular Wizard</div>

      <div className="controls">
        <Link to="/trainModel" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="button">
            <TrainModelIcon />
            <span>Train Model</span>
          </div>
        </Link>
        <Link to="/userModels" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="button">
          <UserModelIcon/>
            <span>User Models</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
export default Header;
