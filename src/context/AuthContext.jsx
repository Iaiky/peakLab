import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Au chargement, on vérifie si l'utilisateur était déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      setIsLoggedIn(true);
      setUser({ name: "Jean Dupont", role: "Client Premium", initiales: "JD" });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user_token", "fake_token_123");
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);