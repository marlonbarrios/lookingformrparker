"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import { fal } from "@fal-ai/client";
import type { FastSdxlInput } from "@fal-ai/client/endpoints";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from './ticker.module.css';

const DISABLED = false;

/** Classic portrait look appended to each prompt (matches original default). */
const PORTRAIT_STYLE =
  "handsome, gentle blue eyes with tender gaze, soft blond hair falling naturally, warm fatherly expression, subtle smile, glowing skin with light sweat, golden hour lighting, shallow depth of field, emotional intimacy, vintage 1960s Polaroid aesthetic, soft focus, film grain, warm color palette, dreamy atmosphere";

const DEFAULT_PROMPT = `extreme close up portrait of a 40 years old man, ${PORTRAIT_STYLE}`;

function portraitWithEmphasis(mid: string) {
  return `extreme close up portrait of a 40 years old man, ${mid}, ${PORTRAIT_STYLE}`;
}

const PROJECT_TITLE = "Looking for Mr. Parker";
const PROJECT_DESCRIPTION =
  "Capturing memories of a Sunday afternoon in Venezuela, 1960s";

const EXPRESSIONS = [
  { mood: "default", prompt: DEFAULT_PROMPT },
  {
    mood: "Texas blue",
    prompt: portraitWithEmphasis(
      "direct gentle cobalt eyes warm approachable grin sapphire clarity English-teaching softness male forties blond",
    ),
  },
  {
    mood: "warm teacher",
    prompt: portraitWithEmphasis(
      "patient half grin gringo Spanish try visible in softened brow blond lashes humid sweat humane male sapphire eyes",
    ),
  },
  {
    mood: "workshop sunday grin",
    prompt: portraitWithEmphasis(
      "dusty gold light squint-smile crow's-feet teaching joy cobalt eyes cheek male American blond humid Venezuela",
    ),
  },
  {
    mood: "La Creole calm",
    prompt: portraitWithEmphasis(
      "understated Texan pride soft closed-mouth smirk sapphire gaze oil-company expat masculine sun-burnished blond",
    ),
  },
  {
    mood: "look at this",
    prompt: portraitWithEmphasis(
      "inviting see-what grin eyes bright fatherly approachable memory-of-kids warmth sapphire male blond Texas",
    ),
  },
  {
    mood: "bilingual tenderness",
    prompt: portraitWithEmphasis(
      "mouth clumsy earnest Spanish cobalt eyes forgiving listening furrow blond brows sweat sheen masculine American",
    ),
  },
  {
    mood: "humid shade",
    prompt: portraitWithEmphasis(
      "tropical contrast vivid blue eyes grin tired cheerful cheek flush sunday backyard heat male blond masculine",
    ),
  },
  {
    mood: "listening drawl",
    prompt: portraitWithEmphasis(
      "head tilt receptive smile at lids attentive Texas cobalt stare relaxed humid afternoon male forty blond",
    ),
  },
  {
    mood: "handsome weary",
    prompt: portraitWithEmphasis(
      "kind worn grin lines cobalt eyes alert dignity masculine pale sun blond stubble humane American forty",
    ),
  },
  {
    mood: "backlit halo grin",
    prompt: portraitWithEmphasis(
      "rim-lit messy blond hair cobalt irises soft friendly toothy grin humid haze cheek masculine sunday Venezuela",
    ),
  },
  {
    mood: "proud restrained",
    prompt: portraitWithEmphasis(
      "closed-mouth Texan smile sapphire eyes disciplined La Creole man composed warm humidity male blond Anglo",
    ),
  },
  {
    mood: "symmetrical joy",
    prompt: portraitWithEmphasis(
      "both eyes cobalt sharp symmetrical male face grin lines from outer corners blond crow's-feet American forty",
    ),
  },
  {
    mood: "sun motes grin",
    prompt: portraitWithEmphasis(
      "particle sunbeam open smile squint sapphire eyes nostalgic sunday workshop gold dust male blond Texas",
    ),
  },
  {
    mood: "three-quarter grin",
    prompt: portraitWithEmphasis(
      "masculine three-quarter cobalt eye vivid grin at lip corner blond stubble jaw chin visible sunday humid male",
    ),
  },
  {
    mood: "earnest gringo",
    prompt: portraitWithEmphasis(
      "shy language-learner grin sapphire eyes forgiving sweet clumsy masculine American blond humid grin male forty",
    ),
  },
  {
    mood: "floor-level kids",
    prompt: portraitWithEmphasis(
      "downward-soft eyes grin unguarded uncle warmth speaking to children sapphire male blond sweat humid affection",
    ),
  },
  {
    mood: "diagonal sunday gold",
    prompt: portraitWithEmphasis(
      "light slice grin cheek cobalt clarity blond male Texas masculine forties humid Venezuela afternoon sapphire",
    ),
  },
  {
    mood: "quiet knowing smile",
    prompt: portraitWithEmphasis(
      "subtle smirk cobalt melancholic joy crow's-feet male forties blond American Texan expat humane heat smile",
    ),
  },
  {
    mood: "wide tired warmth",
    prompt: portraitWithEmphasis(
      "broad tired grin after heat fierce sapphire eyes blond sweat humane sunday approachable male American forty",
    ),
  },
];

