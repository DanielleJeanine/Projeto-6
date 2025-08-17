// ---------------------- Seleção de elementos ----------------------
const apiKeyInput = document.getElementById("api-key");
const saveKeyBtn = document.querySelector(".botao");
const questionInput = document.querySelector(".input-container input");
const askBtn = document.querySelector(".btn-enviar");
const respostaContainer = document.getElementById("respostaContainer");
const respostaTexto = document.getElementById("resposta");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const pdfBtn = document.getElementById("pdfBtn");
const charCount = document.getElementById("charCount");
const historyList = document.getElementById("historyList");
const historicoSection = document.getElementById("historico");
const toggleTheme = document.getElementById("toggleTheme");
const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");
const readSelectedBtn = document.getElementById("readSelected");
const toggleHistory = document.getElementById("toggleHistory");

// Barra de acessibilidade
let fontSize = 16; 
document.documentElement.style.fontSize = fontSize + "px";

// Aumentar e diminuir fonte
increaseFont.addEventListener("click", () => {
  if (fontSize < 30) {
    fontSize += 2;
    document.documentElement.style.fontSize = fontSize + "px";
  }
});

decreaseFont.addEventListener("click", () => {
  if (fontSize > 12) {
    fontSize -= 2;
    document.documentElement.style.fontSize = fontSize + "px";
  }
});

// Dark mode
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Leitor de texto

let isReading = false;
let currentUtterance = null;

readSelectedBtn.addEventListener("click", () => {
  if (!isReading) {
    // Pegar o texto selecionado
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      alert("Selecione algum texto para ler.");
      return;
    }

    currentUtterance = new SpeechSynthesisUtterance(selectedText);
    currentUtterance.lang = "pt-BR";
    currentUtterance.rate = 1;
    currentUtterance.pitch = 1;

  
    currentUtterance.onend = () => {
      isReading = false;
      readSelectedBtn.textContent = "🔊";
    };

    window.speechSynthesis.speak(currentUtterance);
    isReading = true;
    readSelectedBtn.textContent = "⏹️"; 

  } else {
    window.speechSynthesis.cancel();
    isReading = false;
    readSelectedBtn.textContent = "🔊"; 
  }
});


//Exibir histórico
toggleHistory.addEventListener("click", () => {
  if (historicoSection.style.display === "none" || historicoSection.style.display === "") {
    historicoSection.style.display = "block";
    historicoSection.scrollIntoView({ behavior: "smooth" });
  } else {
    historicoSection.style.display = "none";
  }
});

// Salvar histórico com dropdown
function salvarHistorico(pergunta, resposta) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = pergunta; // título da pergunta
  const p = document.createElement("p");
  p.textContent = resposta; // conteúdo da resposta
  details.appendChild(summary);
  details.appendChild(p);
  historyList.appendChild(details);

  historicoSection.style.display = "block";

  // Salvar no localStorage
  let oldHistory = JSON.parse(localStorage.getItem("historico")) || [];
  oldHistory.push({ pergunta, resposta });
  localStorage.setItem("historico", JSON.stringify(oldHistory));
}
// Carregar histórico salvo e API Key salva
window.addEventListener("DOMContentLoaded", () => {
  const savedApiKey = localStorage.getItem("apiKey");
  if (savedApiKey) apiKeyInput.value = savedApiKey;

  const savedHistory = JSON.parse(localStorage.getItem("historico")) || [];
  if (savedHistory.length > 0) {
    savedHistory.forEach(item => {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = item.pergunta;
      const p = document.createElement("p");
      p.textContent = item.resposta;
      details.appendChild(summary);
      details.appendChild(p);
      historyList.appendChild(details);
    });
  }
});

//  Carregar API Key salva
window.addEventListener("DOMContentLoaded", () => {
  const savedApiKey = localStorage.getItem("apiKey");
  if (savedApiKey) apiKeyInput.value = savedApiKey;



// Salvar API Key
saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) return alert("Por favor, insira uma chave de API válida.");
  localStorage.setItem("apiKey", key);
  alert("✅ Chave salva com sucesso!");
});

// Contador de caracteres 
questionInput.addEventListener("input", () => {
  charCount.textContent = `${questionInput.value.length} / 200`;
});

