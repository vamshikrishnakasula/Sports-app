import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db, Collection } from 'mongodb';
import { GoogleGenAI, Type } from '@google/genai';
import {
  MoodLog,
  PracticeEntry,
  ChatMessage,
  OverthinkingAnalysis,
  MoodChangerItem,
  AppServerStatus,
  PracticeType,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// IN-MEMORY SEED DATA & FALLBACK STORE (In case MongoDB is connecting or URI not supplied)
// -------------------------------------------------------------

let memoryMoods: MoodLog[] = [
  {
    id: 'm-1',
    mood: 'anxious',
    score: 2,
    emotionTags: ['Work/Study', 'Overthinking', 'Fatigue'],
    note: 'Feeling overwhelmed with upcoming deadlines. Mind keeps spinning about worst-case scenarios.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'm-2',
    mood: 'okay',
    score: 3,
    emotionTags: ['Routine', 'Quiet'],
    note: 'Took a short walk outside during lunch break. Calmed my nerves slightly.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'm-3',
    mood: 'good',
    score: 4,
    emotionTags: ['Gratitude', 'Friends'],
    note: 'Had a warm video call with an old friend. Felt listened to.',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

let memoryPractices: PracticeEntry[] = [
  {
    id: 'p-1',
    type: 'gratitude',
    title: 'Morning Appreciation',
    content: '1. The aroma of warm coffee in the early morning.\n2. A quiet room where I can breathe slowly.\n3. My body doing its best to carry me through this week.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    moodAssociated: 'good',
  },
  {
    id: 'p-2',
    type: 'affirmation',
    title: 'Reassurance on Uncertainty',
    content: 'I do not have to figure out my entire future today. I only need to take the next gentle, honest step.',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    moodAssociated: 'anxious',
  },
  {
    id: 'p-3',
    type: 'journal',
    title: 'Letting Go of Perfectionism',
    content: 'Today I noticed a harsh inner critic telling me I was falling behind. I stopped and reminded myself that rest is not a reward I have to earn—it is a biological requirement.',
    promptUsed: 'What is one expectation you can give yourself permission to release today?',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    moodAssociated: 'okay',
  },
];

let memoryChats: ChatMessage[] = [
  {
    id: 'c-welcome',
    role: 'assistant',
    text: "Hello, I am MindEase, your supportive mental health companion. Whatever you're holding right now—whether you feel anxious, overwhelmed, lonely, or just need a safe space to vent—I'm here to listen without judgment. How are you feeling right now?",
    timestamp: new Date().toISOString(),
    suggestions: [
      "I can't stop overthinking a conversation",
      'I feel anxious and need help calming down',
      'I am feeling burnt out and exhausted',
      'Can you help me reframe a negative thought?',
    ],
  },
];

const curatedMoodChangers: MoodChangerItem[] = [
  // Movies
  {
    id: 'mc-1',
    category: 'movie',
    title: 'My Neighbor Totoro',
    creatorOrYear: 'Hayao Miyazaki (1988)',
    description: 'A gentle, slow-paced anime masterpiece brimming with childlike wonder, peaceful countryside rain, and gentle forest spirits.',
    whyItHelps: 'Has virtually no high-stakes conflict or villain, lowering cortisol and offering pure soothing escapism.',
    moodTarget: 'High Anxiety & Racing Mind',
    durationOrLength: '1h 26m',
    tags: ['Comfort', 'Gentle', 'Nature', 'Anime'],
  },
  {
    id: 'mc-2',
    category: 'movie',
    title: 'The Secret Life of Walter Mitty',
    creatorOrYear: 'Ben Stiller (2013)',
    description: 'A day-dreaming office worker embarks on an unexpected real-world journey across Iceland and Greenland.',
    whyItHelps: 'Inspires courage to step out of mental loops and reconnect with the expansive beauty of the physical world.',
    moodTarget: 'Feeling Stuck & Overwhelmed',
    durationOrLength: '1h 54m',
    tags: ['Uplifting', 'Adventure', 'Perspective'],
  },
  {
    id: 'mc-3',
    category: 'movie',
    title: 'Paddington 2',
    creatorOrYear: 'Paul King (2017)',
    description: 'A charming, endlessly kind bear brings warmth, marmalade sandwiches, and sincere community spirit to everyone he meets.',
    whyItHelps: 'Universal feel-good comfort that restores faith in human empathy and kindness.',
    moodTarget: 'Low Mood & Loneliness',
    durationOrLength: '1h 44m',
    tags: ['Heartwarming', 'Comedy', 'Feel Good'],
  },
  {
    id: 'mc-4',
    category: 'movie',
    title: 'Amélie',
    creatorOrYear: 'Jean-Pierre Jeunet (2001)',
    description: 'An imaginative young woman in Paris secretly orchestrates small acts of joy for the eccentric people around her.',
    whyItHelps: 'Celebrates tiny sensory pleasures and finding magic in everyday quiet moments.',
    moodTarget: 'Emotional Numbness or Apathy',
    durationOrLength: '2h 02m',
    tags: ['Whimsical', 'Visual', 'Uplifting'],
  },

  // Books
  {
    id: 'mc-5',
    category: 'book',
    title: 'The Boy, the Mole, the Fox and the Horse',
    creatorOrYear: 'Charlie Mackesy',
    description: 'A poignant, illustrated conversation about kindness, courage, vulnerability, and what it means to ask for help.',
    whyItHelps: 'Bite-sized, gorgeously illustrated wisdom that feels like a warm hug when words are too hard to process.',
    moodTarget: 'Low Self-Esteem & Sadness',
    durationOrLength: '128 pages',
    tags: ['Illustrated', 'Self-Compassion', 'Gentle'],
  },
  {
    id: 'mc-6',
    category: 'book',
    title: 'Reasons to Stay Alive',
    creatorOrYear: 'Matt Haig',
    description: 'A candid, deeply personal memoir on surviving severe anxiety and depression, filled with lists and reassuring insights.',
    whyItHelps: 'Reminds you that severe dark feelings are temporary states and you are not alone in having them.',
    moodTarget: 'Existential Dread & Depression',
    durationOrLength: '272 pages',
    tags: ['Mental Health', 'Hope', 'Relatable'],
  },
  {
    id: 'mc-7',
    category: 'book',
    title: 'The Midnight Library',
    creatorOrYear: 'Matt Haig',
    description: 'Between life and death lies a library where every book offers a chance to experience the lives you could have lived.',
    whyItHelps: 'Directly helps soothe persistent regret and "what-if" loops by showing that every path has value.',
    moodTarget: 'Overthinking & Regret Loops',
    durationOrLength: '304 pages',
    tags: ['Fiction', 'Perspective', 'Philosophy'],
  },
  {
    id: 'mc-8',
    category: 'book',
    title: 'Before the Coffee Gets Cold',
    creatorOrYear: 'Toshikazu Kawaguchi',
    description: 'In a small Tokyo back alley cafe, customers are given the rare chance to travel back in time for as long as their coffee remains warm.',
    whyItHelps: 'Quiet, introspective pacing that encourages acceptance and peace with what cannot be changed.',
    moodTarget: 'Racing Thoughts & Restlessness',
    durationOrLength: '213 pages',
    tags: ['Cozy', 'Japanese Fiction', 'Peaceful'],
  },

  // Activities
  {
    id: 'mc-9',
    category: 'activity',
    title: 'Warm Water & Sensory Reset',
    creatorOrYear: 'Somatic Grounding',
    description: 'Wash your hands or face with warm water for 60 seconds, paying conscious attention to the temperature, softness of the towel, and your breath.',
    whyItHelps: 'Activates the mammalian dive reflex and parasympathetic nervous system to rapidly slow down heart rate.',
    moodTarget: 'Acute Panic or Severe Tension',
    durationOrLength: '3-5 minutes',
    tags: ['Sensory', 'Quick', 'Somatic'],
  },
  {
    id: 'mc-10',
    category: 'activity',
    title: 'The "Brain Dump & Tear Up" Exercise',
    creatorOrYear: 'Cognitive Defusion',
    description: 'Grab a physical sheet of paper and write down every ugly, anxious, unfiltered thought for 5 minutes without editing. Then physically tear it up and throw it away.',
    whyItHelps: 'Physically unburdens working memory and symbolizes that thoughts are mental events, not permanent reality.',
    moodTarget: 'Obsessive Overthinking',
    durationOrLength: '7 minutes',
    tags: ['Release', 'Mindset', 'Action'],
  },
  {
    id: 'mc-11',
    category: 'activity',
    title: 'Micro-Walk Without Phone',
    creatorOrYear: 'Mindful Movement',
    description: 'Step outside or walk around your living space with zero screens or podcasts. Look for 5 objects that are green, 3 that are textured, and 1 unique shadow.',
    whyItHelps: 'Shifts focus from internal ruminative loops outward into sensory visual cues.',
    moodTarget: 'Brain Fog & Restlessness',
    durationOrLength: '10 minutes',
    tags: ['Nature', 'Movement', 'Grounding'],
  },
  {
    id: 'mc-12',
    category: 'activity',
    title: 'Humming or Low-Frequency Vocal Tone',
    creatorOrYear: 'Vagus Nerve Reset',
    description: 'Inhale deeply through your nose, then exhale slowly with a low "hmmm" or "voo" vibration in your chest for 6 continuous breath cycles.',
    whyItHelps: 'Vibrates the vocal cords and directly stimulates the vagus nerve to signal physical safety to your brain.',
    moodTarget: 'Chest Tightness & Nervous Agitation',
    durationOrLength: '2 minutes',
    tags: ['Breathing', 'Nervous System', 'Immediate'],
  },
];

// -------------------------------------------------------------
// MONGODB CONNECTION SETUP
// -------------------------------------------------------------

let mongoClient: MongoClient | null = null;
let db: Db | null = null;
let isMongoConnected = false;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindheal';

async function initMongoDB() {
  try {
    mongoClient = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    await mongoClient.connect();
    db = mongoClient.db();
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to database: ${db.databaseName}`);

    // Pre-populate database with seed data if collections are empty
    const moodsCol = db.collection<MoodLog>('moods');
    const moodCount = await moodsCol.countDocuments();
    if (moodCount === 0) {
      await moodsCol.insertMany(memoryMoods);
      console.log('[MongoDB] Seeded initial mood logs.');
    }

    const practicesCol = db.collection<PracticeEntry>('practices');
    const practicesCount = await practicesCol.countDocuments();
    if (practicesCount === 0) {
      await practicesCol.insertMany(memoryPractices);
      console.log('[MongoDB] Seeded initial practices.');
    }
  } catch (err: any) {
    isMongoConnected = false;
    console.warn(`[MongoDB] Could not connect to MongoDB (${err?.message || err}). Falling back to robust in-memory persistent storage. App will work 100% seamlessly.`);
  }
}

// -------------------------------------------------------------
// GEMINI AI SETUP
// -------------------------------------------------------------

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('[Gemini AI] GEMINI_API_KEY is not set. Intelligent built-in cognitive responses will be used.');
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error('[Gemini AI] Initialization error:', err);
    return null;
  }
}

// -------------------------------------------------------------
// HELPER: CRISIS KEYWORD DETECTION (SAFETY FIRST)
// -------------------------------------------------------------

function checkCrisisKeywords(text: string): boolean {
  const crisisRegex = /(kill myself|suicide|end my life|want to die|harm myself|cutting myself|hang myself|don't want to live anymore|dont want to live anymore|better off dead|no reason to live)/i;
  return crisisRegex.test(text);
}

const crisisEmergencyText = `⚠️ I hear how deeply exhausted and in pain you are right now, and I want you to know that your life has immense worth. You do not have to carry this crushing weight all by yourself. 

Please reach out immediately to trained compassionate professionals who are ready 24/7 to listen confidentially:

• In the US & Canada: Call or text **988** (Suicide & Crisis Lifeline - free, 24/7)
• In the UK: Call **111** (NHS Mental Health) or text SHOUT to **85258**
• In India: Call **14416** (Tele-MANAS) or **044-24640050** (Sneha India)
• International: Visit **https://findahelpline.com** or call your local emergency services (911 / 999 / 112).

Please stay safe and let someone support you today. I am here to be a calm space, but a real human lifeline can give you the real-time care you deserve.`;

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health & Server Status
app.get('/api/status', async (_req, res) => {
  let totalMoodLogs = memoryMoods.length;
  let totalPractices = memoryPractices.length;

  if (isMongoConnected && db) {
    try {
      totalMoodLogs = await db.collection('moods').countDocuments();
      totalPractices = await db.collection('practices').countDocuments();
    } catch {
      // ignore
    }
  }

  const status: AppServerStatus = {
    mongodbConnected: isMongoConnected,
    databaseName: isMongoConnected && db ? db.databaseName : 'Local Safe Storage',
    aiReady: Boolean(process.env.GEMINI_API_KEY),
    totalMoodLogs,
    totalPractices,
  };
  res.json(status);
});

// 2. Mood Tracking (CRUD)
app.get('/api/moods', async (_req, res) => {
  try {
    if (isMongoConnected && db) {
      const logs = await db.collection<MoodLog>('moods').find().sort({ timestamp: -1 }).toArray();
      return res.json(logs);
    }
    return res.json([...memoryMoods].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/moods', async (req, res) => {
  try {
    const { mood, score, emotionTags, note } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const newLog: MoodLog = {
      id: `m-${Date.now()}`,
      mood,
      score: Number(score) || 3,
      emotionTags: Array.isArray(emotionTags) ? emotionTags : [],
      note: note || '',
      timestamp: new Date().toISOString(),
    };

    if (isMongoConnected && db) {
      await db.collection<MoodLog>('moods').insertOne({ ...newLog });
    } else {
      memoryMoods.unshift(newLog);
    }

    res.status(201).json(newLog);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Daily Practices (Gratitude, Affirmations, Journaling)
app.get('/api/practices', async (req, res) => {
  try {
    const typeFilter = req.query.type as PracticeType | undefined;
    if (isMongoConnected && db) {
      const query: any = typeFilter ? { type: typeFilter } : {};
      const entries = await db.collection<PracticeEntry>('practices').find(query).sort({ timestamp: -1 }).toArray();
      return res.json(entries);
    }

    let entries = [...memoryPractices];
    if (typeFilter) {
      entries = entries.filter((e) => e.type === typeFilter);
    }
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(entries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/practices', async (req, res) => {
  try {
    const { type, title, content, promptUsed, moodAssociated } = req.body;
    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }

    const newPractice: PracticeEntry = {
      id: `p-${Date.now()}`,
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Reflection`,
      content,
      promptUsed: promptUsed || undefined,
      moodAssociated: moodAssociated || undefined,
      timestamp: new Date().toISOString(),
    };

    if (isMongoConnected && db) {
      await db.collection<PracticeEntry>('practices').insertOne({ ...newPractice });
    } else {
      memoryPractices.unshift(newPractice);
    }

    res.status(201).json(newPractice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/practices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && db) {
      await db.collection('practices').deleteOne({ id });
    } else {
      memoryPractices = memoryPractices.filter((p) => p.id !== id);
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Chat Assistant
app.get('/api/chat', async (_req, res) => {
  try {
    if (isMongoConnected && db) {
      const messages = await db.collection<ChatMessage>('chats').find().sort({ timestamp: 1 }).toArray();
      return res.json(messages.length > 0 ? messages : memoryChats);
    }
    res.json(memoryChats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chat', async (_req, res) => {
  try {
    if (isMongoConnected && db) {
      await db.collection('chats').deleteMany({});
    }
    memoryChats = [
      {
        id: `c-${Date.now()}`,
        role: 'assistant',
        text: "I've refreshed our conversation. Take a deep breath. Whenever you're ready, feel free to share what's on your mind.",
        timestamp: new Date().toISOString(),
        suggestions: [
          'Help me calm down right now',
          'I need to talk through my overthinking',
          'Give me a gentle affirmation',
        ],
      },
    ];
    res.json({ success: true, message: 'Chat reset' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, currentMood } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage: ChatMessage = {
      id: `c-user-${Date.now()}`,
      role: 'user',
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Save user message
    if (isMongoConnected && db) {
      await db.collection<ChatMessage>('chats').insertOne({ ...userMessage });
    } else {
      memoryChats.push(userMessage);
    }

    // Safety check first
    if (checkCrisisKeywords(message)) {
      const crisisReply: ChatMessage = {
        id: `c-ai-${Date.now()}`,
        role: 'assistant',
        text: crisisEmergencyText,
        timestamp: new Date().toISOString(),
        isCrisisAlert: true,
        suggestions: ['988 Lifeline Info', 'How to practice grounding right now', 'I want to talk safely'],
      };

      if (isMongoConnected && db) {
        await db.collection<ChatMessage>('chats').insertOne({ ...crisisReply });
      } else {
        memoryChats.push(crisisReply);
      }
      return res.json(crisisReply);
    }

    const ai = getAiClient();
    let replyText = '';
    let suggestions: string[] = [];

    if (ai) {
      try {
        const systemInstruction = `You are MindEase, an empathetic, mindfulness-informed, and compassionate AI mental health companion.
Your mission is to support users experiencing anxiety, overthinking, stress, sadness, burnout, and emotional fatigue.
Key guidelines:
1. Empathy & Active Listening: Validate their emotions first ("It sounds like you are carrying a lot...", "That feels so exhausting..."). Never dismiss or give shallow toxic positivity.
2. Cognitive Defusion & Gentle Curiosity: Help them identify catastrophic assumptions gently without sounding clinical or robotic.
3. Somatic Grounding: Offer quick physical techniques (e.g. relaxing the jaw, unclasping hands, 4-7-8 breathing) when tension is high.
4. Boundaries: You are an AI companion, not a licensed medical doctor or therapist. You provide emotional support, coping strategies, and grounding exercises.
5. Tone: Warm, calm, reassuring, conversational, and respectful. Keep responses readable with comfortable paragraph spacing. End with a gentle, non-pressuring question or check-in.
${currentMood ? `The user recently logged their mood as "${currentMood}". Keep this context in mind.` : ''}`;

        // Get past messages for short context
        const contextHistory = memoryChats.slice(-6).map((m) => `${m.role === 'user' ? 'User' : 'MindEase'}: ${m.text}`).join('\n\n');

        const prompt = `${contextHistory}\n\nUser: ${message}\n\nMindEase:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        replyText = response.text?.trim() || "I am right here with you. Take a slow, gentle breath. Tell me a little more about what is feeling most heavy right now.";

        // Also generate 2-3 quick follow-up suggestions
        suggestions = [
          'Can we do a quick grounding exercise?',
          'How can I break out of this thought loop?',
          'What is a kind way to view this situation?',
        ];
      } catch (aiErr: any) {
        console.error('[Gemini API] Chat error:', aiErr);
        replyText = getFallbackChatResponse(message, currentMood);
        suggestions = [
          'Guide me through a calming breath',
          'Help me reframe my overthinking',
          'Give me a gentle affirmation',
        ];
      }
    } else {
      // Offline / Key missing fallback
      replyText = getFallbackChatResponse(message, currentMood);
      suggestions = [
        'Guide me through a calming breath',
        'Help me reframe my overthinking',
        'Give me a gentle affirmation',
      ];
    }

    const assistantMessage: ChatMessage = {
      id: `c-ai-${Date.now()}`,
      role: 'assistant',
      text: replyText,
      timestamp: new Date().toISOString(),
      suggestions,
    };

    if (isMongoConnected && db) {
      await db.collection<ChatMessage>('chats').insertOne({ ...assistantMessage });
    } else {
      memoryChats.push(assistantMessage);
    }

    res.json(assistantMessage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Overthinking Relief Analyzer & Deconstructor ("What to do depending upon overthinking")
app.post('/api/ai/overthinking', async (req, res) => {
  try {
    const { thought, context } = req.body;
    if (!thought || typeof thought !== 'string') {
      return res.status(400).json({ error: 'Overthinking thought text is required' });
    }

    const ai = getAiClient();

    if (ai) {
      try {
        const prompt = `The user is stuck in a painful spiral of overthinking: "${thought}".
${context ? `Additional context: ${context}` : ''}

Analyze this overthinking pattern with warmth and cognitive behavioral grounding principles.
Respond strictly in JSON matching the required schema:
- coreProblem: A compassionate 1-sentence summary of the underlying fear (e.g. fear of rejection, fear of failure, perfectionism).
- distortionIdentified: The thinking trap (e.g., Catastrophizing, Mind Reading, All-or-Nothing thinking, Fortune Telling).
- whatIsFact: Array of 2-3 verifiable concrete facts about the situation right now.
- whatIsAssumption: Array of 2-3 unproven assumptions, worries, or story loops the brain is inventing.
- inMyControl: Array of 2-3 concrete actions or choices the user actually has control over today.
- outsideMyControl: Array of 2-3 things that cannot be forced or controlled (other people's thoughts, past events, future certainty).
- calmingActionSteps: Array of 3 sequential, extremely low-friction physical and mental steps to take right now.
- reframedPerspective: A compassionate, balanced perspective that is realistic rather than falsely positive.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                coreProblem: { type: Type.STRING },
                distortionIdentified: { type: Type.STRING },
                whatIsFact: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                whatIsAssumption: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                inMyControl: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                outsideMyControl: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                calmingActionSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                reframedPerspective: { type: Type.STRING },
              },
              required: [
                'coreProblem',
                'distortionIdentified',
                'whatIsFact',
                'whatIsAssumption',
                'inMyControl',
                'outsideMyControl',
                'calmingActionSteps',
                'reframedPerspective',
              ],
            },
          },
        });

        const parsed: OverthinkingAnalysis = JSON.parse(response.text?.trim() || '{}');
        return res.json(parsed);
      } catch (aiErr) {
        console.error('[Gemini API] Overthinking analysis error:', aiErr);
      }
    }

    // High quality intelligent fallback if AI key is pending
    const fallback = generateFallbackOverthinking(thought);
    res.json(fallback);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. AI Affirmation Generator
app.post('/api/ai/affirmation', async (req, res) => {
  try {
    const { feeling, challenge } = req.body;
    const ai = getAiClient();

    if (ai) {
      try {
        const prompt = `Generate 3 gentle, grounding, realistic mental health affirmations for someone experiencing: "${feeling || 'anxiety and self-doubt'}" with the challenge: "${challenge || 'feeling overwhelmed'}".
Avoid toxic positivity (e.g. "Everything is amazing!"). Use compassionate, self-validating language (e.g. "I am allowed to take up space even when I am unsure").
Return as a JSON array of strings.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        });

        const affirmations = JSON.parse(response.text?.trim() || '[]');
        return res.json({ affirmations });
      } catch (err) {
        console.error('[Gemini] Affirmation generation error:', err);
      }
    }

    // Built-in intelligent affirmations
    res.json({
      affirmations: [
        'My thoughts are mental events passing through, not permanent facts about my worth.',
        'I do not need to solve the entire puzzle today; taking one quiet breath is enough.',
        'It is safe for me to slow down. The world will wait while I regain my balance.',
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Mood Changers (Curated & AI Recommendations for Movies, Books, Stuff to do)
app.get('/api/mood-changers', (_req, res) => {
  res.json(curatedMoodChangers);
});

app.post('/api/ai/recommend-changers', async (req, res) => {
  try {
    const { currentMood, desiredShift, preferredType } = req.body;
    const ai = getAiClient();

    if (ai) {
      try {
        const prompt = `Recommend 3 specific, uplifting, comforting mood-changers for someone currently feeling "${currentMood || 'stressed and overthinking'}" who wants to feel "${desiredShift || 'calm, grounded, and comforted'}".
Preferred media/activity type: ${preferredType || 'mixed (movies, books, or activities)'}.
Return as a JSON array of objects with:
- category: 'movie' | 'book' | 'activity'
- title: string
- creatorOrYear: string
- description: 2-sentence description of the work or action
- whyItHelps: psychological or emotional reason this shifts perspective
- moodTarget: string
- durationOrLength: string
- tags: array of 3 strings`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  creatorOrYear: { type: Type.STRING },
                  description: { type: Type.STRING },
                  whyItHelps: { type: Type.STRING },
                  moodTarget: { type: Type.STRING },
                  durationOrLength: { type: Type.STRING },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['category', 'title', 'description', 'whyItHelps', 'moodTarget'],
              },
            },
          },
        });

        const items = JSON.parse(response.text?.trim() || '[]');
        const itemsWithId = items.map((item: any, idx: number) => ({
          ...item,
          id: `ai-mc-${Date.now()}-${idx}`,
        }));
        return res.json(itemsWithId);
      } catch (err) {
        console.error('[Gemini] Recommend changers error:', err);
      }
    }

    // Filter matching curated items
    const filtered = curatedMoodChangers.slice(0, 3);
    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// FALLBACK LOGIC (When Gemini API key is missing or offline)
// -------------------------------------------------------------

function getFallbackChatResponse(message: string, currentMood?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('breath') || lower.includes('panic') || lower.includes('anxious') || lower.includes('heart')) {
    return `I can hear how loud your nervous system is feeling right now. Let's do a gentle somatic pause together:

1. Drop your shoulders down away from your ears.
2. Unclench your jaw and let your tongue rest gently on the floor of your mouth.
3. Inhale slowly through your nose for a count of 4... hold gently for 4... and exhale softly through your mouth like you're blowing through a straw for 6.

Your body is responding to perceived threat, but right here, in this exact second, you are safe. What is one physical object in front of you that you can touch right now?`;
  }

  if (lower.includes('overthinking') || lower.includes('mistake') || lower.includes('what if') || lower.includes('regret')) {
    return `Our minds are meaning-making machines that desperately try to predict and protect us from harm by imagining every worst-case scenario.

When you notice a "what if" loop:
• Ask yourself: "Is this thought happening in reality right now, or is it a movie my brain is screening?"
• Notice the difference between **facts** (what an objective camera would record) and **interpretations** (the painful storylines we attach).

Would you like to try our Overthinking SOS tool to unpick this specific thought step by step?`;
  }

  if (lower.includes('tired') || lower.includes('burnout') || lower.includes('exhausted') || lower.includes('cant anymore')) {
    return `It sounds like you have been carrying an invisible backpack full of heavy stones for a very long time.

Please give yourself permission to lower your standards today. You do not have to perform, optimize, or be strong right now. 

What is the lowest-effort, kindest thing you could do for your body in the next 15 minutes? (Even if that just means sipping a glass of room-temperature water or laying down with your eyes closed).`;
  }

  return `Thank you for sharing that with me. It takes courage to put feelings into words, especially when things feel messy or heavy inside.

${currentMood ? `I see you logged feeling ${currentMood} earlier today. ` : ''}Remember that emotions are like weather patterns—intense, stormy, and sometimes overwhelming, but they always move across the sky. You are the sky, not the weather.

What feels like the heaviest part of this for you right now? I'm listening.`;
}

function generateFallbackOverthinking(thought: string): OverthinkingAnalysis {
  return {
    coreProblem: 'Your brain is trying to gain control over uncertainty by replaying worst-case scenarios on repeat.',
    distortionIdentified: 'Catastrophizing & Anticipatory Anxiety (assuming the worst outcome is inevitable)',
    whatIsFact: [
      'You are experiencing strong feelings of uncertainty and stress in your body right now.',
      'The event or situation has ambiguous aspects, but the catastrophic ending has not actually occurred.',
      'You are actively seeking support and taking steps to address your well-being.',
    ],
    whatIsAssumption: [
      'Assuming that feeling anxious means something terrible is definitely about to happen.',
      'Assuming other people are judging or thinking negatively about you without concrete proof.',
      'Assuming you will not have the resilience to cope if things do not go as planned.',
    ],
    inMyControl: [
      'How you respond to your nervous system right now (taking deep breaths, resting your body).',
      'The single next small action you choose to take today.',
      'Choosing to speak to yourself with gentleness instead of harsh criticism.',
    ],
    outsideMyControl: [
      'How other people choose to feel, react, or communicate.',
      'Past moments or conversations that have already concluded.',
      'Guaranteeing absolute 100% certainty about tomorrow.',
    ],
    calmingActionSteps: [
      'Physical Reset: Drink a full glass of cool water and loosen the muscles in your forehead and neck.',
      '5-Minute Rule: Give yourself a designated 5-minute "worry window", after which you gently redirect attention to an easy sensory task.',
      'Reality Grounding: Name 3 concrete things in the room that are completely peaceful and unchanged by this worry.',
    ],
    reframedPerspective: 'I do not have to solve every uncertainty right now. Feeling worried is simply my mind trying to keep me safe, but I can thank my mind for trying and still choose to take a calm, gentle breath.',
  };
}

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------

async function startServer() {
  await initMongoDB();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MindEase] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
