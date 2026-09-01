import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.replace("/(auth)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>The Holy Way</Text>
          <Text style={styles.subtitle}>Create. Connect. Grow. 🙏</Text>
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>⎋</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Welcome to The Holy Way
          </Text>
          <Text style={styles.cardText}>
            A place to create, connect, discover, and grow together.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/(app)/messages")}
          >
            <Text style={styles.buttonText}>💬 Go to Messages</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Coming Soon</Text>

        <View style={styles.feature}>
          <Text style={styles.icon}>🎥</Text>
          <Text style={styles.featureText}>Short Videos</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.icon}>🏢</Text>
          <Text style={styles.featureText}>Business</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.featureText}>AI Creation</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.icon}>🌍</Text>
          <Text style={styles.featureText}>Global Community</Text>
        </View>
      </ScrollView>

      <View style={styles.nav}>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/(app)/home")}
        >
          <Text style={styles.navIcon}>🏠</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>🔎</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert("Create", "Create feature coming soon")}
        >
          <Text style={styles.navIcon}>➕</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/(app)/messages")}
        >
          <Text style={styles.navIcon}>💬</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert("Profile", "Profile feature coming soon")}
        >
          <Text style={styles.navIcon}>👤</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
  },
  subtitle: {
    marginTop: 5,
    color: "#666666",
    fontSize: 15,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#f4f1e8",
    borderRadius: 24,
    padding: 24,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#111",
  },
  cardText: {
    marginTop: 10,
    color: "#666666",
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#111111",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
  },
  icon: {
    fontSize: 25,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
  },
});