// Add a constant for the initial seed
const INITIAL_SEED = '1234567'; // A fixed seed for consistent first generation

// Update the story text constant
const STORY_TEXT = `I could hear my heartbeat when he was close to me. I was 8. A Sunday, warm. We went to Mr. Parker's house. My grandmother's boss. He was from Texas, she said. A big place, far off. Didn't know much about it. Only the name. Texas. He worked for La Creole. The oil company. My grandmother, self-taught in English, had worked her way up to this. Proud.

We found him in the back. He was working on a boat. A wooden boat. He called us over, us kids. The boat wasn't finished. Pieces of wood, scattered. He wasn't wearing much. A sleeveless shirt. Arms bare, skin pale. Pink in places, burnt from the sun. His hair, blonde, messy. He looked at me. "Marlon, look at this." His voice, low. He showed me the wood, how he was fitting it together. I nodded, but I wasn't watching the wood. I watched him. His arms, his hands. The way his skin looked, almost glowing in the sun. The way he spoke. English. Not just words, but something else. I didn't understand. Couldn't. But I listened. It was like hearing something far off. A place I didn't know.

He switched to Spanish. Slow, deliberate, the words thick with his "gringo" accent. Clumsy, but sweet. He tried. It made me smile. Made me feel something, though I didn't know what. There was a rhythm in the air. Something I couldn't name. Not then. I just stood there, listening. The heat of the Venezuelan sun, his voice, the way he looked at me. Like I was the only one there.

Goosebumps rose on my arms, even though it was warm. He smiled. I remember that. And the sound of his voice. And something else, something like seeing a shadow before it arrives. Like knowing what's coming, even if you don't have the words for it yet. It was all there, in his voice, in the way he spoke. I couldn't see the boat. Couldn't see anything else. Just him. The way his arms moved, the way his skin flushed under the sun. The words didn't matter. I didn't understand it all, but I didn't need to. It stayed with me.`;

// Route HTTPS calls through Next so `FAL_KEY` stays on the server (`app/api/fal/proxy/route.ts`).
// Matches `@fal-ai/client` docs: proxy in the browser instead of embedding `credentials: "YOUR_FAL_KEY"`.
fal.config({
  proxyUrl: "/api/fal/proxy",
  credentials: undefined,
});

/** Queue/subscribe endpoint from [fal fast-sdxl docs](https://fal.ai/models/fal-ai/fast-sdxl/api). */
const FAL_MODEL = "fal-ai/fast-sdxl";

const INPUT_DEFAULTS: Omit<FastSdxlInput, "prompt"> = {
  enable_safety_checker: false,
  format: "jpeg" as const,
  guidance_scale: 7.5,
  image_size: "square_hd" as const,
  negative_prompt: "",
  num_images: 1,
  num_inference_steps: 25,
};

