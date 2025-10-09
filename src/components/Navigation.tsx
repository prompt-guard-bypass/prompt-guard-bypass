import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'paper' | 'explorer';
  onTabChange: (tab: 'paper' | 'explorer') => void;
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
          className={`nav-button ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => onTabChange('explorer')}
        >
          🔍 Explorer
        </button>
      </div>
    </nav>
  );
};

export default Navigation;