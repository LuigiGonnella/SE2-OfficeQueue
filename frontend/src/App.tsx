import { Routes, Route, Navigate } from 'react-router';
import HomePage from './components/Home';
import SList from './components/ServiceList';
import BoardPage from './components/BoardPage';
import ServiceCreation from './components/ServiceManagement';
import OfficerPanel from './components/OfficerPanel';
import CustomerCreation from './components/CustomerManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<SList />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/newservice" element={<ServiceCreation />} />
      <Route path="/officers" element={<OfficerPanel />} />
      <Route path="/newcustomer" element={<CustomerCreation />} />

    </Routes>
  )
}



export default App
