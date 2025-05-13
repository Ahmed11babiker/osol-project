const Placeholder = ({ lang }) => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold mb-4">
            {lang === 'ar' ? 'الصفحة قيد التحميل...' : 'Page is loading...'}
          </div>
          <div className="text-xl text-gray-600">
            {lang === 'ar' ? 'يرجى الانتظار قليلاً' : 'Please wait a moment'}
          </div>
        </div>
      </div>
    );
  };
  
  export default Placeholder;
  