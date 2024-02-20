import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageAccounts from './ManageAccounts';
import ManageWords from './ManageWords';
import { useEffect } from 'react';

function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('accounts');
  
  const loginInfo = localStorage.getItem('loginInfo');
  const Profile2 = JSON.parse(loginInfo)
  console.log(loginInfo)

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    // Check if the user is authenticated
    const loginInfo = localStorage.getItem('loginInfo');   
    if (loginInfo === null) {
      // If no token found, user is not authenticated, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const renderSection = () => {
    if (activeSection === 'accounts') {
      return <ManageAccounts />;
    } else if (activeSection === 'words') {
      return <ManageWords />;
    }
  };

  // const styles = {
  //   adminContainer: {
  //     display: 'flex',
  //     fontFamily: 'Arial, sans-serif',
  //     height: '100vh',
  //     width: '100vw',
  //     overflow: 'hidden',
  //   },
  //   sidebar: {
  //     flex: '0 0 250px',
  //     backgroundColor: '#2c3e50',
  //     color: '#ecf0f1',
  //     boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
  //     padding: '20px',
  //     display: 'flex',
  //     flexDirection: 'column',
  //   },
  //   content: {
  //     flex: '1',
  //     padding: '20px',
  //     backgroundColor: '#ecf0f1',
  //     overflowY: 'auto',
  //   },
  //   title: {
  //     fontSize: '24px',
  //     fontWeight: 'bold',
  //     marginBottom: '20px',
  //   },
  //   button: {
  //     marginBottom: '10px',
  //     cursor: 'pointer',
  //     backgroundColor: '#34495e',
  //     color: '#ecf0f1',
  //     border: 'none',
  //     borderRadius: '5px',
  //     padding: '10px 15px',
  //     transition: 'background-color 0.3s',
  //   },
  //   activeButton: {
  //     backgroundColor: '#2980b9',
  //   },
  // };
  const styles = {
    adminContainer: {
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      height: '100vh',  // Set the height to 100vh to make it fit the viewport height
      width: '100vw',
      overflow: 'hidden',
    },
    sidebar: {
      flex: '0 0 250px',
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1',
      padding: '20px',
      backgroundColor: '#ecf0f1',
      overflowY: 'auto',
      height: '100%',  // Set the height to 100% to fill the available space
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    button: {
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: '#34495e',
      color: '#ecf0f1',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      transition: 'background-color 0.3s',
    },
    activeButton: {
      backgroundColor: '#2980b9',
    },
  };
  

  return (
    <div style={styles.adminContainer}>
      <div style={styles.sidebar}>
        <h1 style={styles.title}>Web Admin</h1>
        <button
          style={{
            ...styles.button,
            ...(activeSection === 'accounts' && styles.activeButton),
          }}
          onClick={() => setActiveSection('accounts')}
        >
          Quản lý Account
        </button>
        <button
          style={{
            ...styles.button,
            ...(activeSection === 'words' && styles.activeButton),
          }}
          onClick={() => setActiveSection('words')}
        >
          Quản lý Words
        </button>
        <div style={{ flex: '30' }}></div>
        <div style={{marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5em', margin: '0' }}>Profile</h2>
          </div>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '15px' }}></div>
          <div style={{ marginBottom: '15px' }}>
            <strong>User Name:</strong> {Profile2.user_name}
          </div>
          <div>
            <strong>Role:</strong> {Profile2.role}
          </div>
        <div style={{ flex: '1' }}></div> {/* Empty space to push "Đăng Xuất" button to the bottom */}
        <button style={styles.button} onClick={handleLogout}>
          Đăng Xuất
        </button>
      </div>
      <div style={styles.content}>{renderSection()}</div>
    </div>
  );
}

export default Admin;
