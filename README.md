This project was developed as a prototype for a Bank digital portal. It is designed to offer a user-friendly interface that allows banking workers to open new accounts, view all existing account details, and carry out secure transactions. The backend is built using Node.js with Express and connects to an Azure SQL Database using the mysql2/promise (or mssql, depending on the configuration) package. The frontend is implemented in React and styled with CSS.

Features
Account Management:
Banking Staffs with accesss can create new bank accounts with details such as citizenship number, name, address, age, and marital status.

Dashboard Statistics:
The home page displays important metrics like total number of users and total deposits in the bank.

Transaction Processing:
Cashier can perform transactions (deposits and withdrawals) after searching for customers account by bank ID, with a custom confirmation modal for additional safety.

Data Display:
View detailed account information and transaction history with a professional and responsive design.

Secure Connectivity:
The backend connects securely to an Azure SQL Database using SSL (or appropriate security settings).
