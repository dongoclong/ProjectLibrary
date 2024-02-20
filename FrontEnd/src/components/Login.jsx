import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Authen from '../service/AuthenService';
import StorageService from '../service/StorageService';
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react';

// Dữ liệu người dùng giả
const fakeUserData = {
  username: 'admin',
  password: 'password123'
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook useNavigate

  


  const handleLogin = async () => {
    try {
      const data = await Authen.login(username, password);
      console.log(data)
      localStorage.setItem('token', data.token);
      console.log(data.user_name, data.password)
      // Lưu thông tin đăng nhập vào localStorage
      const loginInfo = { user_name: data.user_name, password: data.password, id: data.id, role: data.role };
      localStorage.setItem('loginInfo', JSON.stringify(loginInfo)); // Lưu object dưới dạng string
      navigate('/admin');
      setError('');
    } catch (error) {
      console.log(error);
      setError('Invalid username or password');
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.loginForm}>
        <h2 style={styles.title}>Admin</h2>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={styles.button} onClick={handleLogin}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// CSS Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("/111111.jpg")', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundColor: '#f5f5f5'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  }
};

export default Login;
