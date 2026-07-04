import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      label: "Turniri",
      path: "/tournaments",
      icon: "trophy-outline",
      activeIcon: "trophy",
    },
    {
      label: "Moji",
      path: "/my-tournaments",
      icon: "person-outline",
      activeIcon: "person",
    },
    {
      label: "Prijave",
      path: "/my-applications",
      icon: "document-text-outline",
      activeIcon: "document-text",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={60} tint="light" style={styles.container}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <TouchableOpacity
              key={tab.path}
              style={styles.tab}
              onPress={() => router.push(tab.path)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={20}
                color={isActive ? "#111" : "#4A3E3D"}
                style={styles.icon}
              />
              <Text style={[styles.label, isActive && styles.active]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
    paddingBottom: 28,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 4,
    opacity: 0.85,
  },
  label: {
    fontSize: 11,
    color: "#4A3E3D",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  active: {
    color: "#111",
    fontWeight: "600",
  },
});
