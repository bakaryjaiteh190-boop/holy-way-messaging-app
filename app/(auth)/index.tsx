import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AuthScreen() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  async function signIn() { if (!email || !password) return Alert.alert('Sign in', 'Enter your email and password.'); setLoading(true); const { error } = await supabase.auth.signInWithPassword({ email, password }); setLoading(false); if (error) Alert.alert('Sign in failed', error.message); else router.replace('/(app)/home'); }
  return <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.mark}>HOLY WAY</Text><Text style={styles.title}>Come as you are.</Text><Text style={styles.body}>A gentle space for faith, friendship, and honest conversation.</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" placeholderTextColor="#89877F" value={email} onChangeText={setEmail} style={styles.input} /><TextInput secureTextEntry placeholder="Password" placeholderTextColor="#89877F" value={password} onChangeText={setPassword} style={styles.input} /><Pressable onPress={signIn} style={styles.button} disabled={loading}><Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text></Pressable></View></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F8F5EE' }, container: { flex: 1, justifyContent: 'center', padding: 28 }, mark: { color: '#B88645', fontSize: 13, fontWeight: '800', letterSpacing: 2, marginBottom: 30 }, title: { color: '#20251F', fontSize: 38, fontWeight: '700' }, body: { color: '#73786F', fontSize: 16, lineHeight: 24, marginTop: 12, marginBottom: 34 }, input: { backgroundColor: '#FFFDF8', borderColor: '#E5E2D8', borderWidth: 1, padding: 15, marginBottom: 12, color: '#20251F' }, button: { backgroundColor: '#2F5D50', padding: 16, alignItems: 'center', marginTop: 8 }, buttonText: { color: '#FFFFFF', fontWeight: '700' } });
