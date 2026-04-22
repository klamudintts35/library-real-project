import { createContext, useContext, useEffect, useState } from "react";

// AuthContext banaya gaya hai taaki poore app me login state use ho sake
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // token localStorage se uthaya ja raha hai
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // admin info localStorage se uthaya ja raha hai
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  // login function
  const login = (tokenValue, adminData) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setToken(tokenValue);
    setAdmin(adminData);
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    // localStorage.removeItem("libraryToken");
    localStorage.removeItem("libraryToken");
    localStorage.removeItem("resetMobile");
    localStorage.removeItem("resetOtp");
    setToken("");
    setAdmin(null);
  };

  // refresh ke baad bhi state sync rahe
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedAdmin = localStorage.getItem("admin");

    if (savedToken) setToken(savedToken);
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// easy custom hook
export const useAuth = () => useContext(AuthContext);