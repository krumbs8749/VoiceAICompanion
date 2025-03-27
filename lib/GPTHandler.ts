export async function processWithGPT(transcription: string): Promise<{ response: string; notes: string[] }> {
  const prompt = `The user said: "${transcription}".
Analyse the transcription and extract 2–5 bullet points summarizing key ideas.
Respond ONLY with a valid JSON object in the following format (no extra characters):
{"response": "Title extracted from the conversation.", "notes": ["Note 1", "Note 2"]}`;

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const fullResponse = await apiResponse.json();
    console.log("GPT full response:", fullResponse);

    // Extract the content from the first choice
    const contentStr = fullResponse.choices?.[0]?.message?.content;
    if (!contentStr) {
      throw new Error("No content received from GPT.");
    }

    // Parse the content string as JSON.
    const parsed = JSON.parse(contentStr);
    return {
      response: parsed.response || 'No response',
      notes: parsed.notes || [],
    };
  } catch (error) {
    console.error('GPT handler error:', error);
    return { response: 'Failed to get response.', notes: [] };
  }
}
