import axios from "axios";

const baseUrl = "http://localhost:8000/api/v1/product"; // Replace with your actual API URL
const loginInfo = localStorage.getItem('loginInfo'); 
export const getWords = async () => {
  try {
    const response = await axios.get(`${baseUrl}/show`);
    return response.data;
  } catch (error) {
    console.error("Error fetching words:", error);
    throw error;
  }
};
const handleError = (action, error) => {
  console.error(`Error while ${action} account:`, error);
  throw error;
};
export const addWord = async (word, meaning, note, subject, image) => {
  try {
    const user_add  = JSON.parse(loginInfo).user_name;
    const formData = new FormData();
    if (image != undefined) {
      formData.append('src_img', image);
    }
    formData.append('word', word);
    formData.append('meaning', meaning);
    formData.append('note', note);
    formData.append('user_add', user_add);
    formData.append('subject', subject);
    console.log(formData)
    console.log(Object.fromEntries(formData.entries()));

    const response = await axios.post('http://localhost:8000/api/v1/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError('adding Word', error);
  }
};

export const updateWord = async (id, wordData) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, wordData);
    return response.data;
  } catch (error) {
    console.error("Error updating word:", error);
    throw error;
  }
};


export const editWord= async (id_word, word, meaning, note, subject, image, list_id_img ) => {
  try {
    const id_user_edit  = JSON.parse(loginInfo).id;
    const formData = new FormData();
    console.log(list_id_img)
    if (image != undefined) {
      formData.append('src_img', image);
    }
    console.log(formData.getAll('src_img'));
    const requestOptions = {
      method: 'PATCH',
    };
    
    if (image !== undefined) {
      requestOptions.body = formData;
    }
    
    const url = `${baseUrl}/update/${id_word}?word=${word}&meaning=${meaning}&list_id_img=${list_id_img}&note=${note}&subject=${subject}&id_user_update=${id_user_edit}`;
    
    const response = await fetch(url, requestOptions);
    // const response = await fetch(`${baseUrl}/update/${id_word}?word=${word}&meaning=${meaning}&note=${note}&subject=${subject}&id_user_update=${id_user_edit}`, {
    //   method: 'PATCH',
    //   body: formData,
    // });

    if (!response.ok) {
      throw new Error('Failed to edit word');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error editing word:', error);
    throw error;
  }
};


// const isResourceExists = async (id_product) => {
//   try {
//     const response = await axios.get(`${baseUrl}/show`);
//     return response.status === 200; // Trả về true nếu tài nguyên tồn tại, ngược lại trả về false
//   } catch (error) {
//     return false; // Xử lý lỗi hoặc tài nguyên không tồn tại
//   }
// };

export const deleteWord = async (id_product) => {
  try {
    const response = await axios.delete(`${baseUrl}/delete/${id_product}`);
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

