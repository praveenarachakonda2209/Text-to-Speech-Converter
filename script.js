const textarea = document.querySelector("textarea");
const voiceList = document.querySelector("select");
const speechBtn = document.querySelector("button");

const synth = window.speechSynthesis;
let isSpeaking = false;
let isPaused = false;

// Load available voices into the dropdown
function loadVoices() {
  voiceList.innerHTML = "";
  synth.getVoices().forEach(voice => {
    const selected = voice.name === "Google US English" ? "selected" : "";
    const option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  });
}

synth.addEventListener("voiceschanged", loadVoices);
loadVoices();

speechBtn.addEventListener("click", e => {
  e.preventDefault();
  const text = textarea.value;

  if (!text) return;

  // Case 1: Start new speech
  if (!isSpeaking) {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = synth.getVoices().find(voice => voice.name === voiceList.value);
    utterance.voice = selectedVoice;

    synth.speak(utterance);
    isSpeaking = true;
    isPaused = false;
    speechBtn.textContent = "Pause Speech";

    utterance.onend = () => {
      isSpeaking = false;
      isPaused = false;
      speechBtn.textContent = "Convert To Speech";
    };
    return;
  }

  // Case 2: If speaking and not paused → pause it
  if (!isPaused) {
    synth.pause();
    isPaused = true;
    speechBtn.textContent = "Resume Speech";
  }
  // Case 3: If paused → resume it
  else {
    synth.resume();
    isPaused = false;
    speechBtn.textContent = "Pause Speech";
  }
});
