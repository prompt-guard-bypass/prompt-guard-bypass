import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'paper' | 'playground';
  onTabChange: (tab: 'paper' | 'playground') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button
          className={`nav-button ${activeTab === 'paper' ? 'active' : ''}`}
          onClick={() => onTabChange('paper')}
        >
          📄 Paper
        </button>
        <button
          className={`nav-button ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => onTabChange('playground')}
        >
          🎮 Playground
        </button>
      </div>
    </nav>
  );
};

export default Navigation;