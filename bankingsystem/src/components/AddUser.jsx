import { useState } from 'react';
import './AddUser.css';

const AddUser = () => {
  const [userData, setUserData] = useState({
    citizenship_number: '',
    first_name: '',
    last_name: '',
    address: '',
    age: '',
    marital_status: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure all required fields are filled
    if (!userData.citizenship_number || !userData.first_name || !userData.last_name || !userData.address || !userData.age || !userData.marital_status) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const result = await response.json();
      setMessage(`Account created successfully! Account ID: ${result.accountId}`);
      // Reset form
      setUserData({
        citizenship_number: '',
        first_name: '',
        last_name: '',
        address: '',
        age: '',
        marital_status: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('Error creating account');
    }
  };

  return (
    <div className="add-user-container">
      <h2>Create New Account</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <label htmlFor="citizenship_number">Citizenship Number:</label>
          <input
            id="citizenship_number"
            type="text"
            value={userData.citizenship_number}
            onChange={(e) =>
              setUserData({ ...userData, citizenship_number: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            id="first_name"
            type="text"
            value={userData.first_name}
            onChange={(e) =>
              setUserData({ ...userData, first_name: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            id="last_name"
            type="text"
            value={userData.last_name}
            onChange={(e) =>
              setUserData({ ...userData, last_name: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={userData.address}
            onChange={(e) =>
              setUserData({ ...userData, address: e.target.value })
            }
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            value={userData.age}
            onChange={(e) =>
              setUserData({ ...userData, age: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="marital_status">Marital Status:</label>
          <select
            id="marital_status"
            value={userData.marital_status}
            onChange={(e) =>
              setUserData({ ...userData, marital_status: e.target.value })
            }
            required
          >
            <option value="">--Select Status--</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default AddUser;
