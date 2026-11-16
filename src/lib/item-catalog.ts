// One entry per subtask name, shared by every league, so a subtask gets its
// trade link and its price from the same place. Matching is exact: partial
// matching used to send "Foulborn Exalted Orb" and "Influenced Exalted Orb"
// to plain Exalted Orbs.
//
// Trade ids come from https://www.pathofexile.com/api/trade/data/static. Prices
// are looked up by name on poe.ninja; a "*" name means the cheapest item of that
// type, for subtasks that accept any member of a family. Quantities are not
// stored here: they come from the subtask's counterTarget.

export type NinjaEndpoint = "exchange" | "currencyoverview" | "itemoverview";

export interface PriceSource {
	endpoint: NinjaEndpoint;
	type: string;
	name: string;
}

export type TradeTarget =
	| { exchange: string[] }
	// "type" for real base types; "term" for uniques, which the trade API
	// rejects as a type ("Unknown item base type").
	| { search: string; by: "term" | "type" };

export interface CatalogEntry {
	trade?: TradeTarget;
	// Several sources mean the subtask accepts any of them; the cheapest wins.
	price?: PriceSource[];
	// The subtask needs one of every source instead, so the prices add up.
	needsAll?: true;
}

export const ITEM_CATALOG: Record<string, CatalogEntry> = {
	"Abyssal Depths": { trade: { exchange: ["abyss-scarab-of-descending"] } },
	"Acton's Nightmare": {
		trade: { search: "Acton's Nightmare", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Acton's Nightmare",
			},
		],
	},
	"Al-Hezmin's Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Al-Hezmin's Head" },
		],
	},
	"Ancient Orb": {
		trade: { exchange: ["ancient-orb"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Ancient Orb" }],
	},
	"Any Crystallised Rancour Craft": {
		trade: { exchange: ["sandswept-lifeforce"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Crystallised Rancour" },
		],
	},
	"Awakener's Orb": {
		trade: { exchange: ["awakeners-orb"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Awakener's Orb" }],
	},
	"Baran's Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Baran's Head" },
		],
	},
	"Blessed Orb": {
		trade: { exchange: ["blessed"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Blessed Orb" }],
	},
	"Blight Oil": { price: [{ endpoint: "exchange", type: "Oil", name: "*" }] },
	"Brinehook's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Brinehook's Ducat" }],
	},
	"Caer Blaidd, Wolfpack's Den": {
		trade: { search: "Caer Blaidd, Wolfpack's Den", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Caer Blaidd, Wolfpack's Den",
			},
		],
	},
	Catalyst: {
		trade: {
			exchange: [
				"abrasive-catalyst",
				"accelerating-catalyst",
				"fertile-catalyst",
				"imbued-catalyst",
				"intrinsic-catalyst",
				"noxious-catalyst",
				"prismatic-catalyst",
				"tempering-catalyst",
				"turbulent-catalyst",
				"unstable-catalyst",
			],
		},
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Abrasive Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Accelerating Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Fertile Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Imbued Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Intrinsic Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Noxious Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Prismatic Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Tempering Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Turbulent Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Unstable Catalyst",
			},
		],
	},
	Catarina: {
		trade: { exchange: ["syndicate-medallion"] },
		price: [
			{ endpoint: "exchange", type: "Fragment", name: "Syndicate Medallion" },
		],
	},
	"Chaos Orb": {
		trade: { exchange: ["chaos"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Chaos Orb" }],
	},
	"Chimera Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Chimera's Head" },
		],
	},
	"Chromatic Orb": {
		trade: { exchange: ["chrome"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Chromatic Orb" }],
	},
	"Coin of Desecration": {
		trade: { exchange: ["coin-of-desecration"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Desecration",
			},
		],
	},
	"Coin of Knowledge": {
		trade: { exchange: ["coin-of-knowledge"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Knowledge",
			},
		],
	},
	"Coin of Power": {
		trade: { exchange: ["coin-of-power"] },
		price: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Coin of Power" },
		],
	},
	"Coin of Restoration": {
		trade: { exchange: ["coin-of-restoration"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Restoration",
			},
		],
	},
	"Coin of Skill": {
		trade: { exchange: ["coin-of-skill"] },
		price: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Coin of Skill" },
		],
	},
	"Conqueror Exalted Orb": {
		trade: {
			exchange: [
				"hunters-exalted-orb",
				"crusaders-exalted-orb",
				"redeemers-exalted-orb",
				"warlords-exalted-orb",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Hunter's Exalted Orb" },
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Crusader's Exalted Orb",
			},
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Redeemer's Exalted Orb",
			},
			{ endpoint: "exchange", type: "Currency", name: "Warlord's Exalted Orb" },
		],
	},
	"Constrictor Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Constrictor's Head" },
		],
	},
	"Corrupted Essence": {
		trade: {
			exchange: [
				"essence-of-delirium",
				"essence-of-horror",
				"essence-of-hysteria",
				"essence-of-insanity",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Essence", name: "Essence of Delirium" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Horror" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Hysteria" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Insanity" },
		],
	},
	"Cortex without being hit by Wormhole Slam": {
		trade: { search: "Cortex", by: "term" },
		price: [{ endpoint: "itemoverview", type: "UniqueMap", name: "Cortex" }],
	},
	"Cyaxan's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Cyaxan's Ducat" }],
	},
	"Death and Taxes": {
		trade: { search: "Death and Taxes", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Death and Taxes" },
		],
	},
	"Divine Orb": {
		trade: { exchange: ["divine"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Divine Orb" }],
	},
	"Doryani's Machinarium": {
		trade: { search: "Doryani's Machinarium", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Doryani's Machinarium",
			},
		],
	},
	"Drox's Head": {
		price: [{ endpoint: "itemoverview", type: "Viscera", name: "Drox's Head" }],
	},
	"Eldritch Exalted, Annulment or Chaos Orb": {
		trade: {
			exchange: [
				"eldritch-exalted-orb",
				"eldritch-orb-of-annulment",
				"eldritch-chaos-orb",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Eldritch Exalted Orb" },
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Eldritch Orb of Annulment",
			},
			{ endpoint: "exchange", type: "Currency", name: "Eldritch Chaos Orb" },
		],
	},
	"Eldritch Exalted, Annulment or Chaos orb": {
		trade: {
			exchange: [
				"eldritch-exalted-orb",
				"eldritch-orb-of-annulment",
				"eldritch-chaos-orb",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Eldritch Exalted Orb" },
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Eldritch Orb of Annulment",
			},
			{ endpoint: "exchange", type: "Currency", name: "Eldritch Chaos Orb" },
		],
	},
	"Enshrouding Crystal": {
		price: [{ endpoint: "exchange", type: "EnshroudingCrystal", name: "*" }],
	},
	"Enslaver Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Enslaver's Head" },
		],
	},
	"Eradicator Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Eradicator's Head" },
		],
	},
	"Essence of Desolation": {
		trade: { exchange: ["essence-of-desolation"] },
		price: [
			{
				endpoint: "itemoverview",
				type: "Essence",
				name: "Essence of Desolation",
			},
		],
	},
	"Exalted or Divine Orb": {
		trade: { exchange: ["exalted", "divine"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Exalted Orb" },
			{ endpoint: "exchange", type: "Currency", name: "Divine Orb" },
		],
	},
	"Exalted Orb": {
		trade: { exchange: ["exalted"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Exalted Orb" }],
	},
	"Exceptional Eldritch Ichor or Ember": {
		trade: {
			exchange: ["exceptional-eldritch-ichor", "exceptional-eldritch-ember"],
		},
		price: [
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Exceptional Eldritch Ichor",
			},
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Exceptional Eldritch Ember",
			},
		],
	},
	"Foulborn Exalted Orb": {
		trade: { exchange: ["foulborn-exalted-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Foulborn Exalted Orb" },
		],
	},
	"Foulborn Orb of Augmentation": {
		trade: { exchange: ["foulborn-orb-of-augmentation"] },
		price: [
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Foulborn Orb of Augmentation",
			},
		],
	},
	"Foulborn Regal Orb": {
		trade: { exchange: ["foulborn-regal-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Foulborn Regal Orb" },
		],
	},
	"Fracturing Orb": {
		trade: { exchange: ["fracturing-orb"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Fracturing Orb" }],
	},
	"Gemcutter's Prism": {
		trade: { exchange: ["gcp"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Gemcutter's Prism" },
		],
	},
	"Hallowed Ground": {
		trade: { search: "Hallowed Ground", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Hallowed Ground" },
		],
	},
	"High Templar Venarius in the Cortex": {
		trade: { search: "Cortex", by: "term" },
		price: [{ endpoint: "itemoverview", type: "UniqueMap", name: "Cortex" }],
	},
	"Hinekora's Lock": {
		trade: { exchange: ["hinekoras-lock"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Hinekora's Lock" },
		],
	},
	"Honoured, Sacred or Miraged Incubator": {
		trade: { search: "Miraged Incubator", by: "type" },
		price: [
			{
				endpoint: "itemoverview",
				type: "Incubator",
				name: "Honoured Incubator",
			},
			{
				endpoint: "itemoverview",
				type: "Incubator",
				name: "Miraged Incubator",
			},
			{ endpoint: "itemoverview", type: "Incubator", name: "Sacred Incubator" },
		],
	},
	"Hydra Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Hydra's Head" },
		],
	},
	"Influenced Exalted Orb": {
		trade: {
			exchange: [
				"hunters-exalted-orb",
				"crusaders-exalted-orb",
				"redeemers-exalted-orb",
				"warlords-exalted-orb",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Hunter's Exalted Orb" },
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Crusader's Exalted Orb",
			},
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Redeemer's Exalted Orb",
			},
			{ endpoint: "exchange", type: "Currency", name: "Warlord's Exalted Orb" },
		],
	},
	Izaro: {
		trade: { exchange: ["offer-dedication"] },
		price: [
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "Dedication to the Goddess",
			},
		],
	},
	"Jeweller's Orb": {
		trade: { exchange: ["jewellers"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Jeweller's Orb" }],
	},
	"Katakohi's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Katakohi's Ducat" }],
	},
	"Kishara's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Kishara's Ducat" }],
	},
	"Maelström of Chaos": {
		trade: { search: "Maelström of Chaos", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Maelström of Chaos",
			},
		],
	},
	"Mao Kun": {
		trade: { search: "Mao Kun", by: "term" },
		price: [{ endpoint: "itemoverview", type: "UniqueMap", name: "Mao Kun" }],
	},
	"Merrick's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Merrick's Ducat" }],
	},
	"Minotaur Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Minotaur's Head" },
		],
	},
	"Mirror of Kalandra": {
		trade: { exchange: ["mirror"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Mirror of Kalandra" },
		],
	},
	"Nightmarish Book of Depravity": {
		price: [
			{
				endpoint: "itemoverview",
				type: "Viscera",
				name: "Nightmarish Book of Depravity",
			},
		],
	},
	"Nightmarish Core of the Unbreakable": {
		price: [
			{
				endpoint: "itemoverview",
				type: "Viscera",
				name: "Nightmarish Core of the Unbreakable",
			},
		],
	},
	"Nightmarish Head of Uhtred": {
		price: [
			{
				endpoint: "itemoverview",
				type: "Viscera",
				name: "Nightmarish Head of Uhtred",
			},
		],
	},
	"Nightmarish Wings of Catarina": {
		price: [
			{
				endpoint: "itemoverview",
				type: "Viscera",
				name: "Nightmarish Wings of Catarina",
			},
		],
	},
	"Nightmarish Wings of Lycia": {
		price: [
			{
				endpoint: "itemoverview",
				type: "Viscera",
				name: "Nightmarish Wings of Lycia",
			},
		],
	},
	"Oba's Cursed Trove": {
		trade: { search: "Oba's Cursed Trove", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Oba's Cursed Trove",
			},
		],
	},
	"Olmec's Sanctum": {
		trade: { search: "Olmec's Sanctum", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Olmec's Sanctum" },
		],
	},
	"Orb of Alchemy": {
		trade: { exchange: ["alch"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Orb of Alchemy" }],
	},
	"Orb of Alteration": {
		trade: { exchange: ["alt"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Alteration" },
		],
	},
	"Orb of Annulment": {
		trade: { exchange: ["annul"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Annulment" },
		],
	},
	"Orb of Augmentation": {
		trade: { exchange: ["aug"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Augmentation" },
		],
	},
	"Orb of Chance": {
		trade: { exchange: ["chance"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Orb of Chance" }],
	},
	"Orb of Dominance": {
		trade: { exchange: ["mavens-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Dominance" },
		],
	},
	"Orb of Fusing": {
		trade: { exchange: ["fusing"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Orb of Fusing" }],
	},
	"Orb of Regret": {
		trade: { exchange: ["regret"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Orb of Regret" }],
	},
	"Orb of Remembrance, Unravelling or Intention": {
		trade: {
			exchange: [
				"orb-of-remembrance",
				"orb-of-unravelling",
				"orb-of-intention",
			],
		},
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Remembrance" },
			{ endpoint: "exchange", type: "Currency", name: "Orb of Unravelling" },
			{ endpoint: "exchange", type: "Currency", name: "Orb of Intention" },
		],
	},
	"Orb of Scouring": {
		trade: { exchange: ["scour"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Scouring" },
		],
	},
	"Orb of Transmutation": {
		trade: { exchange: ["transmute"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Transmutation" },
		],
	},
	"Orb of Unmaking": {
		trade: { exchange: ["orb-of-unmaking"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Unmaking" },
		],
	},
	Oshabi: {
		trade: { exchange: ["sacred-blossom"] },
		price: [{ endpoint: "exchange", type: "Fragment", name: "Sacred Blossom" }],
	},
	"Phoenix Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Phoenix's Head" },
		],
	},
	"Pillars of Arun": {
		trade: { search: "Pillars of Arun", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Pillars of Arun" },
		],
	},
	"Poorjoy's Asylum": {
		trade: { search: "Poorjoy's Asylum", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Poorjoy's Asylum" },
		],
	},
	"Purifier Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Purifier's Head" },
		],
	},
	"Reflecting Mist": {
		trade: { exchange: ["reflecting-mist"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Reflecting Mist",
			},
		],
	},
	"Refracting Fog": {
		trade: { exchange: ["cluster-fog"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Refracting Fog",
			},
		],
	},
	"Regal Orb": {
		trade: { exchange: ["regal"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Regal Orb" }],
	},
	"Rotmother's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Rotmother's Ducat" }],
	},
	"Runegraft or Tattoo": {
		price: [
			{ endpoint: "exchange", type: "Runegraft", name: "*" },
			{ endpoint: "exchange", type: "Tattoo", name: "*" },
		],
	},
	"Sacred Crystallised Lifeforce or Crystallised Rancour": {
		trade: { exchange: ["sacred-lifeforce", "sandswept-lifeforce"] },
		price: [
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Sacred Crystallised Lifeforce",
			},
			{ endpoint: "exchange", type: "Currency", name: "Crystallised Rancour" },
		],
	},
	"Sacred Orb": {
		trade: { exchange: ["sacred-orb"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Sacred Orb" }],
	},
	Saresh: {
		trade: { exchange: ["the-black-barya"] },
		price: [
			{ endpoint: "exchange", type: "Fragment", name: "The Black Barya" },
		],
	},
	Simulacrum: {
		trade: { exchange: ["simulacrum"] },
		price: [{ endpoint: "exchange", type: "Fragment", name: "Simulacrum" }],
	},
	// No price: the counter is waves, not fragments, so counterTarget (60)
	// would price 60 Simulacrums.
	"Simulacrum Waves": {
		trade: { exchange: ["simulacrum"] },
	},
	"Sinistral or Dextral Catalyst": {
		trade: { exchange: ["sinistral-catalyst", "dextral-catalyst"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Sinistral Catalyst" },
			{ endpoint: "exchange", type: "Currency", name: "Dextral Catalyst" },
		],
	},
	"Tainted Currency": {
		trade: { exchange: ["tainted-catalyst"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Tainted Catalyst",
			},
		],
	},
	"Telesia's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Telesia's Ducat" }],
	},
	"Tempering or Tailoring Orb": {
		trade: { exchange: ["tempering-orb", "tailoring-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Tempering Orb" },
			{ endpoint: "exchange", type: "Currency", name: "Tailoring Orb" },
		],
	},
	"The Coward's Trial": {
		trade: { search: "The Coward's Trial", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "The Coward's Trial",
			},
		],
	},
	"The Genteel's Ducat": {
		price: [
			{ endpoint: "exchange", type: "Ducat", name: "The Genteel's Ducat" },
		],
	},
	"The King in the Mists": {
		trade: { exchange: ["an-audience-with-the-king"] },
		price: [
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "An Audience With The King",
			},
		],
	},
	"The Putrid Cloister": {
		trade: { search: "The Putrid Cloister", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "The Putrid Cloister",
			},
		],
	},
	"The Twilight Temple": {
		trade: { search: "The Twilight Temple", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "The Twilight Temple",
			},
		],
	},
	"The Vinktar Square": {
		trade: { search: "The Vinktar Square", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "The Vinktar Square",
			},
		],
	},
	"Tzamoto's Ducat": {
		price: [{ endpoint: "exchange", type: "Ducat", name: "Tzamoto's Ducat" }],
	},
	"Uber Atziri": { trade: { exchange: ["hope"] } },
	"Use an Orb of Alchemy": {
		trade: { exchange: ["alch"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Orb of Alchemy" }],
	},
	"Use an Orb of Alteration": {
		trade: { exchange: ["alt"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Alteration" },
		],
	},
	"Use an Orb of Augmentation": {
		trade: { exchange: ["aug"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Augmentation" },
		],
	},
	"Use an Orb of Transmutation": {
		trade: { exchange: ["transmute"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Transmutation" },
		],
	},
	"Use Chromatic Orbs": {
		trade: { exchange: ["chrome"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Chromatic Orb" }],
	},
	"Use Gemcutter's Prisms": {
		trade: { exchange: ["gcp"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Gemcutter's Prism" },
		],
	},
	"Use Vaal Orbs": {
		trade: { exchange: ["vaal"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Vaal Orb" }],
	},
	"Use Volatile Vaal Orbs": {
		trade: { exchange: ["tainted-divine-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Volatile Vaal Orb" },
		],
	},
	"Vaal Orb": {
		trade: { exchange: ["vaal"] },
		price: [{ endpoint: "exchange", type: "Currency", name: "Vaal Orb" }],
	},
	"Vaults of Atziri": {
		trade: { search: "Vaults of Atziri", by: "term" },
		price: [
			{ endpoint: "itemoverview", type: "UniqueMap", name: "Vaults of Atziri" },
		],
	},
	"Veiled Chaos Orb": {
		trade: { exchange: ["veiled-chaos-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Veiled Chaos Orb" },
		],
	},
	"Veiled Exalted or Chaos Orb": {
		trade: { exchange: ["veiled-exalted-orb", "veiled-chaos-orb"] },
		price: [
			{ endpoint: "exchange", type: "Currency", name: "Veiled Exalted Orb" },
			{ endpoint: "exchange", type: "Currency", name: "Veiled Chaos Orb" },
		],
	},
	"Veritania's Head": {
		price: [
			{ endpoint: "itemoverview", type: "Viscera", name: "Veritania's Head" },
		],
	},
	"Volatile Vaal Orb": {
		trade: { exchange: ["tainted-divine-orb"] },
		price: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Volatile Vaal Orb",
			},
		],
	},
	"Wave 30 of the Simulacrum": {
		trade: { exchange: ["simulacrum"] },
		price: [{ endpoint: "exchange", type: "Fragment", name: "Simulacrum" }],
	},
	"Whakawairua Tuahu": {
		trade: { search: "Whakawairua Tuahu", by: "term" },
		price: [
			{
				endpoint: "itemoverview",
				type: "UniqueMap",
				name: "Whakawairua Tuahu",
			},
		],
	},
	// One of each Eye opens the arena.
	Zorath: {
		needsAll: true,
		trade: {
			exchange: [
				"zoraths-eye-of-malevolence",
				"zoraths-eye-of-authority",
				"zoraths-eye-of-the-inevitable",
				"zoraths-eye-of-the-endless",
			],
		},
		price: [
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "Zorath's Eye of Malevolence",
			},
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "Zorath's Eye of Authority",
			},
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "Zorath's Eye of the Inevitable",
			},
			{
				endpoint: "exchange",
				type: "Fragment",
				name: "Zorath's Eye of the Endless",
			},
		],
	},
};

// Challenges where the subtasks are interchangeable purchases, so showing the
// cheapest set that finishes the challenge is useful. Elsewhere (boss lists,
// for one) most rows cost nothing, and a cheapest total would push the few
// rows that happen to have a price.
export const CHEAPEST_PATH_CHALLENGES: ReadonlySet<string> = new Set([
	"mirage:22",
	"allflame:22",
	"allflame:34",
	"coven:15",
	"coven:22",
	"coven:23",
]);
