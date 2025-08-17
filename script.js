// Seleciona elementos do HTML
const apiKeyInput = document.getElementById("api-key");
const saveKeyBtn = document.querySelector(".botao");
const questionInput = document.querySelector(".input-container input");
const askBtn = document.querySelector(".btn-enviar");
const respostaContainer = document.getElementById("respostaContainer");
const respostaTexto = document.getElementById("resposta");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const pdfBtn = document.getElementById("pdfBtn");

// 🔑 Carregar API Key salva no localStorage ao iniciar
window.addEventListener("DOMContentLoaded", () => {
  const savedApiKey = localStorage.getItem("apiKey");
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }
});

// 💾 Salvar API Key no localStorage quando clicar no botão ao lado do campo
saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert("Por favor, insira uma chave de API válida.");
    return;
  }
  localStorage.setItem("apiKey", key);
  alert("✅ Chave salva com sucesso!");
});

// Detecta se a chave é da OpenAI ou do Gemini
function detectProvider(apiKey) {
  if (apiKey.startsWith("sk-")) {
    return "openai";
  }
  return "gemini";
}

// Função para enviar pergunta
async function enviarPergunta() {
  const apiKey = apiKeyInput.value.trim();
  const question = questionInput.value.trim();

  if (!apiKey) {
    alert("Por favor, insira sua chave de API!");
    return;
  }
  if (!question) {
    alert("Por favor, escreva uma pergunta!");
    return;
  }

  // Estado de carregamento
  askBtn.disabled = true;
  askBtn.textContent = "⌛";

  try {
    let response, answer;
    const provider = detectProvider(apiKey);

    if (provider === "openai") {
      // 🔹 OpenAI
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: question }]
        })
      });

      if (!response.ok) throw new Error("Erro na requisição OpenAI: " + response.status);
      const data = await response.json();
      answer = data.choices[0].message.content;

    } else {
      // 🔹 Gemini
      response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: question }]
            }
          ]
        })
      });

      if (!response.ok) throw new Error("Erro na requisição Gemini: " + response.status);
      const data = await response.json();
      answer = data.candidates[0].content.parts[0].text;
    }

    // Exibir resposta
    respostaTexto.textContent = answer;
    respostaContainer.style.display = "block";

  } catch (error) {
    respostaTexto.textContent = "❌ Ocorreu um erro: " + error.message;
    respostaContainer.style.display = "block";
  }

  // Reset do botão
  askBtn.disabled = false;
  askBtn.textContent = "→";
  questionInput.value = "";
}

// 📌 Eventos de envio
askBtn.addEventListener("click", enviarPergunta);
questionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarPergunta();
  }
});

// 📋 Copiar resposta
copyBtn.addEventListener("click", () => {
  const text = respostaTexto.textContent;
  if (!text) {
    alert("Não há resposta para copiar.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("📋 Resposta copiada!");
  }).catch(err => {
    alert("❌ Falha ao copiar: " + err);
  });
});

// 🗑️ Limpar pergunta + resposta
clearBtn.addEventListener("click", () => {
  questionInput.value = "";
  respostaTexto.textContent = "";
  respostaContainer.style.display = "none";
});

// 📄 Exportar PDF
pdfBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pergunta = questionInput.textContent || "(sem pergunta)";
  const resposta = respostaTexto.textContent || "(sem resposta)";

  let conteudo = `🤖 a.IA - Conversa\n\nPergunta:\n${pergunta}\n\nResposta:\n${resposta}`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(conteudo, 10, 10);

  doc.save("conversa.pdf");
});

