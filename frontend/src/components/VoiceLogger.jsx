import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  X, 
  Volume2, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck,
  Languages
} from 'lucide-react';
import { api } from '../services/api';
import { speakText } from '../utils/ttsHelper';
import { TRANSLATIONS } from '../utils/locales';

export default function VoiceLogger({ 
  worker, 
  isOpen, 
  onClose, 
  onEntryAdded, 
  currentLang 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);
  const [presets, setPresets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [recognitionActive, setRecognitionActive] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Load sample presets
    api.getVoicePresets().then(setPresets).catch(() => {});

    // Setup Web Speech API if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      recog.onresult = (event) => {
        const text = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setTranscript(text);
      };

      recog.onend = () => {
        setIsRecording(false);
        setRecognitionActive(false);
      };

      recog.onerror = (e) => {
        console.warn('Speech error:', e);
        setIsRecording(false);
        setRecognitionActive(false);
      };

      recognitionRef.current = recog;
    }
  }, [currentLang]);

  if (!isOpen) return null;

  const startVoiceRecording = () => {
    setErrorMsg('');
    setExtractedResult(null);
    setTranscript('');
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setRecognitionActive(true);
      } catch (err) {
        console.warn('Recognition start issue:', err);
      }
    } else {
      // Fallback mock timer if browser mic is blocked
      setTimeout(() => {
        setTranscript("आज मैंने 8 घंटे चिनाई का काम किया रमेश ठेकेदार के पास और 750 रुपये नकद मिले।");
        setIsRecording(false);
      }, 3000);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current && recognitionActive) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleProcessTranscript = async (textToProcess) => {
    const text = textToProcess || transcript;
    if (!text || text.trim().length === 0) {
      setErrorMsg('Please speak or select a sample transcript first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const res = await api.ingestVoice({
        worker_id: worker?.id || 'worker_ramesh',
        audio_transcript: text,
        language: currentLang
      });
      setExtractedResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process voice log');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setTranscript(preset.transcript);
    handleProcessTranscript(preset.transcript);
  };

  const handleSaveToLedger = async () => {
    if (!extractedResult || !extractedResult.extracted_entry) return;
    setIsProcessing(true);
    try {
      const added = await api.addEntry(worker?.id || 'worker_ramesh', extractedResult.extracted_entry);
      speakText(`₹${added.amount_paid} की प्रविष्टि लेजर में सुरक्षित जोड़ दी गई है।`);
      onEntryAdded(added);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save entry');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>AI Voice Wage Logger</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
                  Hindi / English NLP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Speak your daily work details naturally in any Indian language
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          
          {/* Voice Recording Central Orb */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative overflow-hidden">
            
            {/* Pulsing waves when recording */}
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-amber-500/10 animate-ping"></div>
                <div className="w-48 h-48 rounded-full bg-amber-500/5 animate-pulse"></div>
              </div>
            )}

            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-xl ${
                isRecording
                  ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white animate-pulse-ring'
                  : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 text-slate-950 hover:shadow-amber-500/25'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-slate-950 font-bold" />
              )}
            </button>

            <p className="mt-4 text-sm font-medium text-slate-300 text-center">
              {isRecording ? (
                <span className="text-amber-400 font-semibold animate-pulse">
                  {t.listening} ("आज मैंने 8 घंटे काम किया...")
                </span>
              ) : (
                <span>{t.speakNow}</span>
              )}
            </p>

            {/* Live waveform simulation */}
            {isRecording && (
              <div className="flex items-center space-x-1.5 mt-3 h-8">
                {[40, 70, 95, 60, 85, 30, 90, 75, 45, 80, 100, 50, 65, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-400 rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Preset Sample Audio Prompts for quick demo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Try realistic audio samples (1-Click Demonstration):</span>
              <span className="text-[10px] text-amber-400 font-mono">Simulated Voice Logs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 text-left transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-400 shrink-0 mt-0.5">
                    <Play className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                        {p.title_hi}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1">
                        {p.expected_amount}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                      "{p.transcript}"
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transcript display & manual trigger */}
          {transcript && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recognized Transcript:
              </label>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-200 font-sans italic">
                  "{transcript}"
                </p>
                <button
                  onClick={() => handleProcessTranscript()}
                  disabled={isProcessing}
                  className="ml-3 shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Analyzing...' : 'Extract Fields'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extracted Structured Card */}
          {extractedResult && extractedResult.extracted_entry && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    AI Extracted Wage Card
                  </span>
                </div>
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span>Confidence: {extractedResult.validation.confidence_score}%</span>
                </div>
              </div>

              {/* Grid of structured attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Amount Paid</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    ₹{extractedResult.extracted_entry.amount_paid}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Work Hours</span>
                  <span className="text-sm font-bold text-slate-200">
                    {extractedResult.extracted_entry.hours_worked} Hours
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Payment Mode</span>
                  <span className="text-sm font-bold text-amber-300">
                    {extractedResult.extracted_entry.payment_mode}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Skill / Trade</span>
                  <span className="text-xs font-bold text-slate-200 truncate block">
                    {extractedResult.extracted_entry.skill_type}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Contractor / Employer</span>
                  <span className="text-xs font-bold text-slate-200 truncate block">
                    {extractedResult.extracted_entry.employer_name}
                  </span>
                </div>
              </div>

              {/* Positive Signals / Benchmarks */}
              {extractedResult.validation.positive_signals && extractedResult.validation.positive_signals.length > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  {extractedResult.validation.positive_signals.map((sig, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveToLedger}
            disabled={!extractedResult || isProcessing}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg ${
              extractedResult && !isProcessing
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:scale-105 shadow-orange-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Verify & Add to SHA-256 Ledger</span>
          </button>
        </div>

      </div>
    </div>
  );
}
