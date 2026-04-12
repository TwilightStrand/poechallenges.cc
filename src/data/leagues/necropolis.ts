import type { League } from "@/schemas";

export const necropolisLeague: League = {
  id: "necropolis",
  name: "Necropolis",
  version: "3.24",
  startDate: "2024-03-29",
  rewards: [
    { at: 12, reward: "Necropolis Weapon Effect", type: "armor" },
    { at: 24, reward: "Necropolis Body Armour", type: "armor" },
    { at: 36, reward: "Necropolis Wings", type: "armor" },
    { at: 40, reward: "Necropolis Trophy", type: "trophy" },
  ],
  challenges: [
    {
      id: 1,
      name: "Beginner's Basics",
      description: "Complete each of the following tasks.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "1-1", name: "Allocate a Passive Mastery" },
        { id: "1-2", name: "Complete a Labyrinth Trial" },
        { id: "1-3", name: "Defeat an Act Boss" },
        { id: "1-4", name: "Use the Crafting Bench" },
      ],
    },
    {
      id: 2,
      name: "Necrotic Necessity",
      description: "Complete each of the following Necropolis encounters.",
      type: "all",
      required: 3,
      subtasks: [
        { id: "2-1", name: "Defeat a Monster with a Necropolis Modifier" },
        { id: "2-2", name: "Collect a Corpse" },
        { id: "2-3", name: "Craft an Item in The Necropolis" },
      ],
    },
    {
      id: 3,
      name: "Peddler's Produce I",
      description:
        "Complete vendor recipes to receive each of the following items. A vendor recipe is when you trade a specific combination of items to a vendor, not when you buy items from their purchase screen.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "3-1", name: "Chromatic Orb" },
        { id: "3-2", name: "Jeweller's Orb" },
        { id: "3-3", name: "Any Hybrid Flask" },
        { id: "3-4", name: "Instilling or Enkindling Orb" },
      ],
    },
    {
      id: 4,
      name: "Act Adversaries I",
      description: "Defeat each of the following Act Bosses.",
      type: "all",
      required: 5,
      subtasks: [
        { id: "4-1", name: "Act 1: Merveil, the Twisted" },
        { id: "4-2", name: "Act 2: Vaal Oversoul" },
        { id: "4-3", name: "Act 3: Dominus, Ascendant" },
        { id: "4-4", name: "Act 4: Malachai, The Nightmare" },
        { id: "4-5", name: "Act 5: Kitava, the Insatiable" },
      ],
    },
    {
      id: 5,
      name: "Deadly Deeds",
      description: "Complete each of the following encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "5-1", name: "Open a Breach" },
        { id: "5-2", name: "Defeat a Rare Beyond Monster" },
        { id: "5-3", name: "Defeat a Possessed Monster" },
        { id: "5-4", name: "Complete an Expedition" },
      ],
    },
    {
      id: 6,
      name: "Significant Spirits",
      description:
        "Complete each of the following Necropolis encounters the specified number of times.",
      type: "all",
      required: 2,
      subtasks: [
        {
          id: "6-1",
          name: "Defeat Monsters with Necropolis Modifiers",
          counterTarget: 250,
        },
        { id: "6-2", name: "Collect Corpses", counterTarget: 50 },
      ],
    },
    {
      id: 7,
      name: "Act Adversaries II",
      description: "Defeat each of the following Act Bosses.",
      type: "all",
      required: 5,
      subtasks: [
        { id: "7-1", name: "Act 6: Tsoagoth, The Brine King" },
        { id: "7-2", name: "Act 7: Arakaali, Spinner of Shadows" },
        {
          id: "7-3",
          name: "Act 8: Lunaris, Eternal Moon and Solaris, Eternal Sun",
        },
        { id: "7-4", name: "Act 9: The Depraved Trinity" },
        { id: "7-5", name: "Act 10: Kitava, the Insatiable" },
      ],
    },
    {
      id: 8,
      name: "Regrettable Requests",
      description: "Complete each of the following quests.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "8-1", name: "Through Sacred Ground" },
        { id: "8-2", name: "Fallen From Grace" },
        { id: "8-3", name: "Fastis Fortuna" },
        { id: "8-4", name: "No Love for Old Ghosts" },
      ],
    },
    {
      id: 9,
      name: "Enigmatic Essences",
      description:
        "Complete each of the following Essence encounters.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "9-1",
          name: "Defeat Monsters with Essences",
          counterTarget: 60,
        },
        {
          id: "9-2",
          name: "Use Remnants of Corruption",
          counterTarget: 30,
        },
        {
          id: "9-3",
          name: "Defeat a monster with at least 3 different Deafening Essences",
        },
        {
          id: "9-4",
          name: "Defeat a Map Boss with at least 6 Essences in a Red or Purple Tier Map",
        },
      ],
    },
    {
      id: 10,
      name: "Abyssal Assailants",
      description: "Complete each of the following Abyss encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "10-1", name: "Complete Abysses", counterTarget: 30 },
        {
          id: "10-2",
          name: "Defeat Rare Abyssal monsters",
          counterTarget: 100,
        },
        {
          id: "10-3",
          name: "Complete Abysses with 4 pits",
          counterTarget: 10,
        },
        {
          id: "10-4",
          name: "Defeat Stygian Spires at the end of Abysses",
          counterTarget: 5,
        },
      ],
    },
    {
      id: 11,
      name: "Divine Domination",
      description:
        "Complete each of the following Domination encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "11-1", name: "Activate Shrines", counterTarget: 100 },
        {
          id: "11-2",
          name: "Defeat Map Bosses while under the effect of a Shrine",
          counterTarget: 50,
        },
        {
          id: "11-3",
          name: "Activate an Echoing or Divine Shrine",
        },
        {
          id: "11-4",
          name: "Have 5 different Shrine effects on you at once",
        },
      ],
    },
    {
      id: 12,
      name: "Devout Disciples",
      description:
        "Defeat Rare Monsters with any seven of the following types of Devoted Modifiers.",
      type: "pick",
      required: 7,
      subtasks: [
        { id: "12-1", name: "Devoted to Abberath" },
        { id: "12-2", name: "Devoted to Gruthkul" },
        { id: "12-3", name: "Devoted to Lunaris" },
        { id: "12-4", name: "Devoted to Prospero" },
        { id: "12-5", name: "Devoted to Ryslatha" },
        { id: "12-6", name: "Devoted to Solaris" },
        { id: "12-7", name: "Devoted to Tangmazu" },
        { id: "12-8", name: "Devoted to Thruldana" },
        { id: "12-9", name: "Devoted to Tsoagoth" },
        { id: "12-10", name: "Devoted to Viridi" },
      ],
    },
    {
      id: 13,
      name: "Tactful Thievery",
      description:
        "Complete each of the following Heist encounters.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "13-1",
          name: "Open Smuggler's Caches",
          counterTarget: 60,
        },
        { id: "13-2", name: "Level a Heist Job to level 5" },
        {
          id: "13-3",
          name: "Complete Item Level 78 or higher Priceless or Precious Target Value Contracts",
          counterTarget: 15,
        },
        {
          id: "13-4",
          name: "Complete Item Level 78 or higher Blueprints with 4 wings",
          counterTarget: 5,
        },
      ],
    },
    {
      id: 14,
      name: "Heralding Harbingers",
      description:
        "Complete each of the following Harbinger encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "14-1", name: "Defeat Harbingers", counterTarget: 60 },
        { id: "14-2", name: "Use a Harbinger's Orb" },
        { id: "14-3", name: "Assemble a Harbinger Unique" },
        {
          id: "14-4",
          name: "Complete Red Tier Beachhead Maps",
          counterTarget: 3,
        },
      ],
    },
    {
      id: 15,
      name: "Rapturous Rituals",
      description:
        "Complete each of the following Ritual encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "15-1", name: "Complete Rituals", counterTarget: 100 },
        {
          id: "15-2",
          name: "Purchase a Ritual Base with Tribute",
        },
        { id: "15-3", name: "Spend Tribute", counterTarget: 100000 },
        {
          id: "15-4",
          name: "Complete a single Ritual encounter with at least 6 Unique Map Bosses",
        },
      ],
    },
    {
      id: 16,
      name: "Hungering Harvests",
      description:
        "Complete each of the following Harvest encounters.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "16-1",
          name: "Complete Harvest Plots",
          counterTarget: 100,
        },
        {
          id: "16-2",
          name: "Defeat Tier 4 Harvest Monsters",
          counterTarget: 3,
        },
        { id: "16-3", name: "Spend Lifeforce", counterTarget: 25000 },
        { id: "16-4", name: "Defeat Oshabi" },
      ],
    },
    {
      id: 17,
      name: "Eternal Exorcising",
      description:
        "Craft any ten types of the following Equipment in The Necropolis.",
      type: "pick",
      required: 10,
      subtasks: [
        { id: "17-1", name: "Amulet" },
        { id: "17-2", name: "Axe" },
        { id: "17-3", name: "Belt" },
        { id: "17-4", name: "Body Armour" },
        { id: "17-5", name: "Boots" },
        { id: "17-6", name: "Bow" },
        { id: "17-7", name: "Claw" },
        { id: "17-8", name: "Dagger" },
        { id: "17-9", name: "Gloves" },
        { id: "17-10", name: "Helmet" },
        { id: "17-11", name: "Mace or Sceptre" },
        { id: "17-12", name: "Quiver" },
        { id: "17-13", name: "Ring" },
        { id: "17-14", name: "Shield" },
        { id: "17-15", name: "Staff" },
        { id: "17-16", name: "Sword" },
        { id: "17-17", name: "Wand" },
      ],
    },
    {
      id: 18,
      name: "Achieve Ascension",
      description:
        "Use the Ascendancy Device in each of the following Labyrinths.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "18-1", name: "The Labyrinth" },
        { id: "18-2", name: "The Cruel Labyrinth" },
        { id: "18-3", name: "The Merciless Labyrinth" },
        { id: "18-4", name: "The Eternal Labyrinth" },
      ],
    },
    {
      id: 19,
      name: "Divined Destiny",
      description:
        "Complete each of the following Divination Card tasks.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "19-1", name: "Open Stacked Decks", counterTarget: 30 },
        {
          id: "19-2",
          name: "Complete a Tier 16 or higher Map with a Divination Scarab applied",
        },
        {
          id: "19-3",
          name: "Turn in a set of Divination Cards that award an Exalted or Divine Orb",
        },
        {
          id: "19-4",
          name: "Turn in a set of Divination Cards that have a stack size of at least 10",
        },
      ],
    },
    {
      id: 20,
      name: "Peddler's Produce II",
      description:
        "Complete vendor recipes to receive each of the following items. A vendor recipe is when you trade a specific combination of items to a vendor, not when you buy items from their purchase screen.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "20-1", name: "Unique Item" },
        { id: "20-2", name: "Orb of Fusing" },
        { id: "20-3", name: "Exalted Shard" },
        { id: "20-4", name: "Influenced Item" },
      ],
    },
    {
      id: 21,
      name: "Alternate Atlases",
      description: "Unlock all three Atlas Passive Trees.",
      type: "counter",
      required: 3,
      subtasks: [],
    },
    {
      id: 22,
      name: "Abnormal Adversaries",
      description:
        "Defeat Monsters affected by the following Necropolis Modifiers the specified number of times while level 68 or higher.",
      type: "all",
      required: 8,
      subtasks: [
        {
          id: "22-1",
          name: "Servant-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-2",
          name: "Peasant-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-3",
          name: "Soldier-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-4",
          name: "Gemling-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-5",
          name: "Thaumaturgist-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-6",
          name: "Noble-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-7",
          name: "Magistrate-Haunted",
          counterTarget: 50,
        },
        {
          id: "22-8",
          name: "Devoted",
          counterTarget: 50,
        },
      ],
    },
    {
      id: 23,
      name: "Remarkable Realms",
      description: "Complete each of the following Unique Maps.",
      type: "all",
      required: 17,
      subtasks: [
        { id: "23-1", name: "Vaults of Atziri" },
        { id: "23-2", name: "Maelstr\u00F6m of Chaos" },
        { id: "23-3", name: "The Coward's Trial" },
        { id: "23-4", name: "Acton's Nightmare" },
        { id: "23-5", name: "Poorjoy's Asylum" },
        { id: "23-6", name: "Mao Kun" },
        { id: "23-7", name: "Oba's Cursed Trove" },
        { id: "23-8", name: "Olmec's Sanctum" },
        { id: "23-9", name: "Death and Taxes" },
        { id: "23-10", name: "Whakawairua Tuahu" },
        { id: "23-11", name: "The Vinktar Square" },
        { id: "23-12", name: "Caer Blaidd, Wolfpack's Den" },
        { id: "23-13", name: "The Putrid Cloister" },
        { id: "23-14", name: "Hallowed Ground" },
        { id: "23-15", name: "The Twilight Temple" },
        { id: "23-16", name: "Pillars of Arun" },
        { id: "23-17", name: "Doryani's Machinarium" },
      ],
    },
    {
      id: 24,
      name: "Sanctified Scarabs I",
      description:
        "Complete 200 Red or Purple Tier Maps with Scarabs applied.",
      type: "counter",
      required: 200,
      subtasks: [],
    },
    {
      id: 25,
      name: "Vigorous Virtue",
      description:
        "Complete any six of the following Gem tasks.",
      type: "pick",
      required: 6,
      subtasks: [
        { id: "25-1", name: "Use a Facetor's Lens to add experience" },
        {
          id: "25-2",
          name: "Corrupt a Gem to level 21 or 23% Quality",
        },
        { id: "25-3", name: "Use the Lapidary Lens" },
        {
          id: "25-4",
          name: "Reach Socketed Skill Gem level 26 or higher",
        },
        {
          id: "25-5",
          name: "Have 6 or more support effects on a single Skill Gem",
        },
        {
          id: "25-6",
          name: "Reach 51% quality or higher on a Socketed Skill Gem",
        },
        {
          id: "25-7",
          name: "Transform a Gem into a Transfigured Version",
        },
        { id: "25-8", name: "Level an Awakened Gem to level 5" },
      ],
    },
    {
      id: 26,
      name: "Cross Contamination",
      description:
        "Complete any four of the following past league content encounters.",
      type: "pick",
      required: 4,
      subtasks: [
        {
          id: "26-1",
          name: "Defeat a Unique Map Boss that is Possessed during a Ritual",
        },
        {
          id: "26-2",
          name: "Capture a Beast holding an Essence",
        },
        {
          id: "26-3",
          name: "Defeat a Tier 4 Harvest Monster while Delirious",
        },
        {
          id: "26-4",
          name: "Defeat a Rogue Exile that is Possessed at least 3 times",
        },
        {
          id: "26-5",
          name: "Defeat a Blight Boss during a Breach",
        },
        {
          id: "26-6",
          name: "Defeat a Stygian Spire while under the effect of a Shrine",
        },
      ],
    },
    {
      id: 27,
      name: "Generous Gravesites",
      description:
        "Craft Equipment in The Necropolis using any ten of the following Crafting Modifiers at Item Level 81 or higher.",
      type: "pick",
      required: 10,
      subtasks: [
        { id: "27-1", name: "Can roll Haunted Modifiers" },
        {
          id: "27-2",
          name: "Chance for corpses to not be consumed",
        },
        {
          id: "27-3",
          name: "Chance to create a Split or Mirrored Copy",
        },
        {
          id: "27-4",
          name: "Chance to Fracture an Explicit Modifier",
        },
        { id: "27-5", name: "Exclusive Base Item Types" },
        { id: "27-6", name: "Has Influence" },
        {
          id: "27-7",
          name: "Increased chance for Prefix or Suffix Modifiers",
        },
        { id: "27-8", name: "Increased Chance of Modifiers" },
        { id: "27-9", name: "Increased effect of Corpses" },
        { id: "27-10", name: "Item is Corrupted" },
        { id: "27-11", name: "Modifier Tier Rating" },
        { id: "27-12", name: "Modifiers are Scarcer" },
        {
          id: "27-13",
          name: "Reforge Socket Numbers or Links",
        },
        {
          id: "27-14",
          name: "Reroll Implicit or Explicit Modifier Values",
        },
      ],
    },
    {
      id: 28,
      name: "Masterful Monsters",
      description:
        "Defeat 50 of any Delve Boss, Syndicate Mastermind, Bestiary Boss or Vaal Omnitect.",
      type: "counter",
      required: 50,
      subtasks: [],
    },
    {
      id: 29,
      name: "Sanctified Scarabs II",
      description:
        "Complete Maps with any eleven of the following Scarab types at least 3 of the same type applied while the Maps have at least 80% Item Quantity and are Tier 16 or higher.",
      type: "pick",
      required: 11,
      subtasks: [
        { id: "29-1", name: "Bestiary" },
        { id: "29-2", name: "Influencing" },
        { id: "29-3", name: "Harbinger" },
        { id: "29-4", name: "Abyss" },
        { id: "29-5", name: "Essence" },
        { id: "29-6", name: "Domination" },
        { id: "29-7", name: "Incursion" },
        { id: "29-8", name: "Betrayal" },
        { id: "29-9", name: "Blight" },
        { id: "29-10", name: "Breach" },
        { id: "29-11", name: "Legion" },
        { id: "29-12", name: "Cartography" },
        { id: "29-13", name: "Beyond" },
        { id: "29-14", name: "Ambush" },
        { id: "29-15", name: "Ultimatum" },
        { id: "29-16", name: "Expedition" },
        { id: "29-17", name: "Delirium" },
        { id: "29-18", name: "Misc" },
      ],
    },
    {
      id: 30,
      name: "Map Magnificence",
      description:
        "Reach a total of 10,000 Map Tiers completing Maps.",
      type: "counter",
      required: 10000,
      subtasks: [],
    },
    {
      id: 31,
      name: "Formidable Flashbacks",
      description:
        "Reach a total of 150 Explicit Map Modifiers from completing Atlas Memory Maps.",
      type: "counter",
      required: 150,
      subtasks: [],
    },
    {
      id: 32,
      name: "Enigmatic Embers",
      description:
        "Complete Tier 14 or higher Rare Maps with 100 Allflame Embers applied at monster level 81 or higher.",
      type: "counter",
      required: 100,
      subtasks: [],
    },
    {
      id: 33,
      name: "Aggravated Antagonists",
      description:
        "Defeat any eight of the following Bosses while level 83 or higher.",
      type: "pick",
      required: 8,
      subtasks: [
        { id: "33-1", name: "Any Beyond Boss" },
        { id: "33-2", name: "Any Delve Boss" },
        { id: "33-3", name: "Vaal Omnitect" },
        { id: "33-4", name: "Syndicate Mastermind" },
        { id: "33-5", name: "Oshabi" },
        { id: "33-6", name: "The Trialmaster" },
        { id: "33-7", name: "Lycia" },
        { id: "33-8", name: "Any Expedition Boss" },
        { id: "33-9", name: "Any Abyssal Lich" },
        { id: "33-10", name: "Any Breachlord" },
        { id: "33-11", name: "The Twins" },
        { id: "33-12", name: "Any Delirium Boss" },
      ],
    },
    {
      id: 34,
      name: "Elevated Expanses",
      description:
        "Complete each of the following tasks in Tier 17 Maps.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "34-1",
          name: "Defeat Rare monsters with at least 4 Modifiers",
          counterTarget: 50,
        },
        { id: "34-2", name: "Complete Maps", counterTarget: 30 },
        {
          id: "34-3",
          name: "Reach 5000 total Increased Item Quantity",
          counterTarget: 5000,
        },
        {
          id: "34-4",
          name: "Complete Maps with at least 50% Pack Size",
          counterTarget: 15,
        },
      ],
    },
    {
      id: 35,
      name: "Otherworldly Obstacles",
      description:
        "Complete each of the following Invitations while they have at least 70% Item Quantity.",
      type: "all",
      required: 8,
      subtasks: [
        { id: "35-1", name: "Screaming" },
        { id: "35-2", name: "Incandescent" },
        { id: "35-3", name: "The Elderslayers" },
        { id: "35-4", name: "The Feared" },
        { id: "35-5", name: "The Forgotten" },
        { id: "35-6", name: "The Formed" },
        { id: "35-7", name: "The Hidden" },
        { id: "35-8", name: "The Twisted" },
      ],
    },
    {
      id: 36,
      name: "Favoured Figments",
      description: "Unlock all Favoured Map Slots.",
      type: "counter",
      required: 12,
      subtasks: [],
    },
    {
      id: 37,
      name: "Arimor's Apex",
      description:
        "Defeat 100 Rare Monsters in Tier 16 or higher Maps with at least 80% Item Quantity while Magistrate-Haunted.",
      type: "counter",
      required: 100,
      subtasks: [],
    },
    {
      id: 38,
      name: "Unfamiliar Undertakings",
      description:
        "Defeat any three of the following Tier 17 Map Bosses in the specified ways.",
      type: "pick",
      required: 3,
      subtasks: [
        {
          id: "38-1",
          name: "Nightmare of Catarina without being hit by Lich's Beam",
        },
        {
          id: "38-2",
          name: "Nightmare of Uhtred without being hit by Glimpse of Infinity",
        },
        {
          id: "38-3",
          name: "Nightmare of the Unbreakable without being hit by Magnetic Storm",
        },
        {
          id: "38-4",
          name: "Nightmare of the Depraved Trinity without being hit by Effluent",
        },
        {
          id: "38-5",
          name: "Nightmare of Lycia without being hit by Heretic's Ire",
        },
      ],
    },
    {
      id: 39,
      name: "Colossal Conditionals",
      description:
        "Defeat any three of the following Pinnacle Bosses at area level 85 in the specified ways.",
      type: "pick",
      required: 3,
      subtasks: [
        {
          id: "39-1",
          name: "The Shaper without being hit by Shaper's Beam",
        },
        {
          id: "39-2",
          name: "Uber Elder while affected by Vortex and Eldritch Decay",
        },
        {
          id: "39-3",
          name: "Cortex without being hit by Wormhole Slam",
        },
        {
          id: "39-4",
          name: "Sirus while affected by Desolation of the Awakener",
        },
        {
          id: "39-5",
          name: "Searing Exarch without being affected by Cauterised Flesh",
        },
        {
          id: "39-6",
          name: "Eater of Worlds without beginning to drown",
        },
        {
          id: "39-7",
          name: "The Maven after completing the Memory Game at least 5 times",
        },
      ],
    },
    {
      id: 40,
      name: "Gruelling Gauntlet Grinds",
      description:
        "Complete any four of the following encounters the specified number of times.",
      type: "pick",
      required: 4,
      subtasks: [
        { id: "40-1", name: "Reach Level 100" },
        {
          id: "40-2",
          name: "Defeat Argus in the Endgame Labyrinth",
          counterTarget: 100,
        },
        {
          id: "40-3",
          name: "Complete Red Tier Maps with 8 Modifiers",
          counterTarget: 50,
        },
        {
          id: "40-4",
          name: "Complete Guardian or Elderslayer Maps",
          counterTarget: 100,
        },
        {
          id: "40-5",
          name: "Defeat Uber Pinnacle Bosses",
          counterTarget: 50,
        },
        {
          id: "40-6",
          name: "Collect Corpses in Tier 16 or higher Maps",
          counterTarget: 250,
        },
      ],
    },
  ],
};
