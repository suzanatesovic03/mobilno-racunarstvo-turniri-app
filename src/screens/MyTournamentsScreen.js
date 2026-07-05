import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { organizersApi } from "../api/organizers";
import { tournamentsApi } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

export default function MyTournamentsScreen() {
  const [myTournaments, setMyTournaments] = useState([]);
  const [coTournaments, setCoTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const all = await tournamentsApi.getAll(token);
      const mine = all.filter((t) => t.creator_id === user.id);
      setMyTournaments(mine);
      const co = await organizersApi.getMyCoOrganized(token, user.id);
      setCoTournaments(co.map((c) => c.tournaments));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
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

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <BlurView intensity={40} tint="light" style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/tournament/${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.cardMain}>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.infoRow}>
                <Ionicons
                  name="game-controller-outline"
                  size={15}
                  color="#4A3E3D"
                  style={styles.icon}
                />
                <Text style={styles.cardInfo} numberOfLines={1}>
                  {item.game}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#4A3E3D"
                  style={styles.icon}
                />
                <Text style={styles.cardInfo} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </View>

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
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  return (
    <LinearGradient
      colors={["#E8C3B9", "#DDA193", "#C58B80"]}
      style={styles.container}
    >
      <View style={styles.backgroundCircle} />

      <View style={styles.header}>
        <Text style={styles.title}>Moji turniri_</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Kreirao/la sam</Text>
        <FlatList
          data={myTournaments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <BlurView intensity={20} tint="light" style={styles.emptyCard}>
              <Text style={styles.empty}>Nisi kreirao/la nijedan turnir.</Text>
            </BlurView>
          }
          scrollEnabled={false}
        />

        <Text style={styles.sectionTitle}>Ko-organizator sam</Text>
        <FlatList
          data={coTournaments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <BlurView intensity={20} tint="light" style={styles.emptyCard}>
              <Text style={styles.empty}>
                Nisi ko-organizator ni na jednom turniru.
              </Text>
            </BlurView>
          }
          scrollEnabled={false}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create-tournament")}
        activeOpacity={0.9}
      >
        <Ionicons
          name="add"
          size={24}
          color="#fff"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.fabText}>Novi turnir</Text>
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
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#F3C1B6",
    bottom: "15%",
    left: "-10%",
    opacity: 0.35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "400",
    color: "#111",
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 4,
    letterSpacing: 0.3,
  },
  cardWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cardContainer: {
    backgroundColor: "transparent",
  },
  card: {
    padding: 20,
  },
  cardMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    opacity: 0.85,
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
    fontSize: 11,
    fontWeight: "600",
    color: "#111",
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  empty: {
    color: "#4A3E3D",
    fontSize: 14,
    opacity: 0.8,
  },
  fab: {
    position: "absolute",
    bottom: 96,
    right: 24,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    height: 52,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
