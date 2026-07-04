import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log("Greška pri učitavanju korisnika", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    console.log("Login response:", JSON.stringify(data));
    if (data.access_token) {
      setToken(data.access_token);
      setUser(data.user);
      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    }
    return {
      success: false,
      error: data.error_description || "Greška pri prijavi",
    };
  };

  const register = async (email, password, username) => {
    const data = await authApi.register(email, password);
    console.log("Register data:", JSON.stringify(data));
    if (data.access_token) {
      // Upiši profil
      await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${data.access_token}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          id: data.user.id,
          username: username,
        }),
      });
      return { success: true };
    }
    return {
      success: false,
      error: data.error_description || "Greška pri registraciji",
    };
  };

  const logout = async () => {
    await authApi.logout(token);
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