// Detectar provedor 
function detectProvider(apiKey) {
  if (apiKey.startsWith("sk-")) return "openai";
  return "gemini";
}

// Enviar pergunta 
async function enviarPergunta() {
  const apiKey = apiKeyInput.value.trim();
  const question = questionInput.value.trim();

  if (!apiKey) return alert("Por favor, insira sua chave de API!");
  if (!question) return alert("Por favor, escreva uma pergunta!");

  askBtn.disabled = true;
  askBtn.textContent = "⌛";

  try {
    let response, answer;
    const provider = detectProvider(apiKey);

    if (provider === "openai") {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: question }] })
      });
      if (!response.ok) throw new Error("Erro na requisição OpenAI: " + response.status);
      const data = await response.json();
      answer = data.choices[0].message.content;
    } else {
      response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: question }] }] })
      });
      if (!response.ok) throw new Error("Erro na requisição Gemini: " + response.status);
      const data = await response.json();
      answer = data.candidates[0].content.parts[0].text;
    }

    // Exibir resposta
    respostaTexto.innerHTML = marked.parse(answer);
    respostaContainer.style.display = "block";
    respostaContainer.scrollIntoView({ behavior: "smooth" });
    askBtn.innerHTML = '<img src="assets/botao.svg" alt="Enviar" />';

    // Salvar histórico
    salvarHistorico(question, answer);

  } catch (error) {
    respostaTexto.textContent = "❌ Ocorreu um erro: " + error.message;
    respostaContainer.style.display = "block";
  } finally {
    askBtn.disabled = false;
  }
}

// Eventos de envio
askBtn.addEventListener("click", enviarPergunta);
questionInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarPergunta();
  }
});

// Copiar resposta 
copyBtn.addEventListener("click", () => {
  const text = respostaTexto.textContent;
  if (!text) return alert("Não há resposta para copiar.");
  navigator.clipboard.writeText(text).then(() => alert("Resposta copiada!"))
    .catch(err => alert("❌ Falha ao copiar: " + err));
});

// Limpar resposta 
clearBtn.addEventListener("click", () => {
  questionInput.value = "";
  respostaTexto.textContent = "";
  respostaContainer.style.display = "none";
  askBtn.disabled = false;
  askBtn.innerHTML = '<img src="assets/botao.svg" alt="Enviar" />';
  charCount.textContent = "0 / 200";
});

// Exportar PDF formatado
pdfBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pergunta = questionInput.value || "(sem pergunta)";
  const resposta = respostaTexto.textContent || "(sem resposta)";

  // Adiciona a logo no PDF
  const logoImg = document.querySelector(".logo");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = logoImg.naturalWidth;
  canvas.height = logoImg.naturalHeight;
  ctx.drawImage(logoImg, 0, 0);
  const imgData = canvas.toDataURL("image/png");
  doc.addImage(imgData, "PNG", 10, 10, 50, 20);

 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor("#c94cb5");
  doc.text(" a.IA - Assistente Virtual", 70, 20);

  // Linha separadora em magenta claro
  doc.setDrawColor(201, 76, 181); // #c94cb5
  doc.setLineWidth(0.7);
  doc.line(10, 35, 200, 35);

  let y = 45;

  // Pergunta (título)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#c94cb5");
  doc.text("Pergunta:", 10, y);
  y += 6;

// Pergunta (texto)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor("#333333");
  const perguntaLines = doc.splitTextToSize(pergunta, 190);
  perguntaLines.forEach(line => {
    if (y > 280) { // nova página
      doc.addPage();
      y = 20;
    }
    doc.text(line, 10, y);
    y += 6;
  });

  // Linha separadora neutra
  if (y > 280) {
    doc.addPage();
    y = 20;
  }
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(10, y, 200, y);
  y += 8;


  // Resposta (título)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#c94cb5");
  doc.text("Resposta:", 10, y);
  y += 6;

  // Resposta (texto) com quebra de página
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor("#555555");
  const respostaLines = doc.splitTextToSize(resposta, 190);
  respostaLines.forEach(line => {
    if (y > 280) { // nova página
      doc.addPage();
      y = 20;
    }
    doc.text(line, 10, y);
    y += 6;
  });

  // Salvar PDF
  doc.save("conversa_IA.pdf");
});

}); 