import React from 'react'
import DataTable from 'react-data-table-component'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import getWord from '../service/WordService'
import DataTables from "react-data-table-component";
import moment from 'moment'
import Modal from 'react-modal';
import Slider from 'react-slick';
// Đặt phần tử ứng dụng
Modal.setAppElement('#root');
const Word = () => {
  const [words, setWords] = useState([])
  const [search, setSearch] = useState('')
  const [filteredWord, setFilteredWord] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWord();
        setWords(data);
        setFilteredWord(data); // Khởi tạo filteredCountries với tất cả các quốc gia
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    getWord();
  }, []);

  useEffect(() => {
    const result = words.filter((word) => {
      return word.word.toLowerCase().match(search.toLowerCase());
    });
    setFilteredWord(result);
  }, [search]);


  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowPopup(true);
    setIsModalOpen(true);
  };

  const openImage = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedRow(null);
    // setSelectedImage(null);
  };
  const closeModalImage = () => {
    setSelectedImage(null);
  };


  

  const column = [
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>STT</b>, selector: (row, index) => index + 1, sortable: true, grow: 0},
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Date</b>, selector: (row) => row.date, sortable: true, width: "12rem" },
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Word</b>, selector: (row) => row.word, sortable: true, width: "12rem" },
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Meaning</b>, selector: (row) => row.meaning, sortable: true, width: "12rem" },
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Description</b>, selector: (row) => row.note, sortable: true, width: "13rem" },
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>User Edit status</b>, selector: (row) => row.user_add, sortable: true, width: "11rem"},
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Image</b>, selector: (row) => <img src={row.image[0]} width={25} height={25} />, width: "5rem"},
    { name: <b style={{fontWeight: 'bold', fontSize: '15px', textAlign: 'center'}}>Subject</b>, selector: (row) => row.subject, sortable: true, width: "12rem"},

  ];

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
      height: '70%',
      maxWidth: '600px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };
  const imageStyles = {
    overlay: {
      // backgroundColor: 'rgba(0, 0, 0, 0.0)',
      zIndex: 1001,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      // marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      // border: '1px solid #ccc',
      // background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      // borderRadius: '10px',
      outline: 'none',
      padding: '0px',
      width: '70%',
      // maxWidth: '600px',
      // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
      textAlign: 'right'
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
      <DataTables
        title="WEB Từ Điển"
        columns={column}
        data={filteredWord}
        pagination
        onRowClicked={handleRowClick}
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search here now"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }

      />

      {selectedRow && (
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={"Edit Account"}
        style={modalStyles}
      >
      <div style={{ display: 'flex',flexDirection: 'column' ,justifyContent: 'center', alignItems: 'center' }}>
          <h2>Thông tin chi tiết</h2>
          <p>Ngày thêm: {selectedRow.date}</p>
          <p>Từ: {selectedRow.word}</p>
          {/* <p>Định Nghĩa: {selectedRow.meaning}</p> */}
          <p>
            Định Nghĩa: {selectedRow.meaning}
          </p>
          <p style={{ maxWidth: '100%', overflowWrap: 'break-word', wordWrap: 'break-word' }}>Ghi chú: {selectedRow.note}</p>
          <p>Người thêm: {selectedRow.user_add}</p>
          <p>Môn học: {selectedRow.subject}</p>
          {/* <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <div style={{ display: 'flex' }}>
              {selectedRow.image.map((imageSrc, index) => (
                <div key={index} style={{ height: '200px', marginRight: '10px' }}>
                  <img
                    src={imageSrc}
                    style={{ height: '100%', width: 'auto' }}
                    onClick={() => openImage(imageSrc)}
                  />
                </div>
              ))}
            </div>
          </div> */}
          <div style={{ maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex' }}>
              {selectedRow.image.map((imageSrc, index) => (
                <div key={index} style={{ height: '200px', width: 'auto', marginRight: '10px' }}>
                  <img
                    src={imageSrc}
                    style={{ height: '100%', width: 'auto', cursor: 'pointer' }}
                    onClick={() => openImage(imageSrc)}
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={buttonContainerStyles}>
            <button onClick={closeModal} style={{ marginRight: '10px' }} className="btn btn-outline-dark">Close</button>
            {/* <button onClick={handleSave(selectedRow.id,selectedRow.user_name,selectedRow.old_password, selectedRow.new_password )}>Save</button> */}
            {/* <button onClick={() => handleSave2(selectedRow.id, selectedRow.user_name, selectedRow.old_password, selectedRow.new_password)}>Save</button> */}
          </div>
        </div>
      </Modal>
        )}
        {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onRequestClose={closeModalImage}
          contentLabel={"Image Preview"}
          style={imageStyles}
        >
          <div>
            <img
              src={selectedImage}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              alt="Selected Image"
            />
            {/* <button onClick={closeModalImage} style={{ marginTop: '10px' }}>Close</button> */}
            {/* <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a> */}
          </div>

        </Modal>
      )}
    </>
  );

};

export default Word;

