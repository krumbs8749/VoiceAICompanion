import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VoiceRecorder from '@/components/ui/VoiceRecorder';
import { sendAudioForTranscription } from '@/lib/STTHandler';
import { processWithGPT } from '@/lib/GPTHandler';
import { saveSession } from '@/lib/storage';

export default function YappingScreen() {
  const [transcript, setTranscript] = useState(''); 
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRecordingFinish = async (uri: string) => {
    setLoading(true);
    try {
      // Get the transcription via Whisper API (forced to English, etc.)
      const transcription = await sendAudioForTranscription(uri);
      setTranscript(transcription);

      // Process the transcription with GPT to extract key notes
      const result = await processWithGPT(transcription);
      setNotes(result.notes || []);

      // Save session data (timestamp, transcription, notes)
      const sessionData = {
        timestamp: new Date().toISOString(),
        transcription,
        notes: result.notes || [],
      };
      await saveSession(sessionData);
    } catch (err) {
      console.error('Error processing conversation:', err);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
          {loading && <ActivityIndicator size="large" color="#00ccff" />}
          {transcript !== '' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Transcript</Text>
              <Text style={styles.transcript}>{transcript}</Text>
            </View>
          )}
          {notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Notes</Text>
              {notes.map((note, idx) => (
                <Text key={idx} style={styles.noteItem}>• {note}</Text>
              ))}
            </View>
          )}
        </ScrollView>

        {/* VoiceRecorder captures your conversation */}
        <VoiceRecorder onFinish={handleRecordingFinish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: '10%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
    color: '#ffffff',
  },
  transcript: {
    fontSize: 16,
    color: '#ffffff',
  },
  noteItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#ffffff',
  },
});
