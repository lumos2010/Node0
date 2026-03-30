export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { messages } = await req.json();
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      // Exact parameters translated from your Python script
      body: JSON.stringify({
        model: "qwen/qwen3-next-80b-a3b-thinking",
        messages: messages,
        temperature: 0.6,
        top_p: 0.7,
        max_tokens: 4096,
        stream: true
      })
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

