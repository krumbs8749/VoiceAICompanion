// app/(tabs)/notes.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getSessions } from '../../lib/storage';
import { useColorScheme } from 'react-native';

export default function NotesScreen() {
  const [sessions, setSessions] = useState<any[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchSessions = async () => {
      const storedSessions = await getSessions();
      setSessions(storedSessions || []);
    };
    fetchSessions();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, colorScheme === 'dark' && styles.cardDark]}>
      <Text style={[styles.cardTitle, colorScheme === 'dark' && styles.cardTitleDark]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      <Text style={[styles.cardText, colorScheme === 'dark' && styles.cardTextDark]}>
        {item.notes.join('\n')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={[styles.emptyText, colorScheme === 'dark' && styles.emptyTextDark]}>No sessions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  containerDark: { backgroundColor: '#000' },
  card: { padding: 16, marginVertical: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  cardDark: { backgroundColor: '#222' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  cardTitleDark: { color: '#fff' },
  cardText: { marginTop: 8, fontSize: 14, color: '#555' },
  cardTextDark: { color: '#ccc' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  emptyTextDark: { color: '#aaa' },
});
