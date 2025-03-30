// server.js
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create necessary tables if they don't exist
async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        bank_id INT AUTO_INCREMENT PRIMARY KEY,
        citizenship_number VARCHAR(20) NOT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        address VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed') NOT NULL,
        deposited_amount DECIMAL(15,2) DEFAULT 0.00
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INT AUTO_INCREMENT PRIMARY KEY,
        bank_id INT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        type ENUM('deposit', 'withdrawal') NOT NULL,
        notes TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_id) REFERENCES bank_accounts(bank_id)
      )
    `);
  } finally {
    connection.release();
  }
}

// Routes
app.get('/accounts', async (req, res) => {
  try {
    const [accounts] = await pool.query('SELECT * FROM bank_accounts');
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching accounts' });
  }
});

app.get('/accounts/:bankId', async (req, res) => {
  try {
    const [account] = await pool.query(
      'SELECT * FROM bank_accounts WHERE bank_id = ?',
      [req.params.bankId]
    );
    
    if (account.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching account' });
  }
});

app.post('/accounts', async (req, res) => {
  try {
    const { citizenship_number, first_name, last_name, address, age, marital_status } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO bank_accounts 
      (citizenship_number, first_name, last_name, address, age, marital_status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [citizenship_number, first_name, last_name, address, age, marital_status]
    );
    
    res.json({
      message: 'Account created successfully',
      accountId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating account' });
  }
});

app.post('/transactions', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { bank_id, amount, type, notes } = req.body;
    
    // Update account balance
    const account = await connection.query(
      'SELECT deposited_amount FROM bank_accounts WHERE bank_id = ? FOR UPDATE',
      [bank_id]
    );
    
    if (account[0].length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    const currentBalance = parseFloat(account[0][0].deposited_amount);
    const transactionAmount = parseFloat(amount);
    let newBalance = currentBalance;
    
    if (type === 'deposit') {
      newBalance = currentBalance + transactionAmount;
    } else if (type === 'withdrawal') {
      if (currentBalance < transactionAmount) {
        throw new Error('Insufficient funds');
      }
      newBalance = currentBalance - transactionAmount;
    }
    
    await connection.query(
      'UPDATE bank_accounts SET deposited_amount = ? WHERE bank_id = ?',
      [newBalance, bank_id]
    );
    
    // Create transaction record
    const [transactionResult] = await connection.query(
      `INSERT INTO transactions 
      (bank_id, amount, type, notes)
      VALUES (?, ?, ?, ?)`,
      [bank_id, transactionAmount, type, notes]
    );
    
    await connection.commit();
    
    res.json({
      message: 'Transaction completed successfully',
      newBalance: newBalance.toFixed(2)
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ 
      error: error.message || 'Transaction failed' 
    });
  } finally {
    connection.release();
  }
});

const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});