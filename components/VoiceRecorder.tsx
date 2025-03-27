import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';
import { Audio } from 'expo-av';
import LiveWaveform from './LiveWaveform'; // Make sure path is correct

export default function VoiceRecorder({ onFinish }: { onFinish: (uri: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Microphone access is required.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
        },
        isMeteringEnabled: true, // ✅ This is required!
      });

      await recording.startAsync();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setIsRecording(false);
      setRecordedUri(uri);
      if (uri) onFinish(uri);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <Text style={[styles.status, colorScheme === 'dark' && styles.statusDark]}>
        {isRecording ? 'Recording...' : 'Tap to Start'}
      </Text>

      {isRecording && (
        <LiveWaveform recordingRef={recordingRef} isRecording={isRecording} />
      )}

      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
        color={colorScheme === 'dark' ? 'white' : 'black'}
      />

      {recordedUri && (
        <Text style={[styles.uriText, colorScheme === 'dark' && styles.uriTextDark]}>
          Saved: {recordedUri}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  status: {
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
  statusDark: {
    color: '#fff',
  },
  uriText: {
    marginTop: 16,
    fontSize: 12,
    color: 'gray',
  },
  uriTextDark: {
    color: 'lightgray',
  },
});
