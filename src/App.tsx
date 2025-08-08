import { Route, Routes, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import VocabGame from './pages/VocabGame';
import CultureQuiz from './pages/CultureQuiz';

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header glass">
        <div className="brand">
          <NavLink to="/" className="nav-brand" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h1>Catalan Learning</h1>
          </NavLink>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/vocab/ca-en">CA → EN</NavLink>
          <NavLink to="/vocab/en-ca">EN → CA</NavLink>
          <NavLink to="/culture">Culture Quiz</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vocab/ca-en" element={<VocabGame direction="ca-en" />} />
          <Route path="/vocab/en-ca" element={<VocabGame direction="en-ca" />} />
          <Route path="/culture" element={<CultureQuiz />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Aprenem català! · Built with ❤️</p>
      </footer>
    </div>
  );
}
