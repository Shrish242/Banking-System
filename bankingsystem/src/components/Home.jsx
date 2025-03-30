import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // Compute dashboard stats
  const totalUsers = accounts.length;
  const totalDeposits = accounts.reduce(
    (sum, account) => sum + (account.deposited_amount ? parseFloat(account.deposited_amount) : 0),
    0
  );

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-container">
      <header className="hero">
        <h1>National Development Bank</h1>
        <p>Your trusted partner in financial growth.</p>
        <div className="hero-buttons">
          <Link to='/add-user'><button>Open Account</button></Link>
          <button>Contact Us</button>
        </div>
      </header>

      <section className="dashboard-summary">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Deposits</h3>
          <p>${totalDeposits.toLocaleString()}</p>
        </div>
      </section>

      <section className="bank-info">
        <h3>About Our Bank</h3>
        <p>
          Established in 2023, National Development Bank is dedicated to providing secure and innovative financial services with a focus on personalized customer care and digital innovation.
        </p>
        <ul className="services-list">
          <li>Personal Banking</li>
          <li>Business Banking</li>
          <li>Loan Services</li>
          <li>Investment Services</li>
          <li>Digital Wallet</li>
        </ul>
      </section>

      <section className="security-tips">
        <h3>Security Tips</h3>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Always log out after completing transactions</li>
          <li>Enable two-factor authentication</li>
        </ul>
      </section>

      <section className="latest-news">
        <h3>Latest News</h3>
        <article>
          <h4>Digital Banking Transformation 2025</h4>
          <p>Discover how we are leveraging innovative technologies to redefine the banking experience.</p>
        </article>
        <article>
          <h4>New Loan Products Launched</h4>
          <p>Our new loan products are designed to meet the evolving needs of our customers.</p>
        </article>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} National Development Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
