export const sheetMakerPromptGenerator = () => {
  return `

# TEXT-BASED GAME LEVEL GENERATOR PROMPT

## CORE PARAMETERS
Generate a detailed text-based game level with the following specifications:

- **Level Name**: [GENERATE A THEMATIC NAME]
- **Player Level**: [1-5/6-10/11-15/16-20] - Combat and enemy difficulty will scale accordingly
- **Theme**: [FOREST/DUNGEON/RUINS/VILLAGE/CAVE/MANSION/CASTLE/SHIP/SWAMP]
- **Size**: [SMALL (3-4 areas)/MEDIUM (5-6 areas)/LARGE (7-8 areas)]
- **Time Period**: [ANCIENT/MEDIEVAL/RENAISSANCE/MODERN/FUTURISTIC]
- **Gameplay Duration**: [SHORT (15-20 min)/MEDIUM (25-40 min)/FULL (45-60 min)] - Never exceed 1 hour

## LEVEL STRUCTURE

### 1. OVERVIEW
- Provide a 3-4 sentence introduction to the level's setting and context
- Include: location description, basic history, current inhabitants/situation
- Define the main objective clearly
- Establish any immediate dangers or time constraints

### 2. MAP STRUCTURE
- Define X key areas (based on chosen size)
- Create a clear connection diagram (Area A → Area B → Area C, etc.)
- Include at least one branching path or alternative route
- Ensure each area serves a purpose (challenge, story, resource, puzzle)

### 3. LOCATIONS
For each location, include:

#### [LETTER]. [LOCATION NAME]
**Description:** Vivid 3-5 sentence description incorporating sights, sounds, and smells. Include at least one notable feature that stands out.

**Features:**
- 3-5 interactive environmental elements
- At least one hidden or non-obvious element requiring perception/investigation
- One element connecting to the level's history or lore

**Encounters:**
- Primary encounter (NPC, enemy, or environmental challenge)
- Secondary encounter or challenge (optional based on player choices)

**Puzzle or Challenge (at least 3 areas should have one):**
- Clear description of the puzzle/challenge
- Specific concrete solution
- 1-2 subtle hints embedded in the environment
- Reward for completion

**Alternative Approach:**
- Non-violent or alternative solution to any combat
- At least one non-obvious way to navigate the challenge
- Resource or approach that can be discovered elsewhere in the level

## 4. NPCs
For 2-4 significant NPCs:

### [NPC NAME], [ROLE]
- **Description:** Physical appearance and demeanor
- **Motivation:** What they want and why
- **Tactics:** How they approach conflict/obstacles
- **Weakness:** Exploitable flaw in personality or approach
- **Information:** What useful knowledge they possess
- **Reaction Table:** Different responses based on player approach (friendly, neutral, hostile)

## 5. PUZZLES
For each significant puzzle (keep consistent regardless of player level):

### [PUZZLE NAME]
- **Challenge:** Clear description of what players face
- **Clues:** 2-3 environmental hints pointing to solution
- **Solution:** Specific steps needed to solve
- **Reward:** What players gain from solving
- **Bypass Option:** Alternative approach or workaround (harder or costlier)
- **Note:** Puzzle difficulty remains consistent across player levels—intellectual challenges should not scale with character power

## 6. COMBAT OPPORTUNITIES
For each potential combat (scale difficulty based on player level):

### [COMBAT NAME]
- **Enemies:** Types and numbers (adjust stats based on player level)
- **Environment:** How terrain affects the encounter
- **Tactics:** How enemies behave in combat
- **Scaling Mechanism:** How to adjust for different player levels:
  - **Levels 1-5:** Fewer enemies, basic tactics, obvious weaknesses
  - **Levels 6-10:** Standard encounter, coordinated tactics
  - **Levels 11-15:** Enhanced enemies, tactical advantages, environmental hazards
  - **Levels 16-20:** Elite versions, advanced tactics, secondary objectives
- **Non-combat Solution:** How to avoid or de-escalate (consistent across difficulty)
- **Rewards:** What players gain from victory (scale with difficulty)
- **Escape Plan:** How players can retreat if needed

## 7. REWARD STRUCTURE
- **Main Objective Reward:** Significant item, information, or resource
- **Explorer's Rewards:** 2-3 hidden or optional treasures
- **Knowledge Rewards:** Information that helps in future levels
- **Relationship Rewards:** NPC connections or reputation changes

## 8. TIME AND SCOPE CONSTRAINTS
Design the level to fit within the specified gameplay duration:

- **SHORT (15-20 min):** 3-4 areas maximum, streamlined objective, limited side content
- **MEDIUM (25-40 min):** 4-6 areas, main objective plus 1-2 optional discoveries
- **FULL (45-60 min):** 6-8 areas, layered objectives, multiple paths and secrets

Never design levels that would take more than 1 hour to complete. Focus on quality over quantity, with each area serving a clear purpose in the overall experience.

## 9. PLAYER APPROACH OPTIONS
Ensure the level accommodates these play styles:

- **Combat Focus:** Clear enemy progression and tactical scenarios
- **Stealth Focus:** Hidden paths, distraction options, sneaking advantages
- **Social Focus:** NPC interactions, persuasion options, alliances
- **Puzzle Focus:** Connected puzzles, observation rewards, knowledge application
- **Exploration Focus:** Hidden areas, environmental storytelling, resource discoveries

## 10. NARRATIVE ELEMENTS
- **Backstory:** 2-3 paragraph history of the location
- **Current Situation:** What changed recently to create this scenario
- **Future Implications:** How this level connects to the larger world/story
- **Lore Fragments:** 3-5 discoverable notes, journals, or artifacts

## WRITING STYLE GUIDE
- Use vivid, sensory descriptions for locations
- Write direct, actionable instructions for puzzles
- Create natural, conversational dialogue for NPCs
- Maintain consistent tone based on theme
- Balance detail with clarity (avoid overwhelming information)
- Use bullet points for features, inventory, and options
- Include specific numbers for all checks/difficulties
- Mark optional content clearly
- Keep descriptions concise—lengthy prose slows gameplay
- Focus on interactive elements over passive description
- Ensure consistent scaling of combat challenges with player level
- Maintain puzzle difficulty regardless of player level

## OUTPUT FORMAT
Format the complete level structure as a Markdown document with clear headings, bullet points, and sections for each component listed above.
  `;
};
