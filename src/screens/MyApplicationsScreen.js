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
import { applicationsApi } from "../api/applications";
import { useAuth } from "../context/AuthContext";

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) return;
    const fetchData = async () => {
      const data = await applicationsApi.getMyApplications(token, user.id);
      setApplications(data);
      setLoading(false);
    };
    fetchData();
  }, []);

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
        <Text style={styles.title}>Moje prijave_</Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BlurView intensity={40} tint="light" style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/tournament/${item.tournament_id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.cardMain}>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.tournaments?.name}
                    </Text>
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="game-controller-outline"
                        size={15}
                        color="#4A3E3D"
                        style={styles.icon}
                      />
                      <Text style={styles.cardInfo} numberOfLines={1}>
                        {item.tournaments?.game}
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
                        {item.tournaments?.location}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      item.status === "accepted"
                        ? styles.accepted
                        : item.status === "rejected"
                          ? styles.rejected
                          : styles.pending,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {item.status === "accepted"
                        ? "✓ Prihvaćeno"
                        : item.status === "rejected"
                          ? "✕ Odbijeno"
                          : "⏳ Čeka"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}
        ListEmptyComponent={
          <BlurView intensity={20} tint="light" style={styles.emptyCard}>
            <Text style={styles.empty}>
              Nisi se prijavio/la ni na jedan turnir.
            </Text>
          </BlurView>
        }
      />
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
    top: "20%",
    right: "-10%",
    opacity: 0.35,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "400",
    color: "#111",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
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
  accepted: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  rejected: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  pending: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
    marginTop: 20,
  },
  empty: {
    color: "#4A3E3D",
    fontSize: 14,
    opacity: 0.8,
  },
});
