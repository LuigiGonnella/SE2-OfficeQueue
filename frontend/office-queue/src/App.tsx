import {Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import OfficerPanel from "./pages/OfficerPanel.tsx";


function App() {

  return (
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer-panel" element={<div>New Ticket</div>} />
          <Route path="/officer-panel" element={<OfficerPanel />} />
          <Route path="/info-board" element={<div>Info Board</div>} />
      </Routes>
  )
}

export default App