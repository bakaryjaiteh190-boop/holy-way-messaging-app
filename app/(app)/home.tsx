import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppShell, colors, SectionLabel, styles as shared } from './ui';

export default function HomeScreen() {
  return (
    <AppShell title="Home">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>A place to walk together.</Text>
        <SectionLabel>Today</SectionLabel>
        <View style={shared.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={shared.body}>
            Take a moment to connect, share what is on your heart, or continue a conversation.
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 24, paddingBottom: 24 },
  welcome: { color: colors.ink, fontSize: 22, lineHeight: 30, marginBottom: 30 },
  title: { color: colors.ink, fontSize: 18, fontWeight: '700', marginBottom: 8 },
});