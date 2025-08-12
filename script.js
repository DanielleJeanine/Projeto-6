// API da OpenAI
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const form = document.querySelector("form");
const inputPergunta = document.querySelector("#pergunta");
const btnPerguntar = document.querySelector("#btn-perguntar");
const respostaEl = document.querySelector("#resposta");
const statusEl = document.querySelector("#status");
const copiarBtn = document.querySelector("#copiar");

function mostrarStatus(msg, tipo = "info") {
    statusEl.textContent = msg;
    statusEl.className = tipo; 
}

function salvarHistorico(pergunta, resposta) {
    const historico = JSON.parse(localStorage.getItem("historico")) || [];
    historico.push({ pergunta, resposta, data: new Date().toISOString() });
    localStorage.setItem("historico", JSON.stringify(historico));
}

async function fazerPergunta(pergunta) {
    try {
        mostrarStatus("Consultando IA...", "info");
        btnPerguntar.disabled = true;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: pergunta }]
            })
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();
        const resposta = data.choices[0].message.content.trim();

        respostaEl.textContent = resposta;
        mostrarStatus("Resposta recebida ✔", "sucesso");

        salvarHistorico(pergunta, resposta);

    } catch (erro) {
        console.error(erro);
        mostrarStatus("Ocorreu um erro ao consultar a IA.", "erro");
        respostaEl.textContent = "";
    } finally {
        btnPerguntar.disabled = false;
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pergunta = inputPergunta.value.trim();
    if (!pergunta) {
        mostrarStatus("Digite uma pergunta antes de enviar.", "erro");
        return;
    }

    fazerPergunta(pergunta);
});

copiarBtn.addEventListener("click", () => {
    const texto = respostaEl.textContent;
    if (!texto) return;

    navigator.clipboard.writeText(texto)
        .then(() => mostrarStatus("Resposta copiada para a área de transferência!", "sucesso"))
        .catch(() => mostrarStatus("Erro ao copiar.", "erro"));
});

