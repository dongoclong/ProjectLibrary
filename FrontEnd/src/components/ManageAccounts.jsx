import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllAccounts, deleteAccount, addAccount, editAccount } from '../service/AccountService';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { json } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';


// import '../Common/YourStyle.css';
const ManageAccounts = ({ navigateToEditPage }) => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [showPopup4, setShowPopup4] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successMessage2, setSuccessMessage2] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = accounts.filter(account =>
      account.user_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAccounts(filteredData);
  }, [search, accounts]);

  const handleDelete2 = async (id) => {
    const response = await deleteAccount(id);
    const loginInfo = localStorage.getItem('loginInfo')
    const Profile2 = JSON.parse(loginInfo)
    console.log(response)
    if (response.message === 'Xoá tài khoản thành công.') {
      const updatedAccounts = accounts.filter(account => account.id !== id);
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts.filter(account =>
        account.user_name.toLowerCase().includes(search.toLowerCase())
      ));
      // const data = await getAllAccounts();
      // setAccounts(data);
      // setFilteredAccounts(data);
    }
    console.log(response)
    setSuccessMessage2(response.message); // Set the success message
    setTimeout(() => {
      setSuccessMessage2('');
    }, 3000);
    window.location.reload();
    if (Profile2.id === id) {
      navigate('/login');
    }
  };



  const handleSave2 = async (user_name, password, role, image) => {
    if (!user_name || !password || !role) {
      // alert('Please fill out all required fields');
      setSuccessMessage2('Please fill out all required fields');
      setTimeout(() => {
        setSuccessMessage2('');
      }, 3000);
      return;
    }
    console.log("role: ", role)
    const response = await addAccount(user_name, password, role, image);
    console.log(response)
    if (response.message.includes('Đã add thêm từ')) {
      const updatedData = await getAllAccounts();
      setAccounts(updatedData);
      setFilteredAccounts(updatedData.filter(account =>
        account.user_name.toLowerCase().includes(search.toLowerCase())
      ));
    }
    setSuccessMessage2(response.message);
    setTimeout(() => {
      setSuccessMessage2('');
    }, 3000);
  };

  const handleSave = async (id, user_name, old_password, new_password) => {
    // if (!user_name || !old_password) {
    //   setSuccessMessage2('Please fill out all required fields');
    //   setTimeout(() => {
    //     setSuccessMessage2('');
    //   }, 3000);
    //   return;
    // }
    console.log(id, user_name, old_password, new_password)
    if (user_name === undefined) {
      user_name = '';
    }
    if (old_password === undefined) {
      old_password = '';
    }
    if (new_password === undefined) {
      new_password = '';
    }
    const response = await editAccount(id, user_name, old_password, new_password);
    console.log(response)
    if (response.message.includes('Đã thay đổi thông tin thành công!')) {
      const updatedData = await getAllAccounts();
      setAccounts(updatedData);
      setFilteredAccounts(updatedData.filter(account =>
        account.user_name.toLowerCase().includes(search.toLowerCase())
      ));
    }
    setSuccessMessage2(response.message);
    setTimeout(() => {
      setSuccessMessage2('');
    }, 3000);
    // Implement the save functionality here
    // For example, you might want to call editAccount from your service
    // and pass the updated account details
    // console.log("Saving account:", selectedRow);
  };



  const handleEdit = async (id) => {
    const row = filteredAccounts.find(account => account.id === id);
    setSelectedRow(row);
    setShowPopup(true);
    setIsModalOpen(true);
  };


  const handleAdd = () => {
    setSelectedRow({
      user_name: '',
      password: '', // For the new account's password
      role: 'admin',
      image: null, // If you're including image uploads
      // Any other fields that are relevant for a new account
    });
    setShowPopup2(true); // Open the modal for adding a new account
    setIsModalOpen2(true);
  };

  const handlShowProfile = () => {
    setShowPopup4(true);
    setIsModalOpen4(true);
  };

  const closeModal4 = () => {
    setIsModalOpen4(false);
  };
  const handleDelete = async (id) => {
    const row = filteredAccounts.find(account => account.id === id);
    setSelectedRow(row);
    setShowPopup3(true);
    setIsModalOpen3(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModal3 = () => {
    setIsModalOpen3(false);
  };
  const infoIconStyles = {
    marginLeft: '10px', // Khoảng cách từ biểu tượng đến các phần tử khác
    color: '#007bff', // Màu sắc của biểu tượng
    fontSize: '20px', // Kích thước của biểu tượng
    cursor: 'pointer', // Hiển thị con trỏ khi rê chuột vào biểu tượng
  };


  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',
      width: '50%',
      maxWidth: '670px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };
  const modalStyles2 = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',
      width: '50%',
      maxWidth: '300px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };
  const formStyles = {
    formGroup: {
      display: 'flex',
      marginBottom: '15px',
      alignItems: 'center'
    },
    label: {
      marginRight: '10px',
      width: '100px',
      textAlign: 'left'
    },
    input: {
      flex: '1',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc'
    }
  };
  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  };
  const subHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Ensure the container spans the full width
  };
  const searchStyle = {
    width: '250px', // Adjust the width as needed
  };
  const addButtonStyles = {
    padding: '10px 15px',
    border: '2px solid #007bff', // Solid border with a distinct color
    borderRadius: '5px', // Rounded corners
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  };
  const alertMessageStyle = {
    padding: '10px',
    backgroundColor: '#d4edda', // Light green background
    color: '#155724', // Dark green text
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center'
  };

  const columns = [
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>ID</b>, selector: (row, index) => index + 1, sortable: true, grow: 0 },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Username</b>, selector: row => row.user_name, sortable: true },
    // { name: 'Password', selector: row => row.password, sortable: true },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Role</b>, selector: row => row.role, sortable: true },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Date</b>, selector: row => row.date, sortable: true },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Image</b>, selector: (row) => <img src={row.image} width={25} height={25} />, },
    {
      name: '',
      cell: row => (
        <>
          <button onClick={() => handleEdit(row.id)}
            style={{ ...addButtonStyles, backgroundColor: '#3498db', color: '#fff', marginRight: '5px' }}
          >Edit</button>
          <button onClick={() => handleDelete(row.id)}
            style={{ ...addButtonStyles, backgroundColor: '#e74c3c', color: '#fff' }}
          >Delete</button>
        </>
      ),
    },
  ];

  return (

    <>
      {successMessage && <div style={alertMessageStyle}>{successMessage}</div>}
      <DataTable
        columns={columns}
        // columns={columns.map(column => ({
        //   ...column,
        //   style: {
        //     ...(column.style || {}), // Preserve existing styles
        //     // fontSize: '18px',
        //     fontWeight: 'bold',
        //   },
        // }))}

        data={filteredAccounts}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div style={subHeaderStyles}>
            <input
              type="text"
              placeholder="Search Accounts..."
              className="form-control"
              style={searchStyle}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleAdd}
              style={addButtonStyles}
              onMouseEnter={(e) => e.target.style.border = '2px solid #0056b3'} // Darker border on hover
              onMouseLeave={(e) => e.target.style.border = '2px solid #007bff'}
            >
              Add Account
            </button>
            {/* <button
              onClick={handlShowProfile}
              style={addButtonStyles}
            >
              Profile
            </button> */}
          </div>
        }
      />
      {showPopup && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={"Edit Account"}
          style={modalStyles}
        >
          {successMessage2 && <div style={alertMessageStyle}>{successMessage2}</div>}
          <div className="text-center">
            <h2>{"Edit Account"}</h2>
          </div>
          <div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Username:</label>
              <input
                type="text"
                value={selectedRow.user_name || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, user_name: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Old Password:</label>
              <input
                type="text"
                value={selectedRow.old_password || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, old_password: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>New Password:</label>
              <input
                type="text"
                value={selectedRow.new_password || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, new_password: e.target.value })}
                style={formStyles.input}
              />
            </div>
          </div>
          <div style={buttonContainerStyles}>
            <button onClick={closeModal} style={{ marginRight: '10px' }} className="btn btn-outline-dark">Close</button>
            {/* <button onClick={handleSave(selectedRow.id,selectedRow.user_name,selectedRow.old_password, selectedRow.new_password )}>Save</button> */}
            <button onClick={() => handleSave(selectedRow.id, selectedRow.user_name, selectedRow.old_password, selectedRow.new_password)} className="btn btn-outline-dark" required>Save</button>
          </div>
        </Modal>
      )
      }
      {showPopup2 && (
        <Modal
          isOpen={isModalOpen2}
          onRequestClose={closeModal2}
          contentLabel={"Add Account"}
          style={modalStyles}
        >
          {successMessage2 && <div style={alertMessageStyle}>{successMessage2}</div>}
          <div className="text-center">
            <h2>{"Add Account"}</h2>
          </div>
          <div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Username:</label>
              <input
                type="text"
                value={selectedRow.user_name || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, user_name: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Password:</label>
              <input
                type="text"
                value={selectedRow.password || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, password: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>role:</label>
              <select value={selectedRow.role || ''} onChange={(e) => setSelectedRow({ ...selectedRow, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Image:</label>
              <input
                type="file"
                accept="image/*"  // This restricts the file picker to image files
                onChange={(e) => {
                  // Handle file selection
                  if (e.target.files && e.target.files[0]) {
                    // Assuming you want to store the file object in selectedRow
                    setSelectedRow({ ...selectedRow, image: e.target.files[0] });
                  }
                }}
                style={formStyles.input}
              />
            </div>

          </div>
          <div style={buttonContainerStyles}>
            <button onClick={closeModal2} style={{ marginRight: '10px' }} className="btn btn-outline-dark" >Close</button>
            {/* <button onClick={handleSave(selectedRow.id,selectedRow.user_name,selectedRow.old_password, selectedRow.new_password )}>Save</button> */}
            <button onClick={() => handleSave2(selectedRow.user_name, selectedRow.password, selectedRow.role, selectedRow.image)} className="btn btn-outline-dark" required>Save</button>
          </div>
        </Modal>
      )
      }
      {showPopup3 && (
        <Modal
          isOpen={isModalOpen3}
          onRequestClose={closeModal3}
          contentLabel={"Delete Account"}
          style={modalStyles}
        >
          {successMessage2 && <div style={alertMessageStyle}>{successMessage2}</div>}
          <h2>{"Bạn có chắc muốn xoá account này không?"}</h2>
          <div style={buttonContainerStyles}>
            <button onClick={closeModal3} style={{ marginRight: '10px' }} className="btn btn-outline-dark">Close</button>
            {/* <button onClick={handleSave(selectedRow.id,selectedRow.user_name,selectedRow.old_password, selectedRow.new_password )}>Save</button> */}
            <button onClick={() => handleDelete2(selectedRow.id)} className="btn btn-outline-dark" required>Oke</button>
          </div>
        </Modal>
      )
      }
    </>
  );
};

export default ManageAccounts;
