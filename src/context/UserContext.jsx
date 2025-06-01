import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (userId && token) {
      axios
        .get(`http://localhost:3001/api/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setName(res.data.username);
          // يمكنك تعديل هذا إذا كان لديك صورة شخصية
          setImage("/default-profile.jpg"); // أو res.data.image لو موجود
        })
        .catch((err) => {
          console.error("فشل في جلب بيانات المستخدم:", err);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ name, setName, image, setImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
