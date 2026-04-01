type ChatMode = "anthropic" | "gemini" | "mock";

type ChatHealth = {
  ok: boolean;
  chatMode: string;
  resolvedMode: ChatMode;
  providers: {
    anthropicConfigured: boolean;
    geminiConfigured: boolean;
  };
  warnings: string[];
};

function resolveMode(
  chatMode: string,
  anthropicConfigured: boolean,
  geminiConfigured: boolean,
): { resolvedMode: ChatMode; warnings: string[] } {
  const warnings: string[] = [];

  if (chatMode === "mock") {
    return { resolvedMode: "mock", warnings };
  }

  if (chatMode === "anthropic") {
    if (!anthropicConfigured) {
      warnings.push("CHAT_MODE=anthropic but ANTHROPIC_API_KEY is missing.");
      return { resolvedMode: "mock", warnings };
    }
    return { resolvedMode: "anthropic", warnings };
  }

  if (chatMode === "gemini") {
    if (!geminiConfigured) {
      warnings.push("CHAT_MODE=gemini but GEMINI_API_KEY is missing.");
      return { resolvedMode: "mock", warnings };
    }
    return { resolvedMode: "gemini", warnings };
  }

  if (chatMode !== "auto") {
    warnings.push("Invalid CHAT_MODE value. Supported: auto, mock, gemini, anthropic.");
  }

  if (anthropicConfigured) return { resolvedMode: "anthropic", warnings };
  if (geminiConfigured) return { resolvedMode: "gemini", warnings };

  warnings.push("No provider keys configured. Falling back to mock mode.");
  return { resolvedMode: "mock", warnings };
}

export async function GET() {
  const chatMode = (process.env.CHAT_MODE ?? "auto").trim().toLowerCase();
  const anthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  const { resolvedMode, warnings } = resolveMode(
    chatMode,
    anthropicConfigured,
    geminiConfigured,
  );

  const payload: ChatHealth = {
    ok: warnings.length === 0,
    chatMode,
    resolvedMode,
    providers: {
      anthropicConfigured,
      geminiConfigured,
    },
    warnings,
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
