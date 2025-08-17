# a.IA - Assistente Virtual

![Banner](assets/demo-banner.png)

## Visão Geral
**a.IA** é um assistente virtual desenvolvido para fornecer respostas rápidas e úteis para dúvidas do dia a dia. Ele integra APIs de geração de conteúdo (OpenAI e Gemini), permitindo consultas inteligentes com histórico, leitura de respostas, ajuste de fonte e suporte a modo claro/escuro.

O projeto foi desenvolvido com foco em **acessibilidade**, oferecendo recursos que permitem fácil interação para todos os tipos de usuários.

---

## Funcionalidades Principais

- **Envio de perguntas** via API (OpenAI ou Gemini)  
- **Histórico de perguntas** em dropdown para melhor organização  
- **Ajuste de fonte**: aumente ou diminua o tamanho do texto  
- **Modo claro/escuro** para conforto visual  
- **Exportação de conversas em PDF** com logo e cores magenta destacadas  
- **Copiar respostas** para a área de transferência  
- **Limpar campos** de pergunta e resposta  
- **Leitura de respostas** com botão de iniciar/parar  
- **Contador de caracteres** para perguntas  
- **Responsivo** para diferentes dispositivos  

---


## Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript (Vanilla)**
- [jsPDF](https://github.com/parallax/jsPDF) para exportação de PDF
- APIs de geração de conteúdo:
  - OpenAI GPT-3.5
  - Gemini (Google)
- Fontes acessíveis: **Atkinson Hyperlegible**, **Sora**
- Cores do projeto: magenta #c94cb5, tons neutros e dark mode cinza escuro

---

## Instalação

1. Clone o repositório:

bash
git clone https://github.com/seu-usuario/a.IA.git

2. Abra o projeto em seu navegador:

Abrir index.html diretamente, ou

Configurar um servidor local (recomendado para fetch API)

---

## Uso

Insira sua chave de API (OpenAI ou Gemini) na interface.

Inserir pergunta: Digite no campo de texto.

Enviar: Clique no botão enviar ou pressione Enter.

Visualizar resposta: A resposta aparece na área de resposta, com Markdown renderizado.

Copiar texto : Clique no botão 📋 para copiar o texto de resposta para a área de trabalho.

Limpar texto: Clique no botão 🗑️ para limpar pergunta e resposta.

Exportar PDF: Clique no botão 📄 para salvar a conversa em um pdf formatado.

Histórico: Clique no botão "Histórico" para ver todas as perguntas feitas.

Acessibilidade: Ajuste a fonte e alterne entre modo claro e escuro.

Leitura de texto: Selecione texto na resposta e clique no botão 🔊 para ler, ou ⏹️ para parar.

---

## Estrutura do projeto

├─ index.html          # Página principal
├─ style.css           # Estilos CSS
├─ script.js           # Lógica JavaScript
├─ assets/             # Imagens e logo
└─ README.md

---

## Equipe de Desenvolvimento

[Carla Matos](https://github.com/carlapw) - Estrutura HTML
[Danielle Jeanine](https://github.com/DanielleJeanine) – Script de Acessibilidade
[Ítalo Feitosa](https://github.com/Itajen) – Integração de APIs
[Thiago dos Reis](https://github.com/tchaaago) – UI/UX e design responsivo

---

## Sugestões de Futuras Melhorias

- Suporte a múltiplos idiomas
- Exportação de PDF do histórico
- Sistema de login para múltiplos usuários com histórico separado