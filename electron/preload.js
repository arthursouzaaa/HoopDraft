// Sem IPC por enquanto (lógica pura roda no renderer).
// Mantido para boas práticas de segurança do Electron.
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-electron", "true");
});