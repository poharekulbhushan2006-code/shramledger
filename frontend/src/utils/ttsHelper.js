export const speakText = (text, lang = 'hi-IN') => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  // Try to find a suitable voice
  const voices = window.speechSynthesis.getVoices();
  const matchVoice = voices.find(v => v.lang.includes(lang) || (lang.startsWith('hi') && v.lang.includes('hi')));
  
  if (matchVoice) {
    utterance.voice = matchVoice;
  }
  
  utterance.lang = lang.startsWith('hi') ? 'hi-IN' : 'en-IN';

  window.speechSynthesis.speak(utterance);
};
