import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RealtimeConnection() {
  const colorScheme = useColorScheme();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  // Helper to append log messages
  const appendLog = (msg: string) => {
    setLog((prev) => prev + '\n' + msg);
    console.log(msg);
  };

  // Fetch ephemeral API key from your server
  const fetchEphemeralKey = async (): Promise<string> => {
    try {
      const res = await fetch('http://localhost:3000/session'); // update URL accordingly
      const data = await res.json();
      console.log(data)
      return data.client_secret.value;
    } catch (error) {
      appendLog('Error fetching ephemeral key: ' + error);
      throw error;
    }
  };

  // Connect using WebSocket with ephemeral key via query parameters
  const connectWebSocket = async () => {
    setLoading(true);
    try {
      const ephemeralKey = await fetchEphemeralKey();
      appendLog('Ephemeral key received.');

      // Build the WebSocket URL with query parameters.
      const baseUrl = 'wss://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      const url = `${baseUrl}?model=${model}` +
        `&authorization=Bearer%20${encodeURIComponent(ephemeralKey)}` +
        `&OpenAI-Beta=realtime%3Dv1`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        appendLog("WebSocket connected");
        setConnected(true);
        setLoading(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, JSON.stringify(data)]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        appendLog("WebSocket error: " + JSON.stringify(error));
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        appendLog("WebSocket closed: " + event.code + " " + event.reason);
        setConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setLoading(false);
    }
  };

  const disconnectWebSocket = () => {
    wsRef.current?.close();
    setConnected(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, colorScheme === 'dark' && styles.titleDark]}>
          Realtime via WebSocket
        </Text>
        {loading && <ActivityIndicator size="small" color="#00ccff" />}
      </View>
      <View style={styles.buttonContainer}>
        {!connected ? (
          <Button title="Connect" onPress={connectWebSocket} />
        ) : (
          <Button title="Disconnect" onPress={disconnectWebSocket} />
        )}
      </View>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={[styles.message, colorScheme === 'dark' && styles.messageDark]}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.logContainer}>
        <Text style={styles.logText}>{log}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  messageDark: {
    color: '#fff',
  },
  logContainer: {
    marginTop: 10,
  },
  logText: {
    fontSize: 12,
    color: '#666',
  },
});
