import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { PriceDashboard } from './components/PriceDashboard';
import { StakingPage } from './pages/StakingPage';
import { PoolDetailPage } from './pages/PoolDetailPage';
import { BoardroomPage } from './pages/BoardroomPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navigation />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prices" element={<PriceDashboard />} />
            <Route path="/staking" element={<StakingPage />} />
            <Route path="/pool/:poolId" element={<PoolDetailPage />} />
            <Route path="/boardroom" element={<BoardroomPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>F-SOCIETY // solana // pyth network</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
