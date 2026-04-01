import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are an AI assistant for Oussema Aouini, an engineering student at MSE Tunisia specializing in AI and web development. Answer only questions about his profile. Be friendly and concise.

Key facts:
- Education: Cycle Ingénieur at MSE (2025-2028), Bachelor IT at ISET (2022-2025)
- Internships: Arabsoft (Angular UI, Jan-Feb 2024), MajestEye (Chess bot ELO~1200 + YOLOv3, Jun-Aug 2024), MajestEye (Nomos RAG chatbot 80%+ accuracy, Feb-Jun 2025)
- Projects: Nomos (RAG+FAISS+LangChain+Next.js, 80%+ QA accuracy), Wadden Sea Dashboard (GIS+Python), Chess Bot (Minimax+Pygame, ELO~1200)
- Skills: Python, JS, Next.js, React, Angular, Tailwind, LangChain, HuggingFace, FAISS, TensorFlow, RAG, NLP, Docker, Git
- Languages: Arabic (native), French (proficient), English (fluent)
- Open to internships in AI and/or web development
- Email: oussema.aouini2003@gmail.com
- Location: Tunis, Tunisia`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 400,
      temperature: 0.7,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("Groq API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



