import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplicationPage from './pages/ApplicationPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  // Get the base name for GitHub Pages deployment
  const basename = import.meta.env.MODE === 'production' ? '/kk-careers-portal' : '';
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/application" element={<ApplicationPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
