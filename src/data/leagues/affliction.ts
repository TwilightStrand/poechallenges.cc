import type { League } from "@/schemas";

export const afflictionLeague: League = {
  id: "affliction",
  name: "Affliction",
  version: "3.23",
  startDate: "2023-12-08",
  rewards: [
    { at: 12, reward: "Affliction Weapon Effect", type: "armor" },
    { at: 24, reward: "Affliction Body Armour", type: "armor" },
    { at: 36, reward: "Affliction Wings", type: "armor" },
    { at: 40, reward: "Affliction Trophy", type: "trophy" },
  ],
  challenges: [
    {
      id: 1,
      name: "Beginner's Basics",
      description: "Complete each of the following tasks.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "1-1", name: "Equip a Magic Flask" },
        { id: "1-2", name: "Buy a Magic or Rare item from a Vendor" },
        { id: "1-3", name: "Use an Orb of Alchemy" },
        { id: "1-4", name: "Complete a Labyrinth Trial" },
      ],
    },
    {
      id: 2,
      name: "Ancient Azmeri Ancestry",
      description: "Complete each of the following encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "2-1", name: "Enter the Viridian Wildwood" },
        { id: "2-2", name: "Collect Wisps", counterTarget: 1000 },
        { id: "2-3", name: "Kill a Rare Monster in the Viridian Wildwood" },
        { id: "2-4", name: "Encounter a Denizen of the Wildwood" },
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
        { id: "3-1", name: "Life Flask" },
        { id: "3-2", name: "Boots with Movement Speed" },
        { id: "3-3", name: "Sapphire, Topaz or Ruby Ring" },
        { id: "3-4", name: "Glassblower's Bauble" },
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
        { id: "5-1", name: "Activate a Shrine" },
        { id: "5-2", name: "Defeat a Monster holding an Essence" },
        { id: "5-3", name: "Capture a Red Beast" },
        { id: "5-4", name: "Pass through a Mirror of Delirium" },
      ],
    },
    {
      id: 6,
      name: "Whispering Wildwood Wisps",
      description:
        "Collect the following types of Wisps in the Viridian Wildwood.",
      type: "all",
      required: 3,
      subtasks: [
        { id: "6-1", name: "Primal Wisps", counterTarget: 15000 },
        { id: "6-2", name: "Wild Wisps", counterTarget: 15000 },
        { id: "6-3", name: "Vivid Wisps", counterTarget: 15000 },
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
      name: "Quality Quandaries",
      description: "Complete each of the following quests.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "8-1", name: "The Marooned Mariner" },
        { id: "8-2", name: "Victario's Secrets" },
        { id: "8-3", name: "In Service to Science" },
        { id: "8-4", name: "The Puppet Mistress" },
      ],
    },
    {
      id: 9,
      name: "Tumultuous Torment",
      description: "Complete each of the following Torment encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "9-1", name: "Defeat Touched Monsters", counterTarget: 300 },
        { id: "9-2", name: "Defeat Possessed Monsters", counterTarget: 40 },
        { id: "9-3", name: "Be Possessed by a Tormented Spirit" },
        {
          id: "9-4",
          name: "Defeat a Map Boss that has been Possessed by 3 Tormented Spirits in a Tier 16 Map",
        },
      ],
    },
    {
      id: 10,
      name: "Archaic Anarchy",
      description: "Complete each of the following Anarchy encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "10-1", name: "Defeat Rogue Exiles", counterTarget: 90 },
        {
          id: "10-2",
          name: "Defeat Possessed Rogue Exiles",
          counterTarget: 60,
        },
        {
          id: "10-3",
          name: "Kill 3 Rogue Exiles within 10 seconds of the first one dying",
        },
        {
          id: "10-4",
          name: "Defeat at least 15 Rogue Exiles in a single Tier 16 Map",
        },
      ],
    },
    {
      id: 11,
      name: "Alluring Ambush",
      description: "Complete each of the following Ambush encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "11-1", name: "Open Strongboxes", counterTarget: 120 },
        {
          id: "11-2",
          name: "Open Corrupted and Rare Strongboxes",
          counterTarget: 90,
        },
        { id: "11-3", name: "Open a Unique Strongbox" },
        {
          id: "11-4",
          name: "Open at least 18 Strongboxes in a single Tier 16 Map",
        },
      ],
    },
    {
      id: 12,
      name: "Ryslatha's Ravenous Rage",
      description:
        "Defeat Wisped Rare or Unique monsters of each of the following types.",
      type: "all",
      required: 3,
      subtasks: [
        {
          id: "12-1",
          name: "Defeat Primal Wisped Rare or Unique Monsters",
          counterTarget: 50,
        },
        {
          id: "12-2",
          name: "Defeat Wild Wisped Rare or Unique Monsters",
          counterTarget: 50,
        },
        {
          id: "12-3",
          name: "Defeat Vivid Wisped Rare or Unique Monsters",
          counterTarget: 50,
        },
      ],
    },
    {
      id: 13,
      name: "Beseeching Beyond",
      description: "Complete each of the following Beyond encounters.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "13-1",
          name: "Defeat Rare Beyond Monsters",
          counterTarget: 100,
        },
        { id: "13-2", name: "Use Tainted Currency", counterTarget: 10 },
        { id: "13-3", name: "Defeat Beyond Bosses", counterTarget: 3 },
        {
          id: "13-4",
          name: "Defeat a Beyond Boss in a Tier 16 Map with at least 80% Item Quantity",
        },
      ],
    },
    {
      id: 14,
      name: "Bizarre Blights",
      description: "Complete each of the following Blight encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "14-1", name: "Complete Blights", counterTarget: 30 },
        { id: "14-2", name: "Defeat Blight Bosses", counterTarget: 50 },
        {
          id: "14-3",
          name: "Complete Tier 14 or higher Blighted Maps with at least 80% Item Quantity",
          counterTarget: 10,
        },
        {
          id: "14-4",
          name: "Complete a Rare Tier 16 Blight-Ravaged Map with at least 5 Modifiers",
        },
      ],
    },
    {
      id: 15,
      name: "Explorative Expeditions",
      description: "Complete each of the following Expedition encounters.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "15-1", name: "Complete Expeditions", counterTarget: 30 },
        { id: "15-2", name: "Detonate Remnants", counterTarget: 100 },
        {
          id: "15-3",
          name: "Complete Logbooks with at least 10 active Remnants",
          counterTarget: 10,
        },
        {
          id: "15-4",
          name: "Defeat an Expedition Boss in a level 83 area with at least 10 Remnants active",
        },
      ],
    },
    {
      id: 16,
      name: "Unreal Ultimatum",
      description: "Complete each of the following Ultimatum encounters.",
      type: "all",
      required: 4,
      subtasks: [
        {
          id: "16-1",
          name: "Complete Ultimatum Waves",
          counterTarget: 200,
        },
        {
          id: "16-2",
          name: "Fully Complete Ultimatums in Red Tier Maps",
          counterTarget: 20,
        },
        {
          id: "16-3",
          name: "Complete Red Tier Inscribed Ultimatums",
          counterTarget: 10,
        },
        {
          id: "16-4",
          name: "Defeat the Trialmaster in a Tier 16 Map that is at least Rare",
        },
      ],
    },
    {
      id: 17,
      name: "Prospero's Profitable Promises",
      description:
        "Purchase any 11 of the following items from Denizens of the Wildwood.",
      type: "pick",
      required: 11,
      subtasks: [
        { id: "17-1", name: "Ironwood Tincture" },
        { id: "17-2", name: "Ashbark Tincture" },
        { id: "17-3", name: "Fulgurite Tincture" },
        { id: "17-4", name: "Poisonberry Tincture" },
        { id: "17-5", name: "Rosethorn Tincture" },
        { id: "17-6", name: "Oakbranch Tincture" },
        { id: "17-7", name: "Borealwood Tincture" },
        { id: "17-8", name: "Blood Sap Tincture" },
        { id: "17-9", name: "Corvine Charm" },
        { id: "17-10", name: "Lupine Charm" },
        { id: "17-11", name: "Ursine Charm" },
        { id: "17-12", name: "Eldritch Corpse" },
        { id: "17-13", name: "Humanoid Corpse" },
        { id: "17-14", name: "Construct Corpse" },
        { id: "17-15", name: "Beast Corpse" },
        { id: "17-16", name: "Undead Corpse" },
        { id: "17-17", name: "Demon Corpse" },
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
        "Turn in any four Divination Card sets which specifically grant each of the following reward types.",
      type: "pick",
      required: 4,
      subtasks: [
        { id: "19-1", name: "Two-Implicit Unique" },
        { id: "19-2", name: "Uncorrupted Rare or Unique Jewel" },
        { id: "19-3", name: "Six-link Item" },
        { id: "19-4", name: "Level 21 or 23% Quality Gem" },
        { id: "19-5", name: "Double-Influenced Item" },
        { id: "19-6", name: "Exalted or Divine Orb" },
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
        { id: "20-1", name: "Inscribed Ultimatum" },
        { id: "20-2", name: "Gilded Scarab" },
        { id: "20-3", name: "Catalyst" },
        { id: "20-4", name: "Tier 16 Map" },
      ],
    },
    {
      id: 21,
      name: "Critical Crafting",
      description: "Use each of the following types of crafts.",
      type: "all",
      required: 4,
      subtasks: [
        { id: "21-1", name: "Any Modify Mods Bestiary Recipe" },
        { id: "21-2", name: "Tier 3 Incursion Crafting Bench" },
        { id: "21-3", name: "Rank 3 or 4 Betrayal Crafting Bench" },
        { id: "21-4", name: "Powerful or Prime Chaotic Resonator" },
      ],
    },
    {
      id: 22,
      name: "Viridi's Verdant Vessel",
      description:
        "Allocate eight Wildwood Passive Points in a single Wildwood Ascendancy specialization.",
      type: "pick",
      required: 1,
      subtasks: [
        {
          id: "22-1",
          name: "Wildwood Primalist",
          counterTarget: 8,
        },
        {
          id: "22-2",
          name: "Warden of the Maji",
          counterTarget: 8,
        },
        {
          id: "22-3",
          name: "Warlock of the Mists",
          counterTarget: 8,
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
      name: "Enhanced Equipment",
      description:
        "Equip any eight of the following types of items in a single equipment set.",
      type: "pick",
      required: 8,
      subtasks: [
        { id: "24-1", name: "Enchanted" },
        { id: "24-2", name: "Synthesized" },
        { id: "24-3", name: "Fractured" },
        { id: "24-4", name: "Influenced" },
        { id: "24-5", name: "Mirrored" },
        { id: "24-6", name: "Crafted" },
        { id: "24-7", name: "Corrupted" },
        { id: "24-8", name: "Qualitied" },
        { id: "24-9", name: "Veiled" },
        { id: "24-10", name: "Split" },
      ],
    },
    {
      id: 25,
      name: "Tremendous Thaumaturgy",
      description:
        "Use the Divine Font in the Lord's Labyrinth in any five of the following ways.",
      type: "pick",
      required: 5,
      subtasks: [
        {
          id: "25-1",
          name: "Add at least 50,000,000 experience to a Gem",
        },
        { id: "25-2", name: "Add at least 10% quality to a Gem" },
        {
          id: "25-3",
          name: "Sacrifice a Gem for at least 40% of its experience as a Facetor's Lens",
        },
        {
          id: "25-4",
          name: "Transform a Corrupted Transfigured Skill Gem",
        },
        { id: "25-5", name: "Sacrifice a Gem for Treasure Keys" },
        { id: "25-6", name: "Sacrifice a Gem for Currency Items" },
        {
          id: "25-7",
          name: "Transform a Skill Gem to a random Transfigured version",
        },
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
          name: "Defeat 5 Possessed Rogue Exiles in a single Map",
        },
        {
          id: "26-2",
          name: "Open a Cartographer's Strongbox while affected by a Tempest",
        },
        {
          id: "26-3",
          name: "Defeat a Blight Boss while affected by a Shrine",
        },
        {
          id: "26-4",
          name: "Complete an Expedition while in a Breach",
        },
        { id: "26-5", name: "Defeat a Possessed Syndicate Member" },
        {
          id: "26-6",
          name: "Complete an Ultimatum while Delirious",
        },
      ],
    },
    {
      id: 27,
      name: "M\u00F3rrigan's Mystic Marvels",
      description:
        "Encounter any six of the following phenomena in the Viridian Wildwood.",
      type: "pick",
      required: 6,
      subtasks: [
        { id: "27-1", name: "Azmeri God Shrine" },
        { id: "27-2", name: "King in the Mists' Ritual Grounds" },
        { id: "27-3", name: "Harvest Field" },
        { id: "27-4", name: "Beyond Rift" },
        { id: "27-5", name: "Nameless Shrine" },
        { id: "27-6", name: "Omen Cairn" },
        { id: "27-7", name: "Funerary Altar" },
        { id: "27-8", name: "Wisp Conversion Tree" },
      ],
    },
    {
      id: 28,
      name: "Meaningful Masters",
      description:
        "Complete Master missions in Tier 16 Maps with at least 80% Item Quantity the specified number of times.",
      type: "all",
      required: 5,
      subtasks: [
        { id: "28-1", name: "Einhar Missions", counterTarget: 10 },
        { id: "28-2", name: "Niko Missions", counterTarget: 10 },
        { id: "28-3", name: "Alva Missions", counterTarget: 10 },
        { id: "28-4", name: "Jun Missions", counterTarget: 10 },
        { id: "28-5", name: "Kirac Missions", counterTarget: 10 },
      ],
    },
    {
      id: 29,
      name: "Selective Sextants",
      description:
        "Complete Maps with any two of the following Sextant modifier combinations in Tier 16 Maps with at least 80% Item Quantity.",
      type: "pick",
      required: 2,
      subtasks: [
        {
          id: "29-1",
          name: "Map Bosses drop additional Unique Items, Bodyguards or Mysterious Harbinger",
        },
        {
          id: "29-2",
          name: "Additional Corrupted Vaal, Mirrored Rare or Convert-on-Kill packs",
        },
        {
          id: "29-3",
          name: "Increased Fire, Cold, Lightning or Chaos damage",
        },
        {
          id: "29-4",
          name: "Increased Magic Pack Size, Unidentified Maps or Beyond Demon Pack Size",
        },
      ],
    },
    {
      id: 30,
      name: "Magnificent Modifiers",
      description: "Defeat a total of 20,000 Rare Monster Modifiers.",
      type: "counter",
      required: 20000,
      subtasks: [],
    },
    {
      id: 31,
      name: "Memory Madness",
      description:
        "Reach a total of 2,500% Item Quantity from Atlas Memory Maps.",
      type: "counter",
      required: 2500,
      subtasks: [],
    },
    {
      id: 32,
      name: "Catha's Callous Conflict",
      description:
        "Complete any four of the following Wildwood encounters in level 78 or higher areas.",
      type: "pick",
      required: 4,
      subtasks: [
        {
          id: "32-1",
          name: "Defeat Black M\u00F3rrigan while she is Enraged",
        },
        {
          id: "32-2",
          name: "Defeat Bleak, Bitter, and Biting B\u00EDle within 10 seconds of each other",
        },
        {
          id: "32-3",
          name: "Defeat the Wildwood Abomination without being hit by Vicious Vines",
        },
        {
          id: "32-4",
          name: "Defeat the Troll Shaman without being hit by Shamanic Vines",
        },
        {
          id: "32-5",
          name: "Survive the Incarnation of Agony with a maximum of 5 stacks of Aura of Death",
        },
        {
          id: "32-6",
          name: "Defeat a Map Boss affected by 2 or more Wisp types",
        },
        {
          id: "32-7",
          name: "Defeat a Rare Monster affected by all three Wisp types",
        },
      ],
    },
    {
      id: 33,
      name: "Lavish Luxuries",
      description:
        "Use any six of the following crafting currency the specified number of times.",
      type: "pick",
      required: 6,
      subtasks: [
        {
          id: "33-1",
          name: "Corrupted Essences",
          counterTarget: 4,
        },
        { id: "33-2", name: "Golden Oil" },
        { id: "33-3", name: "Tempering or Tailoring Orb" },
        { id: "33-4", name: "Sacred Lifeforce" },
        { id: "33-5", name: "Fracturing Orb" },
        { id: "33-6", name: "Catalysts", counterTarget: 40 },
        {
          id: "33-7",
          name: "Tainted Exalted, Chaos or Divine Teardrop",
        },
        {
          id: "33-8",
          name: "Eldritch Exalted, Annulment or Chaos Orb",
        },
        { id: "33-9", name: "Elderslayer Exalted or Awakener's Orb" },
      ],
    },
    {
      id: 34,
      name: "Dominated Domains",
      description:
        "Complete a total of 100 Elder Guardian, Shaper Guardian or Elderslayer Maps.",
      type: "counter",
      required: 100,
      subtasks: [],
    },
    {
      id: 35,
      name: "Eldritch Endgame",
      description:
        "Use Eldritch Altars or defeat Witnessed Map Bosses the specified number of times.",
      type: "all",
      required: 3,
      subtasks: [
        {
          id: "35-1",
          name: "Searing Exarch Altars with Wrath of the Cosmos allocated",
          counterTarget: 250,
        },
        {
          id: "35-2",
          name: "Eater of Worlds Altars with Eldritch Gaze allocated",
          counterTarget: 250,
        },
        {
          id: "35-3",
          name: "Witnessed Map Bosses with Destructive Play allocated",
          counterTarget: 200,
        },
      ],
    },
    {
      id: 36,
      name: "Awakened Atlas",
      description: "Allocate all 132 acquirable Atlas Passive Points.",
      type: "counter",
      required: 132,
      subtasks: [],
    },
    {
      id: 37,
      name: "Malignant Mist Manifestation",
      description:
        "Defeat The King in the Mists in the Crux of Nothingness in any three of the following ways.",
      type: "pick",
      required: 3,
      subtasks: [
        {
          id: "37-1",
          name: "Without accumulating 3 or more stacks of Shadow Surge",
        },
        { id: "37-2", name: "While affected by Mystic Miasma" },
        {
          id: "37-3",
          name: "Without taking damage from Ritual of Meditation or Ritual of Dance",
        },
        {
          id: "37-4",
          name: "Without being hit by Exploding Toads",
        },
      ],
    },
    {
      id: 38,
      name: "Ultimate Undertaking",
      description:
        "Complete any four of the following Endgame League Content encounters.",
      type: "pick",
      required: 4,
      subtasks: [
        { id: "38-1", name: "Wave 30 of the Simulacrum" },
        {
          id: "38-2",
          name: "Domain of Timeless Conflict with at least 30 rewards",
        },
        {
          id: "38-3",
          name: "Sanctum in a level 83 area with no Equipped Relics",
        },
        { id: "38-4", name: "Flawless Breachstone" },
        {
          id: "38-5",
          name: "Heist Blueprint in a level 83 area with 4 wings and at least 100% Item Quantity",
        },
        { id: "38-6", name: "Infused Beachhead" },
        {
          id: "38-7",
          name: "Inscribed Ultimatum in a level 83 area with at least 8 modifiers",
        },
      ],
    },
    {
      id: 39,
      name: "Peak Pinnacles",
      description:
        "Defeat any four of the following Pinnacle Boss Encounters in level 85 areas.",
      type: "pick",
      required: 4,
      subtasks: [
        {
          id: "39-1",
          name: "Sirus, Awakener of Worlds in the Eye of the Storm",
        },
        { id: "39-2", name: "The Elder in The Shaper's Realm" },
        {
          id: "39-3",
          name: "The Maven in the Absence of Mercy and Empathy",
        },
        {
          id: "39-4",
          name: "The Searing Exarch in the Absence of Patience and Wisdom",
        },
        {
          id: "39-5",
          name: "The Eater of Worlds in the Absence of Symmetry and Harmony",
        },
        { id: "39-6", name: "High Templar Venarius in the Cortex" },
        { id: "39-7", name: "The Shaper in The Shaper's Realm" },
      ],
    },
    {
      id: 40,
      name: "Grand Gripping Grail",
      description:
        "Complete any four of the following encounters the specified number of times.",
      type: "pick",
      required: 4,
      subtasks: [
        { id: "40-1", name: "Reach Level 100" },
        {
          id: "40-2",
          name: "Open Endgame Labyrinth Chests",
          counterTarget: 250,
        },
        {
          id: "40-3",
          name: "Defeat Delve, Syndicate, Bestiary or Vaal Omnitect Bosses",
          counterTarget: 80,
        },
        {
          id: "40-4",
          name: "Defeat Rare Monsters with at least 4 Modifiers",
          counterTarget: 300,
        },
        {
          id: "40-5",
          name: "Complete Maps with Scarabs applied",
          counterTarget: 1000,
        },
        {
          id: "40-6",
          name: "Defeat Rare or Unique Monsters affected by Wisps in Tier 16 Maps",
          counterTarget: 500,
        },
      ],
    },
  ],
};
