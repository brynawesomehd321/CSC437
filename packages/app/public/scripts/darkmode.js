document.body.addEventListener("dark-mode:toggle", (event) => {
    const page = event.currentTarget;
    const checked = event.detail.checked;
    page.classList.toggle("dark-mode", checked);
});

function toggleDarkMode(target, checked) {
  const customEvent = new CustomEvent(
    "dark-mode:toggle", {
      bubbles: true,
      detail: { checked },
      composed: true
  });
  target.dispatchEvent(customEvent);
}