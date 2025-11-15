import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SuggestionBoard from './pages/SuggestionBoard';
import SubmitSuggestion from './pages/SubmitSuggestion';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              💡 Feedback Platform
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Board</Link>
              <Link to="/submit" className="nav-link">Submit</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<SuggestionBoard />} />
            <Route path="/submit" element={<SubmitSuggestion />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

