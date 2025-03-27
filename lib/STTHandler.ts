export async function sendAudioForTranscription(fileUri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: 'audio.wav',
    type: 'audio/wav',
  } as any);
  formData.append('model', 'whisper-1'); // Required by OpenAI Whisper

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
      },
      body: formData,
    });

    const raw = await response.text();
    console.log('Whisper raw response:', raw);

    if (response.ok) {
      const jsonResponse = JSON.parse(raw);
      return jsonResponse.text || '';
    } else {
      console.error('Whisper API error:', response.status, raw);
      return '';
    }
  } catch (error) {
    console.error('Error sending audio to Whisper:', error);
    return '';
  }
}
