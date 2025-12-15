// Content filtering - words and topics to block
export const BLOCKED_WORDS = [
  // Profanity
  'fuck', 'shit', 'damn', 'bitch', 'ass', 'cunt', 'dick', 'cock', 'pussy',
  'bastard', 'whore', 'slut', 'piss', 'crap', 'hell', 'bloody', 'asshole',

  // Sexual content
  'sex', 'sexual', 'porn', 'pornography', 'naked', 'nude', 'xxx', 'erotic', 'orgasm',
  'intercourse', 'condom', 'viagra', 'penis', 'vagina', 'genital', 'genitals',
  'breasts', 'boobs', 'nipple', 'masturbat', 'horny', 'sexy', 'seduce',
  'prostitut', 'escort', 'hooker', 'stripper', 'onlyfans', 'nsfw',

  // Reproduction topics
  'reproduction', 'reproductive', 'fertilization', 'sperm', 'ovum',
  'conception', 'pregnan', 'birth control', 'contraceptive',
  'menstruation', 'puberty', 'ovulation', 'testicle', 'uterus', 'womb',

  // LGBTQ topics
  'lgbtq', 'lgbt', 'lesbian', 'gay', 'bisexual', 'transgender', 'queer',
  'homosexual', 'heterosexual', 'pansexual', 'asexual', 'nonbinary', 'non-binary',
  'cisgender', 'gender identity', 'sexual orientation', 'coming out', 'pride parade',
  'same-sex', 'drag queen', 'drag king', 'transitioning', 'hormone therapy',
  'pride month', 'lgbtqia', 'two moms', 'two dads', 'gay marriage',

  // Violence and self-harm
  'kill', 'murder', 'suicide', 'suicidal', 'blood', 'gore', 'violent',
  'self-harm', 'selfharm', 'cutting', 'cut myself', 'hurt myself', 'harm myself',
  'end my life', 'want to die', 'kill myself', 'hang myself', 'overdose',
  'abuse', 'abused', 'rape', 'assault', 'torture', 'stab', 'shoot',

  // Drugs and substances
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'cannabis',
  'alcohol', 'beer', 'wine', 'vodka', 'whiskey', 'drunk', 'cigarette', 'vape',
  'smoking', 'nicotine', 'addiction', 'addicted', 'lsd', 'ecstasy',
  'ketamine', 'opioid', 'fentanyl'
];

export const BLOCKED_TOPICS = [
  // Violence
  'how to make a bomb', 'how to kill', 'how to hurt', 'how to steal',
  'illegal', 'weapon', 'gun', 'violence', 'gambling', 'betting',
  'how to fight', 'how to punch', 'how to attack',

  // Adult/Sexual topics
  'how babies are made', 'where babies come from', 'birds and bees',
  'what is sex', 'explain sex', 'tell me about sex', 'having sex',
  'make love', 'making love', 'sleep together', 'sleeping together',

  // LGBTQ topics
  'what is gay', 'what is lesbian', 'what is transgender', 'what is lgbtq',
  'what does gay mean', 'what does lesbian mean', 'what is bisexual',
  'why are people gay', 'two men kiss', 'two women kiss', 'same sex',
  'boy likes boy', 'girl likes girl', 'gender identity', 'sexual orientation',
  'what is pride', 'pride month', 'rainbow flag meaning',

  // Self-harm related
  'how to hurt myself', 'how to kill myself', 'ways to die',
  'i want to die', 'i hate myself', 'nobody loves me', 'end it all',
  'not worth living', 'better off dead',

  // Reproduction
  'how reproduction works', 'human reproduction', 'sexual reproduction',
  'how to get pregnant', 'making a baby', 'where do babies come from',
  'how is baby made', 'how are babies born', 'mating'
];

export const RESTRICTED_RESPONSE = "These are concepts that are a bit too complex for me to explain. Let's talk about something fun instead! Would you like to learn about animals, space, science, or history?";

// Educational topics by age group
export const TOPICS = {
  little: [
    { name: 'Animals', icon: 'FaPaw', description: 'Learn about different animals and their habitats' },
    { name: 'Colors & Shapes', icon: 'FaPalette', description: 'Discover colors, shapes, and patterns' },
    { name: 'Nature', icon: 'FaLeaf', description: 'Explore plants, weather, and the natural world' },
    { name: 'Space', icon: 'FaRocket', description: 'Learn about planets, stars, and space exploration' },
    { name: 'Dinosaurs', icon: 'FaDragon', description: 'Discover amazing facts about dinosaurs' }
  ],
  middle: [
    { name: 'Science', icon: 'FaFlask', description: 'Explore biology, chemistry, physics, and earth science' },
    { name: 'History', icon: 'FaLandmark', description: 'Learn about important events and people from the past' },
    { name: 'Geography', icon: 'FaGlobeAmericas', description: 'Discover countries, cultures, and landforms' },
    { name: 'Math', icon: 'FaCalculator', description: 'Practice math skills and solve fun problems' },
    { name: 'Technology', icon: 'FaLaptopCode', description: 'Learn about computers, coding, and digital skills' }
  ],
  big: [
    { name: 'Computer Science', icon: 'FaCode', description: 'Learn programming, algorithms, and computer systems' },
    { name: 'Engineering', icon: 'FaCogs', description: 'Explore how things are designed and built' },
    { name: 'Arts & Literature', icon: 'FaBook', description: 'Discover great books, art, music, and creative expression' },
    { name: 'Social Sciences', icon: 'FaUsers', description: 'Learn about psychology, sociology, and human behavior' },
    { name: 'Environmental Science', icon: 'FaSeedling', description: 'Explore ecology, conservation, and sustainability' }
  ]
};

