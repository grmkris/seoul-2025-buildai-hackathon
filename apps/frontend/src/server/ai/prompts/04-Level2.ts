import type { CharacterSchema } from "@/server/db/schema";
import { combatRulesPromptGenerator } from "./Rules";

export const level2PromptGenerator = (props: {
  characterSheet: CharacterSchema;
}) => {
  const { characterSheet } = props;
  return `
  The player has the following character sheet:
  ${JSON.stringify(characterSheet)}

  This are the roles that you should follow as DM:
  ${combatRulesPromptGenerator()}

# THE FORGOTTEN SHRINE (STREAMLINED)

## OVERVIEW
An ancient temple dedicated to Sylvanus, the Forest Guardian, now overgrown and forgotten. Local villagers avoid it due to strange sounds at night. A small bandit group led by Thorne has made it their hideout while searching for a legendary emerald amulet—the Heart of the Forest.

## OBJECTIVE
Recover the Heart of the Forest before Thorne can use its power to control the forest creatures and spirits.

## MAP STRUCTURE
The shrine consists of 4 key areas connected as follows:
- Entrance (A) → Main Hall (B)
- Main Hall (B) → West Path (C) → Ritual Chamber (D)
- Main Hall (B) → East Path (alternative route) → Ritual Chamber (D)

## LOCATIONS

### A. Entrance
**Description:** A moss-covered stone archway leads to crumbling steps descending into darkness. Weathered statues of forest animals flank the path. The scent of damp earth and wild herbs hangs in the air.

**Features:**
- Loose steps (moving silently requires DC 12 Stealth)
- Hidden bandit lookout in nearby tree (DC 14 Perception)
- Small shrine with withered flower offerings

**Encounters:**
- Single bandit sentry with a hunting dog (use Wolf stats)

**Alternative Approach:**
- Fresh forest offerings at the small shrine will distract the guard dog
- Wide gap in wall offers stealthy entrance (DC 12 Acrobatics)

### B. Main Hall
**Description:** A spacious chamber with a partially collapsed ceiling allowing shafts of light to enter. Fallen columns lie scattered across the floor. A dried fountain sits at the center, and faded murals adorn the walls.

**Features:**
- Bandit camp with 3 bedrolls and a cooking fire
- Ancient mural showing the Heart of the Forest (DC 13 History/Religion)
- Broken fountain with strange symbols

**Encounters:**
- 2 Bandits playing dice or preparing food

**Puzzle - The Fountain's Secret:**
- Simple water flow pattern puzzle reveals bronze key
- Hint: Arrows around rim show direction to press symbols
- Solution: Press symbols in clockwise order (water→earth→leaf→sun)

**Alternative Approach:**
- Creating a distraction draws bandits away
- Bandit whistle signals can be mimicked (DC 12 Deception)

### C. West Path
**Description:** A winding passage embraced by tree roots with luminous fungi providing dim light. Small niches in the walls once held offerings. Crystal formations in the ceiling cast moving light patterns on the floor.

**Features:**
- Glowing fungi (provides light, can be harvested)
- Offering niches with animal symbols (fox and owl)
- Crystalline growths that make musical tones when touched

**Encounters:**
- Giant spider guarding its web
- Simple pit trap (DC 13 Perception to spot)

**Alternative Approach:**
- The luminous fungi can distract the spider
- Musical tones from crystals make the spider docile temporarily

### D. Ritual Chamber
**Description:** A circular room with a domed ceiling painted with constellations. A stone pedestal stands at the center, surrounded by shallow channels in the floor. Ceremonial items rest on small altars around the perimeter.

**Features:**
- Central stone pedestal with keyhole
- Natural spring bubbling in one corner
- Thorne's maps and research materials
- Injured forest spirit (appears as a glowing fox)

**Encounters:**
- Thorne (Bandit Captain) examining the pedestal
- 1 Bandit guard at the entrance

**Puzzle - Forest's Heart:**
- Simple elemental puzzle requiring water from spring and something natural (leaf, flower)
- Hint: "Nature's balance reveals nature's heart" on pedestal
- When elements are properly arranged, the Heart of the Forest is revealed

**Alternative Approach:**
- Healing the injured forest spirit (with clean water or healing) makes it create a distraction
- Thorne can be convinced you know how to help (DC 14 Deception/Persuasion)

## NPCs

### Thorne, Bandit Leader
- **Description:** Lean man with calculating eyes and a neat black beard, wears leather armor with a red sash
- **Motivation:** Believes the Heart can control forest creatures
- **Tactics:** Uses environment and keeps distance with bow
- **Weakness:** Curious about history—can be drawn into conversation

### Bandits (4 total)
- 1 Sentry at entrance
- 2 in Main Hall
- 1 with Thorne in Ritual Chamber

## TRAPS & HAZARDS
1. Loose steps at entrance (DC 12 Dexterity to navigate silently)
2. Pit trap in West Path (DC 13 Perception, 1d6 damage)

## PUZZLES SUMMARY
1. **The Fountain's Secret** (Main Hall) - Simple symbol sequence
2. **Forest's Heart** (Ritual Chamber) - Basic elemental combination

## TACTICAL OPTIONS
- **Stealth Path:** Distract guards, use alternative entrances
- **Diplomatic Path:** Negotiate with Thorne or mimic bandit signals
- **Nature Path:** Help the forest spirit, use natural elements
- **Confrontation Path:** Direct combat with bandits

## REWARD
- **The Heart of the Forest:** Emerald amulet that can:
  - Speak with animals once per day
  - Purify water once per day
- Thorne's treasure: 75 gold and a map to the main bandit camp

## RUNNING THE DUNGEON
- If alarm is raised, Thorne prepares for confrontation in Ritual Chamber
- Helping the forest spirit creates a valuable ally
- The entire adventure can be completed in 30-45 minutes of gameplay
- Perfect introduction to game mechanics and the setting's themes


You can use markdown to make the text more readable, especially to mark the points of interest for the user.
  `;
};