type FalRealtimeImage = {
  url?: string | null;
  content?: string | Uint8Array | ArrayBuffer | null;
  content_type?: string | null;
};

type FalRealtimePayload = {
  images?: FalRealtimeImage[];
  timings?: { inference?: number };
};

/** Normalize msgpack/JSON quirks (nested output, casing). */
function coerceRealtimePayload(raw: unknown): FalRealtimePayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  let images =
    (o.images as FalRealtimeImage[] | undefined) ??
    (o.image ? [o.image as FalRealtimeImage] : undefined);

  if (!images?.length && o.output && typeof o.output === "object") {
    const out = o.output as Record<string, unknown>;
    images = out.images as FalRealtimeImage[] | undefined;
  }

  if (!images?.length) return null;
  return {
    images,
    timings:
      typeof o.timings === "object" && o.timings !== null
        ? (o.timings as FalRealtimePayload["timings"])
        : undefined,
  };
}

/** Map model output (and rare wrapper shapes) → images for display. */
function subscribeResultToPayload(resultData: unknown): FalRealtimePayload | null {
  if (!resultData || typeof resultData !== "object") return null;
  const o = resultData as Record<string, unknown>;
  const inner =
    o.data !== undefined && typeof o.data === "object"
      ? (o.data as Record<string, unknown>)
      : o.result !== undefined && typeof o.result === "object"
        ? (o.result as Record<string, unknown>)
        : o;
  return coerceRealtimePayload(inner);
}

function falMime(first: FalRealtimeImage): string {
  const ct = first.content_type?.toLowerCase() ?? "";
  if (ct.includes("png")) return "image/png";
  if (ct.includes("webp")) return "image/webp";
  return "image/jpeg";
}

