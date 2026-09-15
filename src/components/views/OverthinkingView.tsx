import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wind,
  Layers,
  ArrowRight,
  ShieldCheck,
  Eye,
  Hand,
  Volume2,
  Coffee,
  Smile,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { OverthinkingAnalysis } from '../../types';
import { api } from '../../services/api';

export const OverthinkingView: React.FC = () => {
  const [thoughtInput, setThoughtInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<OverthinkingAnalysis | null>(null);

  // Somatic Tool Switcher: 'deconstruct' | 'breathing' | 'grounding'
  const [activeTool, setActiveTool] = useState<'deconstruct' | 'breathing' | 'grounding'>(
    'deconstruct'
  );

  // Breathing Circle State (4-7-8 method)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathTimer, setBreathTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // 5-4-3-2-1 Grounding Checklist State
  const [groundingState, setGroundingState] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: [''],
  });

  const sampleThoughts = [
    'I said something awkward earlier and now everyone secretly thinks I am strange.',
    'I have so many pending tasks that I am paralyzed and will fail everything.',
    'What if I made the wrong career decision and ruined my future?',
  ];

  // 4-7-8 Breathing Loop
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          if (breathPhase.startsWith('Inhale')) {
            setBreathPhase('Hold (7s)');
            return 7;
          } else if (breathPhase.startsWith('Hold')) {
            setBreathPhase('Exhale (8s)');
            return 8;
          } else {
            setBreathPhase('Inhale (4s)');
            setCycleCount((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathPhase('Inhale (4s)');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!thoughtInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await api.analyzeOverthinking(thoughtInput, contextInput);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to analyze overthinking:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGroundingInput = (
    category: keyof typeof groundingState,
    index: number,
    value: string
  ) => {
    setGroundingState((prev) => {
      const updated = [...prev[category]];
      updated[index] = value;
      return { ...prev, [category]: updated };
    });
  };

  const completedGroundingCount =
    groundingState.see.filter(Boolean).length +
    groundingState.touch.filter(Boolean).length +
    groundingState.hear.filter(Boolean).length +
    groundingState.smell.filter(Boolean).length +
    groundingState.taste.filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-50 via-teal-50 to-stone-50 border border-cyan-100 rounded-3xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100/80 px-2.5 py-1 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            Overthinking & Racing Mind SOS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif tracking-tight">
            What to do when your brain won't stop spinning
          </h1>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            Overthinking is not a lack of willpower—it is your nervous system mistaking future ambiguity for immediate danger. Use cognitive defusion to break down the loop, or use physical somatic tools to reset your physiology.
          </p>

          {/* Tool Navigation */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              id="tool-deconstruct"
              onClick={() => setActiveTool('deconstruct')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTool === 'deconstruct'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>AI Thought Deconstructor</span>
            </button>
            <button
              id="tool-breathing"
              onClick={() => setActiveTool('breathing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTool === 'breathing'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>4-7-8 Breathing Circle</span>
            </button>
            <button
              id="tool-grounding"
              onClick={() => setActiveTool('grounding')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTool === 'grounding'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>5-4-3-2-1 Sensory Grounding</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOOL 1: AI THOUGHT DECONSTRUCTOR */}
      {activeTool === 'deconstruct' && (
        <div className="space-y-6">
          {/* Input Form Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <span>Unpack your spinning thought</span>
            </h2>
            <p className="text-xs text-stone-500">
              Type the repetitive thought exactly as it whispers in your mind. Gemini will separate what is actual reality from what your anxious brain is projecting.
            </p>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  The overthinking loop / "What if" worry:
                </label>
                <textarea
                  id="overthinking-thought-input"
                  rows={3}
                  value={thoughtInput}
                  onChange={(e) => setThoughtInput(e.target.value)}
                  placeholder="e.g. My boss sent a vague email saying 'let's talk tomorrow' and I'm convinced I am getting fired or reprimanded."
                  className="w-full bg-stone-50 hover:bg-stone-100/50 focus:bg-white text-stone-900 border border-stone-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 rounded-2xl p-4 text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* Sample inspiration prompts */}
              <div>
                <p className="text-[11px] text-stone-400 mb-1.5 font-medium">Or try an example:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sampleThoughts.map((st, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setThoughtInput(st)}
                      className="text-[11px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-xl transition-colors text-left"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="analyze-overthinking-btn"
                type="submit"
                disabled={isAnalyzing || !thoughtInput.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Deconstructing Loop...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Deconstruct This Overthinking (AI)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Breakdown Results */}
          {analysis && (
            <div className="bg-white rounded-3xl border border-cyan-200 p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
              {/* Header result */}
              <div className="border-b border-stone-100 pb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Cognitive Deconstruction Completed</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-serif">
                  {analysis.coreProblem}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Thinking Trap: {analysis.distortionIdentified}</span>
                </div>
              </div>

              {/* Facts vs Assumptions 2-Col Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facts Col */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>What is Concrete Fact (Verifiable):</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950 leading-relaxed">
                    {analysis.whatIsFact.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assumptions Col */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>What is Pure Assumption (Mind-Made):</span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950 leading-relaxed">
                    {analysis.whatIsAssumption.map((ass, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold mt-0.5">•</span>
                        <span>{ass}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Circles of Control Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* In My Control */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    <span>Inside Your Circle of Control:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
                    {analysis.inMyControl.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outside My Control */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-stone-400" />
                    <span>Outside Your Control (Let It Be):</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-500 leading-relaxed">
                    {analysis.outsideMyControl.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Calming Action Steps */}
              <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 space-y-3">
                <h4 className="text-sm font-bold text-cyan-950 font-serif flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-cyan-700" />
                  <span>3 Micro-Actions to Take Right Now:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {analysis.calmingActionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-cyan-100 rounded-xl p-3 text-xs text-stone-800 shadow-2xs space-y-1"
                    >
                      <span className="inline-block w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 text-center font-bold text-[11px] leading-5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed mt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compassionate Reframe */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Balanced, Compassionate Perspective
                </span>
                <p className="text-stone-900 font-serif text-base italic leading-relaxed">
                  "{analysis.reframedPerspective}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: 4-7-8 BREATHING CIRCLE */}
      {activeTool === 'breathing' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xs flex flex-col items-center text-center space-y-8">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Somatic Nervous System Reset
            </span>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mt-3">
              The 4-7-8 Breathing Circle
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Inhale through your nose for 4s, hold gently for 7s, and exhale through your mouth for 8s. This exact ratio triggers an involuntary release of acetylcholine, slowing your heart rate.
            </p>
          </div>

          {/* Interactive Breathing Visual Ring */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pulsing ring */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathingActive
                  ? breathPhase.startsWith('Inhale')
                    ? 'scale-110 bg-emerald-100/60 ring-8 ring-emerald-200/50'
                    : breathPhase.startsWith('Hold')
                    ? 'scale-110 bg-amber-100/60 ring-8 ring-amber-200/50'
                    : 'scale-90 bg-sky-100/60 ring-4 ring-sky-200/40'
                  : 'bg-stone-100 ring-2 ring-stone-200'
              }`}
            />

            {/* Inner text */}
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {isBreathingActive ? breathPhase : 'Ready to start'}
              </span>
              <div className="text-5xl font-extrabold text-stone-900 font-serif">
                {isBreathingActive ? breathTimer : '4-7-8'}
              </div>
              <span className="text-xs text-stone-400">
                {isBreathingActive ? `Completed cycles: ${cycleCount}` : 'Click Start below'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              id="toggle-breathing-btn"
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-sm ${
                isBreathingActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isBreathingActive ? 'Pause Breathing' : 'Begin 4-7-8 Breathing'}
            </button>
            {cycleCount > 0 && (
              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setCycleCount(0);
                }}
                className="p-3 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-colors"
                title="Reset counter"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: 5-4-3-2-1 SENSORY GROUNDING */}
      {activeTool === 'grounding' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                Acute Panic & Dissociation Relief
              </span>
              <h2 className="text-xl font-bold text-stone-900 font-serif mt-2">
                5-4-3-2-1 Sensory Grounding Technique
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Bring your attention back into the physical world by anchoring your 5 bodily senses.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-teal-700">
                {completedGroundingCount} / 15 Anchors Found
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {/* 5 Things you can SEE */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800">
                <Eye className="w-4 h-4 text-cyan-600" />
                <span>5 Things you can SEE around you right now:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {groundingState.see.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => handleGroundingInput('see', idx, e.target.value)}
                    placeholder={`Object #${idx + 1}`}
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none"
                  />
                ))}
              </div>
            </div>

            {/* 4 Things you can TOUCH */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800">
                <Hand className="w-4 h-4 text-emerald-600" />
                <span>4 Things you can physically TOUCH or FEEL:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {groundingState.touch.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => handleGroundingInput('touch', idx, e.target.value)}
                    placeholder={`Texture #${idx + 1}`}
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                  />
                ))}
              </div>
            </div>

            {/* 3 Things you can HEAR */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>3 Sounds you can HEAR in the room or outside:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {groundingState.hear.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => handleGroundingInput('hear', idx, e.target.value)}
                    placeholder={`Sound #${idx + 1}`}
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none"
                  />
                ))}
              </div>
            </div>

            {/* 2 Things you can SMELL */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800">
                <Coffee className="w-4 h-4 text-rose-500" />
                <span>2 Scents you can SMELL (or favorite scents):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groundingState.smell.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => handleGroundingInput('smell', idx, e.target.value)}
                    placeholder={`Scent #${idx + 1}`}
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 outline-none"
                  />
                ))}
              </div>
            </div>

            {/* 1 Thing you can TASTE */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800">
                <Smile className="w-4 h-4 text-teal-600" />
                <span>1 Flavor you can TASTE (or sip of water/gum):</span>
              </div>
              <div>
                <input
                  type="text"
                  value={groundingState.taste[0]}
                  onChange={(e) => handleGroundingInput('taste', 0, e.target.value)}
                  placeholder="e.g. Toothpaste, water, mint"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none"
                />
              </div>
            </div>
          </div>

          {completedGroundingCount >= 5 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Wonderful work. Notice that you are physically right here in this room. The worst-case future has not happened.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
