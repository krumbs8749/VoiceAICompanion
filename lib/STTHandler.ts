// lib/STTHandler.ts
export async function sendAudioForTranscription(fileUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: 'voice.wav',
      type: 'audio/wav',
    } as any);
  
    try {
      const response = await fetch('YOUR_SPEECH_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any additional headers required by your API (e.g., API keys)
        },
        body: formData,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.transcription || '';
      } else {
        console.error('STT API error:', response.status);
        return '';
      }
    } catch (error) {
      console.error('Error sending audio for transcription:', error);
      return '';
    }
  }
  