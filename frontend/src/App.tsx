import { Routes, Route, Navigate } from 'react-router';
import HomePage from './components/Home';
import SList from './components/ServiceList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<SList />} />
    </Routes>
  )
}

export default App
