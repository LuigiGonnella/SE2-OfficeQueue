import { Routes, Route, Navigate } from 'react-router';
import HomePage from './components/Home';
import SList from './components/ServiceList';
import BoardPage from './components/BoardPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<SList />} />
      <Route path="/board" element={<BoardPage />} />
    </Routes>
  )
}



export default App
