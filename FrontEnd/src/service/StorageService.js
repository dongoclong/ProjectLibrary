const StorageService = {
  // Lưu trữ dữ liệu người dùng
  setUserData: (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
  },

  // Lấy dữ liệu người dùng
  getUserData: () => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },

  // Lưu trữ token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Xóa dữ liệu người dùng và token
  clearStorage: () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  }
};

export default StorageService;
