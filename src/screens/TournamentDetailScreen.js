import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { applicationsApi } from "../api/applications";
import { tournamentsApi } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token, user } = useAuth();
  const router = useRouter();
  const [tournament, setTournament] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isCoOrganizer, setIsCoOrganizer] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id || !token) return;
    setLoading(true);
    const t = await tournamentsApi.getById(token, id);
    setTournament(t);

    const { organizersApi } = await import("../api/organizers");
    const coOrgs = await organizersApi.getByTournament(token, id);
    const coOrgIds = coOrgs.map((c) => c.user_id);
    setIsCoOrganizer(coOrgIds.includes(user?.id));

    if (t?.creator_id === user?.id || coOrgIds.includes(user?.id)) {
      const apps = await applicationsApi.getByTournament(token, id);
      setApplications(apps);
    }
    setLoading(false);
  }, [id, token, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApply = async () => {
    if (!tournament) return;
    setApplying(true);
    const alreadyApplied = await applicationsApi.checkExisting(
      token,
      id,
      user.id,
    );
    if (alreadyApplied) {
      Alert.alert("Greška", "Već si se prijavio/la na ovaj turnir!");
      setApplying(false);
      return;
    }
    const acceptedCount = await applicationsApi.getAcceptedCount(token, id);
    if (acceptedCount >= tournament.max_participants) {
      Alert.alert("Nema mesta", "Turnir je popunjen!");
      setApplying(false);
      return;
    }
    await applicationsApi.apply(token, id, user.id);
    Alert.alert("Uspeh", "Prijava je poslata!");
    setApplying(false);
  };

  const handleUpdateStatus = async (applicationId, status) => {
    if (!tournament) return;
    const acceptedCount = await applicationsApi.getAcceptedCount(token, id);
    if (status === "accepted" && acceptedCount >= tournament.max_participants) {
      Alert.alert("Nema mesta", "Dostignut je maksimalan broj učesnika!");
      return;
    }
    await applicationsApi.updateStatus(token, applicationId, status);
    if (
      status === "accepted" &&
      acceptedCount + 1 >= tournament.max_participants
    ) {
      await tournamentsApi.update(token, id, { status: "closed" });
    }
    fetchData();
  };

  if (!id || !token || loading || !tournament) {
    return (
      <LinearGradient
        colors={["#E8C3B9", "#DDA193", "#C58B80"]}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#1A1A1A" />
      </LinearGradient>
    );
  }

  const isOrganizer = tournament.creator_id === user?.id || isCoOrganizer;
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
        </View>

        <View style={styles.cardWrapper}>
          <BlurView intensity={40} tint="light" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{tournament.name}</Text>
              <View
                style={[
                  styles.badge,
                  tournament.status === "open" ? styles.open : styles.closed,
                ]}
              >
                <Text style={styles.badgeText}>
                  {tournament.status === "open" ? "Otvoreno" : "Zatvoreno"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="game-controller-outline"
                size={18}
                color="#4A3E3D"
                style={styles.icon}
              />
              <Text style={styles.info}>{tournament.game}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#4A3E3D"
                style={styles.icon}
              />
              <Text style={styles.info}>{tournament.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#4A3E3D"
                style={styles.icon}
              />
              <Text style={styles.info}>{tournament.date?.split("T")[0]}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="people-outline"
                size={18}
                color="#4A3E3D"
                style={styles.icon}
              />
              <Text style={styles.info}>
                Maksimalno učesnika: {tournament.max_participants}
              </Text>
            </View>
          </BlurView>
        </View>

        {!isOrganizer && tournament.status === "open" && (
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            disabled={applying}
            activeOpacity={0.9}
          >
            {applying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.applyBtnText}>Prijavi se na turnir</Text>
            )}
          </TouchableOpacity>
        )}

        {isOrganizer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Broj prijava: ({applications.length})
            </Text>
            {applications.length === 0 && (
              <BlurView intensity={20} tint="light" style={styles.emptyCard}>
                <Text style={styles.empty}>Nema prijava još.</Text>
              </BlurView>
            )}
            {applications.map((app) => (
              <View key={app.id} style={styles.appCardWrapper}>
                <BlurView intensity={30} tint="light" style={styles.appCard}>
                  <View style={styles.appHeader}>
                    <Text style={styles.appName}>
                      {app.profiles?.username || "Korisnik"}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        app.status === "accepted"
                          ? styles.statusAccepted
                          : app.status === "rejected"
                            ? styles.statusRejected
                            : styles.statusPending,
                      ]}
                    >
                      <Text style={styles.statusText}>{app.status}</Text>
                    </View>
                  </View>

                  {app.status === "pending" && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleUpdateStatus(app.id, "accepted")}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionText}>✓ Prihvati</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleUpdateStatus(app.id, "rejected")}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.rejectText}>✕ Odbij</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </BlurView>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    top: "20%",
    right: "-15%",
    opacity: 0.4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
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
  cardWrapper: {
    marginHorizontal: 24,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 20,
  },
  card: {
    padding: 28,
    backgroundColor: "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    opacity: 0.8,
  },
  icon: {
    marginRight: 12,
  },
  info: {
    fontSize: 15,
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
  applyBtn: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 24,
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
  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    marginBottom: 16,
  },
  emptyCard: {
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  empty: {
    color: "#4A3E3D",
    fontSize: 15,
    opacity: 0.8,
  },
  appCardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  appCard: {
    padding: 16,
    backgroundColor: "transparent",
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusAccepted: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  statusRejected: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  statusPending: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  acceptBtn: {
    backgroundColor: "#1A1A1A",
    height: 38,
    borderRadius: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    height: 38,
    borderRadius: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  rejectText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 13,
  },
});