/** Raw base64 (no data: prefix); fal often returns jpeg bytes this way. */
function falDecodeBase64ToBytes(raw: string): Uint8Array {
  const trimmed = raw.trim();
  const payload =
    trimmed.includes(",") ? trimmed.slice(trimmed.indexOf(",") + 1).trim() : trimmed;
  const bin = atob(payload.replace(/\s/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

/** Narrow to `BlobPart` for strict DOM typings (handles `Uint8Array<ArrayBufferLike>`). */
function bytesToBlobPart(bytes: Uint8Array): BlobPart {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

/**
 * Normalize fal realtime image output to something <img src> can render.
 * `new Blob([base64String])` is wrong UTF-16 bytes → broken images.
 */
async function falRealtimePayloadToDisplayUrl(payload: FalRealtimePayload): Promise<string | null> {
  const img = payload.images?.[0];
  if (!img) return null;

  const mime = falMime(img);

  if (typeof img.url === "string" && img.url.length > 0) {
    if (img.url.startsWith("http://") || img.url.startsWith("https://")) {
      try {
        const res = await fetch(img.url, { mode: "cors" });
        if (res.ok) return URL.createObjectURL(await res.blob());
      } catch {
        /* cors or network — <img crossOrigin omitted can still decode from CDN */
      }
      return img.url;
    }
    if (img.url.startsWith("data:image")) return img.url;
  }

  const c = img.content;
  if (typeof c === "string" && c.length > 0) {
    const s = c.trim();
    if (s.startsWith("data:image")) return s;
    try {
      return URL.createObjectURL(
        new Blob([bytesToBlobPart(falDecodeBase64ToBytes(s))], { type: mime }),
      );
    } catch {
      return null;
    }
  }

  if (c instanceof ArrayBuffer) {
    return URL.createObjectURL(new Blob([c], { type: mime }));
  }
  if (c instanceof Uint8Array) {
    return URL.createObjectURL(new Blob([bytesToBlobPart(c)], { type: mime }));
  }

  return null;
}

function DisabledMessage() {
  return (
    <div className="flex flex-col mt-60">
      <div className="py-4 px-0 space-y-4 lg:space-y-8 mx-auto">
        <h1 className="text-lg">
          Hey there! This demo is now published on <a
            className="underline"
            href="https://fal.ai/demos/fastsdxl"
          >
            fal.
          </a>{" "}
        </h1>

        <p className="text-lg">
          In the meantime, feel free to fork this{" "}
          <a
            className="underline"
            href="https://github.com/fal-ai/real-time-demo-app"
          >
            repo
          </a>{" "}
          and follow the{" "}
          <a
            className="underline"
            href="https://twitter.com/dabit3/status/1761194109841146026"
          >
            tutorial
          </a>
          to build your own version.
        </p>
        <p>Team fal ❤️</p>
      </div>
    </div>
  );
}

// Add a helper function to chunk the array into rows
function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((acc, item, i) => {
    const chunkIndex = Math.floor(i / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(item);
    return acc;
  }, [] as T[][]);
}

// Update the generateNearbySeed function for more randomness
function generateNearbySeed(currentSeed: string) {
  // Create larger variations (-100 to +100)
  const variation = Math.floor(Math.random() * 201) - 100;
  
  // Add some time-based randomness
  const timeVariation = Date.now() % 100;
  
  // Combine both sources of randomness
  const combinedVariation = variation + timeVariation;
  
  // Ensure the seed stays within valid range (7 digits)
  const newSeed = Math.max(1000000, Math.min(9999999, 
    Number(currentSeed) + combinedVariation
  ));
  
  return newSeed.toString();
}

// Add a function to get a random prompt
function getRandomPrompt(currentIndex: number) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * EXPRESSIONS.length);
  } while (newIndex === currentIndex); // Ensure we don't get the same prompt twice in a row
  return newIndex;
}

/** When false, Space is left to the browser (buttons, inputs, dropdowns). */
function shouldUseSpaceShortcut(): boolean {
  const active = document.activeElement;
  if (!active || active === document.body) return true;

  if (
    active instanceof HTMLButtonElement ||
    active instanceof HTMLAnchorElement ||
    active.tagName === "SUMMARY"
  )
    return false;

  if (
    active instanceof HTMLTextAreaElement ||
    active instanceof HTMLSelectElement ||
    (active as HTMLElement).isContentEditable ||
    active instanceof HTMLInputElement
  )
    return false;

  let el: Element | null = active;
  while (el) {
    const r = el.getAttribute("role") ?? "";
    if (
      r === "textbox" ||
      r === "combobox" ||
      r === "listbox" ||
      r === "menu" ||
      r === "menuitem" ||
      r === "menubar"
    )
      return false;
    el = el.parentElement;
  }

  return true;
}

export default function Lightning() {
  const [image, setImage] = useState<null | string>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [seed, setSeed] = useState<string>(INITIAL_SEED);
  const [inferenceTime, setInferenceTime] = useState<number>(NaN);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageHistory, setImageHistory] = useState<{ 
    url: string; 
    timestamp: string; 
    generation: number;
    isLatest: boolean;
  }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [newImageId, setNewImageId] = useState<number | null>(null);
  const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ startX: 0, startY: 0 });
  const [isTickerPlaying, setIsTickerPlaying] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [awaitingImage, setAwaitingImage] = useState(false);

  const isFullscreenRef = useRef(false);

  const isGeneratingRef = useRef(isGenerating);
  const seedRef = useRef(seed);
  const expressionIndexRef = useRef(currentExpressionIndex);
  const playStackSoundRef = useRef<() => void>(() => {});
  /** Keeps footer count in sync with image history without reading stale React state. */
  const generationSeqRef = useRef(0);
  const toggleGenerationRef = useRef<() => void>(() => {});
  const awaitingImageRef = useRef(false);
  const subscribeLockRef = useRef(false);
  const autoChainTimeoutRef = useRef<number | null>(null);
  const generateNewImageRef = useRef<() => void>(() => {});

  const flushAutoChainTimers = () => {
    if (autoChainTimeoutRef.current !== null) {
      clearTimeout(autoChainTimeoutRef.current);
      autoChainTimeoutRef.current = null;
    }
  };

  isGeneratingRef.current = isGenerating;
  seedRef.current = seed;
  expressionIndexRef.current = currentExpressionIndex;
  isFullscreenRef.current = isFullscreen;

  const playToggleSound = useCallback(() => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = 200;
    filter.Q.value = 8;

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequency = isGenerating ? 60 : 50;
    const duration = 0.3;

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext, isGenerating]);

  const playStackSound = useCallback(() => {
    if (!audioContext) return;

    const heartbeats = [
      { frequency: 40, duration: 0.2, gain: 0.7 },
      { frequency: 30, duration: 0.1, gain: 0.2 },
      { frequency: 35, duration: 0.15, gain: 0.5 },
    ];

    heartbeats.forEach(({ frequency, duration, gain }, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.value = 80;
      filter.Q.value = 18;

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const startTime = audioContext.currentTime + index * 0.25;
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }, [audioContext]);

  playStackSoundRef.current = playStackSound;

  const markAwaitingImage = useCallback((v: boolean) => {
    awaitingImageRef.current = v;
    setAwaitingImage(v);
  }, []);

  const runSubscribe = useCallback(
    async (input: FastSdxlInput, opts: { chainAuto: boolean }) => {
      if (subscribeLockRef.current) return;
      subscribeLockRef.current = true;
      markAwaitingImage(true);

      try {
        const result = await fal.subscribe(FAL_MODEL, {
          input,
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS" && update.logs?.length) {
              update.logs.map((log) => log.message).forEach((m) =>
                console.log("[fal queue]", m),
              );
            }
          },
        });

        if (process.env.NODE_ENV === "development") {
          console.debug("[fal] requestId", result.requestId);
        }

        const coerced = subscribeResultToPayload(result.data);
        if (!coerced) {
          markAwaitingImage(false);
          setGenerationError(
            "fal.subscribe finished but the response shape was unexpected (see console).",
          );
          return;
        }

        const newImageUrl = await falRealtimePayloadToDisplayUrl(coerced);
        if (!newImageUrl) {
          markAwaitingImage(false);
          setGenerationError(
            "Model returned data we could not turn into an image (check console / Network tab).",
          );
          return;
        }

        setGenerationError(null);
        markAwaitingImage(false);

        generationSeqRef.current += 1;
        const newGeneration = generationSeqRef.current;

        setGenerationCount(newGeneration);

        setImageHistory((prevHistory) => {
          const updated = prevHistory.map((img) => ({
            ...img,
            isLatest: false,
          }));
          return [
            ...updated,
            {
              url: newImageUrl,
              timestamp: new Date().toISOString(),
              generation: newGeneration,
              isLatest: true,
            },
          ];
        });

        setImage(newImageUrl);
        setNewImageId(newGeneration);
        setTimeout(() => setNewImageId(null), 1000);

        const inf = coerced.timings?.inference;
        setInferenceTime(typeof inf === "number" ? inf : NaN);

        playStackSoundRef.current();

        if (opts.chainAuto && isGeneratingRef.current) {
          flushAutoChainTimers();
          autoChainTimeoutRef.current = window.setTimeout(() => {
            generateNewImageRef.current();
          }, 150);
        }
      } catch (e) {
        console.error("fal.subscribe failed:", e);
        markAwaitingImage(false);
        const message =
          e instanceof Error ? e.message : String(e ?? "fal.subscribe error");
        setGenerationError(message);
      } finally {
        subscribeLockRef.current = false;
      }
    },
    [markAwaitingImage],
  );

  const timer = useRef<number | undefined>(undefined);

  const generateNewImage = useCallback(() => {
    setCurrentExpressionIndex((prev) => {
      const idx = getRandomPrompt(prev);
      const promptText = EXPRESSIONS[idx].prompt;

      setPrompt(promptText);
      expressionIndexRef.current = idx;

      const nextSeed = generateNearbySeed(seedRef.current);
      seedRef.current = nextSeed;
      setSeed(nextSeed);

      void runSubscribe(
        {
          ...INPUT_DEFAULTS,
          prompt: promptText,
          seed: Number(nextSeed),
        },
        { chainAuto: true },
      );

      return idx;
    });
  }, [runSubscribe]);

  generateNewImageRef.current = generateNewImage;

  const toggleGeneration = useCallback(() => {
    void audioContext?.resume?.().catch(() => {});
    playToggleSound();
    setIsTickerPlaying((t) => !t);
    setIsGenerating((prev) => {
      const next = !prev;
      isGeneratingRef.current = next;
      if (!next) {
        markAwaitingImage(false);
        flushAutoChainTimers();
      }
      return next;
    });
    setAutoGenerate((a) => !a);
  }, [audioContext, playToggleSound, markAwaitingImage]);

  toggleGenerationRef.current = toggleGeneration;

  const handleOnChange = async (prompt: string) => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
    setPrompt(prompt);

    const nextSeed = (parseInt(seed, 10) + 1).toString().padStart(7, "0");
    setSeed(nextSeed);

    timer.current = window.setTimeout(() => {
      void runSubscribe(
        {
          ...INPUT_DEFAULTS,
          prompt,
          seed: Number(nextSeed),
        },
        { chainAuto: false },
      );
    }, 500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
  }, []);

  useEffect(() => {
    return () => flushAutoChainTimers();
  }, []);

  useEffect(() => {
    if (!awaitingImage) return;
    const id = window.setTimeout(() => {
      if (!awaitingImageRef.current) return;
      markAwaitingImage(false);
      setGenerationError(
        "No result from fal.subscribe within 120s. In DevTools → Network, check `/api/fal/proxy` targets `queue.fal.run` and that FAL_KEY is set on the server.",
      );
    }, 120000);
    return () => clearTimeout(id);
  }, [awaitingImage, markAwaitingImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key === "Escape") {
        if (isFullscreenRef.current) {
          e.preventDefault();
          setIsFullscreen(false);
          setZoomLevel(1);
          setDragPosition({ x: 0, y: 0 });
        }
        return;
      }

      if ((e.key === "f" || e.key === "F") && shouldUseSpaceShortcut()) {
        setIsFullscreen((prev) => !prev);
        return;
      }

      if (e.key !== " " && e.code !== "Space") return;
      if (isFullscreenRef.current) return;

      if (!shouldUseSpaceShortcut()) return;

      e.preventDefault();
      toggleGenerationRef.current();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  useEffect(() => {
    if (newImageId && gridRef.current) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: 'end',
      };
      
      gridRef.current.scrollIntoView(scrollOptions);
    }
  }, [newImageId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
    }
  }, []);

  useEffect(() => {
    if (autoGenerate) {
      generateNewImage();
    }
  }, [autoGenerate, generateNewImage]);

  // Add zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(1, zoomLevel + delta), 4);
    setZoomLevel(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.pageX - dragPosition.x,
      startY: e.pageY - dragPosition.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setDragPosition({
      x: e.pageX - dragRef.current.startX,
      y: e.pageY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <main tabIndex={-1} className="min-h-screen bg-black outline-none focus:outline-none">
      {DISABLED ? (
        <DisabledMessage />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {generationError ? (
            <div
              className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {generationError}
            </div>
          ) : null}
          <div className={`fixed top-0 left-0 right-0 h-16 ${styles.tickerContainer} backdrop-blur-sm pointer-events-none z-40 overflow-hidden border-b border-white/10`}>
            <div className="h-full flex items-center">
              <div className={styles.container}>
                <div className={`${styles.text} ${isTickerPlaying ? styles.textPlaying : ''}`}>
                  {STORY_TEXT.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <span className={styles.separator}>●</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div ref={gridRef} className="flex flex-col gap-8 max-w-[2000px] mx-auto">
            {imageHistory.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 space-y-2 max-w-md mx-auto">
                <p className="text-neutral-400">Press Space while this page has focus — or tap “Start Auto” below.</p>
                <p className="text-xs text-neutral-600">
                  If DevTools / the browser toolbar has focus, click the artwork area once, then try Space again.
                </p>
              </div>
            ) : (
              chunkArray(imageHistory, 4).map((row, rowIndex) => (
                <div 
                  key={rowIndex}
                  className={`grid grid-cols-4 gap-4 ${
                    rowIndex % 2 === 0 ? '' : 'flex-row'
                  }`}
                >
                  {row.map((img) => (
                    <div 
                      key={img.generation}
                      className={`
                        relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900
                        ${newImageId === img.generation ? 'pop-in' : ''}
                        ${img.isLatest ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}
                        transform transition-all duration-500 hover:scale-105
                        ${img.isLatest ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
                        shadow-lg
                        ${newImageId === img.generation ? 'saturate-150' : 'saturate-100'}
                      `}
                    >
                      <img
                        src={img.url}
                        alt={`Generated image ${img.generation}`}
                        className={`
                          w-full h-full object-cover
                          ${newImageId === img.generation ? 'shimmer' : ''}
                        `}
                        onClick={() => {
                          setImage(img.url);
                          setIsFullscreen(true);
                        }}
                      />
                      <div className={`
                        absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2
                        ${newImageId === img.generation ? 'animate-fade-in' : ''}
                      `}>
                        <div className="text-white/80 text-xs flex items-center gap-1">
                          <span>#{img.generation}</span>
                          {newImageId === img.generation && (
                            <span className="px-1.5 py-0.5 bg-blue-500/20 rounded-full text-[10px] animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <div 
                        className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 
                        transition-opacity duration-300 flex items-center justify-center
                        backdrop-blur-sm"
                      >
                        <button
                          onClick={() => {
                            setImage(img.url);
                            setIsFullscreen(true);
                          }}
                          className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70
                          transform transition-transform duration-300 hover:scale-110"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Fill empty spaces in the last row */}
                  {rowIndex === Math.floor(imageHistory.length / 4) && 
                    Array(4 - row.length).fill(null).map((_, i) => (
                      <div 
                        key={`empty-${i}`} 
                        className="relative aspect-[3/4] bg-neutral-900/20 rounded-lg"
                      />
                    ))
                  }
                </div>
              ))
            )}
          </div>

          <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <h3 className="font-light text-neutral-400 mb-1">{PROJECT_TITLE}</h3>
                  <p className="text-neutral-500">{PROJECT_DESCRIPTION}</p>
                  <p className="text-sm mt-2 px-3 py-1.5 inline-block rounded-full bg-white/10 font-light text-white">
                    {EXPRESSIONS[currentExpressionIndex].mood}
                  </p>
                </div>
                <div>
                  <h3 className="font-light text-neutral-400 mb-1">Controls</h3>
                  <p className="text-neutral-500">Press Space here (focus the canvas, not Chrome DevTools) or tap “Start Auto”. Press [f] for fullscreen.</p>
                  <button
                    onClick={toggleGeneration}
                    className={`
                      mt-2 px-4 py-2 rounded-lg transition-all duration-300 w-full
                      ${isGenerating 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                      }
                      relative overflow-hidden
                    `}
                  >
                    <span className="relative z-10">
                      {isGenerating ? 'Stop Auto' : 'Start Auto'}
                    </span>
                    {isGenerating && (
                      <span className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                  </button>
                </div>
                <div>
                  <h3 className="font-light text-neutral-400 mb-1">Stats</h3>
                  <p className="text-neutral-500">Generated: {generationCount}</p>
                  <p className="text-neutral-500">
                    Inference: {inferenceTime ? `${(inferenceTime * 1000).toFixed(0)}ms` : 'n/a'}
                  </p>
                  <p className="text-neutral-500">Seed: {seed}</p>
                  {awaitingImage ? (
                    <p className="text-amber-400/95">Waiting for fal…</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <a 
                    href="https://fal.ai" 
                    className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-2 justify-end"
                    target="_blank"
                  >
                    Powered by
                    <span className="bg-neutral-800 px-2 py-1 rounded-md hover:bg-neutral-700">
                      fal.ai
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {isFullscreen && image && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-lg"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={image} 
                alt="Fullscreen view"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl cursor-move"
                style={{
                  transform: `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
              />
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white/70 text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setZoomLevel(1);
                  setDragPosition({ x: 0, y: 0 });
                }}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/50 hover:bg-black/70 
                text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
