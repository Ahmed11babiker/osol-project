// UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  return (
    <UserContext.Provider value={{ userId, setUserId, name, setName, image, setImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
