import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // هنا يمكن إجراء التحقق من البريد الإلكتروني مع API أو بيانات وهمية
      if (email === 'user@example.com') {
        // ارسال رابط إعادة تعيين كلمة المرور (نموذج وهمي)
        setMessage(lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'Password reset link has been sent to your email');
        setError('');
      } else {
        setError(lang === 'ar' ? 'البريد الإلكتروني غير موجود في النظام' : 'Email not found');
        setMessage('');
      }
    } else {
      setError(lang === 'ar' ? 'من فضلك أدخل بريدك الإلكتروني' : 'Please enter your email');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {lang === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password'}
        </h2>
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {lang === 'ar' ? 'إرسال رابط إعادة تعيين كلمة المرور' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-700">
            {lang === 'ar' ? 'تذكر كلمة المرور؟' : 'Remember your password?'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
