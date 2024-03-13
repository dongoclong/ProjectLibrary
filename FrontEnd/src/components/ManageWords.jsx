import React from 'react'
import DataTable from 'react-data-table-component'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import getWord from '../service/WordService'
import DataTables from "react-data-table-component";
import moment from 'moment'
import Modal from 'react-modal';
import ReactDOM from "react-dom";
import Popup from "reactjs-popup";
// import Content from "./Content.js";
import { getWords, deleteWord, addWord, updateWord, editWord } from '../service/ManaWordsService.js'
import 'bootstrap/dist/css/bootstrap.min.css';


// Đặt phần tử ứng dụng
Modal.setAppElement('#root');
const Word2 = () => {
  const [words, setWords] = useState([])
  const [subjects, setSubject] = useState([])
  const [search, setSearch] = useState('')
  const [search2, setSearch2] = useState('')
  const [filteredWord, setFilteredWord] = useState('')
  const [filteredSubject, setFilteredSubject] = useState('')
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successMessage2, setSuccessMessage2] = useState('');
  const [showPopup2, setShowPopup2] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWords();
        setWords(data);
        setFilteredWord(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteImage = (index) => {
    // Tạo một bản sao mới của mảng ảnh không bao gồm ảnh cần xóa
    const updatedImages = selectedRow.image.filter((_, i) => i !== index);
    setSelectedRow({ ...selectedRow, image: updatedImages });
  };


  useEffect(() => {
    getWords();
  }, []);

  // useEffect(() => {
  //   const result = words.filter((word) => {
  //     return word.word.toLowerCase().match(search.toLowerCase());
  //   });
  //   setFilteredWord(result);
  // }, [search]);

  useEffect(() => {
    const result = words.filter((word) => {
      return search ? word.word.toLowerCase().match(search.toLowerCase()) : word.subject.toLowerCase().match(search2.toLocaleLowerCase())
    })
    setFilteredWord(result);
  }, [search, search2]);

  // useEffect(() => {
  //   const result = subjects.filter((subject) => {
  //     return subject.subject.toLowerCase().match(search2.toLowerCase());
  //   });
  //   setFilteredSubject(result);
  // }, [search2]);


  const handleEdit = async (id) => {
    const row = filteredWord.find(word => word.id === id);
    setSelectedRow(row);
    setShowPopup(true);
    setIsModalOpen(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete2 = async (id) => {
    try {
      const response = await deleteWord(id);
      // console.log(response.data)

      // if (response.message === 'Xóa từ ${response.word} thành công.') {
      if (response.message.includes('Xoá từ')) {
        const updatedWords = words.filter(word => word.id !== id);
        setWords(updatedWords);
        setFilteredWord(updatedWords.filter(word =>
          word.meaning.toLowerCase().includes(search.toLowerCase())
        ));
        // const data = await getWord();
        // setWords(data);
        // setFilteredWord(data); 
      }
      setSuccessMessage2(response.message); // Set the success message
      setTimeout(() => {
        setSuccessMessage2('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleAdd = async () => {
    setSelectedRow({
      word: '',
      meaning: '',
      description: '',
      subject: '',
      image: null,
      // password: '', // If you need a password field
      // ... include other fields as required
    });

    setShowPopup2(true);
    setIsModalOpen2(true);
  };




  const column = [
    // { name: "STT", selector: (row) => row.id, sortable: true, grow: 0 },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>STT</b>, selector: (row, index) => index + 1, sortable: true, grow: 0 },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Date</b>, selector: (row) => row.date, sortable: true, width: "12rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Word</b>, selector: (row) => row.word, sortable: true, width: "12rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Meaning</b>, selector: (row) => row.meaning, sortable: true, width: "10rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Description</b>, selector: (row) => row.note, sortable: true, width: "8rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px' }}>User Edit status</b>, selector: (row) => row.user_add, sortable: true, width: "10rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Image</b>, selector: (row) => <img src={row.image[0]} width={25} height={25} />, width: "10rem" },
    { name: <b style={{ fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>Subject</b>, selector: (row) => row.subject, sortable: true, width: "15rem" },

    {
      name: '',
      cell: row => (
        <>
          <button onClick={() => handleEdit(row.id)}
            // style={{ backgroundColor: '#3498db', color: '#fff', marginRight: '5px' }}
            style={{ ...addButtonStyles, backgroundColor: '#3498db', color: '#fff', marginRight: '5px' }}
          >Edit</button>
          <button onClick={() => handleDelete(row.id)}
            style={{ ...addButtonStyles, backgroundColor: '#e74c3c', color: '#fff' }}
          >Delete</button>
        </>
      ),
    },
  ];

  const handleSave = async (id, word, meaning, note, subject, image) => {
    // if (!word || !meaning || !note || !subject) {
    //   setSuccessMessage2('Please fill out all required fields');
    //   setTimeout(() => {
    //     setSuccessMessage2('');
    //   }, 3000);
    //   return;
    // }

    if (word === undefined) {
      word = '';
    }
    if (meaning === undefined) {
      meaning = '';
    }
    if (note === undefined) {
      note = '';
    }
    if (subject === undefined) {
      subject = '';
    }
    const response = await editWord(id, word, meaning, note, subject, image);
    console.log(response)
    if (response.message.includes('Thay đổi thông tin từ thành công!')) {
      const updatedData = await getWords();
      setWords(updatedData);
      setFilteredWord(updatedData.filter(words =>
        words.word.toLowerCase().includes(search.toLowerCase())
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
  const handleSave2 = async (word, meaning, note, subject, image) => {
    if (!word || !meaning || !note || !subject) {
      setSuccessMessage2('Please fill out all required fields');
      setTimeout(() => {
        setSuccessMessage2('');
      }, 3000);
      return;
    }
    const response = await addWord(word, meaning, note, subject, image);
    console.log(response)
    if (response.message.includes('Đã add thêm từ')) {
      const updatedData = await getWords();
      setWords(updatedData);
      setFilteredWord(updatedData.filter(words =>
        words.word.toLowerCase().includes(search.toLowerCase())
      ));
    }
    setSuccessMessage2(response.message);
    setTimeout(() => {
      setSuccessMessage2('');
    }, 3000);
  };
  const handleDelete = async (id) => {
    const row = filteredWord.find(word => word.id === id);
    setSelectedRow(row);
    setShowPopup3(true);
    setIsModalOpen3(true);
  };
  const closeModal3 = () => {
    setIsModalOpen3(false);
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
      maxWidth: '630px',
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




  return (
    <>
      {successMessage && <div style={alertMessageStyle}>{successMessage}</div>}
      <DataTables
        // title="WEB Từ Điển"
        columns={column}
        data={filteredWord}
        pagination
        // onRowClicked={handleRowClick}
        // selectableRows
        // selectableRowsHighlight
        // highlightOnHover
        subHeader
        subHeaderComponent={
          <div style={subHeaderStyles}>
            <input
              type="text"
              placeholder="Search Words..."
              className="form-control"
              style={searchStyle}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearch2('')}
            />

            <input
              type="text"
              placeholder="Search Subjects..."
              className="form-control"
              onFocus={() => setSearch('')}
              style={searchStyle}
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
            />


            <button
              onClick={handleAdd}
              style={addButtonStyles}
              onMouseEnter={(e) => e.target.style.border = '2px solid #0056b3'} // Darker border on hover
              onMouseLeave={(e) => e.target.style.border = '2px solid #007bff'}
            >
              Add Word
            </button>
          </div>
        }

      />
      {/* <Popup modal trigger={selectedRow}>
        {close => <Content close={close} />}
      </Popup> */}
      {showPopup && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={"Edit Word"}
          style={modalStyles}
        >
          {successMessage2 && <div style={alertMessageStyle}>{successMessage2}</div>}
          <div className="text-center">
            <h2>{"Edit Word"}</h2>
          </div>
          <div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Word:</label>
              <input
                type="text"
                value={selectedRow.word || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, word: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Meaning:</label>
              <input
                type="text"
                value={selectedRow.meaning || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, meaning: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Description:</label>
              <input
                type="text"
                value={selectedRow.note || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, note: e.target.value })}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Subject:</label>
              <input
                type="text"
                value={selectedRow.subject || ''}
                onChange={(e) => setSelectedRow({ ...selectedRow, subject: e.target.value })}
                style={formStyles.input}
              />
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
                    setSelectedRow({ ...selectedRow, image2: e.target.files[0] });
                  }
                }}
                style={formStyles.input}
              />
            </div>

            {/* <div style={{ padding: '15px 10px', maxWidth: '100%', overflowX: 'auto' }}>
              <div style={{ display: 'flex' }}>

                {selectedRow.image.map((imageSrc, index) => (
                  // console.log(type(selectedRow.image))
                  < div key={index} style={{ height: '200px', marginRight: '10px' }}>
                    <img
                      src={imageSrc}
                      style={{ height: '100%', width: 'auto' }}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            <div style={{ padding: '15px 10px', maxWidth: '100%', overflowX: 'auto' }}>
              <div style={{ display: 'flex' }}>

                {selectedRow.image && selectedRow.image.map((imageSrc, index) => (
                  <div key={index} style={{ position: 'relative', height: '200px', marginRight: '10px' }}>
                    <img
                      src={imageSrc}
                      style={{ height: '100%', width: 'auto' }}
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}

              </div>
            </div>
            <div style={buttonContainerStyles}>
              <button onClick={closeModal} style={{ marginRight: '10px' }} className="btn btn-outline-dark">Close</button>
              <button onClick={() => handleSave(selectedRow.id, selectedRow.word, selectedRow.meaning, selectedRow.note, selectedRow.subject, selectedRow.image2)} className="btn btn-outline-dark" >Save</button>
            </div>
          </div>
        </Modal >
      )
      }
      {
        showPopup2 && (
          <Modal
            isOpen={isModalOpen2}
            onRequestClose={closeModal2}
            contentLabel={"Add Word"}
            style={modalStyles}
          >
            {successMessage2 && <div style={alertMessageStyle}>{successMessage2}</div>}
            <div className="text-center">
              <h2>{"Add Word"}</h2>
            </div>
            <div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Word:</label>
                <input
                  type="text"
                  value={selectedRow.word || ''}
                  onChange={(e) => setSelectedRow({ ...selectedRow, word: e.target.value })}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Meaning:</label>
                <input
                  type="text"
                  value={selectedRow.meaning || ''}
                  onChange={(e) => setSelectedRow({ ...selectedRow, meaning: e.target.value })}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Description:</label>
                <input
                  type="text"
                  value={selectedRow.note || ''}
                  onChange={(e) => setSelectedRow({ ...selectedRow, note: e.target.value })}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Subject:</label>
                <input
                  type="text"
                  value={selectedRow.subject || ''}
                  onChange={(e) => setSelectedRow({ ...selectedRow, subject: e.target.value })}
                  style={formStyles.input}
                />
              </div>
              {/* <div style={formStyles.formGroup}>
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
              </div> */}
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Images:</label>
                <input
                  type="file"
                  accept="image/*" // This restricts the file picker to image files
                  multiple // This enables selecting multiple files
                  onChange={(e) => {
                    // Handle multiple file selections
                    if (e.target.files && e.target.files.length > 0) {
                      // Create an array with the selected files
                      const filesArray = Array.from(e.target.files);
                      // Assuming you want to store the file objects in selectedRow under an 'images' key
                      setSelectedRow({ ...selectedRow, images: filesArray });
                    }
                  }}
                  style={formStyles.input}
                />
              </div>

              <div style={{ padding: '15px 10px', maxWidth: '100%', overflowX: 'auto' }}>
              <div style={{ display: 'flex' }}>

                {selectedRow.image && selectedRow.image.length > 0 && selectedRow.image.map((imageSrc, index) => (
                  <div key={index} style={{ position: 'relative', height: '200px', marginRight: '10px' }}>
                    <img
                      src={imageSrc}
                      style={{ height: '100%', width: 'auto' }}
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}

              </div>
            </div>

              <div style={buttonContainerStyles}>
                <button onClick={closeModal2} style={{ marginRight: '10px' }} className="btn btn-outline-dark">Close</button>
                <button onClick={() => handleSave2(selectedRow.word, selectedRow.meaning, selectedRow.note, selectedRow.subject, selectedRow.image)} className="btn btn-outline-dark" required>Save</button>
              </div>
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
          <h2>{"Bạn có chắc muốn xoá word này không?"}</h2>
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
  // {selectedRow && (
  //   <Modal isOpen={true} onRequestClose={closeModal} style={{ width:'80%'}}>
  //     <div style={{ display: 'flex',flexDirection: 'column' ,backgroundColor: '#fff',justifyContent:'center', alignItems:'center', width:'80%' , padding: '20px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)' }}>
  //       <h2>Thông tin chi tiết</h2>
  //       <p>Ngày thêm: {selectedRow.date}</p>
  //       <p>Từ: {selectedRow.word}</p>
  //       <p>Định Nghĩa: {selectedRow.note}</p>
  //       <p>Người thêm: {selectedRow.user_add}</p>
  //       <p>Môn học: {selectedRow.subject}</p>
  //       <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
  //         <div style={{ display: 'flex' }}>
  //           {selectedRow.image.map((imageSrc, index) => (
  //             <div key={index} style={{ height: '200px', marginRight: '10px' }}>
  //               <img
  //                 src={imageSrc}
  //                 style={{ height: '100%', width: 'auto' }}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //       {/* Các thông tin khác */}
  //       <button onClick={closeModal}>Đóng</button>
  //     </div>
  //   </Modal>
  // )}
};

export default Word2;