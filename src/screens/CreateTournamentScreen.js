import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { organizersApi } from "../api/organizers";
import { tournamentsApi } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

export default function CreateTournamentScreen() {
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const router = useRouter();

  const handleSearchUsers = async () => {
    if (!searchUsername) return;
    const results = await organizersApi.searchUsers(token, searchUsername);
    const filtered = results.filter((u) => u.id !== user.id);
    setSearchResults(filtered);
  };

  const addOrganizer = (u) => {
    if (selectedOrganizers.find((o) => o.id === u.id)) return;
    setSelectedOrganizers([...selectedOrganizers, u]);
    setSearchResults([]);
    setSearchUsername("");
  };

  const removeOrganizer = (id) => {
    setSelectedOrganizers(selectedOrganizers.filter((o) => o.id !== id));
  };

  const handleCreate = async () => {
    if (!name || !game || !date || !location || !maxParticipants) {
      Alert.alert("Greška", "Popunite sva polja");
      return;
    }
    setLoading(true);
    try {
      const tournament = await tournamentsApi.create(token, {
        name,
        game,
        date,
        location,
        max_participants: parseInt(maxParticipants),
        creator_id: user.id,
        status: "open",
      });

      if (selectedOrganizers.length > 0) {
        await Promise.all(
          selectedOrganizers.map((o) =>
            organizersApi.add(token, tournament.id, o.id),
          ),
        );
      }

      Alert.alert("Uspeh", "Turnir je kreiran!");
      router.replace("/tournaments");
    } catch (e) {
      Alert.alert("Greška", "Nešto je pošlo naopako");
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#E8C3B9", "#DDA193", "#C58B80"]}
      style={styles.container}
    >
      <View style={styles.backgroundCircle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Novi turnir_</Text>
        </View>

        <View style={styles.cardWrapper}>
          <BlurView intensity={40} tint="light" style={styles.card}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="trophy-outline"
                size={18}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Naziv turnira"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="game-controller-outline"
                size={18}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Igra (npr. FIFA, Catan...)"
                placeholderTextColor="#888"
                value={game}
                onChangeText={setGame}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Datum (npr. 2026-08-15)"
                placeholderTextColor="#888"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Lokacija"
                placeholderTextColor="#888"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="people-outline"
                size={18}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Max broj učesnika"
                placeholderTextColor="#888"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.sectionTitle}>Ko-organizatori</Text>

            <View style={styles.searchRow}>
              <View
                style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Pretraži korisnike..."
                  placeholderTextColor="#888"
                  value={searchUsername}
                  onChangeText={setSearchUsername}
                />
              </View>
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearchUsers}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.resultsContainer}>
              {searchResults.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={styles.userResult}
                  onPress={() => addOrganizer(u)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.userResultText}>{u.username}</Text>
                  <Ionicons name="add-circle-outline" size={20} color="#111" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.chipsContainer}>
              {selectedOrganizers.map((o) => (
                <View key={o.id} style={styles.selectedOrganizer}>
                  <Text style={styles.organizerText}>{o.username}</Text>
                  <TouchableOpacity onPress={() => removeOrganizer(o.id)}>
                    <Ionicons name="close" size={16} color="#111" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreate}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Kreiraj turnir</Text>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#F3C1B6",
    top: "10%",
    left: "-10%",
    opacity: 0.4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: 26,
    fontWeight: "400",
    color: "#111",
  },
  cardWrapper: {
    marginHorizontal: 24,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  card: {
    padding: 28,
    backgroundColor: "transparent",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginBottom: 12,
    marginTop: 8,
    paddingLeft: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBtn: {
    backgroundColor: "#1A1A1A",
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    marginTop: 8,
  },
  userResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 100,
    marginBottom: 6,
  },
  userResultText: {
    fontSize: 14,
    color: "#111",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  selectedOrganizer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 100,
  },
  organizerText: {
    fontSize: 13,
    color: "#111",
    fontWeight: "500",
  },
  bottomRow: {
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: "#1A1A1A",
    height: 54,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
