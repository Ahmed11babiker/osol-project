import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Login = ({ lang, setUsername }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookies] = useCookies(['token']);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      setIsLoading(true);
      try {
        const res = await axios.post("http://localhost:3001/api/auth/login", { email, password });
        if (res.status === 200) {
          const token = res.data.token;
          setCookies('token', res.data.token, { maxAge: 4 * 60 * 60 });
          window.localStorage.setItem('user_id', res.data.id);
          window.localStorage.setItem('name', res.data.username);
          window.localStorage.setItem('role', res.data.role);
          navigate("/dashboard");
        } else {
          const err = await response.json();
          setError(err.message || (lang === "ar" ? "خطأ في تسجيل الدخول" : "Login error"));
          setIsLoading(false);
        }
      } catch {
        setError(lang === "ar" ? "خطأ في الاتصال بالخادم" : "Server connection error");
        setIsLoading(false);
      }
    } else {
      setError(lang === "ar" ? "من فضلك أدخل جميع البيانات" : "Please enter all fields");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
          {lang === "ar" ? "تسجيل الدخول" : "Login"}
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium" htmlFor="email">
            {lang === "ar" ? "البريد الإلكتروني" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            required
          />
          <label className="block mb-2 font-medium" htmlFor="password">
            {lang === "ar" ? "كلمة المرور" : "Password"}
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={lang === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
            ) : (
              lang === "ar" ? "تسجيل الدخول" : "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
