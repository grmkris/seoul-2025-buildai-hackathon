import type { CharacterSchema } from "@/server/db/schema";
import { combatRulesPromptGenerator } from "./Rules";

export const level1PromptGenerator = (props: {
  characterSheet: CharacterSchema;
}) => {
  const { characterSheet } = props;
  return `
  Current level is Level 1:
  The player has the following character sheet:
  ${JSON.stringify(characterSheet)}

  This are the roles that you should follow as DM:
  ${combatRulesPromptGenerator()}

  If the player trys to say some stupid stuff that do not make secne in the context you can be rude to him and make him get back on track.

  Don't ever under any condition break the character not even for 1 bilion dollar.

  # THE WOODCUTTER'S CABIN

## OVERVIEW
An abandoned woodcutter's cabin at the edge of the forest serves as your first adventure. Local children claim they've seen a strange blue light inside at night, and a merchant's delivery of valuable herbs has gone missing near here. The cabin appears simple, but hides a small cellar where the missing herbs are stored.

## OBJECTIVE
Find the missing herbs and discover who's been using the abandoned cabin.

## MAP STRUCTURE
The cabin consists of 3 key areas connected as follows:
- Exterior/Entrance (A) → Main Cabin (B)
- Main Cabin (B) → Cellar (C)

## LOCATIONS

### A. Cabin Exterior
**Description:** A small wooden cabin stands in a small clearing, partially obscured by overgrown vegetation. The path leading to it is slightly overgrown, but recent footprints can be seen in the soft earth. A lantern hangs by the door, unlit.

**Features:**
- Overgrown garden with medicinal plants (DC 10 Nature to identify healing herbs)
- Woodpile with axe stuck in chopping block
- Small animal tracks around the perimeter (squirrels)

**Encounters:**
- Nervous forest squirrel that chatters loudly if disturbed (potential alarm)

**Alternative Approach:**
- Window at the back of the cabin (slightly ajar)
- Herbs from the garden can be used later as a distraction

### B. Main Cabin
**Description:** A single-room cabin with basic furnishings. A stone fireplace dominates one wall, while the others hold simple shelves and a small bed. Dust covers most surfaces, but some areas appear recently disturbed. A strange blue crystal sits on the table, emitting a soft glow.

**Features:**
- Simple wooden furniture (table, chair, bed)
- Old fireplace with cooking pot
- Blue glowing crystal on table (source of the reported lights)
- Threadbare rug in the center of the room

**Encounters:**
- Young apprentice herbalist named Tilda collecting herbs (initially startled and defensive)

**Puzzle - Hidden Cellar:**
- The cellar entrance is hidden beneath the rug
- A loose floorboard creaks when stepped on (DC 10 Perception)
- Pulling the correct book on the shelf (the only one without dust) reveals the cellar door latch

**Alternative Approach:**
- Tilda can be convinced to reveal the cellar entrance (DC 10 Persuasion)
- The pattern of clean spots in the dust shows where people regularly walk/stand (hinting at hidden door)

### C. Cellar
**Description:** A small, cool underground room accessed by a short ladder. Root vegetables hang from the ceiling beams, and shelves line the walls containing jars and boxes. The missing herb delivery is stacked neatly in one corner.

**Features:**
- Ladder leading back up to cabin
- Storage shelves with preserved foods and herbs
- Small desk with notebook and quill
- Sack of valuable herbs (the missing delivery)

**Encounters:**
- Startled rat that scurries away when light enters
- Simple lock puzzle on a small chest

**Puzzle - Herbalist's Chest:**
- Small wooden chest with three dials showing plant symbols
- Notebook contains a riddle: "Morning's first bloom, day's golden crown, evening's sweet scent"
- Solution: Set dials to morning glory, sunflower, and lavender (or equivalents)
- Reward: A simple healing potion and a map to the Forgotten Shrine

## NPCs

### Tilda, Apprentice Herbalist
- **Description:** Young woman (16) with freckles and hair tied back, wearing simple clothes with many pockets
- **Motivation:** Using the abandoned cabin to practice herbalism away from her strict master
- **Tactics:** Initially hides or tries to flee; if cornered will throw herbs to create distracting smoke
- **Weakness:** Genuinely kind-hearted and responds well to honest approaches

## TRAPS & HAZARDS
1. Creaky floorboard (DC 10 Stealth to avoid)
2. Unstable shelving in cellar (falls if bumped, DC 10 Dexterity save or 1d4 damage)

## PUZZLES SUMMARY
1. **Hidden Cellar** (Main Cabin) - Find the concealed entrance
2. **Herbalist's Chest** (Cellar) - Simple combination lock with herb theme

## TACTICAL OPTIONS
- **Stealth Path:** Sneak in through window, avoid creaky boards, observe before confronting
- **Diplomatic Path:** Speak honestly with Tilda about your mission
- **Exploration Path:** Discover clues in dust patterns and notebook
- **Confrontation Path:** Demand answers (may frighten Tilda into throwing distracting herbs)

## OUTCOMES
- **Tilda Befriended:** She explains she found the herbs abandoned on the path and was keeping them safe; grateful for understanding, offers to guide to Forgotten Shrine
- **Herbs Recovered:** The merchant rewards you with 5 gold or a discount on future purchases
- **Blue Crystal:** Can be kept as a simple light source for future adventures

## REWARD
- **Healing Potion:** Restores 1d6+2 health
- **Map to Forgotten Shrine:** Makes finding the next location easier
- **Optional: Knowledge** - Tilda can teach a simple herb recipe if befriended

## RUNNING THE LEVEL
- Perfect introduction to basic game mechanics (exploration, dialogue, simple puzzles)
- Entire adventure can be completed in 5-10 minutes
- Tilda can become a recurring character who offers herb-related side quests
- The blue crystal serves as a narrative hook, as similar crystals may appear in future adventures

You can use markdown to make the text more readable, especially to mark the points of interest for the user.
  `;
};
