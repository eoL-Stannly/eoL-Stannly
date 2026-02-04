import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="nav-header">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          F-SOCIETY
        </Link>

        <div className="nav-right">
          <WalletMultiButton />
          <button
            className={`burger-btn ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`nav-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Slide-out Menu */}
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/prices"
          className={`nav-link ${isActive('/prices') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Price Feeds
        </Link>
        <Link
          to="/staking"
          className={`nav-link ${isActive('/staking') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Staking Pools
        </Link>
        <Link
          to="/boardroom"
          className={`nav-link ${isActive('/boardroom') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Boardroom
        </Link>
      </nav>
    </>
  );
}
