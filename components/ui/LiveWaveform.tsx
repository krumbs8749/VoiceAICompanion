import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const barCount = 20;
const updateInterval = 150;

interface Props {
  recordingRef: React.MutableRefObject<any>;
  isRecording: boolean;
}

export default function LiveWaveform({ recordingRef, isRecording }: Props) {
  const colorScheme = useColorScheme();
  const barHeights = useRef(
    Array.from({ length: barCount }).map(() => useSharedValue(10))
  ).current;

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (isRecording) {
      interval = setInterval(async () => {
        try {
          const status = await recordingRef.current?.getStatusAsync();
          const volumeDb = status?.metering ?? -160; // -160 (silent) to 0 (max)
          const volume = Math.max(0, 1 + volumeDb / 60); // Normalize to [0,1]

          for (let i = 0; i < barCount; i++) {
            const height = Math.max(10, volume * (Math.random() * 80 + 20));
            barHeights[i].value = withTiming(height, { duration: updateInterval - 20 });
          }
        } catch (e) {
          // fail silently
        }
      }, updateInterval);
    }

    return () => interval && clearInterval(interval);
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100" viewBox="0 0 400 100">
        {barHeights.map((height, i) => {
          const animatedProps = useAnimatedProps(() => ({
            y: 100 - height.value,
            height: height.value,
          }));
          return (
            <AnimatedRect
              key={i}
              animatedProps={animatedProps}
              x={i * (400 / barCount)}
              width={8}
              rx={4}
              fill={colorScheme === 'dark' ? '#00ffff' : '#00aaff'}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
