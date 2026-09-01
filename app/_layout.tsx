import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(auth)');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.replace('/(app)/home');
        } else {
          router.replace('/(auth)');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(app)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
