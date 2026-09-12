import { NextRequest, NextResponse } from "next/server";

const systemPrompt = `Você é o assistente principal da plataforma IA LUCRATIVA. Responda sempre em português do Brasil, de forma prática, clara e organizada. Entregue passos acionáveis, exemplos e uma conclusão objetiva. Nunca invente dados reais.`;

export async function POST(request: NextRequest) {
  try {
    const { tool, input } = await request.json();
    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Informe uma ideia ou objetivo." }, { status: 400 });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({
        demo: true,
        text: demo(tool, input),
        message: "Modo demonstração: configure OPENAI_API_KEY para respostas com IA real."
      });
    }

    const prompt = `${systemPrompt}\n\nFerramenta: ${tool}\nPedido do usuário: ${input}\n\nGere a melhor resposta para esta ferramenta.`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ error: `Não foi possível gerar a resposta. ${details}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Não foi possível gerar uma resposta.";
    return NextResponse.json({ demo: false, text });
  } catch {
    return NextResponse.json({ error: "Erro ao processar sua solicitação." }, { status: 500 });
  }
}

function demo(tool: string, input: string) {
  const base = `Para "${input}", use esta abordagem:`;
  const maps: Record<string, string> = {
    "Criador de Conteúdo": `${base}\n\n1. Defina um público específico.\n2. Crie 3 pilares de conteúdo: educação, prova e oferta.\n3. Publique conteúdos curtos com uma chamada para ação.\n4. Meça salvamentos, comentários e conversões.`,
    "Estratégias": `${base}\n\n• Público: identifique um problema urgente.\n• Oferta: entregue uma solução simples e clara.\n• Aquisição: conteúdo + indicação + prospecção.\n• Meta: teste por 30 dias e ajuste semanalmente.`,
    "Ideias de Negócios": `${base}\n\nIdeia 1: serviço especializado por assinatura.\nIdeia 2: produto digital de baixo custo.\nIdeia 3: consultoria rápida com diagnóstico.\n\nValide conversando com 10 potenciais clientes antes de investir.`,
    "Gerador de Prompts": `Prompt sugerido:\n\n"Atue como um especialista em negócios digitais. Analise ${input} e crie um plano prático com público-alvo, oferta, canais de aquisição, conteúdo e próximos passos."`,
    "Biblioteca de Prompts": `Prompts para ${input}:\n\n1. "Crie 10 ideias de conteúdo para ${input}."\n2. "Monte uma oferta irresistível para ${input}."\n3. "Crie um plano de vendas de 30 dias para ${input}."`,
    "Automações": `${base}\n\nAutomação 1: captar leads em formulário.\nAutomação 2: enviar resposta inicial automática.\nAutomação 3: organizar contatos por interesse.\nAutomação 4: criar lembretes de acompanhamento.`
  };
  return maps[tool] || `${base}\n\nDefina o objetivo, execute uma primeira ação hoje e acompanhe os resultados.`;
}
