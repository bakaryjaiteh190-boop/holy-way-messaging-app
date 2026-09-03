import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(auth)');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          router.replace('/(app)/home');
        } else {
          router.replace('/(auth)');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [router]);

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
