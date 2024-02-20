import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Word from './components/Word'
import { getWord } from './service/WordService'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin'; // Giả sử bạn có một component Admin
import Login from './components/Login';
// import Per from './components/Performance';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Các routes khác */}
        <Route path='/' element = {<Word />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/per" element={<Per />} /> */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} >
          {/* <Route path="manage-accounts" element={<ManageAccounts />} />
          <Route path="manage-users" element={<ManageUsers />} /> */}

        </Route>
      </Routes>
    </Router>
  );
}



export default App
