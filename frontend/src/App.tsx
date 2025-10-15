import { Routes, Route, Navigate } from 'react-router';
import HomePage from './components/Home';
import SList from './components/ServiceList';
import ServiceCreation from './components/ServiceManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<SList />} />
      <Route path="/officers" element={<ServiceCreation />} />
    </Routes>
  )
}

export default App
