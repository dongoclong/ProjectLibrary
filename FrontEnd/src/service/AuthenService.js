import axios from 'axios';

const Authen = {
  login: async (user_name, password) => {
    try {
      const formData = new FormData();
      formData.append('user_name', user_name);
      formData.append('password', password);

      const response = await axios.post('https://apidic.duckdns.org/api/v1/user/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      throw error;
    }
  }
};

export default Authen;
