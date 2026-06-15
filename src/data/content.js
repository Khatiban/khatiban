// All site content for Ehsan Khatiban — single source of truth.

export const profile = {
  name: 'EHSAN KHATIBAN',
  first: 'EHSAN',
  last: 'KHATIBAN',
  role: 'AI / ML Engineer',
  tagline: 'Software engineer turning data into intelligence.',
  location: 'Linz, Austria',
  email: 'Khatibanehsan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ehsankhatiban/',
  github: 'https://github.com/Khatiban',
  githubUser: 'Khatiban',
};

// Floating italic keywords that radiate from the hero wordmark (the "synapse" map).
// x / y are viewport percentages. side hints which way the connector leaves the word.
export const heroWords = [
  { text: 'machine learning', x: 22, y: 16 },
  { text: 'neural networks', x: 50, y: 11 },
  { text: 'python', x: 78, y: 15 },
  { text: 'deep learning', x: 88, y: 24 },
  { text: 'pytorch', x: 14, y: 27 },
  { text: 'research', x: 35, y: 33 },
  { text: 'transformers', x: 66, y: 35 },
  { text: 'vision', x: 90, y: 40 },
  { text: 'reinforcement', x: 9, y: 44 },
  { text: 'tensorflow', x: 93, y: 52 },
  { text: 'java', x: 12, y: 60 },
  { text: 'algorithms', x: 30, y: 70 },
  { text: 'intelligence', x: 70, y: 67 },
  { text: 'data', x: 85, y: 73 },
  { text: 'models', x: 22, y: 80 },
  { text: 'innovation', x: 50, y: 86 },
  { text: 'curiosity', x: 74, y: 83 },
  { text: 'linz', x: 90, y: 88 },
];

export const sections = [
  { id: 'home', index: '001', label: 'HOME' },
  { id: 'about', index: '002', label: 'ABOUT' },
  { id: 'skills', index: '003', label: 'SKILLS' },
  { id: 'work', index: '004', label: 'WORK' },
  { id: 'projects', index: '005', label: 'PROJECTS' },
  { id: 'contact', index: '006', label: 'CONTACT' },
];

export const about = {
  heading: 'I build systems that learn.',
  body: [
    'I am a software engineer evolving into artificial intelligence — currently pursuing a Master of Artificial Intelligence at Johannes Kepler University in Linz, Austria.',
    'For six years I shipped real products: a scalable IPTV platform running on smart TVs, blockchain smart contracts securing in-game economies, and mobile apps used across multiple markets. Today I channel that engineering rigour into deep learning, reinforcement learning and the architectures behind modern intelligence.',
  ],
  facts: [
    { k: 'Based in', v: 'Linz, Austria' },
    { k: 'Focus', v: 'Deep Learning · RL · NLP' },
    { k: 'Studying', v: 'M.Sc. Artificial Intelligence — JKU' },
    { k: 'Experience', v: '6+ years software engineering' },
  ],
  education: [
    { degree: 'M.Sc. Artificial Intelligence', org: 'Johannes Kepler University, Linz', period: '2024 — present' },
    { degree: 'M.Sc. IT E-commerce', org: 'Azad University (IAU)', period: '2022 — 2024' },
    { degree: 'B.Sc. Civil Engineering Technology', org: 'University of Applied Sciences & Technology', period: '2018 — 2021' },
  ],
};

export const skills = [
  {
    group: 'Machine Learning',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Deep Learning', 'Reinforcement Learning', 'NLP'],
  },
  {
    group: 'Languages',
    items: ['Python', 'Java', 'C#', 'SQL'],
  },
  {
    group: 'Data',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'NLTK', 'Data Analysis', 'Visualisation'],
  },
  {
    group: 'Engineering',
    items: ['REST APIs', 'ASP.NET', 'Android', 'Docker', 'AWS', 'Git / GitLab'],
  },
];

export const experience = [
  {
    role: 'Software Developer',
    org: 'Amvaj Gostar Novin',
    period: '2021 — 2024',
    points: [
      'Designed and built a scalable IPTV platform for smart TVs serving hotel and residential environments.',
      'Shipped and maintained multiple production releases (Tvplayer, Amvaj-v1, Amvaj-v2).',
      'Optimised performance and responsiveness across a fragmented landscape of smart-TV hardware.',
    ],
    repos: ['TVPlayer', 'amvaj-v1', 'amvaj-v2'],
  },
  {
    role: 'Blockchain Developer',
    org: 'Independent',
    period: '2022',
    points: [
      'Developed and deployed smart contracts for the Cherry Blossom Token (CBL) powering secure in-game transactions.',
      'Collaborated with a distributed team on blockchain apps (2win, Niwa, Punch, Hush3).',
      'Focused on contract security, gas efficiency and seamless integration into gaming ecosystems.',
    ],
    repos: ['hush3', 'Niwa', 'Punch', 'simp2win'],
  },
  {
    role: 'Application Developer',
    org: 'Dehnad',
    period: '2018 — 2020',
    points: [
      'Built and delivered mobile applications with a focus on usability and performance.',
      'Implemented features that improved engagement across products (30Day, Dambel, Tahchin).',
      'Maintained and continuously improved live applications through fixes and enhancements.',
    ],
    repos: ['30Day', 'Dambel', 'tahchin'],
  },
  {
    role: 'Application Developer',
    org: 'Freelance',
    period: '2018 — 2019',
    points: [
      'Delivered 9+ successful client projects across web and mobile platforms.',
      'Built applications including Airtoken, Face-car, InstaFull, Behina and Grep.',
      'Worked directly with clients to define requirements and ship tailored solutions.',
    ],
    repos: ['airtoken', 'Face-Car', 'InstaFull', 'GREP', 'Behina_app'],
  },
];

export const projects = [
  {
    n: '01',
    title: 'Deep RL Agent — DOOM',
    tags: ['DQN', 'PPO', 'Computer Vision'],
    blurb:
      'A reinforcement-learning agent that plays a DOOM-based environment from raw pixels. Implemented and tuned DQN and PPO, encoding 128×128 visual frames through neural encoders, then evaluated agent behaviour across simulations.',
  },
  {
    n: '02',
    title: 'xLSTM Architecture',
    tags: ['RNN', 'Sequence Models'],
    blurb:
      'Implemented and analysed the xLSTM architecture as an extension of classical LSTM — building sLSTM with scalar memory and a new update mechanism, and mLSTM with matrix memory for better scalability and parallelism.',
  },
  {
    n: '03',
    title: 'Transformers vs. LSTM',
    tags: ['NLP', 'Attention'],
    blurb:
      'Built a compact Transformer from scratch and benchmarked it against LSTM. Used token and positional embeddings, GELU activations and dropout, then dissected where attention outperforms recurrence.',
  },
  {
    n: '04',
    title: 'QSAR Bioactivity Modeling',
    tags: ['Life Sciences', 'Data'],
    blurb:
      'Predicted molecular bioactivity and toxicity from chemical structure. Processed SMILES data, integrated assays from PubChem and ChEMBL, and ran cleaning plus exploratory analysis to surface structure–activity patterns.',
  },
];

export const contact = {
  heading: "Let's build something intelligent.",
  body: 'Open to roles in AI, machine learning and backend engineering — and to interesting collaborations.',
};
