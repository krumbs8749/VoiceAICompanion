// lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = 'voice_ai_sessions';

export const saveSession = async (session: any) => {
  try {
    const existingSessions = await getSessions();
    const sessions = existingSessions ? [...existingSessions, session] : [session];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const getSessions = async (): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};
