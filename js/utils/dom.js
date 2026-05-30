export function setStatus(element, message, type = 'info') {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

export function createObjectUrl(blob) {
  return URL.createObjectURL(blob);
}

export function safeSetText(element, value) {
  if (element) element.textContent = value;
}
