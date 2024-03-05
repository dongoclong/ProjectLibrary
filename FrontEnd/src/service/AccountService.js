import axios from 'axios';

const baseUrl = 'http://localhost:8000/api/v1/user';


const handleError = (action, error) => {
  console.error(`Error while ${action} account:`, error);
  throw error;
};

export const getAllAccounts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/show`);
    return response.data.map((account) => ({
      id: account.id,
      user_name: account.user_name,
      image: account.image,
      role: account.role,
      date: account.date,
    }));
  } catch (error) {
    handleError('fetching accounts', error);
  }
};

const loginInfo = localStorage.getItem('loginInfo'); 
export const deleteAccount = async (id_user) => {
  const id_user_delete  = JSON.parse(loginInfo).id;
  console.log(id_user_delete)
  console.log(id_user)
  // console.log(loginInfo.JSON.parse(loginInfo))
  try {
    const response = await axios.delete(`${baseUrl}/delete/${id_user}`, {
      params: {
        id_user_delete: id_user_delete
      }
    });
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// accountservice.js

export const editAccount = async (id_user, user_name, old_password, new_password) => {
  try {
    const id_user_delete  = JSON.parse(loginInfo).id;
    // const formData = new FormData();
    // check nếu trường kh trống thì mới gửi về sv
    // formData.append('user_name', user_name);
    // formData.append('old_password', old_password);
    // formData.append('new_password', new_password);
    // formData.append('src_img', src_img);
            // 1?id_user_edit=2&user_name=long ne1234&old_password=123
    const response = await fetch(`${baseUrl}/update/${id_user}?user_name=${user_name}&old_password=${old_password}&new_password=${new_password}&id_user_edit=${id_user_delete}`, {
      method: 'PATCH',
      // body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to edit account');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error editing account:', error);
    throw error;
  }
};


// export const addAccount = async (user_name, password, role, image) => {
//   try {
//     const id_user_delete  = JSON.parse(loginInfo).id;
//     const formData = new FormData();

//     formData.append('user_name', user_name);
//     formData.append('password', password);
//     formData.append('role', role);
//     formData.append('image', image);
//     formData.append('id_user_edit', id_user_delete)
//     // formData.append('src_img', src_img);
//     const response = await axios.post(`${baseUrl}/add`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: {
//       formData,
//       }
//     });

//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     handleError('adding account', error);
//   }
// };
export const addAccount = async (user_name, password, role, image) => {
  try {
    const id_user_delete = JSON.parse(loginInfo).id;
    const formData = new FormData();
    if (image != undefined) {
      formData.append('src_img', image);
    }
    console.log(id_user_delete, user_name, password, role, image)
    formData.append('user_name', user_name);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('id_user_add', id_user_delete);
    console.log(formData)
    console.log(Object.fromEntries(formData.entries()));

    const response = await axios.post('http://localhost:8000/api/v1/user/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': 'https://testuidic.duckdns.org'
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError('adding account', error);
  }
};
