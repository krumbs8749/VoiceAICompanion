// app/(tabs)/chat.tsx
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import VoiceRecorder from '../../components/VoiceRecorder';
import { sendAudioForTranscription } from '../../lib/STTHandler';
import { processWithGPT } from '../../lib/GPTHandler';
import { saveSession } from '../../lib/storage';
import { useColorScheme } from 'react-native';

export default function ChatScreen() {
  const [gptResponse, setGptResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleRecordingFinish = async (audioUri: string) => {
    setLoading(true);
    const transcription = await sendAudioForTranscription(audioUri);
    const gptText = await processWithGPT(transcription);
    setGptResponse(gptText);
    
    // Save the session (MVP using local storage)
    const sessionData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mode: 'chat',
      transcription,
      aiResponse: gptText,
      notes: extractNotes(gptText), // Assume a helper that extracts bullet points
    };
    await saveSession(sessionData);

    setLoading(false);
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <VoiceRecorder onFinish={handleRecordingFinish} />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={[styles.title, colorScheme === 'dark' && styles.titleDark]}>AI Companion</Text>
          <Text style={[styles.response, colorScheme === 'dark' && styles.responseDark]}>{gptResponse}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  response: {
    fontSize: 16,
    color: '#555',
  },
  responseDark: {
    color: '#ccc',
  },
});
  
// Dummy helper for note extraction (replace with your logic)
const extractNotes = (gptText: string): string[] => {
  // For example, split by newline or bullet point
  return gptText.split('\n').filter((line) => line.trim() !== '');
};
