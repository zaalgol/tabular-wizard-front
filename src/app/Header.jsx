import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { TrainModelIcon } from '../icons/TrainModelIcon';
import { ModelsGridIcon } from '../icons/ModelsGridIcon';
import { MenuIcon } from '../icons/MenuIcon';

function Header() {
  return (
    <div className="header">
      <div className="menu-icon">
        {/* <MenuIcon /> */}
        <img src="logo12.png" alt="Tabularwizard Logo" class="logo"/>
      </div>
      <div className="title">Tabular Wizard</div>
      <div className="controls">
        <Link to="/trainModel" className="button">
          <TrainModelIcon />
          <span>Train Model</span>
        </Link>
        <Link to="/userModels" className="button">
          <ModelsGridIcon />
          <span>User Models</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
