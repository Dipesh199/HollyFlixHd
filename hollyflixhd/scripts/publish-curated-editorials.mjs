import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../data/editorials');

const curatedEditorials = {
  'dune-part-two-2024': {
    editorial: "Few modern sci-fi spectacles match the overwhelming sensory scale of Denis Villeneuve's desert epic. Picking up immediately after House Atreides falls, you follow Paul Atreides as he embraces Fremen guerrilla warfare while wrestling with the horrifying prophetic visions of a holy war fought in his name. Austin Butler's hairless, psychopathic turn as Feyd-Rautha on the monochrome infrared surface of Giedi Prime injects a jolt of menace that balances Zendaya's skeptical, emotionally grounded Chani. The film's 166-minute runtime demands patience for complex intergalactic politics and religious fanaticism, but the payoff during the climactic siege of Arrakeen is pure cinematic majesty. If you crave visionary, tactile world-building and sound design that rattles your chest, this is an essential big-screen experience.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["sci-fi", "tactile-epic", "desert-warfare", "visionary"],
    toneAndPace: "monumental, operatic, pulse-pounding",
    targetAudience: "Ideal for sci-fi enthusiasts who appreciate grand-scale political intrigue and philosophical depth over breezy action.",
    similarMovies: ["Blade Runner 2049", "Lawrence of Arabia", "Oppenheimer"],
    watchReasons: [
      "Greig Fraser's jaw-dropping infrared cinematography",
      "Austin Butler's chilling Feyd-Rautha performance",
      "Hans Zimmer's thunderous, tactile soundscape"
    ]
  },
  'oppenheimer-2023': {
    editorial: "Christopher Nolan strips away the standard biographical safety net to construct a relentless, ticking psychological thriller about the man who gave humanity the power to annihilate itself. You spend three hours inside the haunted, piercing blue eyes of Cillian Murphy as J. Robert Oppenheimer, balancing scientific breakthroughs in Los Alamos against the radioactive fallout of political betrayal in Lewis Strauss's kangaroo hearing room. Robert Downey Jr. gives a career-best performance in crisp black-and-white 65mm IMAX, capturing pure bureaucratic spite with devastating quietness. Ludwig Göransson's frenetic violin score builds an unbearable undercurrent of dread, though the rapid non-linear cross-cutting and dense courtroom dialogue require your absolute undivided attention. It is a terrifying, monumental masterpiece that refuses to offer easy moral closure.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["historical-drama", "psychological-thriller", "biopic", "cerebral"],
    toneAndPace: "frenetic, intense, dread-soaked",
    targetAudience: "Ideal for lovers of dense historical dramas and psychological character studies who appreciate moral complexity.",
    similarMovies: ["The Social Network", "Amadeus", "There Will Be Blood"],
    watchReasons: [
      "Cillian Murphy's haunting, Oscar-winning lead performance",
      "Robert Downey Jr.'s masterful supporting turn",
      "Ludwig Göransson's anxiety-inducing orchestral score"
    ]
  },
  'deadpool-wolverine-2024': {
    editorial: "If you have grown weary of sanitized superhero formulas, this unapologetically filthy, blood-soaked buddy comedy delivers exactly the violent caffeine boost you were hoping for. Ryan Reynolds and Hugh Jackman share an electric, barbed chemistry as Wade Wilson drags a depressed, world-weary Logan into a multiversal wasteland presided over by Emma Corrin's delightfully sinister Cassandra Nova. The action sequences are vicious and creative, leaning heavily into R-rated slapstick set to exuberant 90s and 2000s pop anthems. The overarching TVA plot is paper-thin and exists almost entirely to service self-aware franchise roasts and crowd-pleasing cameos, so do not expect profound narrative stakes. Yet as a nostalgic, hyper-violent love letter to the 20th Century Fox Marvel era, it is an absolute blast from start to finish.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["superhero", "r-rated-action", "meta-comedy", "buddy-film"],
    toneAndPace: "irreverent, chaotic, fast-paced",
    targetAudience: "Ideal for Marvel fans and comedy seekers looking for high-energy R-rated action and self-aware pop culture roasts.",
    similarMovies: ["Deadpool", "Logan", "The Suicide Squad"],
    watchReasons: [
      "Hugh Jackman's fierce, long-awaited comic-accurate Wolverine return",
      "Genuinely hilarious R-rated meta-humor",
      "Exuberant, gore-soaked fight choreography"
    ]
  },
  'inside-out-2-2024': {
    editorial: "Puberty arrives like an overnight demolition crew in Headquarters, and Pixar manages to turn adolescent emotional turmoil into one of the most painfully relatable animated films in years. You watch Amy Poehler's Joy battle for control as Maya Hawke's Anxiety takes the helm, brilliantly capturing the suffocating loop of catastrophizing and self-doubt that accompanies growing up. What makes the film so resonant is its refusal to turn Anxiety into a traditional villain; she is driven by a misguided desire to protect Riley, leading to an extraordinary panic-attack sequence that will leave viewers of any age holding their breath. The narrative structure mirrors the 2015 original's road-trip format quite closely, but the psychological insight and emotional sincerity make this a triumphant sequel that hits straight to the heart.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["animation", "family", "psychological", "emotional"],
    toneAndPace: "heartfelt, vibrant, empathetic",
    targetAudience: "Ideal for families, teenagers, and adults who appreciate emotionally intelligent storytelling with deep psychological empathy.",
    similarMovies: ["Inside Out", "Turning Red", "Soul"],
    watchReasons: [
      "Maya Hawke's breakthrough, empathetic voice performance as Anxiety",
      "A deeply honest, non-judgmental look at teenage anxiety",
      "An emotional, tear-jerking climax about self-acceptance"
    ]
  },
  'wicked-2024': {
    editorial: "Jon M. Chu pulls off what many considered impossible, translating the legendary Broadway musical to the screen with dazzling visual grandeur and immense emotional resonance. You are swept into the emerald spires of Oz through the vibrant practical sets and palpable vocal chemistry between Cynthia Erivo's misunderstood Elphaba and Ariana Grande's bubbly, status-obsessed Glinda. Both leads sang their musical numbers live on set, giving their duets an immediate, raw theatrical energy that studio overdubs simply cannot replicate. Running over two and a half hours to adapt only the stage musical's first act, the pacing in the Shiz University dormitory chapters occasionally lingers, but Cynthia Erivo's soaring rendition of 'Defying Gravity' delivers pure cinematic euphoria. Whether you are a longtime theater fan or a newcomer to Oz, it is a grand musical spectacle that justifies every minute.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["musical", "fantasy", "broadway-adaptation", "spectacle"],
    toneAndPace: "enchanting, theatrical, soaring",
    targetAudience: "Ideal for musical theater enthusiasts and fantasy fans who relish powerhouse vocal performances and lavish production design.",
    similarMovies: ["The Wizard of Oz", "In the Heights", "The Greatest Showman"],
    watchReasons: [
      "Cynthia Erivo's show-stopping live vocal performance",
      "Ariana Grande's surprising comic timing and heart as Glinda",
      "Stunning practical sets of Munchkinland and Shiz University"
    ]
  },
  'the-substance-2024': {
    editorial: "Coralie Fargeat delivers an unhinged, visually maximalist body-horror satire that takes a buzzsaw to the entertainment industry's obsession with youth and female beauty. You follow fading fitness icon Elisabeth Sparkle, played with ferocious vulnerability by Demi Moore, as she injects a black-market serum to spawn a younger, perky alternate self portrayed with chilling ambition by Margaret Qualley. The film refuses subtlety; every needle puncture, surgical stitch, and studio executive masticating seafood is captured with squelching, hyper-saturated sensory brutality. The climactic third-act descent into prosthetic carnage and splatter comedy will undoubtedly push squeamish viewers out of the room. But if you have the stomach for unapologetic gore and razor-sharp feminist rage, it is one of the boldest cult horror films of the decade.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["body-horror", "satire", "cult-cinema", "feminist-horror"],
    toneAndPace: "grotesque, relentless, provocative",
    targetAudience: "Ideal for horror devotees and midnight-movie aficionados who relish extreme practical gore, dark satire, and audacious filmmaking.",
    similarMovies: ["The Fly", "Re-Animator", "Titane"],
    watchReasons: [
      "Demi Moore's brave, career-defining physical performance",
      "Breathtaking practical prosthetic creature effects",
      "Unflinching, hilarious critique of ageism and beauty standards"
    ]
  },
  'alien-romulus-2024': {
    editorial: "Fede Álvarez brings the Alien franchise back to its terrifying, claustrophobic haunted-house roots with tactile dread and slime-soaked practical puppetry. Set between the events of Ridley Scott's 1979 original and James Cameron's 1986 follow-up, you follow a ragtag crew of young asteroid miners exploring an abandoned Weyland-Yutani station, only to become prey to swarming Facehuggers and lethal Xenomorphs. David Jonsson steals the film as Andy, a malfunctioning synthetic brother whose shifting loyalties provide a fascinating emotional core beneath the survival terror. While the movie leans heavily on legacy fan-service and a divisive digital likeness in its midsection, the zero-gravity acid blood sequence and shocking third-act monster design deliver genuine nightmare fuel. It is an adrenaline-fueled creature feature that honors the franchise's grimy industrial heritage.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["sci-fi-horror", "creature-feature", "claustrophobic", "survival"],
    toneAndPace: "tense, grimy, adrenaline-fueled",
    targetAudience: "Ideal for fans of survival sci-fi and classic creature horror who appreciate practical monster effects and intense jump scares.",
    similarMovies: ["Alien", "Don't Breathe", "Prey"],
    watchReasons: [
      "David Jonsson's standout, nuanced performance as the android Andy",
      "Terrifying zero-gravity acid blood escape sequence",
      "Sensational practical creature effects and gothic space-station sets"
    ]
  },
  'spider-man-across-the-spider-verse-2023': {
    editorial: "Pushing animation far past existing boundaries, this visual marvel treats every single frame as a living, breathing work of fine art. You follow Miles Morales and Gwen Stacy as they navigate the Spider-Society across wildly contrasting dimensions, each rendered in its own groundbreaking artistic medium—from watercolor impressionism to Syd Mead cyberpunk and photocopied punk collage. Daniel Pemberton's eclectic score blends hip-hop beats, soaring operatic choirs, and distorted electric guitar to elevate the emotional stakes behind Miguel O'Hara's rigid philosophy of canon tragedy. Because the story ends on an abrupt mid-climax cliffhanger, you will feel the sudden jolt of an unfinished chapter. Yet the sheer audacity of its creative imagination and heartfelt family drama makes it an undisputed milestone in cinematic animation.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["animation", "multiverse", "superhero", "visual-masterpiece"],
    toneAndPace: "kinetic, mind-bending, emotional",
    targetAudience: "Ideal for animation lovers, comic-book fans, and anyone looking for cutting-edge visual storytelling with deep character stakes.",
    similarMovies: ["Spider-Man: Into the Spider-Verse", "The Mitchells vs. the Machines", "Puss in Boots: The Last Wish"],
    watchReasons: [
      "Unprecedented, multi-medium animation styles that redefine the genre",
      "Daniel Pemberton's exhilarating cross-genre musical score",
      "Daniel Kaluuya's unforgettable voice work as Hobie Brown (Spider-Punk)"
    ]
  },
  'barbie-2023': {
    editorial: "Greta Gerwig takes an iconic plastic corporate toy and constructs an unexpectedly poignant, candy-colored existential comedy about the triumphs and contradictions of human existence. You journey with Margot Robbie's Stereotypical Barbie as she experiences her first thoughts of mortality and cellulite, venturing from the neon-pink utopia of Barbieland into the messy realities of the real world. Ryan Gosling nearly steals the entire production with an Oscar-nominated comedic turn as Ken, perfectly balancing fragile patriarchal posturing with theatrical musical exuberance in 'I'm Just Ken'. While a few slapstick Mattel corporate boardroom chases feel somewhat cartoonish, the film's sharp comedic wit and America Ferrera's impassioned monologue make it a joyous, resonant cultural phenomenon.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["comedy", "feminist-satire", "existential", "musical-moments"],
    toneAndPace: "vibrant, satirical, bittersweet",
    targetAudience: "Ideal for comedy seekers and pop-culture enthusiasts who enjoy clever social satire wrapped in dazzling candy-colored visuals.",
    similarMovies: ["Clueless", "The Truman Show", "Legally Blonde"],
    watchReasons: [
      "Ryan Gosling's riotous, scene-stealing performance as Ken",
      "Imaginative practical set design and brilliant costume styling",
      "Greta Gerwig and Noah Baumbach's sharp, subversive screenplay"
    ]
  },
  'the-batman-2022': {
    editorial: "Matt Reeves leaves comic-book camp in the rearview mirror, delivering a rain-soaked, gritty detective procedural that owes far more to David Fincher's Se7en than traditional superhero epics. You trail Robert Pattinson's bruised, obsessive Batman through a rotting Gotham City as he investigates a trail of sadistic political murders orchestrated by Paul Dano's terrifyingly grounded Riddler. Greig Fraser's chiaroscuro cinematography bathes every alleyway in amber streetlights and heavy shadows, while Michael Giacchino's thunderous funeral-march score echoes through the city streets. At nearly three hours, the pacing is deliberately meditative and the final stadium flood sequence feels slightly elongated after the central mystery wraps. However, for anyone craving a serious, atmospheric neo-noir mystery, it is the most grounded Batman film since The Dark Knight.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["neo-noir", "crime-mystery", "detective", "atmospheric"],
    toneAndPace: "deliberate, shadowy, rain-soaked",
    targetAudience: "Ideal for neo-noir mystery lovers and Batman fans who prefer grounded detective investigations over bombastic superpower battles.",
    similarMovies: ["Se7en", "Zodiac", "The Dark Knight"],
    watchReasons: [
      "Robert Pattinson's reclusive, fiercely physical portrayal of the Caped Crusader",
      "Greig Fraser's breathtaking, rain-slicked cinematography",
      "Colin Farrell's unrecognizable, hilarious turn as the Penguin"
    ]
  },
  'interstellar-2014': {
    editorial: "Christopher Nolan blends rigorous astrophysics with a deeply emotional meditation on time, grief, and parental sacrifice across the cosmic void. You ride shotgun with Matthew McConaughey's Cooper as he abandons his family on a dying Earth to pilot the Endurance through a wormhole in search of a habitable sanctuary for humanity. Hans Zimmer's soaring church-organ score provides an overwhelming spiritual resonance, transforming silent orbital maneuvers and titanic tidal waves into moments of awe-inspiring tension. The third-act tesseract sequence ventures into metaphysical sentimentality that occasionally clashes with the movie's hard-scientific foundations, but the raw emotional grief of a father watching decades of his children's video messages in minutes is unforgettable. It remains one of the grandest, most ambitious sci-fi adventures ever committed to film.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["sci-fi", "space-exploration", "existential", "emotional-epic"],
    toneAndPace: "awe-inspiring, philosophical, heart-wrenching",
    targetAudience: "Ideal for space enthusiasts and philosophical dreamers who want grand scientific ambition anchored by profound emotional stakes.",
    similarMovies: ["2001: A Space Odyssey", "Contact", "First Man"],
    watchReasons: [
      "Hans Zimmer's majestic, organ-driven musical score",
      "Visceral IMAX depictions of black holes and relativity physics",
      "Matthew McConaughey's emotionally devastating video-message breakdown"
    ]
  },
  'inception-2010': {
    editorial: "Christopher Nolan crafts the benchmark original sci-fi heist movie, turning the architecture of the subconscious mind into an intricate, gravity-defying playground. You accompany Leonardo DiCaprio's haunted thief Dom Cobb as he attempts the impossible task of planting an idea deep within an heir's psyche across three nested dream realities. From Joseph Gordon-Levitt's legendary zero-gravity hotel corridor combat to Paris streets folding over themselves like origami, the practical filmmaking effects remain staggeringly fresh and tactile. Tracking four simultaneous timelines with different temporal speeds requires your undivided concentration, but every clue snaps together with clockwork precision. It is a rare, exhilarating blockbuster that respects your intelligence while delivering unyielding cinematic adrenaline.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["mind-bending", "sci-fi-heist", "cerebral-action", "modern-classic"],
    toneAndPace: "relentless, cerebral, mathematically-precise",
    targetAudience: "Ideal for viewers who crave high-concept puzzle plots, cerebral action thrills, and meticulously engineered narrative puzzles.",
    similarMovies: ["The Matrix", "Shutter Island", "Tenet"],
    watchReasons: [
      "Groundbreaking practical effects, including the rotating corridor brawl",
      "Hans Zimmer's unforgettable 'Time' orchestral climax",
      "A masterclass in non-linear editing across multiple dream layers"
    ]
  },
  'the-dark-knight-2008': {
    editorial: "Transcending the superhero genre to become a peerless modern urban crime epic, Christopher Nolan pits Batman against the chaotic forces of pure anarchy. You watch Gotham's fragile legal institutions crumble as Heath Ledger delivers a transformative, Oscar-winning performance as the Joker, a malevolent force of nature who does not want money, but the moral degradation of everyone in his path. The tension between Christian Bale's stoic hero, Aaron Eckhart's tragic Harvey Dent, and Gary Oldman's beleaguered Gordon creates a gripping Shakespearean tragedy of compromise and sacrifice. The film's atmosphere is bleak and unrelenting, offering very little comic relief across its two-and-a-half-hour runtime. Yet in its examination of terror, surveillance ethics, and civic morality, it remains the definitive comic-book film in cinematic history.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["crime-epic", "psychological-thriller", "superhero-definitive", "dark-masterpiece"],
    toneAndPace: "relentless, gripping, morally-complex",
    targetAudience: "Ideal for fans of hard-boiled crime thrillers, moral philosophy, and gripping dramatic cinema.",
    similarMovies: ["Heat", "The Silence of the Lambs", "The Departed"],
    watchReasons: [
      "Heath Ledger's electrifying, posthumous Oscar-winning performance as the Joker",
      "Phenomenal practical IMAX action sequences including the Chicago semi-truck flip",
      "A rich, morally intricate screenplay exploring justice and corruption"
    ]
  },
  'gladiator-ii-2024': {
    editorial: "Ridley Scott returns to ancient Rome twenty-four years later with blood-splattered swagger, staging arena combat of staggering, unapologetic scale. You follow Paul Mescal's Lucius as he is enslaved by Roman legionaries and thrust into the Colosseum sand, forced to battle baboons, war rhinos, and flooded naval ships for his survival. While Mescal provides a brooding, physically imposing anchor, Denzel Washington completely steals the show as arms-dealer Macrinus, purring with Machiavellian glee and chewing through the decadent imperial dialogue with unmatched charisma. The narrative hews remarkably close to the structure of the 2000 original, occasionally making it feel like a high-budget remix of Maximus's tragic journey. But for pure big-screen visceral spectacle and theatrical political scheming, Scott proves he is still a master of the sword-and-sandal epic.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["historical-epic", "sword-and-sandal", "colosseum-spectacle", "action-adventure"],
    toneAndPace: "grand, brutal, theatrical",
    targetAudience: "Ideal for fans of historical action spectacles, Roman empire intrigue, and charismatic Machiavellian villains.",
    similarMovies: ["Gladiator", "Kingdom of Heaven", "Spartacus"],
    watchReasons: [
      "Denzel Washington's magnetic, scene-stealing performance as Macrinus",
      "Spectacular, over-the-top arena battles including a flooded naval combat sequence",
      "Paul Mescal's fierce, grounded physical commitment in combat"
    ]
  },
  'top-gun-maverick-2022': {
    editorial: "Proving that practical, in-camera filmmaking still possesses a magic that green screens cannot replicate, this legacy sequel easily surpasses its 1986 predecessor in every respect. You climb straight into the cockpit alongside Tom Cruise and a talented cadre of young naval aviators as they train for an impossible, low-altitude mountain canyon bombing run. Miles Teller delivers surprising emotional resonance as Rooster, the son of Maverick's late navigator Goose, grounding the high-altitude thrills in a heartfelt generational reconciliation. The military mission plot is lean and predictable, honoring classic Hollywood blockbuster tropes down to the second. But the authentic G-force facial contortions, visceral jet sound design, and Claudio Miranda's jaw-dropping aerial photography make this one of the most exhilarating pure action movies ever made.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["aviation-action", "blockbuster", "legacy-sequel", "practical-stunts"],
    toneAndPace: "electrifying, triumphant, heart-pumping",
    targetAudience: "Ideal for action movie enthusiasts and general audiences seeking a flawlessly executed, emotionally satisfying crowd-pleaser.",
    similarMovies: ["Mission: Impossible - Fallout", "Top Gun", "Ford v Ferrari"],
    watchReasons: [
      "Authentic, stomach-dropping in-cockpit IMAX aerial photography",
      "A touching, emotional reunion between Tom Cruise and Val Kilmer",
      "A masterfully paced, white-knuckle climax that delivers total catharsis"
    ]
  },
  'everything-everywhere-all-at-once-2022': {
    editorial: "The Daniels unleash a kaleidoscopic collision of martial-arts action, absurdist surrealism, and devastating immigrant family drama that somehow coheres into pure cinematic magic. You follow Michelle Yeoh's exhausted laundromat owner Evelyn Wang as she discovers an infinite multiverse of alternate lives, fighting off Stephanie Hsu's nihilistic Jobu Tupaki while learning that small acts of kindness are humanity's only defense against existential despair. Ke Huy Quan delivers an unforgettable, Oscar-winning comeback as Waymond, alternating between mild-mannered husband and deadly fanny-pack martial artist with effortless grace. The movie's rapid-fire sensory overload and bizarre sight gags—from hot-dog fingers to talking rocks—will test the patience of viewers who favor conventional linear storytelling. But underneath its dizzying visual anarchy beats a profoundly tender heart about generational healing and unconditional love.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["multiverse", "absurdist-comedy", "family-drama", "kung-fu-cinema"],
    toneAndPace: "manic, kaleidoscopic, deeply-moving",
    targetAudience: "Ideal for adventurous moviegoers who embrace bold absurdist humor, fast editing, and deeply emotional family themes.",
    similarMovies: ["Being John Malkovich", "Eternal Sunshine of the Spotless Mind", "Scott Pilgrim vs. the World"],
    watchReasons: [
      "Michelle Yeoh and Ke Huy Quan's historic, Oscar-winning performances",
      "Astonishing creative ingenuity operating across dozens of parallel realities",
      "A profound, tear-jerking message about kindness and family acceptance"
    ]
  },
  'poor-things-2023': {
    editorial: "Yorgos Lanthimos adapts Alasdair Gray's satirical novel into a visually dazzling, wickedly funny feminist reimagining of Frankenstein. You watch Emma Stone give an astonishing, Oscar-winning physical and linguistic performance as Bella Baxter, an infant's brain transplanted into an adult woman's body who rapidly discovers language, agency, socialist philosophy, and sexual liberation. The production design is a breathtaking steampunk dreamscape of pastel skies and twisted Victorian architecture, accompanied by Jerskin Fendrix's delightfully off-kilter acoustic score. Mark Ruffalo delivers hilarious comedic vanity as Duncan Wedderburn, a petulant cad undone by Bella's refusal to be possessed. The film's frank, extensive sexual exploration and eccentric deadpan dialogue are deliberately provocative and not suited for conservative viewers, but its intellectual audacity and comic genius are undeniable.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["black-comedy", "feminist-satire", "steampunk-fantasy", "bold-vision"],
    toneAndPace: "eccentric, witty, visually-hypnotic",
    targetAudience: "Ideal for cinephiles and dark comedy lovers who relish bold surrealist aesthetics, physical comedy, and subversive philosophical themes.",
    similarMovies: ["The Favourite", "The Lobster", "Barbie"],
    watchReasons: [
      "Emma Stone's fearless, physically astonishing lead performance",
      "Mark Ruffalo's career-best, riotously funny supporting role",
      "Whimsical, hand-crafted steampunk production design and fish-eye visuals"
    ]
  },
  'challengers-2024': {
    editorial: "Luca Guadagnino turns a minor-league tennis tournament into a sultry, high-velocity psychological arena of obsession, ambition, and romantic control. You follow Zendaya's commanding former prodigy Tashi Duncan as she orchestrates a bitter rivalry between her husband Art and her former lover Patrick, portrayed with crackling erotic friction by Mike Faist and Josh O'Connor. Trent Reznor and Atticus Ross provide an unrelenting, synth-driven techno score that pulses beneath every rally, transforming routine tennis volleys into life-or-death confrontations. The non-linear narrative structure leaps back and forth across thirteen years, which occasionally slows the mid-match momentum. But Sayombhu Mukdeeprom's kinetic camera work and Zendaya's cool, calculated authority build toward a breathless, kinetic finale that will leave your heart pounding.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["romantic-drama", "sports-thriller", "psychological-rivalry", "sensual"],
    toneAndPace: "kinetic, sultry, adrenaline-fueled",
    targetAudience: "Ideal for viewers who love intense character dramas, magnetic romantic rivalries, and propulsive electronic musical scores.",
    similarMovies: ["Call Me by Your Name", "Match Point", "The Social Network"],
    watchReasons: [
      "Trent Reznor and Atticus Ross's propulsive, club-ready electronic soundtrack",
      "Sensational romantic and competitive chemistry among the three leads",
      "Luca Guadagnino's stylish, kinetic direction and innovative camera angles"
    ]
  },
  'furiosa-a-mad-max-saga-2024': {
    editorial: "George Miller expands the scorched wasteland mythology with a sprawling, multi-chapter revenge chronicle that trades the non-stop sprint of Fury Road for operatic world-building. You trace the journey of young Furiosa over fifteen years from her kidnapping in the Green Place to her rise in the Citadel, with Anya Taylor-Joy capturing fierce resilience through piercing glares and tactile grit. Chris Hemsworth delivers a tour-de-force comic and menacing performance as the flamboyant, chariot-riding warlord Dr. Dementus, stealing every scene with unhinged verbal theatricality. The heavy reliance on digital landscape extensions means the visual texture feels slightly less raw than the 2015 predecessor, but the jaw-dropping War Rig ambush sequence proves Miller remains the undisputed poet laureate of vehicular kinetic mayhem.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["post-apocalyptic", "action-epic", "revenge-saga", "wasteland-mythology"],
    toneAndPace: "mythic, kinetic, brutal",
    targetAudience: "Ideal for action connoisseurs and Mad Max fans who appreciate world-building and character evolution alongside high-octane vehicular warfare.",
    similarMovies: ["Mad Max: Fury Road", "The Road Warrior", "Dune: Part Two"],
    watchReasons: [
      "Chris Hemsworth's charismatic, deeply unhinged performance as Dementus",
      "Brilliant fifteen-minute War Rig aerial attack set piece",
      "Rich, mythic world-building exploring the Citadel, Gas Town, and Bullet Farm"
    ]
  },
  'twisters-2024': {
    editorial: "Lee Isaac Chung infuses genuine heart, infectious regional flavor, and state-of-the-art storm physics into an immensely enjoyable summer disaster update. You ride alongside Daisy Edgar-Jones' traumatized meteorologist and Glen Powell's swaggering, YouTube-famous 'Tornado Wrangler' as they chase monster EF5 supercells tearing across the Oklahoma plains. Powell radiates effortless movie-star charm that pairs wonderfully with Edgar-Jones' earnest scientific passion, making you care just as much about their character rapport as the impending tornadoes. While the script follows familiar 90s disaster-movie beats down to the final town-saving scientific experiment, the bone-rattling sound design and visceral practical debris make this an irresistible, roaring thrill ride for anyone craving classic blockbuster escapism.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["disaster-thriller", "summer-blockbuster", "storm-chasing", "crowd-pleaser"],
    toneAndPace: "breezy, thunderous, high-energy",
    targetAudience: "Ideal for fans of 90s disaster cinema and popcorn thrill-seekers looking for charismatic leads and thrilling natural spectacles.",
    similarMovies: ["Twister", "The Perfect Storm", "Top Gun: Maverick"],
    watchReasons: [
      "Glen Powell's magnetic, charismatic lead performance",
      "Immersive, deafening tornado sound design in Dolby Atmos",
      "Grounded, respectful depiction of Midwestern communities and storm chasers"
    ]
  },
  'past-lives-2023': {
    editorial: "Celine Song crafts an achingly delicate, mature debut that explores the road not taken with extraordinary emotional restraint. You sit with Nora and Hae Sung as childhood sweethearts reunited in New York two decades after Nora's family emigrated from Seoul, pondering the Korean concept of In-Yun—the subtle ties of fate that connect souls across multiple lifetimes. Greta Lee is magnificent, conveying a lifetime of cultural adaptation, quiet yearning, and pragmatic fulfillment through small glances, while John Magaro plays her American husband with refreshing empathy rather than stereotypical jealousy. There are no dramatic shouting matches or sudden melodramatic choices here, which may feel quiet to lovers of fast-paced romance. But for anyone who has ever wondered about the person they left behind in their youth, it will linger in your mind for days.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["romantic-drama", "subtle-melancholy", "immigrant-identity", "quiet-masterpiece"],
    toneAndPace: "delicate, meditative, bittersweet",
    targetAudience: "Ideal for lovers of thoughtful romantic dramas, international cinema, and poignant meditations on memory and choice.",
    similarMovies: ["Before Sunset", "In the Mood for Love", "Lost in Translation"],
    watchReasons: [
      "Greta Lee and Teo Yoo's quiet, deeply affecting chemistry",
      "Celine Song's poetic, deeply mature screenplay and direction",
      "A refreshingly honest, three-way conversation free of melodramatic clichés"
    ]
  },
  'the-wild-robot-2024': {
    editorial: "Chris Sanders delivers an emotional, gorgeously animated triumph that stands comfortably alongside the finest work in DreamWorks history. You follow the stranded domestic robot Roz, voiced with immense tenderness and mechanical curiosity by Lupita Nyong'o, as she learns wilderness survival and accidentally becomes the adoptive mother to an orphaned gosling named Brightbill. The visual aesthetic looks like a living, impressionistic storybook illustration, blending hand-painted digital brushstrokes with kinetic forest animation. Pedro Pascal provides hilarious, dry comic relief as Fink the fox, while Kris Bowers' soaring orchestral score elevates every emotional beat. It deals honestly with the harsh realities of nature and will require tissues for parents and children alike, but its core message about kindness transcending your programming is deeply resonant.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["animation", "family-tearjerker", "wilderness-adventure", "heartwarming"],
    toneAndPace: "uplifting, emotional, visually-breathtaking",
    targetAudience: "Ideal for families, animation connoisseurs, and anyone seeking a deeply heartfelt story about parenthood and empathy.",
    similarMovies: ["The Iron Giant", "Wall-E", "How to Train Your Dragon"],
    watchReasons: [
      "Lupita Nyong'o's remarkable, tender vocal performance as Roz",
      "Stunning, hand-painted impressionistic animation style",
      "Kris Bowers' emotionally overwhelming, triumphant orchestral score"
    ]
  },
  'civil-war-2024': {
    editorial: "Alex Garland rejects partisan ideological talking points to deliver a harrowing, documentary-style road trip through a near-future American war zone. You ride in a battered press van alongside Kirsten Dunst's burned-out veteran photojournalist Lee Smith as she mentors young Cailee Spaeny across a dystopian landscape toward a besieged Washington, D.C. The sound design is deliberately deafening; sudden, unsignaled sniper gunshots ring out with terrifying physical volume, shattering quiet country roads without warning. Jesse Plemons delivers an uncredited, heart-stopping cameo as a xenophobic militia soldier that will leave your stomach in knots. By refusing to explain the political causes behind the Western Forces' rebellion, the film forces you to confront the dehumanizing, visceral reality of combat journalism itself.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["dystopian-thriller", "war-journalism", "visceral-realism", "tension"],
    toneAndPace: "harrowing, deafening, anxiety-inducing",
    targetAudience: "Ideal for fans of visceral war dramas and psychological thrillers who appreciate uncompromising realism and ambiguous politics.",
    similarMovies: ["Children of Men", "Apocalypse Now", "Sicario"],
    watchReasons: [
      "Kirsten Dunst's weary, authentic portrait of battlefield photojournalism",
      "Jesse Plemons' terrifying, unforgettable roadside cameo",
      "Shockingly realistic, bone-rattling audio mixing and combat photography"
    ]
  },
  'nosferatu-2024': {
    editorial: "Robert Eggers strips away a century of romanticized vampire cliches to resurrect Count Orlok as a repulsive, ancient manifestation of pestilence, rot, and erotic obsession. You journey into the gloom of 19th-century Germany as Nicholas Hoult's young clerk travels to the Carpathian mountains, while Lily-Rose Depp delivers a ferocious, physically unhinged performance as his tormented wife Ellen, whose psychic connection to Orlok invites gothic doom. Jarin Blaschke's 35mm chiaroscuro cinematography is soaked in candlelit shadows, rotting cobblestones, and swarms of real rats, creating an atmosphere of relentless dread. The deliberate historical pacing and archaic German phrasing demand patience from modern horror fans accustomed to jump-scares. But for those who crave authentic gothic dread and macabre historical horror, it is a masterwork of atmospheric terror.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["gothic-horror", "vampire-classic", "atmospheric-dread", "period-piece"],
    toneAndPace: "macabre, oppressive, slow-burn",
    targetAudience: "Ideal for gothic horror aficionados and Eggers devotees who appreciate meticulous historical detail, grim atmosphere, and primal dread.",
    similarMovies: ["The Witch", "The Lighthouse", "Bram Stoker's Dracula"],
    watchReasons: [
      "Lily-Rose Depp's fearless, physically demanding lead performance",
      "Jarin Blaschke's gloomy, candlelit 35mm cinematography",
      "A genuine restoration of the vampire as a repulsive, terrifying plague"
    ]
  },
  'a-quiet-place-day-one-2024': {
    editorial: "Shifting the sound-hunting franchise from rural cornfields to the concrete echo-chamber of Manhattan, this prequel avoids standard disaster tropes by centering on an unexpectedly tender, intimate human connection. You follow Lupita Nyong'o as Samira, a terminally ill hospice patient who ventures through the alien-ravaged streets with Joseph Quinn's terrified stranger Eric, seeking one last slice of Harlem pizza with her unflappable service cat Frodo. Director Michael Sarnoski trades frantic creature slaughter for quiet emotional contemplation, creating moments of breathless subway tension punctuated by rain-slicked emotional intimacy. While creature-feature purists might yearn for more relentless monster combat and lore reveals, Nyong'o's extraordinary, expressive silent performance turns this survival thriller into a moving celebration of dignity and grace.",
    worthWatching: true,
    editorRating: "Worth Watching",
    tags: ["creature-thriller", "character-driven", "apocalyptic", "emotional"],
    toneAndPace: "hushed, bittersweet, suspenseful",
    targetAudience: "Ideal for viewers who appreciate character-driven suspense and quiet emotional intimacy over non-stop monster action.",
    similarMovies: ["A Quiet Place", "I Am Legend", "Pig"],
    watchReasons: [
      "Lupita Nyong'o's expressive, emotionally luminous silent performance",
      "Terrifying cat-and-mouse tension through flooded subway tunnels",
      "Frodo the service cat, the calmest and best feline in horror cinema"
    ]
  },
  'anora-2024': {
    editorial: "Winning the prestigious 2024 Cannes Palme d'Or, Sean Baker delivers a manic, funny, and ultimately heartbreaking screwball odyssey through the working-class fringes of New York. You sprint alongside Mikey Madison's fierce, Brooklyn stripper Ani as she impetuously elopes with the spoiled son of a Russian oligarch, only to have his furious parents dispatch a trio of bumbling henchmen to annul the marriage. Madison gives a volcanic, star-making performance brimming with hilarious defiance, sexual swagger, and devastating vulnerability. The extended middle act features an exhausting amount of screaming and chaotic farce in a Brighton Beach mansion that tests your nervous system, but Yura Borisov's gentle henchman Igor provides an unexpected moral center. It is an exhilarating, bittersweet examination of transaction, class inequality, and human empathy.",
    worthWatching: true,
    editorRating: "Must Watch",
    tags: ["indie-comedy", "romantic-farce", "palme-dor-winner", "class-satire"],
    toneAndPace: "manic, hilarious, emotionally-raw",
    targetAudience: "Ideal for indie cinema lovers and dramedy fans who appreciate authentic urban characters, frantic energy, and poignant emotional depth.",
    similarMovies: ["The Florida Project", "Tangerine", "Uncut Gems"],
    watchReasons: [
      "Mikey Madison's volcanic, career-defining lead performance",
      "Sean Baker's signature empathy for marginalized urban workers",
      "A stunning, quiet final scene that delivers immense emotional devastation"
    ]
  }
};

// 1. Clear out the directory so only verified, curated reviews live in data/editorials
if (fs.existsSync(targetDir)) {
  const existingFiles = fs.readdirSync(targetDir);
  for (const f of existingFiles) {
    if (f.endsWith('.json')) {
      fs.unlinkSync(path.join(targetDir, f));
    }
  }
} else {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 2. Write all 26 fact-checked editorial files
let count = 0;
for (const [slug, data] of Object.entries(curatedEditorials)) {
  const filePath = path.join(targetDir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  count++;
}

console.log(`Successfully published ${count} fact-checked editorials in ${targetDir}`);
