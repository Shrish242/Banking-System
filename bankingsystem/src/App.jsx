import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AddUser from './components/AddUser';
import Transactions from './components/Transactions';
import ViewAccounts from './components/ViewAccounts';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/add-user" element={<><Navbar /><AddUser /></>} />
        <Route path="/transactions" element={<><Navbar /><Transactions /></>} />
        <Route path="/view-accounts" element={<><Navbar /><ViewAccounts /></>} />
      </Routes>
    </Router>
  );
}

export default App;