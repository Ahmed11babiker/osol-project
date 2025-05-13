import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("profileName") || "";
    const storedImage = localStorage.getItem("profileImage") || "";
    setName(storedName);
    setImage(storedImage);
  }, []);

  return (
    <UserContext.Provider value={{ name, setName, image, setImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
