// lib/GPTHandler.ts
export async function processWithGPT(transcription: string): Promise<string> {
    const prompt = `The user said: "${transcription}". Continue the conversation naturally and then list key bullet points summarizing the main ideas.`;
  
    try {
      const response = await fetch('YOUR_GPT_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_GPT_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 200,
          temperature: 0.7,
          model: 'gpt-4o',
        }),
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.response || '';
      } else {
        console.error('GPT API error:', response.status);
        return 'Error processing conversation.';
      }
    } catch (error) {
      console.error('Error calling GPT API:', error);
      return 'Error connecting to GPT service.';
    }
  }
  