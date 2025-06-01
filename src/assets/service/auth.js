import Cookies from 'js-cookie';

export const getToken = () => {
  const token = Cookies.get('token');
  if (!token) {
    redirectToLogin(); 
  }
  return token;
};

export const redirectToLogin = () => {
  window.location.href = '/'; 
};