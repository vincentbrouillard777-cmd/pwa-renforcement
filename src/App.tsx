import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Session } from './pages/Session';
import { ExerciseSolo } from './pages/ExerciseSolo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/exercise/:id" element={<ExerciseSolo />} />
      </Routes>
    </BrowserRouter>
  );
}
