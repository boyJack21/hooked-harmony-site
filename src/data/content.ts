export type Difficulty = "Beginner" | "Easy" | "Intermediate" | "Advanced";
export type Tone = "clay" | "sage" | "rose" | "cream" | "coco";

export interface Pattern {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  yardage: string;
  gauge: string;
  tool: string;
  yarn: string;
  description: string;
  steps: string[];
  isFeatured: boolean;
  emoji: string;
  tone: Tone;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  technique: string;
  level: Difficulty;
  minutes: number;
  content: string[];
  emoji: string;
  tone: Tone;
}

export interface Maker {
  id: string;
  name: string;
  location: string;
  specialty: string;
  bio: string;
  website: string;
  initials: string;
  tone: Tone;
}

export const patterns: Pattern[] = [
  {
    id: "p1",
    slug: "terracotta-throw",
    title: "Terracotta Chunky Throw",
    category: "Home",
    difficulty: "Intermediate",
    yardage: "1,850 yds",
    gauge: "12 sts x 16 rows = 4 in",
    tool: "8mm crochet hook",
    yarn: "2 strands DK-weight wool",
    description:
      "A generously sized, super-cozy throw worked in chunky terracotta and cream stripes. The half-double crochet body keeps it dense and drapey, while a simple moss-stitch border frames it beautifully.",
    steps: [
      "Foundation chain of 150 (or your preferred width) with a double strand of yarn.",
      "Work half-double crochet across, turning each row, until the panel reaches your desired length.",
      "Switch yarn colors every 10 rows for a relaxed stripe rhythm.",
      "Finish with two rounds of single crochet moss stitch around the entire edge.",
      "Weave in all ends and steam-block for a soft, even finish.",
    ],
    isFeatured: true,
    emoji: "🧶",
    tone: "clay",
  },
  {
    id: "p2",
    slug: "sage-ribbed-beanie",
    title: "Sage Ribbed Beanie",
    category: "Accessories",
    difficulty: "Easy",
    yardage: "185 yds",
    gauge: "18 sts x 24 rows = 4 in",
    tool: "5.5mm crochet hook",
    yarn: "Worsted-weight merino",
    description:
      "A beginner-friendly beanie with a satisfyingly bouncy ribbed texture. Worked in the round with only front-post and back-post double crochet, it comes together in a single evening.",
    steps: [
      "Begin with an adjustable magic ring and 8 double crochet.",
      "Increase to 48 stitches evenly across two rounds.",
      "Work front-post/back-post double crochet ribbing for 6 inches.",
      "Begin decreases over 4 rounds to shape the crown.",
      "Pull the remaining yarn through the last stitches and fasten off.",
    ],
    isFeatured: false,
    emoji: "🧢",
    tone: "sage",
  },
  {
    id: "p3",
    slug: "dusty-rose-shawl",
    title: "Dusty Rose Lace Shawl",
    category: "Accessories",
    difficulty: "Advanced",
    yardage: "720 yds",
    gauge: "16 sts x 8 rows = 4 in",
    tool: "5mm knitting needles",
    yarn: "Fingering-weight mohair blend",
    description:
      "A featherweight triangular shawl with an ethereal lace border. Knit from a single cast-on, the garter body flows into a scalloped eyelet edge that drapes beautifully.",
    steps: [
      "Cast on 3 stitches and knit a garter-stitch wedge, increasing every 4 rows.",
      "Continue to your chosen wingspan, then prepare for the border.",
      "Follow the lace chart: yarn overs, k2tog, and slipped-edge scallops.",
      "Bind off loosely so the lace can open fully.",
      "Wet-block aggressively to reveal the openwork pattern.",
    ],
    isFeatured: true,
    emoji: "🕊️",
    tone: "rose",
  },
  {
    id: "p4",
    slug: "cream-granny-squares",
    title: "Heirloom Granny Square Blanket",
    category: "Home",
    difficulty: "Beginner",
    yardage: "2,400 yds",
    gauge: "4 rounds = 3 in",
    tool: "5mm crochet hook",
    yarn: "Worsted-weight cotton blend",
    description:
      "A classic granny-square sampler in cream, sage, and clay. Fifty-six squares crocheted separately and whip-stitched together make a cherished heirloom throw.",
    steps: [
      "Crochet 56 granny squares in three classic cluster rounds each.",
      "Join with a contrasting single-crochet seam, alternating color placements.",
      "Add a wide shell-stitch border around the full blanket.",
      "Block each square lightly before joining for crisp corners.",
    ],
    isFeatured: false,
    emoji: "⬜",
    tone: "cream",
  },
  {
    id: "p5",
    slug: "coco-amigurumi-bear",
    title: "Cocoa Amigurumi Bear",
    category: "Amigurumi",
    difficulty: "Intermediate",
    yardage: "120 yds",
    gauge: "N/A (tight tension)",
    tool: "3.5mm crochet hook",
    yarn: "Worsted-weight cotton",
    description:
      "A sweet little bear with a sable-brown coat and embroidered face. Worked in continuous spirals, it's the perfect pocket-sized gift.",
    steps: [
      "Work head in the round with even increases to 42 stitches.",
      "Shape the muzzle and embroider eyes and a nose.",
      "Create the body, then two arms and two legs worked in spirals.",
      "Stuff firmly and sew parts together with the yarn tail.",
      "Add a tiny scalloped ear detail for extra charm.",
    ],
    isFeatured: false,
    emoji: "🧸",
    tone: "coco",
  },
  {
    id: "p6",
    slug: "sage-dishcloth",
    title: "Sage Textured Dishcloth",
    category: "Home",
    difficulty: "Easy",
    yardage: "90 yds",
    gauge: "16 sts x 22 rows = 4 in",
    tool: "4mm knitting needles",
    yarn: "Worsted-weight cotton",
    description:
      "A quick, grid-textured dishcloth with a seed-stitch border. Great for learning slipped stitches and a satisfying weekend knit.",
    steps: [
      "Cast on 44 stitches.",
      "Knit a 6-row seed-stitch border.",
      "Repeat a 4-row texture pattern (knit, purl, slip) across the body.",
      "Finish with a matching seed-stitch border and bind off.",
    ],
    isFeatured: false,
    emoji: "🧽",
    tone: "sage",
  },
  {
    id: "p7",
    slug: "clay-cabled-cowl",
    title: "Clay Cabled Cowl",
    category: "Accessories",
    difficulty: "Advanced",
    yardage: "260 yds",
    gauge: "20 sts x 26 rows = 4 in",
    tool: "5.5mm knitting needles + cable needle",
    yarn: "Worsted-weight tweed",
    description:
      "A structured infinity cowl with a dramatic rope cable running up the center. The tweed yarn adds warmth and hides mistakes beautifully.",
    steps: [
      "Cast on 110 stitches and join in the round.",
      "Work a 1x1 rib for 3 inches for a snug fold.",
      "Begin the cable chart: 8-stitch rope cable crossed every 8 rows.",
      "Knit to your desired height and finish with a ribbed bind-off.",
    ],
    isFeatured: true,
    emoji: "🧣",
    tone: "clay",
  },
  {
    id: "p8",
    slug: "rose-baby-blanket",
    title: "Rose Baby Blanket",
    category: "Home",
    difficulty: "Beginner",
    yardage: "940 yds",
    gauge: "14 sts x 20 rows = 4 in",
    tool: "5mm knitting needles",
    yarn: "Superwash merino (baby-safe)",
    description:
      "A buttery-soft baby blanket in a simple seed-and-stripe pattern. Washable, breathable, and a cherished new-baby gift.",
    steps: [
      "Cast on 100 stitches.",
      "Knit alternating seed-stitch and stockinette stripes.",
      "Work until the panel is square, then add a garter border.",
      "Bind off loosely and wash gently to soften.",
    ],
    isFeatured: false,
    emoji: "🧡",
    tone: "rose",
  },
];

