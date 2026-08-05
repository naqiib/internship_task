import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Counter from './Counter';
import ThemeToggle from './ThemeToggle';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <div className={`app ${theme}`}>
      <Navbar />

      <main className="main-content">
        <h1>useState Hook Demo</h1>
        <p className="subtitle">A simple counter and theme toggle built with React's useState hook.</p>

        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Counter />
      </main>

      <Footer />
    </div>
  );
}

export default App;