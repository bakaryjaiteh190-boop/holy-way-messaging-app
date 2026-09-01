import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
          <Text style={styles.logoutText}>⏻</Text>
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
        </View>

        <Text style={styles.sectionTitle}>Features</Text>

        <Pressable
          style={styles.feature}
          onPress={() => router.push('/(app)/messages')}
        >
          <Text style={styles.icon}>💬</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureText}>Messages</Text>
            <Text style={styles.featureDesc}>Real-time messaging</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push('/(app)/jokes')}
        >
          <Text style={styles.icon}>😂</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureText}>Joke Generator</Text>
            <Text style={styles.featureDesc}>Get random jokes</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push('/(app)/clock')}
        >
          <Text style={styles.icon}>🌍</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureText}>World Clock</Text>
            <Text style={styles.featureDesc}>Multiple timezones</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Coming Soon</Text>

        <View style={styles.featureDisabled}>
          <Text style={styles.icon}>🎥</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureText}>Short Videos</Text>
            <Text style={styles.featureDesc}>Share your moments</Text>
          </View>
        </View>

        <View style={styles.featureDisabled}>
          <Text style={styles.icon}>🏢</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureText}>Business</Text>
            <Text style={styles.featureDesc}>Connect professionally</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.nav}>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/(app)/home')}
        >
          <Text style={styles.navIcon}>🏠</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>🔎</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert('Create', 'Create feature coming soon')}
        >
          <Text style={styles.navIcon}>➕</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/(app)/messages')}
        >
          <Text style={styles.navIcon}>💬</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert('Profile', 'Profile feature coming soon')}
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
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
  },
  subtitle: {
    marginTop: 5,
    color: '#666666',
    fontSize: 15,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f4f1e8',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#111',
  },
  cardText: {
    marginTop: 10,
    color: '#666666',
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  featureDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    opacity: 0.5,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  featureDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
  },
});
