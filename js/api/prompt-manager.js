const prompts = Object.freeze({
  enhancer: 'Tingkatkan kualitas foto secara natural, pertahankan tekstur wajah, warna realistis, dan detail penting.',
  seoBrief: 'Buat ringkasan konten yang informatif, orisinal, dan bermanfaat untuk pembaca Indonesia.'
});

export function getPrompt(name) {
  return prompts[name] || '';
}
