# 🏀 HoopDraft

> **NBA Draft & Playoff Simulator** — monte seu time dos sonhos com jogadores lendários da NBA (2010–2020) e vença os playoffs.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Vite-blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

---

## ✨ Sobre

**HoopDraft** é um jogo desktop onde você **sorteia elencos históricos da NBA** (time + temporada), escolhe **6 jogadores** (PG, SG, SF, PF, C e 6º homem) e simula **playoffs no formato real da NBA** até conquistar o título.

Cada partida é simulada **posse a posse**, gerando **box score por jogador**, com **cansaço**, **fator casa** e **zebra** — nada de "quem tem overall maior vence".

---

## 🎮 Como funciona

1. **Draft** — a cada rodada o jogo sorteia um time + ano (ex.: `GSW 2016`). Você escolhe 1 jogador do elenco para preencher um slot.
2. **Rerolls** — 1 de **time** (mantém o ano), 1 de **ano** (mantém o time). Reroll grátis se não houver jogador elegível.
3. **Playoffs** — bracket de 16 times, séries melhor-de-7 (2-2-1-1-1), com fator casa.
4. **Simulação** — cada partida gera placar por quarto, box score e MVP.

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Desktop | Electron 31 |
| UI | React 18 + Vite 5 + Tailwind CSS 3 |
| Animação | Framer Motion |
| Estado | Zustand |
| Testes | Vitest |
| Empacotamento | electron-builder |

**Arquitetura em camadas:** toda a lógica pura (ratings, draft, simulação, playoffs) vive em `src/core/` — sem dependência do Electron — e é testável no Node.

---

## 🚀 Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo dev (Vite + Electron juntos)
npm run dev

# 3. Rodar os testes da lógica
npm test

# 4. (Opcional) Baixar dados reais da ESPN (2010–2020)
npm run fetch-data

# 5. Empacotar instalador
npm run dist