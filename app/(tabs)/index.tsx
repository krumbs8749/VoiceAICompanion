import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/misc/HelloWave';
import ParallaxScrollView from '@/components/misc/ParallaxScrollView';
import { ThemedText } from '@/components/misc/ThemedText';
import { ThemedView } from '@/components/misc/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            // Change the source to your AI Companion logo or preferred image.
            source={require('@/assets/images/ai-companion-logo.png')}
            style={styles.logo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to AI Companion!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Chat with Your AI</ThemedText>
          <ThemedText>
            Head over to the Chat tab, press the record button, and start a conversation. Your voice is transformed into a rich, interactive dialogue!
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Review Past Sessions</ThemedText>
          <ThemedText>
            Visit the Notes tab to review historical chats and key takeaways. Every session is saved for you to revisit anytime.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Customize Your Experience</ThemedText>
          <ThemedText>
            In the Profile tab, adjust settings like theme, language, and more to tailor the experience to your needs.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  logo: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