export const tutorials: Tutorial[] = [
  {
    id: "t1",
    slug: "magic-ring",
    title: "The Magic Ring, Made Simple",
    technique: "Crochet",
    level: "Beginner",
    minutes: 8,
    content: [
      "The magic ring (or adjustable loop) lets you begin crocheting in the round with a completely closed center — no hole left behind.",
      "Wrap the yarn twice around your index finger, then pinch the crossing point.",
      "Draw up a loop and chain 1 to secure, then work your first round into the ring.",
      "Pull the yarn tail to cinch the ring closed tightly.",
      "Practice with 6 single crochet until the motion feels natural.",
    ],
    emoji: "🎯",
    tone: "clay",
  },
  {
    id: "t2",
    slug: "reading-patterns",
    title: "How to Read a Crochet or Knit Pattern",
    technique: "General",
    level: "Easy",
    minutes: 12,
    content: [
      "Patterns pack a lot into abbreviations — starting by decoding the legend saves you from unraveling work.",
      "Look for the gauge first: matching it is the difference between a snug hat and a floppy one.",
      "Read round/row numbers as checkpoints, not instructions to be memorized.",
      "Mark your place with a highlighter or row counter so you never lose your spot.",
      "When something repeats, read the asterisk (*) section as a loop, not a one-time instruction.",
    ],
    emoji: "📖",
    tone: "sage",
  },
  {
    id: "t3",
    slug: "frogging-without-tears",
    title: "Frogging Without Tears",
    technique: "General",
    level: "Easy",
    minutes: 5,
    content: [
      "Ripping back work is a normal part of making — no project is a straight line.",
      "Before you pull, place a locking stitch marker into the row below where you want to stop.",
      "Gently pull the working loop and unravel to the marker.",
      "Insert your hook or needle into the marker's stitch and continue confidently.",
    ],
    emoji: "🐸",
    tone: "cream",
  },
  {
    id: "t4",
    slug: "blocking-knit-pieces",
    title: "Blocking: The Secret to a Professional Finish",
    technique: "Knitting",
    level: "Intermediate",
    minutes: 15,
    content: [
      "Blocking evens out stitches, opens up lace, and makes your finished piece look store-bought.",
      "For wool, wet-block: soak, gently squeeze out water, then pin into shape and let dry.",
      "For acrylic, steam-block with an iron hovering just above the surface — never press directly.",
      "Use rust-proof blocking pins and a flat, padded surface.",
      "Always block before seaming or adding borders for best results.",
    ],
    emoji: "📏",
    tone: "rose",
  },
  {
    id: "t5",
    slug: "tension-troubleshooting",
    title: "Tension Troubleshooting",
    technique: "Knitting",
    level: "Beginner",
    minutes: 10,
    content: [
      "Uneven tension usually comes from inconsistent yarn hold, not a lack of talent.",
      "Slow down and keep your working yarn at a consistent tension by anchoring it in your fingers.",
      "Check your gauge swatch — if it's off, change needle/hook size rather than gripping harder.",
      "A tension ring can help if your gauge fluctuates between projects.",
    ],
    emoji: "⚖️",
    tone: "coco",
  },
  {
    id: "t6",
    slug: "weaving-in-ends",
    title: "Weaving in Ends That Never Show",
    technique: "Crochet",
    level: "Easy",
    minutes: 6,
    content: [
      "Neat ends mean a piece that stays put for years instead of slowly unraveling.",
      "Thread the yarn tail onto a blunt tapestry needle.",
      "Weave it back and forth through the wrong side, changing direction once.",
      "Trim close but leave a tiny tail; avoid cutting into the weave.",
    ],
    emoji: "🧵",
    tone: "sage",
  },
];

