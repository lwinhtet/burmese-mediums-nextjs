import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/img/logo/BGtranstroke.png';
import useAuth from '@/hooks/useAuth';
import useCheckLogin from '@/hooks/useCheckLogin';
import ProfileDropdown from '@/parts/dropdowns/ProfileDropdown';
import SettingsDropdown from '@/parts/dropdowns/SettingsDropdown';
import { svgIcon } from '@/utils/Helper';
import styles from './NavigationLayout.module.scss';

const NAVITEMS = [
  {
    id: 1,
    name: 'Marketplace',
    url: ''
  },
  {
    id: 2,
    name: 'Portfolios',
    url: '/portfolios'
  },
  {
    id: 3,
    name: 'Jobs',
    url: ''
  },
  {
    id: 4,
    name: 'Hire',
    url: ''
  },
  {
    id: 5,
    name: 'Tutorials',
    url: ''
  }
];

function NavigationLayout() {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading } = useCheckLogin({});

  const notLoggedInHTML = (
    <>
      <li className="nav_actions-item">
        <Link href="/account/login">
          <span className="btn btn-white">Login</span>
        </Link>
      </li>
      <li className="nav_actions-item max-d-none-xs">
        <Link href="/account/sign-up">
          <span className="btn btn-green">Sign Up</span>
        </Link>
      </li>
    </>
  );

  const loggedInHTML = (
    <>
      <li className="nav_actions-item">
        <ProfileDropdown position="right" />
      </li>
      <li className="nav_actions-item max-d-none-xs">
        <SettingsDropdown position="right" />
      </li>
    </>
  );

  const navItems = className =>
    NAVITEMS.map(val => {
      return (
        <li key={val.id} className={className}>
          <Link href={val.url}>{val.name}</Link>
        </li>
      );
    });

  return (
    <div className="main-nav-container">
      <nav className="nav max-d-none-xs">
        <Link href="/">
          <Image src={logo} alt="Logo" className="nav_logo" priority />
        </Link>
        <ul className="nav_menu">{navItems('nav_menu-item')}</ul>
      </nav>
      <nav className="nav min-d-none-xs">
        <ul className="nav_menu">
          <li className="nav_menu-item">
            <svg className="menu-icon" onClick={() => setIsOpen(prev => !prev)}>
              <use xlinkHref="/img/icomoon/sprite.svg#icon-menu"></use>
            </svg>
          </li>
        </ul>
      </nav>
      <div className={`nav-collapse min-d-none-xs ${isOpen ? '' : 'd-none'}`}>
        <ul className="nav-collapse-menu">
          <li className="nav-collapse-menu-item">
            <label htmlFor="search" className="search-label">
              <div className="main-search">
                <div className="search-icon-wrapper">
                  <i className="search-icon icon-basic-magnifier"></i>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="search-input"
                  placeholder="Search..."
                />
                <div className="main-search-space"></div>
              </div>
            </label>
          </li>
          {navItems('nav-collapse-menu-item')}
        </ul>
      </div>
      <div className="nav-xs-logo min-d-none-xs">
        <Image src={logo} alt="Logo" className="nav_logo" priority />
      </div>

      {isLoading ? (
        <></>
      ) : (
        <ul className="nav_actions">
          <li className="nav_actions-item max-d-none-sm">
            <label htmlFor="search" className="search-label">
              <div className="main-search">
                <div className="search-icon-wrapper">
                  <i className="search-icon icon-basic-magnifier"></i>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="search-input"
                  placeholder="Search..."
                />
                <div className="main-search-space"></div>
              </div>
            </label>
          </li>
          {auth?.isLoggedIn ? loggedInHTML : notLoggedInHTML}
        </ul>
      )}
    </div>
  );
}

export default NavigationLayout;
