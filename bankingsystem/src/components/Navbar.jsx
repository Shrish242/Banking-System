import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="bank-navbar">
      <div className="nav-brand">National Development Bank</div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/add-user">Add User</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/view-accounts">View Accounts</Link></li>
      </ul>
      <div className="user-section">
        <span>Welcome, User</span>
        <Link to='/'><button>Logout</button></Link>
      </div>
    </nav>
  );
};

export default Navbar;