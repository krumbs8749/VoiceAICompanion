// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
// You could also add language selection, etc.

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Dummy toggle - for a real app, you might integrate a context provider for theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    // Save preference locally or via context/state management
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <Text style={[styles.header, colorScheme === 'dark' && styles.headerDark]}>Profile & Settings</Text>
      <View style={styles.row}>
        <Text style={[styles.label, colorScheme === 'dark' && styles.labelDark]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
      {/* More settings like language selection, voice style, etc. */}
      <Button title="Clear History" onPress={() => { /* Implement history clearing */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  containerDark: { backgroundColor: '#000' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  headerDark: { color: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  label: { fontSize: 16, color: '#333' },
  labelDark: { color: '#fff' },
});
