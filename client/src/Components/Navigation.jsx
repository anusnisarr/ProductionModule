import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBoxOpen, 
  faTools, 
  faInfoCircle, 
  faList,
  faTimes,
  faBars,
  faUtensils,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import '../StyleSheets/Navigation.css';

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
<<<<<<< HEAD
  const [activeItem, setActiveItem] = useState('Home');
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { title: 'Item List', icon: faList, link: '/' },
=======
  const [activeItem, setActiveItem] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { title: 'Item List', icon: faList, link: '/Items' },
    { title: 'Category List', icon: faUtensils, link: '/Categories' },
>>>>>>> master
    { title: 'Recipe list', icon: faUtensils, link: '/recipe' },
    { title: 'Demand Orders', icon: faUtensils, link: '/Demand' },
    { title: 'Production Planning', icon: faUtensils, link: '/ProductionPlanning' }

<<<<<<< HEAD
=======

>>>>>>> master
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-left">
            <button 
              className="burger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon 
                icon={sidebarOpen ? faTimes : faBars} 
                className={`nav-icon ${sidebarOpen ? 'spin' : ''}`}
              />
            </button>
            <div className="nav-logo">
              <a href="/">
                {/* <span className="logo-icon">🍽️</span> */}
                <span className="logo-text">The Cosmic Kitchen</span>
              </a>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="nav-user">
              {/* <span className="user-avatar">👨‍🍳</span> */}
              <span className="user-name">User</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Menu */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button 
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li 
              key={index}
              className={activeItem === item.title ? 'active' : ''}
              onClick={() => setActiveItem(item.title)}
            >
              <Link 
                to={item.link} 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span className="menu-text">{item.title}</span>
                <span className="menu-arrow">
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-footer">
          <div className="app-version">v1.0.0</div>
          <div className="app-copyright">© 2025 Created By Anas Nisar</div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;