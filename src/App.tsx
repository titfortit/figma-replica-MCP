import { Routes, Route } from 'react-router-dom';
import FigmaReplica from './FigmaReplica';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FigmaReplica />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
