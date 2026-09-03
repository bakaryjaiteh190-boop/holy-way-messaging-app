import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppShell, colors, SectionLabel, styles as shared } from './ui';
export default function ActivityScreen() { return <AppShell title="Activity"><ScrollView contentContainerStyle={styles.content}><SectionLabel>Recent activity</SectionLabel><View style={shared.card}><Text style={styles.title}>Your community is quiet here.</Text><Text style={shared.body}>When people respond to your reflections or connect with you, you will find it here.</Text></View></ScrollView></AppShell>; }
const styles = StyleSheet.create({ content: { paddingTop: 28 }, title: { color: colors.ink, fontSize: 18, fontWeight: '700', marginBottom: 8 } });
