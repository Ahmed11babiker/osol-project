// 📁 src/components/CenteredToast.jsx
export default function CenteredToast({ message, bgColor = "bg-green-100", textColor = "text-green-800", borderColor = "border-green-400" }) {
  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    ${bgColor} ${textColor} border ${borderColor} 
                    px-6 py-4 rounded shadow-lg z-50 text-center`}>
      {message}
    </div>
  );
}
