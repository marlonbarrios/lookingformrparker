"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import * as fal from "@fal-ai/serverless-client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ModelIcon } from "@/components/icons/model-icon";
import Link from "next/link";
import styles from './ticker.module.css';

const DISABLED = false;
const DEFAULT_PROMPT = "extreme close up portrait of a 40 years old man, handsome, gentle blue eyes with tender gaze, soft blond hair falling naturally, warm fatherly expression, subtle smile, glowing skin with light sweat, golden hour lighting, shallow depth of field, emotional intimacy, vintage 1960s Polaroid aesthetic, soft focus, film grain, warm color palette, dreamy atmosphere";

const PROJECT_TITLE = "Looking for Mr. Parker";
const PROJECT_DESCRIPTION = "Capturing memories of a Sunday afternoon in Venezuela, 1960s";

// Add array of different emotional expressions
const EXPRESSIONS = [
  {
    prompt: "extreme close up of Mr. Parker's wise blue eyes, handsome 40 year old caucasian man, 1960s Venezuela, deep azure irises with golden flecks, fine crow's feet showing years of smiling, blonde lashes wet with workshop sweat, Kodachrome's legendary detail, shot on Hasselblad macro",
    mood: "wisdom eyes"
  },
  {
    prompt: "intimate portrait of Mr. Parker's gentle smile, 40 year old caucasian man, subtle laugh lines around mouth, light blonde stubble catching tropical light, teaching expression while speaking Spanish, sweat beading above lip, Kodachrome's rich tones, shot on Leica macro",
    mood: "gentle teacher"
  },
  {
    prompt: "ultra close up of Mr. Parker's expressive brow, 40 year old caucasian man, character lines showing experience, blonde hair falling across forehead, thoughtful furrow while explaining, workshop light streaming, Kodachrome's texture detail, shot on Nikon F macro",
    mood: "thoughtful brow"
  },
  {
    prompt: "macro detail of Mr. Parker's eye corner, 40 year old caucasian man, deep blue iris meeting weathered skin, fine lines showing maturity and joy, sweat catching golden light, dust motes floating, Kodachrome's legendary reproduction, shot on Rolleiflex macro",
    mood: "experienced gaze"
  },
  {
    prompt: "extreme close up of Mr. Parker's profile, 40 year old caucasian man, strong Nordic jawline softened by years, distinguished blonde stubble, teaching moment captured, Venezuelan sunlight backlighting face, Kodachrome's warmth, shot on Hasselblad macro",
    mood: "noble profile"
  },
  {
    prompt: "portrait of Mr. Parker's full face, handsome 40 year old caucasian man, 1960s Venezuela, mature yet youthful features, distinguished blonde hair, wise crystal blue eyes, gentle teaching smile, light sheen of sweat, backlit by tropical workshop light, Kodachrome's legendary color, shot on Hasselblad",
    mood: "distinguished teacher"
  },
  {
    prompt: "close up of Mr. Parker's experienced face, 40 year old caucasian man, refined features with character lines, intense blue eyes showing years of wisdom, blonde hair touched by time, workshop dust catching light, Kodachrome detail, shot on Leica",
    mood: "mature presence"
  },
  {
    prompt: "intimate portrait of Mr. Parker, 40 year old caucasian man, weathered yet handsome features, crystal blue eyes with depth of experience, blonde hair with subtle silver strands, speaking Spanish with authority, Kodachrome's rich tones, shot on Nikon F",
    mood: "seasoned charm"
  },
  {
    prompt: "profile portrait of Mr. Parker, distinguished 40 year old caucasian man, strong Nordic features softened by experience, blonde hair backlit by workshop window, mature yet vital presence, teaching with confidence, Kodachrome's texture, shot on Rolleiflex",
    mood: "wise mentor"
  },
  {
    prompt: "extreme close up of Mr. Parker's knowing blue eyes, 40 year old caucasian man, depth of experience in azure gaze, fine character lines at corners, blonde lashes catching tropical light, workshop dust dancing, Kodachrome's legendary reproduction, shot on Hasselblad macro",
    mood: "experienced gaze"
  },
  {
    prompt: "extreme macro of Mr. Parker's gentle blue eyes, masculine 30s caucasian man, 1960s Venezuela, crystal clear azure irises with golden sunbursts, tender gaze through wet lashes, teaching expression, Kodachrome's legendary color detail, shot on Hasselblad macro",
    mood: "tender gaze"
  },
  {
    prompt: "ultra close up of single sapphire eye, Mr. Parker 30s caucasian man, ocean-blue iris with flecks of gold, compassionate expression, tropical light making eye luminescent, gentle wisdom showing, Kodachrome detail, shot on Leica macro",
    mood: "ocean eye"
  },
  {
    prompt: "intimate detail of soft smile and eyes, Mr. Parker 30s caucasian man, crystal blue eyes crinkling with warmth, blonde lashes catching light, gentle expression while teaching Spanish, Kodachrome's texture, shot on Nikon F macro",
    mood: "gentle teacher"
  },
  {
    prompt: "extreme close up of caring blue eyes, Mr. Parker 30s caucasian man, cerulean irises with golden corona, tender gaze through blonde lashes, workshop light catching each blue tone, Kodachrome's rendering, shot on Rolleiflex macro",
    mood: "caring look"
  },
  {
    prompt: "macro detail of kind eyes and smile, Mr. Parker 30s caucasian man, intense blue eyes softened by gentle expression, light catching each azure detail, genuine warmth showing, Kodachrome's rich tones, shot on Hasselblad macro",
    mood: "kind eyes"
  },
  {
    prompt: "ultra close up of both crystalline eyes, Mr. Parker 30s caucasian man, pure blue irises like tropical waters, gentle soul showing through gaze, dust motes dancing in sunbeams, Kodachrome's legendary reproduction, shot on Leica macro",
    mood: "soul windows"
  },
  {
    prompt: "extreme macro of Mr. Parker's parted lips mid-word, masculine 30s caucasian man, 1960s Venezuela, light stubble catching sunlight, sweat beading above lip, teaching Spanish, Kodachrome's detail, shot on Hasselblad macro",
    mood: "speaking moment"
  },
  {
    prompt: "ultra close up of intense blue eyes and brows, Mr. Parker 30s caucasian man, powerful masculine gaze, thick blonde eyelashes wet with sweat, tropical light making irises luminescent, Kodachrome detail, shot on Leica macro",
    mood: "piercing gaze"
  },
  {
    prompt: "intimate detail of cheekbone and temple, Mr. Parker 30s caucasian man, strong bone structure, sweat trailing down, afternoon light catching blonde stubble, Venezuelan heat visible, Kodachrome's texture, shot on Nikon F macro",
    mood: "chiseled face"
  },
  {
    prompt: "extreme close up of smile lines and eye corner, Mr. Parker 30s caucasian man, genuine joy showing, blonde lashes casting shadows, workshop light catching each crease, Kodachrome's rendering, shot on Rolleiflex macro",
    mood: "joyful creases"
  },
  {
    prompt: "macro detail of strong jawline profile, Mr. Parker 30s caucasian man, masculine bone structure, light catching stubbled edge, sweat giving skin golden sheen, Kodachrome's rich tones, shot on Hasselblad macro",
    mood: "noble profile"
  },
  {
    prompt: "ultra close up of forehead and falling blonde hair, Mr. Parker 30s caucasian man, strands catching tropical light, sweat beading at hairline, dust motes like stars, Kodachrome's legendary reproduction, shot on Leica macro",
    mood: "golden crown"
  },
  {
    prompt: "extreme macro of Mr. Parker's strong jawline, masculine 30s caucasian man, 1960s Venezuela, defined bone structure, light stubble catching sunlight, sweat beading on tanned skin, workshop heat visible, Kodachrome's detail, shot on Hasselblad macro",
    mood: "masculine jaw"
  },
  {
    prompt: "ultra close up of intense blue eyes, Mr. Parker 30s caucasian man, powerful masculine gaze, thick blonde eyelashes, tropical light catching determined expression, dust motes floating, Kodachrome detail, shot on Leica macro",
    mood: "strong gaze"
  },
  {
    prompt: "intimate detail of muscular neck, Mr. Parker 30s caucasian man, prominent Adam's apple, masculine throat structure, sweat trailing down tanned skin, Venezuelan workshop glow, Kodachrome's texture, shot on Nikon F macro",
    mood: "strong neck"
  },
  {
    prompt: "extreme close up of temple and brow, Mr. Parker 30s caucasian man, masculine bone structure, blonde hair falling across strong forehead, sweat highlighting features, tropical atmosphere, Kodachrome's rendering, shot on Rolleiflex macro",
    mood: "masculine brow"
  },
  {
    prompt: "macro detail of firm set lips, Mr. Parker 30s caucasian man, strong masculine mouth, light blonde stubble, determined expression, backlit by workshop window, Kodachrome's rich tones, shot on Hasselblad macro",
    mood: "strong mouth"
  },
  {
    prompt: "ultra close up of broad shoulder muscle, Mr. Parker 30s caucasian man, powerful masculine form, sleeveless edge revealing tanned skin, workshop sweat glistening, dust dancing in sunbeams, Kodachrome's legendary reproduction, shot on Leica macro",
    mood: "powerful form"
  },
  {
    prompt: "extreme macro of Mr. Parker's neck pulse, 35 years old caucasian man, 1960s Venezuela, visible heartbeat under tanned skin, fine blonde hair catching tropical light, sweat beading, Kodachrome's detail, shot on Hasselblad macro",
    mood: "beating pulse"
  },
  {
    prompt: "ultra close up of Mr. Parker's collarbone, 35 years old caucasian man, sunburnt skin with light sheen, sleeveless shirt edge, workshop sweat glistening, dust motes in sunbeams, Kodachrome's texture, shot on Leica macro",
    mood: "golden collar"
  },
  {
    prompt: "intimate detail of Mr. Parker's temple vein, 35 years old caucasian man, throbbing under skin, blonde hair falling across, afternoon light creating ethereal glow, Venezuelan heat evident, Kodachrome's rendering, shot on Nikon F macro",
    mood: "temple detail"
  },
  {
    prompt: "extreme close up of Mr. Parker's shoulder muscle, 35 years old caucasian man, tensed from work, fine golden hair on tanned skin, sweat droplets catching light, backlit by workshop window, Kodachrome's contrast, shot on Rolleiflex macro",
    mood: "strong shoulder"
  },
  {
    prompt: "macro detail of Mr. Parker's nape, 35 years old caucasian man, blonde hair curling from heat, skin flushed from work, tropical sunlight streaming through workshop, dust particles like stars, Kodachrome's rich tones, shot on Hasselblad macro",
    mood: "golden nape"
  },
  {
    prompt: "ultra close up of Mr. Parker's bicep curve, 35 years old caucasian man, sleeveless edge cutting across muscle, light hair catching sunlight, skin glistening with effort, workshop atmosphere, Kodachrome's detail, shot on Leica macro",
    mood: "curved muscle"
  },
  {
    prompt: "extreme close up of Mr. Parker's muscular forearm, 35 years old caucasian man, 1960s Venezuela, blonde arm hair catching tropical sunlight, skin glistening with workshop sweat, veins visible beneath sunburnt skin, Kodachrome's texture detail, shot on Hasselblad macro",
    mood: "golden arm"
  },
  {
    prompt: "macro detail of Mr. Parker's bicep, 35 years old caucasian man, sleeveless shirt edge, fine blonde hair on tanned skin, afternoon light creating rim lighting on muscle definition, dust particles in sunbeams, Kodachrome's contrast, shot on Leica macro",
    mood: "strong bicep"
  },
  {
    prompt: "ultra close up of Mr. Parker's shoulder and upper arm, 35 years old caucasian man, light golden hair on muscular form, sweat beading on skin, Venezuelan sunlight through workshop window, backlit creating ethereal glow, Kodachrome's rich tones, shot on Nikon F macro",
    mood: "glowing arm"
  },
  {
    prompt: "extreme macro of Mr. Parker's forearm muscle, 35 years old caucasian man, blonde arm hair like spun gold in sunlight, skin flushed from work, tropical heat evident in beading sweat, workshop dust dancing in light beams, Kodachrome's detail rendering, shot on Rolleiflex macro",
    mood: "sunlit muscle"
  },
  {
    prompt: "intimate detail of Mr. Parker's tensed arm, 35 years old caucasian man, fine blonde hair catching afternoon light, veins visible beneath tanned skin, tropical workshop atmosphere, dust motes like stars around limb, Kodachrome's legendary reproduction, shot on Hasselblad macro",
    mood: "strong form"
  },
  {
    prompt: "extreme macro shot of Mr. Parker's left eye, 35 years old caucasian man, 1960s Venezuela, crystal blue iris with gold flecks, backlit by tropical sunlight creating halo effect, light rays through workshop dust, Kodachrome's color detail, shot on Hasselblad macro",
    mood: "luminous eye"
  },
  {
    prompt: "profile silhouette of Mr. Parker, 35 years old caucasian man, strong rim light from workshop window, golden Venezuelan sunlight creating angelic glow around blonde hair, dust particles illuminated like stars, Kodachrome's light rendering, shot on Leica macro",
    mood: "divine light"
  },
  {
    prompt: "extreme close up of temple and hair, Mr. Parker 35 years old caucasian man, afternoon light streaming through blonde strands creating ethereal glow, sweat droplets catching light like diamonds, Kodachrome's backlight detail, shot on Nikon F macro",
    mood: "golden halo"
  },
  {
    prompt: "macro detail of neck and shoulder, Mr. Parker 35 years old caucasian man, strong backlighting through workshop window, light wrapping around muscular form, sweat creating prismatic effects, Kodachrome's contrast, shot on Rolleiflex macro",
    mood: "light embrace"
  },
  {
    prompt: "ultra close up of ear and jawline, Mr. Parker 35 years old caucasian man, late afternoon sun creating rim light, workshop dust illuminated like fireflies, skin glowing from within, Kodachrome's luminance, shot on Hasselblad macro",
    mood: "sacred glow"
  },
  {
    prompt: "extreme macro shot of Mr. Parker's left eye, 35 years old caucasian man, 1960s Venezuela, crystal blue iris with gold flecks, single tear of sweat above, sunlight making eye luminescent, Kodachrome's color detail, shot on Hasselblad macro",
    mood: "left eye"
  },
  {
    prompt: "extreme macro of right eye corner, Mr. Parker 35 years old caucasian man, smile wrinkles forming, blonde eyelashes catching light, tear duct glistening, tropical heat evident, Kodachrome detail, shot on Leica macro",
    mood: "eye corner"
  },
  {
    prompt: "ultra close up of upper lip and philtrum, Mr. Parker speaking Spanish, 35 years old caucasian man, light sweat forming, gentle expression, workshop dust visible, Kodachrome's skin tones, shot on Nikon F macro",
    mood: "speaking detail"
  },
  {
    prompt: "extreme close up of temple vein, Mr. Parker 35 years old caucasian man, pulse visible, blonde hair falling across, skin flushed from work, Venezuelan sunlight, Kodachrome's texture detail, shot on Rolleiflex macro",
    mood: "temple pulse"
  },
  {
    prompt: "macro detail of thumb and forefinger, Mr. Parker 35 years old caucasian man, gripping wooden boat frame, sawdust in skin creases, workshop patina, afternoon light, Kodachrome's grain, shot on Hasselblad macro",
    mood: "working fingers"
  },
  {
    prompt: "extreme close up of ear and jaw, Mr. Parker 35 years old caucasian man, strong bone structure, sweat trailing down, skin golden in tropical light, teaching moment, Kodachrome's warmth, shot on Leica macro",
    mood: "profile detail"
  },
  {
    prompt: "ultra macro of neck pulse point, Mr. Parker 35 years old caucasian man, heartbeat visible, skin glistening, workshop heat evident, shadow of collar, Kodachrome's detail, shot on Nikon F macro",
    mood: "neck pulse"
  },
  {
    prompt: "extreme close up of wrist tendons, Mr. Parker 35 years old caucasian man, working on boat, veins prominent, skin taught from grip, sunburnt texture, Kodachrome's contrast, shot on Rolleiflex macro",
    mood: "working wrist"
  },
  {
    prompt: "intimate detail of laugh lines, Mr. Parker 35 years old caucasian man, genuine joy showing, sweat beading, afternoon light catching each crease, Kodachrome's legendary reproduction, shot on Hasselblad macro",
    mood: "joy lines"
  },
  {
    prompt: "macro shot of shoulder muscle, Mr. Parker 35 years old caucasian man, tension from work visible, sleeveless shirt edge, sunburnt skin gleaming, Venezuelan workshop light, Kodachrome's texture, shot on Leica macro",
    mood: "working muscle"
  },
  {
    prompt: "three-quarter view of Mr. Parker, 30s caucasian man, masculine features softened by warm expression, crystal blue eyes focused on teaching, blonde hair tousled from work, sunburnt skin glowing, Venezuelan sunlight streaming, Kodachrome's rich tones, shot on Nikon F",
    mood: "warm presence"
  },
  {
    prompt: "profile portrait of Mr. Parker, 30s caucasian man, strong Nordic features, blonde hair backlit by workshop window, perfect bone structure, teaching expression, sweat giving skin golden glow, dust particles like stars, Kodachrome's texture, shot on Rolleiflex",
    mood: "noble teacher"
  },
  {
    prompt: "intimate portrait of Mr. Parker's face, 30s caucasian man, blue eyes crinkled in genuine smile, blonde hair falling across forehead, light stubble catching light, speaking Spanish with care, workshop atmosphere, Kodachrome's warmth, shot on Hasselblad",
    mood: "genuine smile"
  }
];

