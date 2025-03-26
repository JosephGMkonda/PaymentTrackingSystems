import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from "./features/store";
import "./index.css"
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './features/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;