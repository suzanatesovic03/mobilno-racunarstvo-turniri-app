import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { tournamentsApi } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

export default function TournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const router = useRouter();

  const fetchTournaments = async () => {
    setLoading(true);
    const data = await tournamentsApi.getAll(token);
    setTournaments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleLogout = async () => {
    await logout();
    setTimeout(() => {
      router.replace("/");
    }, 100);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#E8C3B9", "#DDA193", "#C58B80"]}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#1A1A1A" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E8C3B9", "#DDA193", "#C58B80"]}
      style={styles.container}
    >
      <View style={styles.backgroundCircle} />

      <View style={styles.header}>
        <Text style={styles.title}>Turniri_</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BlurView intensity={40} tint="light" style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push(`/tournament/${item.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View
                    style={[
                      styles.badge,
                      item.status === "open" ? styles.open : styles.closed,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {item.status === "open" ? "Otvoreno" : "Zatvoreno"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="game-controller-outline"
                    size={16}
                    color="#4A3E3D"
                    style={styles.icon}
                  />
                  <Text style={styles.cardInfo}>{item.game}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#4A3E3D"
                    style={styles.icon}
                  />
                  <Text style={styles.cardInfo}>{item.location}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color="#4A3E3D"
                    style={styles.icon}
                  />
                  <Text style={styles.cardInfo}>
                    Max igrača: {item.max_participants}
                  </Text>
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}
        ListEmptyComponent={
          <BlurView intensity={20} tint="light" style={styles.emptyCard}>
            <Text style={styles.empty}>Nema turnira. Budi prvi i kreiraj!</Text>
          </BlurView>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create-tournament")}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <BottomNav />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#F3C1B6",
    top: "30%",
    left: "-20%",
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: "#111",
  },
  logout: {
    color: "#111",
    fontSize: 16,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  cardWrapper: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  card: {
    padding: 24,
    backgroundColor: "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    opacity: 0.8,
  },
  icon: {
    marginRight: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: "#4A3E3D",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  open: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  closed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
  emptyCard: {
    borderRadius: 24,
    padding: 32,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  empty: {
    textAlign: "center",
    color: "#4A3E3D",
    fontSize: 16,
    opacity: 0.8,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 24,
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
    zIndex: 99,
  },
});
