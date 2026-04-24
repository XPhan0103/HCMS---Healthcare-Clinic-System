import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/routers/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
