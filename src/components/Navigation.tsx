import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Vsp Force' },
  { to: '/pga', label: 'PGA' },
  { to: '/pressure', label: 'Wind Pressure' },
  { to: '/markers', label: 'City Locations' },
    {to: '/custom', label: 'Custom Values' },
    { to: '/aviation', label: 'Aviation' },
];

export default function Navigation() {
  return (
    <nav className="top-nav">
      <span className="nav-brand">NBC 2025</span>
      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
