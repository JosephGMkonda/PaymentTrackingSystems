import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from "./features/store";
import "./index.css"
import Login from './pages/Login';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Bills from './pages/Bills'
import Payments from "./pages/Payments"
import Reports from './pages/Reports';
import ProtectedRoute from './features/ProtectedRoute'
import Layout from './features/Layout'
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}> 
              <Route path="/" element={<Home />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/reports" element={<Reports/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;