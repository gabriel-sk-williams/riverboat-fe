import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from './solana/solana-provider';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>riverboat</h1>
      </Link>
      <WalletButton />
    </nav>
  );
}

export default Navbar;