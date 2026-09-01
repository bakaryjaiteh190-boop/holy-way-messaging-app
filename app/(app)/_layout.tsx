import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="clock"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="todos"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