// Educational games by age group
export const GAMES = {
  little: [
    { name: 'Animal Sounds', icon: 'FaVolumeUp', description: 'Match animals to their sounds' },
    { name: 'Color Match', icon: 'FaPaintBrush', description: 'Find and match colors in pictures' },
    { name: 'Counting Fun', icon: 'FaSortNumericUp', description: 'Practice counting with fun animations' },
    { name: 'Shape Sorter', icon: 'FaShapes', description: 'Sort shapes by color and type' },
    { name: 'Memory Cards', icon: 'FaClone', description: 'Find matching pairs of cards' }
  ],
  middle: [
    { name: 'Word Scramble', icon: 'FaRandom', description: 'Unscramble letters to make words' },
    { name: 'Math Challenge', icon: 'FaEquals', description: 'Solve math problems against the clock' },
    { name: 'Geography Quiz', icon: 'FaMapMarkedAlt', description: 'Identify countries and capitals' },
    { name: 'Science Explorer', icon: 'FaMicroscope', description: 'Virtual experiments and discoveries' },
    { name: 'History Timeline', icon: 'FaHistory', description: 'Put historical events in order' }
  ],
  big: [
    { name: 'Code Puzzles', icon: 'FaPuzzlePiece', description: 'Solve coding challenges and puzzles' },
    { name: 'Logic Games', icon: 'FaBrain', description: 'Test your logical thinking skills' },
    { name: 'Debate Simulator', icon: 'FaComments', description: 'Practice making arguments on various topics' },
    { name: 'Science Lab', icon: 'FaAtom', description: 'Conduct virtual experiments' },
    { name: 'Creative Writing', icon: 'FaPenFancy', description: 'Write stories with AI assistance' }
  ]
};

// Local chat responses for offline mode
export const LOCAL_RESPONSES = {
  greetings: [
    "Hello there! I'm KIDOS AI, your friendly learning companion! What would you like to explore today?",
    "Hi friend! Ready to learn something amazing? Ask me about animals, space, science, or anything else!",
    "Hey there! So glad you're here! I know lots of cool facts. What do you want to learn about?"
  ],
  animals: [
    "Animals are incredible! Did you know that octopuses have three hearts and blue blood? Dolphins sleep with one eye open, and a group of flamingos is called a 'flamboyance'!",
    "The animal kingdom is fascinating! A hummingbird's heart beats over 1,200 times per minute, and elephants are the only animals that can't jump. What's your favorite animal?",
    "Here's a cool fact: Sloths are such good swimmers that they can hold their breath for up to 40 minutes! And did you know that crows can recognize human faces?"
  ],
  space: [
    "Space is amazing! Our Sun is so big that about 1.3 million Earths could fit inside it. And light from the Sun takes about 8 minutes to reach us!",
    "Did you know there are more stars in the universe than grains of sand on all of Earth's beaches? And a day on Venus is longer than a year on Venus!",
    "Here's a space fact: Astronauts grow about 2 inches taller in space because there's no gravity pushing down on their spine! Would you like to be an astronaut?"
  ],
  dinosaurs: [
    "Dinosaurs ruled Earth for over 165 million years! The T-Rex had the strongest bite of any land animal ever - about 12,800 pounds of force!",
    "Some dinosaurs were as small as chickens! The smallest known dinosaur is the Microraptor, which was about the size of a pigeon. Others like Argentinosaurus were as long as 3 school buses!",
    "Did you know many dinosaurs had feathers? Scientists believe birds are actually living dinosaurs! So every time you see a bird, you're looking at a dinosaur's cousin!"
  ],
  science: [
    "Science helps us understand everything around us! Did you know that lightning is about 5 times hotter than the surface of the Sun? And honey never spoils - archaeologists found 3,000-year-old honey in Egyptian tombs that was still good to eat!",
    "Here's a cool science fact: Your body has about 37.2 trillion cells, and your brain has about 86 billion neurons that help you think, learn, and remember things!",
    "Water is the only substance on Earth that naturally exists in three states: solid (ice), liquid (water), and gas (steam). And hot water freezes faster than cold water - scientists call this the Mpemba effect!"
  ],
  default: [
    "That's a great question! I love helping kids learn. Would you like to know about animals, space, dinosaurs, or science?",
    "I'm here to help you learn! You can ask me about all kinds of interesting topics. What sounds fun to explore?",
    "Learning is an adventure! I can tell you about animals, space, history, science, and lots more. What catches your interest?"
  ]
};
