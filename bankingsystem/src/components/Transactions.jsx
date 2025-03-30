import { useState } from 'react';
import './Transactions.css'; // Make sure to create and import this CSS file

const Transactions = () => {
  const [searchBankId, setSearchBankId] = useState('');
  const [account, setAccount] = useState(null);
  const [transactionData, setTransactionData] = useState({
    deposited_amount: '',
    type: 'deposit',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handler to search for an account by bank ID
  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setAccount(null);
    try {
      const response = await fetch(`http://localhost:5000/accounts/${searchBankId}`);
      if (!response.ok) {
        throw new Error('Account not found');
      }
      const data = await response.json();
      setAccount(data);
    } catch (err) {
      console.error(err);
      setMessage(`Error fetching account: ${err.message}`);
    }
  };

  // This function processes the transaction once user confirms
  const processTransaction = async () => {
    if (!account) {
      setMessage('No account selected');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bank_id: account.bank_id,
          amount: transactionData.deposited_amount,
          type: transactionData.type,
          notes: transactionData.notes
        })
      });
      if (!response.ok) {
        throw new Error('Transaction failed');
      }
      const result = await response.json();
      setMessage(`Transaction successful: ${result.message}`);
      // Clear the transaction form fields
      setTransactionData({
        deposited_amount: '',
        type: 'deposit',
        notes: ''
      });
      // Optionally update the account balance if returned from backend:
      // setAccount({ ...account, deposited_amount: result.newBalance });
    } catch (err) {
      console.error(err);
      setMessage(`Error performing transaction: ${err.message}`);
    }
  };

  // Handler to show custom confirmation modal
  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    if (!account) {
      setMessage('No account selected');
      return;
    }
    // Instead of using window.confirm, show the custom modal
    setShowConfirmModal(true);
  };

  // Handler for confirming the transaction
  const confirmTransaction = async () => {
    setShowConfirmModal(false);
    await processTransaction();
  };

  // Handler for canceling the transaction
  const cancelTransaction = () => {
    setShowConfirmModal(false);
    setMessage('Transaction cancelled');
  };

  return (
    <div className="transactions-container">
      <div className="search-section">
        <h3>Search Account by Bank ID</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Bank ID"
            value={searchBankId}
            onChange={(e) => setSearchBankId(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {message && <p className="message">{message}</p>}

      {account && (
        <div className="account-info">
          <h3>Account Details</h3>
          <p><strong>Bank ID:</strong> {account.bank_id}</p>
          <p>
            <strong>Name:</strong> {account.first_name} {account.last_name}
          </p>
          <p><strong>Address:</strong> {account.address}</p>
          <p><strong>Age:</strong> {account.age}</p>
          <p>
            <strong>Marital Status:</strong> {account.marital_status}
          </p>
          <p>
            <strong>Current Balance:</strong> ${account.deposited_amount}
          </p>
        </div>
      )}

      {account && (
        <div className="transaction-form">
          <h3>Perform Transaction</h3>
          <form onSubmit={handleTransactionSubmit}>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                value={transactionData.deposited_amount}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    deposited_amount: e.target.value
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Transaction Type:</label>
              <select
                value={transactionData.type}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    type: e.target.value
                  })
                }
              >
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                value={transactionData.notes}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    notes: e.target.value
                  })
                }
              ></textarea>
            </div>
            <button type="submit">Confirm Transaction</button>
          </form>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Transaction</h3>
            <p>Are you sure you want to proceed with this transaction?</p>
            <div className="modal-buttons">
              <button onClick={confirmTransaction}>Yes</button>
              <button onClick={cancelTransaction}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
