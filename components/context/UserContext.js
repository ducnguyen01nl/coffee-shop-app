import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children}) => {
  const [userCurrent,setUserCurrent] = useState(null);
  const [imgUser,setImgUser] = useState(null);
  
    return (
      <UserContext.Provider value={{ userCurrent, setUserCurrent, imgUser,setImgUser }}>
        {children}
      </UserContext.Provider>
    );
  };
