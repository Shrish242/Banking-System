import { useState, useEffect } from 'react';

const ViewAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch accounts from backend API
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
        setError('Error fetching accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account =>
    account.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.citizenship_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="accounts-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or citizenship number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Citizenship Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Age</th>
            <th>Marital Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr key={account.bank_id}>
              <td>{account.citizenship_number}</td>
              <td>{account.first_name}</td>
              <td>{account.last_name}</td>
              <td>{account.address}</td>
              <td>{account.age}</td>
              <td>{account.marital_status}</td>
              <td>
                <button>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAccounts;
