import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("medconnect_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would connect to a backend
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock user data based on email
        if (email && password) {
          let user;
          if (email === "admin@example.com") {
            user = { id: 1, name: "Admin User", email, role: "admin" };
          } else if (email === "doctor@example.com") {
            user = { id: 2, name: "Dr. Smith", email, role: "doctor" };
          } else {
            user = { id: 3, name: "John Patient", email, role: "patient" };
          }

          setCurrentUser(user);
          localStorage.setItem("medconnect_user", JSON.stringify(user));
          toast.success("Logged in successfully");
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
          toast.error("Invalid email or password");
        }
      }, 1000);
    });
  };

  // Mock register function
  const register = (name, email, password, role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password && role) {
          const user = { id: Date.now(), name, email, role };
          setCurrentUser(user);
          localStorage.setItem("medconnect_user", JSON.stringify(user));
          toast.success("Registered successfully");
          resolve(user);
        } else {
          reject(new Error("All fields are required"));
          toast.error("All fields are required");
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("medconnect_user");
    toast.info("Logged out");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