export const makers: Maker[] = [
  {
    id: "m1",
    name: "Amara Okafor",
    location: "Cape Town, South Africa",
    specialty: "Amigurumi & toys",
    bio: "Amara turns leftover yarn into cheerful little creatures. Her stuffed animals have been gifted to hundreds of new babies across the country.",
    website: "amara.makes",
    initials: "AO",
    tone: "clay",
  },
  {
    id: "m2",
    name: "Lena Van Der Berg",
    location: "Ghent, Belgium",
    specialty: "Lace shawls & fine knits",
    bio: "A lifelong knitter, Lena hand-dyes her own fingering-weight yarn and publishes delicate lace patterns inspired by old Flemish gardens.",
    website: "lena.weaves",
    initials: "LV",
    tone: "rose",
  },
  {
    id: "m3",
    name: "Maya Chen",
    location: "Portland, USA",
    specialty: "Modern home textiles",
    bio: "Maya designs chunky throws and cushions in a calm, earthy palette. Her work has been featured in several craft magazines.",
    website: "maya.hooks",
    initials: "MC",
    tone: "sage",
  },
  {
    id: "m4",
    name: "Theo Ndlovu",
    location: "Johannesburg, South Africa",
    specialty: "Technical crochet & teaching",
    bio: "Theo runs weekend workshops teaching beginners the ropes. His patient, no-fuss explanations have helped thousands of new makers get hooked.",
    website: "theo.crochets",
    initials: "TN",
    tone: "coco",
  },
  {
    id: "m5",
    name: "Sofia Reyes",
    location: "Mexico City, Mexico",
    specialty: "Colorwork & brioche",
    bio: "Sofia's vibrant brioche scarves are a riot of color. She shares weekly swatch experiments with her growing online community.",
    website: "sofia.knits",
    initials: "SR",
    tone: "cream",
  },
  {
    id: "m6",
    name: "Ingrid Larsen",
    location: "Oslo, Norway",
    specialty: "Traditional Nordic knits",
    bio: "Ingrid preserves Scandinavian stranded-knitting traditions, adapting heirloom mitten and sweater patterns for modern yarns.",
    website: "ingrid.wool",
    initials: "IL",
    tone: "clay",
  },
];
