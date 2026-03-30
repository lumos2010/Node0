export const config = {
  runtime: 'edge', // Edge runtime is required for fast streaming
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { messages } = await req.json();
    
    // Grabs your key from Vercel settings, or uses the one you provided as a fallback
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
        model: "z-ai/glm5",
        messages: messages,
        temperature: 1,
        top_p: 1,
        max_tokens: 16384,
        stream: true,
        // In fetch, extra_body args go directly into the root JSON payload
        chat_template_kwargs: { enable_thinking: true, clear_thinking: false }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(`NVIDIA API Error: ${errText}`, { status: response.status });
    }

    // Pipe the live stream directly to the frontend
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