// Add a constant for the initial seed
const INITIAL_SEED = '1234567'; // A fixed seed for consistent first generation

// Update the story text constant
const STORY_TEXT = `I could hear my heartbeat when he was close to me. I was 8. A Sunday, warm. We went to Mr. Parker's house. My grandmother's boss. He was from Texas, she said. A big place, far off. Didn't know much about it. Only the name. Texas. He worked for La Creole. The oil company. My grandmother, self-taught in English, had worked her way up to this. Proud.

We found him in the back. He was working on a boat. A wooden boat. He called us over, us kids. The boat wasn't finished. Pieces of wood, scattered. He wasn't wearing much. A sleeveless shirt. Arms bare, skin pale. Pink in places, burnt from the sun. His hair, blonde, messy. He looked at me. "Marlon, look at this." His voice, low. He showed me the wood, how he was fitting it together. I nodded, but I wasn't watching the wood. I watched him. His arms, his hands. The way his skin looked, almost glowing in the sun. The way he spoke. English. Not just words, but something else. I didn't understand. Couldn't. But I listened. It was like hearing something far off. A place I didn't know.

He switched to Spanish. Slow, deliberate, the words thick with his "gringo" accent. Clumsy, but sweet. He tried. It made me smile. Made me feel something, though I didn't know what. There was a rhythm in the air. Something I couldn't name. Not then. I just stood there, listening. The heat of the Venezuelan sun, his voice, the way he looked at me. Like I was the only one there.

Goosebumps rose on my arms, even though it was warm. He smiled. I remember that. And the sound of his voice. And something else, something like seeing a shadow before it arrives. Like knowing what's coming, even if you don't have the words for it yet. It was all there, in his voice, in the way he spoke. I couldn't see the boat. Couldn't see anything else. Just him. The way his arms moved, the way his skin flushed under the sun. The words didn't matter. I didn't understand it all, but I didn't need to. It stayed with me.`;

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

