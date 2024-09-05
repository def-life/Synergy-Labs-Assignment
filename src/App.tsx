import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <>
    <Toaster />
  <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
    </>
  )
}
