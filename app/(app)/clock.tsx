import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

type TimeZone = {
  name: string;
  label: string;
  offset: number;
};

const TIMEZONES: TimeZone[] = [
  { name: 'UTC', label: 'Coordinated Universal Time', offset: 0 },
  { name: 'EST', label: 'Eastern Standard Time', offset: -5 },
  { name: 'CST', label: 'Central Standard Time', offset: -6 },
  { name: 'MST', label: 'Mountain Standard Time', offset: -7 },
  { name: 'PST', label: 'Pacific Standard Time', offset: -8 },
  { name: 'GMT', label: 'Greenwich Mean Time', offset: 0 },
  { name: 'CET', label: 'Central European Time', offset: 1 },
  { name: 'IST', label: 'Indian Standard Time', offset: 5.5 },
  { name: 'JST', label: 'Japan Standard Time', offset: 9 },
  { name: 'AEST', label: 'Australian Eastern Standard Time', offset: 10 },
  { name: 'NZST', label: 'New Zealand Standard Time', offset: 12 },
];

type ClockTime = {
  timezone: TimeZone;
  hours: string;
  minutes: string;
  seconds: string;
};

export default function WorldClockScreen() {
  const [clocks, setClocks] = useState<ClockTime[]>([]);
  const [selectedTZ, setSelectedTZ] = useState<string[]>(['UTC', 'EST', 'IST', 'JST']);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTZ]);

  function updateTime() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();

    const updatedClocks: ClockTime[] = selectedTZ
      .map((tzName) => {
        const tz = TIMEZONES.find((t) => t.name === tzName);
        if (!tz) return null;

        let hours = utcHours + tz.offset;
        const minutes = utcMinutes;
        const seconds = utcSeconds;

        if (hours < 0) hours += 24;
        if (hours >= 24) hours -= 24;

        return {
          timezone: tz,
          hours: String(Math.floor(hours)).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        };
      })
      .filter((clock): clock is ClockTime => clock !== null);

    setClocks(updatedClocks);
  }

  function toggleTimezone(tzName: string) {
    setSelectedTZ((prev) => {
      if (prev.includes(tzName)) {
        return prev.filter((t) => t !== tzName);
      } else {
        return [...prev, tzName];
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌍 World Clock</Text>
        <Text style={styles.subtitle}>Current time in different zones</Text>
      </View>

      <ScrollView
        style={styles.clocksContainer}
        contentContainerStyle={styles.clocksContent}
        showsVerticalScrollIndicator={false}
      >
        {clocks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⏰</Text>
            <Text style={styles.emptyText}>No timezones selected</Text>
            <Text style={styles.emptySubtext}>Add timezones below</Text>
          </View>
        ) : (
          clocks.map((clock) => (
            <View key={clock.timezone.name} style={styles.clockCard}>
              <View style={styles.clockHeader}>
                <Text style={styles.clockName}>{clock.timezone.name}</Text>
                <Text style={styles.clockLabel}>{clock.timezone.label}</Text>
              </View>
              <View style={styles.digitalDisplay}>
                <Text style={styles.timeText}>
                  {clock.hours}:{clock.minutes}:{clock.seconds}
                </Text>
              </View>
              <View style={styles.clockFooter}>
                <Text style={styles.offsetText}>
                  UTC {clock.timezone.offset >= 0 ? '+' : ''}{clock.timezone.offset}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.divider} />

      <ScrollView
        style={styles.timezonesContainer}
        contentContainerStyle={styles.timezonesContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.selectTitle}>Available Timezones</Text>
        <View style={styles.timezonesGrid}>
          {TIMEZONES.map((tz) => (
            <Pressable
              key={tz.name}
              style={[
                styles.tzButton,
                selectedTZ.includes(tz.name) && styles.tzButtonActive,
              ]}
              onPress={() => toggleTimezone(tz.name)}
            >
              <Text
                style={[
                  styles.tzButtonText,
                  selectedTZ.includes(tz.name) && styles.tzButtonTextActive,
                ]}
              >
                {tz.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  clocksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clocksContent: {
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  clockCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  clockHeader: {
    marginBottom: 12,
  },
  clockName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  clockLabel: {
    fontSize: 12,
    color: '#777',
  },
  digitalDisplay: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#00ff00',
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },
  clockFooter: {
    alignItems: 'center',
  },
  offsetText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  timezonesContainer: {
    maxHeight: 220,
    backgroundColor: '#f5f5f5',
  },
  timezonesContent: {
    padding: 20,
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  timezonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tzButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tzButtonActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  tzButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tzButtonTextActive: {
    color: '#fff',
  },
});
