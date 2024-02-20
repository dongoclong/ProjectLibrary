import React, { useState, useEffect } from 'react';

const EditPopup = ({ account, onClose, onUpdate }) => {
  const [editedAccount, setEditedAccount] = useState(account);

  useEffect(() => {
    setEditedAccount(account);
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAccount(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onUpdate(editedAccount);
    onClose();
  };

  return (
    <div className="edit-popup">
      <h3>Edit Account</h3>
      <input
        name="user_name"
        type="text"
        value={editedAccount.user_name}
        onChange={handleChange}
      />
      {/* Add other fields as needed */}
      <button onClick={handleSubmit}>Update</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditPopup;