const INPUT_DEFAULTS = {
  _force_msgpack: new Uint8Array([]),
  enable_safety_checker: false,
  image_size: {
    width: 768,
    height: 768,
  },
  sync_mode: true,
  num_images: 1,
  num_inference_steps: "2",
  temperature: 0.5,
};

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
  const autoGenerateInterval = useRef<NodeJS.Timeout | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ startX: 0, startY: 0 });
  const [isTickerPlaying, setIsTickerPlaying] = useState(false);

  const connection = fal.realtime.connect("fal-ai/flux-schnell-realtime", {
    connectionKey: "flux-schnell-realtime",
    throttleInterval: 75,
    onResult: (result) => {
      const blob = new Blob([result.images[0].content], { type: "image/jpeg" });
      const newImageUrl = URL.createObjectURL(blob);
      const newGeneration = generationCount + 1;
      
      // Update all existing images to not be latest
      setImageHistory(prev => {
        const updated = prev.map(img => ({
          ...img,
          isLatest: false
        }));
        
        // Add new image at the end
        return [...updated, {
          url: newImageUrl,
          timestamp: new Date().toISOString(),
          generation: newGeneration,
          isLatest: true
        }];
      });
      
      setImage(newImageUrl);
      setNewImageId(newGeneration);
      setTimeout(() => setNewImageId(null), 1000);

      setInferenceTime(result.timings.inference);
      setGenerationCount(prev => prev + 1);
      
      // Play stacking sound for each new image
      playStackSound();
      
      if (isGenerating) {
        const nextSeed = generateNearbySeed(seed);
        setSeed(nextSeed);
        
        connection.send({
          ...INPUT_DEFAULTS,
          prompt: EXPRESSIONS[currentExpressionIndex].prompt,
          seed: Number(nextSeed),
          num_inference_steps: "4",
          temperature: 0.5
        });
      }
    },
  });

  const timer = useRef<any | undefined>(undefined);

  const handleOnChange = async (prompt: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPrompt(prompt);
    
    const nextSeed = (parseInt(seed) + 1).toString().padStart(7, '0');
    setSeed(nextSeed);
    
    const input = {
      ...INPUT_DEFAULTS,
      prompt: prompt,
      seed: Number(nextSeed),
      temperature: 0.5
    };
    connection.send(input);
    timer.current = setTimeout(() => {
      connection.send({ ...input, num_inference_steps: "4" });
    }, 500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleGeneration = () => {
    setIsGenerating(!isGenerating);
    setAutoGenerate(!autoGenerate);
    setIsTickerPlaying(!isTickerPlaying);
    playToggleSound();
    
    if (!isGenerating) {
      generateNewImage();
    } else {
      if (autoGenerateInterval.current) {
        clearInterval(autoGenerateInterval.current);
        autoGenerateInterval.current = null;
      }
    }
  };

  const generateNewImage = () => {
    // Get random prompt instead of sequential
    setCurrentExpressionIndex((prev) => getRandomPrompt(prev));
    setPrompt(EXPRESSIONS[currentExpressionIndex].prompt);
    
    const nextSeed = generateNearbySeed(seed);
    setSeed(nextSeed);
    
    connection.send({
      ...INPUT_DEFAULTS,
      prompt: EXPRESSIONS[currentExpressionIndex].prompt,
      seed: Number(nextSeed),
      num_inference_steps: "4",
      temperature: 0.5
    });
  };

  const playToggleSound = useCallback(() => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    filter.type = 'lowpass';
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

    // Create a more pronounced heartbeat pattern with higher volume
    const heartbeats = [
      { frequency: 40, duration: 0.2, gain: 0.7 },  // First "lub" - stronger (increased from 0.4)
      { frequency: 30, duration: 0.1, gain: 0.2 },  // Quick pause (increased from 0.1)
      { frequency: 35, duration: 0.15, gain: 0.5 }, // Second "dub" - softer (increased from 0.3)
    ];

    heartbeats.forEach(({ frequency, duration, gain }, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      // Deeper, more resonant filter settings
      filter.type = 'lowpass';
      filter.frequency.value = 80;  // Even lower frequency for deeper sound
      filter.Q.value = 18;  // Higher resonance for more "thump"

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // More pronounced heartbeat envelope with higher volume
      const startTime = audioContext.currentTime + (index * 0.25);
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);  // Faster attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }, [audioContext]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(!isFullscreen);
      }
      
      if (e.key === ' ' && !(e.target as Element)?.matches?.('input, textarea')) {
        e.preventDefault();
        toggleGeneration();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, isGenerating, toggleGeneration]);

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
      autoGenerateInterval.current = setInterval(() => {
        generateNewImage();
      }, 75);
      
      generateNewImage();
    }
    
    return () => {
      if (autoGenerateInterval.current) {
        clearInterval(autoGenerateInterval.current);
        autoGenerateInterval.current = null;
      }
    };
  }, [autoGenerate]);

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
    <main className="min-h-screen bg-black">
      {DISABLED ? (
        <DisabledMessage />
      ) : (
        <div className="container mx-auto px-4 py-8">
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
              <div className="text-center py-20 text-neutral-500">
                <p>Press [space] or click Generate to start</p>
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
                  <p className="text-neutral-500">Press [space] to generate</p>
                  <p className="text-neutral-500">Press [f] for fullscreen</p>
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
