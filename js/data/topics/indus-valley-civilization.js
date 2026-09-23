// Topic: Indus Valley Civilization
// Source of truth: "ivc 2nd.pdf" (a summary of Singh's account). Every fact below comes from that
// dataset; `sourcePages` points back to the page references it cites.
//
// Content blocks inside each section:
//   { type: 'p', text }                          paragraph ("**bold**" supported)
//   { type: 'list', items: [...] }               bullet list
//   { type: 'callout', variant: 'key'|'debated', text }
//
// Questions: `correctAnswer` is the 0-based index into `options`.
App.topics.register({
  id: 'indus-valley-civilization',
  title: 'Indus Valley Civilization',
  subject: 'history',
  estimatedReadingTime: 5, // minutes
  readingPoints: 5,

  introduction:
    'More than 4,000 years ago, cities stood along the Indus and Ghaggar-Hakra rivers — around the same time as the great cities of Mesopotamia and Egypt. Yet until 1924, the world did not know they had existed. Here is what we know about this civilization, and what historians are still debating.',

  keyFacts: [
    { label: 'Age', value: 'Over 4,000 years' },
    { label: 'Recognised', value: '1924, by John Marshall' },
    { label: 'As old as', value: 'Mesopotamia & Egypt' },
    { label: 'Script', value: '~3,700 inscriptions, still unread' },
  ],

  sections: [
    {
      id: 'discovery',
      title: 'A discovery almost missed',
      sourcePages: 'p. 3–4',
      blocks: [
        { type: 'p', text: 'In the 1870s, **Alexander Cunningham** found the first Harappan seal at Harappa. It showed a bull and a script no one recognised. Because the bull had no hump — unlike Indian zebu cattle — he decided the seal must be foreign, and let the matter drop.' },
        { type: 'p', text: 'That one guess delayed recognition of an entire civilization by about fifty years. The scholar D. R. Bhandarkar even believed the ruins of Mohenjodaro were no more than 250 years old. They turned out to be **over 4,000 years old**.' },
        { type: 'p', text: 'In **1924**, **John Marshall** announced the discovery. Overnight, the origins of civilization in India were pushed back by about **2,500 years** — to roughly the same period as Mesopotamia and Egypt.' },
        { type: 'callout', variant: 'key', text: 'South Asia developed cities, writing and complex administration on its own — far earlier than 19th-century scholars had assumed.' },
      ],
    },
    {
      id: 'where',
      title: 'Where was it?',
      sourcePages: 'Site table supplied by the editor (not in the dataset); coordinates approximate',
      blocks: [
        { type: 'p', text: 'Harappan sites stretch from the **Makran coast** of Balochistan to **Uttar Pradesh**, and from **Punjab** down to **Gujarat** — mostly along the Indus, its tributaries and the Ghaggar-Hakra.' },
        {
          type: 'map',
          title: 'Major Harappan sites',
          caption: 'Tap or hover a site to see its name. Positions are approximate; borders are indicative.',
          base: 'southAsia',
          bounds: { west: 60.6, east: 79.6, south: 20.4, north: 32.6 },
          rivers: ['indus', 'jhelum', 'chenab', 'ravi', 'beas', 'sutlej', 'ghaggar', 'hakra', 'yamuna', 'hindon', 'sabarmati'],
          sites: [
            { name: 'Harappa', location: 'Punjab, Pakistan', river: 'Ravi', lat: 30.631, lon: 72.864 },
            { name: 'Mohenjo-daro', location: 'Sindh, Pakistan', river: 'Indus', lat: 27.324, lon: 68.136 },
            { name: 'Dholavira', location: 'Gujarat, India', river: 'Kutch (seasonal streams)', lat: 23.888, lon: 70.213 },
            { name: 'Lothal', location: 'Gujarat, India', river: 'Sabarmati / Gulf of Khambhat', lat: 22.522, lon: 72.249 },
            { name: 'Kalibangan', location: 'Rajasthan, India', river: 'Ghaggar (ancient Saraswati)', lat: 29.473, lon: 74.13 },
            { name: 'Rakhigarhi', location: 'Haryana, India', river: 'Ghaggar basin', lat: 29.29, lon: 76.114 },
            { name: 'Banawali', location: 'Haryana, India', river: 'Saraswati (ancient course)', lat: 29.598, lon: 75.393 },
            { name: 'Rupar (Ropar)', location: 'Punjab, India', river: 'Sutlej', lat: 30.967, lon: 76.533 },
            { name: 'Alamgirpur', location: 'Uttar Pradesh, India', river: 'Hindon', lat: 29.004, lon: 77.482 },
            { name: 'Sutkagan Dor', location: 'Balochistan, Pakistan', river: 'Makran coast', lat: 25.533, lon: 61.933 },
          ],
        },
      ],
    },
    {
      id: 'name',
      title: 'One civilization, three names',
      sourcePages: 'p. 9–10',
      blocks: [
        { type: 'p', text: 'You may hear it called the **Indus Valley**, **Harappan** or **Sindhu–Sarasvati** civilization.' },
        { type: 'p', text: 'Some scholars say "Indus–Sarasvati" because many sites lie along the **Ghaggar-Hakra river**, which they identify with the Sarasvati of the Rigveda. Others consider that identification unproven, and prefer the neutral name **"Harappan"**.' },
        { type: 'callout', variant: 'debated', text: 'The naming question is tied to much larger present-day debates about Vedic chronology and the origins of Indian civilization.' },
      ],
    },
    {
      id: 'origins',
      title: 'Where did it come from?',
      sourcePages: 'p. 11, 21–22',
      blocks: [
        { type: 'p', text: 'For decades, scholars argued that civilization reached the Indus from West Asia — either through people migrating from Sumer, or, as **Mortimer Wheeler** argued, through the spread of ideas.' },
        { type: 'p', text: 'The evidence now points closer to home. The roots of the civilization lie in **farming communities in Baluchistan**, as early as the seventh millennium BCE.' },
        { type: 'p', text: 'Nor did cities appear suddenly. The mature civilization grew out of a gradual **"cultural convergence"** of regional traditions. Shared pottery styles, early script-like symbols and a "horned deity" motif were already appearing at sites as far apart as Padri, Kalibangan, Dholavira and Harappa before the cities arose.' },
        { type: 'callout', variant: 'key', text: 'Harappan city life was not a sudden leap — it grew gradually out of local roots.' },
      ],
    },
    {
      id: 'cities',
      title: 'Cities and buildings',
      sourcePages: 'p. 23, 29, 31, 40',
      blocks: [
        { type: 'p', text: '**Dholavira** gave us a genuine first. Polished limestone pillar bases found there push back the earliest evidence of monumental stone architecture in the subcontinent — from the Mauryan period (4th century BCE) all the way to the **third millennium BCE**.' },
        { type: 'p', text: '**Mohenjodaro** and **Harappa** are the best-known cities, largely because they were excavated first. Newly reported sites in Punjab may be even bigger: **Lakhmirwala** covers roughly 225 hectares, compared with about 200 for Mohenjodaro — though details on these sites are still limited.' },
        { type: 'p', text: 'Even the famous "granaries" are uncertain. No charred grain or storage residue was ever found in them, which weakens an old theory that powerful rulers stockpiled grain.' },
        { type: 'callout', variant: 'debated', text: 'Were the "granaries" really granaries? The evidence is thin.' },
      ],
    },
    {
      id: 'crafts-trade',
      title: 'Crafts and trade',
      sourcePages: 'p. 55, 60–61',
      blocks: [
        { type: 'p', text: 'Harappan artisans made fine **carnelian beads**. Modern experiments show that drilling a single 6-cm bead took more than three days — so such beads were highly valued, and likely worn only by the rich.' },
        { type: 'p', text: 'Researchers worked out the ancient technique by studying bead-makers in **Khambhat (Cambay), Gujarat** — still one of the largest stone-bead centres in the world.' },
        { type: 'p', text: 'These beads travelled far. Harappan carnelian beads have been excavated from the **royal graves at Ur** in Mesopotamia. Mesopotamian records from the reign of **Sargon of Akkad** (2334–2279 BCE) mention ships arriving from a land called **"Meluhha"** — thought, though not proven, to be the Indus valley.' },
        { type: 'p', text: 'Still, trade with Mesopotamia was modest: only a handful of seals and beads moved in each direction. It was never direct, large-scale or central to the Harappan economy.' },
      ],
    },
    {
      id: 'script',
      title: 'A script no one can read',
      sourcePages: 'p. 63',
      blocks: [
        { type: 'p', text: 'About **3,700 Harappan inscriptions** survive, yet no one has deciphered them. Scholars do not even agree on the language they record — some argue for a Dravidian link, others for Indo-Aryan.' },
        { type: 'p', text: 'This is the single biggest open question in Harappan studies. It is the main reason so much about Harappan religion, society and politics remains uncertain.' },
        { type: 'callout', variant: 'key', text: 'Until the script is read, much of what we say about Harappan beliefs and government is informed guesswork.' },
      ],
    },
    {
      id: 'religion',
      title: 'Religion: the "Pashupati" seal',
      sourcePages: 'p. 68–70',
      blocks: [
        { type: 'p', text: 'The best-known Harappan religious object is the so-called **Pashupati seal**. John Marshall identified its seated figure as a **"proto-Shiva"** — an early form of Shiva as Pashupati, "lord of the animals", who is still worshipped today.' },
        { type: 'p', text: 'Nearly every detail of that reading has been challenged — whether the figure has three heads, and even whether it is male. Scholars **Dhavalikar and Atre** argue that it represents a goddess.' },
        { type: 'callout', variant: 'debated', text: 'The basics of Marshall’s reading still persuade some historians, but nothing is confirmed. It matters because the seal is often used to link the Indus civilization with living Hindu tradition.' },
      ],
    },
    {
      id: 'people-rulers',
      title: 'The people and their rulers',
      sourcePages: 'p. 20, 74, 76, 78–81',
      blocks: [
        { type: 'p', text: 'A study of ancient skulls found that Harappans differed from region to region — and that each region’s ancient population **resembled the people living in the same area today**.' },
        { type: 'p', text: 'At **Rakhigarhi**, excavators found a stacked set of "hopscotches" resembling **pithu**, a game still played by children across India and Pakistan. It suggests — tentatively — that the game may go back to early Harappan times.' },
        { type: 'p', text: 'Who ruled these cities? **No one knows for sure.** Historians have proposed:' },
        {
          type: 'list',
          items: [
            'An empire ruled by **priest-kings** (Piggott, Wheeler)',
            '**No state at all** — only village-level administration (Fairservis)',
            'Rule by **councils** rather than kings (Possehl)',
            '**Competing elite groups** — merchants, ritual specialists and those who controlled resources (Kenoyer)',
          ],
        },
      ],
    },
    {
      id: 'decline',
      title: 'Why did the cities decline?',
      sourcePages: 'p. 82–84',
      blocks: [
        { type: 'p', text: 'For a long time, textbooks said **Aryan invaders** destroyed the cities. Mortimer Wheeler based this on Rigvedic references to Indra as a "fort-destroyer", and on skeletons found at Mohenjodaro.' },
        { type: 'p', text: 'That theory has been **refuted**. The skeletons belong to different time periods, not a single massacre. None were found on the citadel, where a battle would be expected. And skeletal studies show no break in the population.' },
        { type: 'p', text: 'A better-supported explanation is **a river changing course**. Tectonic movements caused the **Sutlej** to join the Indus system instead of feeding the Ghaggar — and the number of settlements along the Ghaggar-Hakra valley fell sharply.' },
        { type: 'p', text: 'The decline was not the same everywhere. While Mohenjodaro was being abandoned, **Rojdi in Saurashtra** was expanding. People seem to have shifted east and south, rather than simply disappearing.' },
        { type: 'callout', variant: 'key', text: 'The Harappan civilization was not destroyed by an invasion. Its city life faded as settlement shifted to new regions.' },
      ],
    },
    {
      id: 'why-it-matters',
      title: 'Why it matters',
      sourcePages: 'p. 3–4, 55, 74, 76',
      blocks: [
        {
          type: 'list',
          items: [
            'It showed that South Asia built cities, writing and complex administration **independently**, as early as Mesopotamia and Egypt.',
            'Its traces live on — in Khambhat’s bead-makers, in the game of pithu, and in regional populations that resemble the ancient people of the same areas.',
            'Big questions remain open — the script, the rulers, the religion — so our picture of the Harappans is **still being written**.',
          ],
        },
      ],
    },
  ],

  // LEARN → confirms engagement with the lesson. Not scored; a wrong answer never blocks completion.
  quickCheck: {
    id: 'qc-1',
    question: 'Why do so many questions about the Harappans remain unanswered?',
    options: [
      'Their script has never been deciphered',
      'All their cities were destroyed by invaders',
      'No written inscriptions have survived',
      'Their cities were only discovered a few years ago',
    ],
    correctAnswer: 0,
    explanation:
      'About 3,700 Harappan inscriptions survive, but no one can read them. That is the main reason Harappan religion, society and politics remain uncertain.',
  },

  // RECALL → the immediate 3-question Quick Quiz on core lesson content.
  quizQuestions: [
    {
      id: 'q-1',
      question: 'Who announced the discovery of the Harappan civilization in 1924?',
      options: ['Alexander Cunningham', 'John Marshall', 'Mortimer Wheeler', 'D. R. Bhandarkar'],
      correctAnswer: 1,
      explanation:
        'Cunningham found the first seal in the 1870s but dismissed it as foreign. John Marshall’s announcement in 1924 finally revealed the civilization — about fifty years later.',
      points: 5,
    },
    {
      id: 'q-2',
      question: 'What did the polished limestone pillar bases found at Dholavira reveal?',
      options: [
        'That Harappan cities were less than 250 years old',
        'That monumental stone architecture existed in the subcontinent by the third millennium BCE',
        'That Dholavira was built during the Mauryan period',
        'That the Harappan script was an early form of Sanskrit',
      ],
      correctAnswer: 1,
      explanation:
        'The oldest evidence of monumental stone architecture used to date from the Mauryan period (4th century BCE). Dholavira pushed it back to the third millennium BCE.',
      points: 5,
    },
    {
      id: 'q-3',
      question: 'What does current evidence say about the theory that Aryan invaders destroyed the Harappan cities?',
      options: [
        'It has been refuted — the evidence does not show an invasion',
        'It is proven by a battle site on the citadel at Mohenjodaro',
        'It is confirmed by the deciphered Harappan script',
        'It explains why every Harappan town was abandoned at once',
      ],
      correctAnswer: 0,
      explanation:
        'The Mohenjodaro skeletons come from different periods, none were on the citadel, and there is no break in the population. A river changing course is a better-supported explanation.',
      points: 5,
    },
  ],

  // REMEMBER → shown the next day as "Yesterday's Flash" (spaced repetition). Not scored.
  yesterdayFlashQuestion: {
    id: 'flash-1',
    question: 'Ancient Mesopotamian records mention ships arriving from a land called “Meluhha”. What is Meluhha thought to be?',
    options: ['Ancient Egypt', 'The Indus valley', 'Ancient Greece', 'Ancient China'],
    correctAnswer: 1,
    explanation:
      'Records from the reign of Sargon of Akkad (2334–2279 BCE) name ships from Dilmun, Magan and Meluhha. Meluhha is identified — though not proven — as the Indus valley.',
  },

  // DEEPEN → optional Bonus Challenge. Goes beyond the lesson; points are only ever added.
  // `explanation` is two short lines.
  bonusQuestions: [
    {
      id: 'b-1',
      question: 'Before radiocarbon dating existed, what did scholars mainly rely on to work out when the Harappan civilization flourished?',
      options: [
        'Dates written in Harappan inscriptions',
        'Its trade links with Mesopotamia',
        'The age of the Rigveda',
        'Tree rings from Harappan timber',
      ],
      correctAnswer: 1,
      explanation: [
        'Harappan–Mesopotamian trade was the key tool for placing the civilization in time.',
        'The inscriptions could not help — the script has never been deciphered.',
      ],
      points: 5,
    },
    {
      id: 'b-2',
      question: 'Two metal objects from Lothal turned out to be 39.1% and 66.1% iron. Why is that surprising?',
      options: [
        'It hints that Harappans in Gujarat may have known some iron smelting before India’s Iron Age',
        'It proves the objects were imported from Mesopotamia',
        'It shows iron was the main metal used in Harappan cities',
        'It proves Lothal was built after the Mauryan period',
      ],
      correctAnswer: 0,
      explanation: [
        'The Harappan civilization is usually labelled a Bronze Age culture.',
        'These finds cautiously suggest some familiarity with iron well before India’s Iron Age began.',
      ],
      points: 5,
    },
  ],

  metadata: {
    sequence: 1, // teaching order within the subject
    era: 'Third millennium BCE',
    tags: ['ancient india', 'harappan', 'archaeology', 'bronze age'],
    source: {
      file: 'ivc 2nd.pdf',
      description: 'Dataset summarising Singh’s account; section page references point to that source.',
    },
    // Dataset material deliberately kept out of the lesson (some of it powers the Bonus Challenge).
    omittedFromLesson: [
      'Trade used to date the civilization before radiocarbon dating — used in Bonus b-1, p. 60',
      'Lothal iron objects (39.1% / 66.1% iron) — used in Bonus b-2, p. 50',
      'Climate debate (Gurdip Singh pollen analysis vs. Lunkaransar lake sediments), p. 41–42',
      'Horse-bone debate at Surkotada (Bökönyi vs. Meadow & Patel), p. 43',
      'Allahdino 36-bead belt (480+ work-days), p. 55',
      'Sterile layer / Cemetery-H detail in the invasion rebuttal, p. 82',
    ],
    version: 1,
  },
});
