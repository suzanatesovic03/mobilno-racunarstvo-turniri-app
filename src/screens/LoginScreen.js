import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Greška", "Unesite email i lozinku");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace("/tournaments");
    } else {
      Alert.alert("Greška", result.error);
    }
  };

  return (
    <LinearGradient
      colors={["#E8C3B9", "#DDA193", "#C58B80"]}
      style={styles.container}
    >
      <View style={styles.backgroundCircle} />

      <View style={styles.headerRow}>
        <Text style={styles.brandTitle}>TurnirNet_</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <BlurView intensity={40} tint="light" style={styles.card}>
        <Text style={styles.title}>Log in</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="e-mail address"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="key-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>I forgot</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardFooterText}>
          Dobrodošli na TurnirNet. Pratite rezultate, rasporede i upravljajte
          vašim omiljenim sportskim i esport turnirima na jednom mestu.
        </Text>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backgroundCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#F3C1B6",
    bottom: "20%",
    right: "-10%",
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: "System",
    color: "#4A3E3D",
    opacity: 0.8,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  card: {
    borderRadius: 32,
    padding: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 36,
    fontWeight: "400",
    color: "#111",
    marginBottom: 32,
    fontFamily: "System",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
  forgotButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  forgotText: {
    fontSize: 12,
    color: "#111",
  },
  cardFooterText: {
    fontSize: 12,
    color: "#4A3E3D",
    lineHeight: 18,
    opacity: 0.8,
    marginTop: 16,
    marginBottom: 24,
    paddingRight: 40,
  },
  bottomRow: {
    alignItems: "flex-end",
  },
  submitButton: {
    backgroundColor: "#1A1A1A",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
});
