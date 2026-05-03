# 🎮 Kerala Konishtt v2.0 — Political Survival Game

A retro 3-lane dodger arcade game themed around Kerala's political chaos. **Choose your coalition. Dodge your party's scandals. Survive!**

## How to Play

1. Open `index.html` in any browser
2. Click **CHOOSE YOUR SIDE**
3. Pick **UDF**, **LDF**, or **NDA**
4. Use **Arrow Keys** (or A/D) to dodge between 3 lanes
5. On mobile: **Swipe** or **tap left/right** halves of screen
6. You have **3 lives** — survive as long as possible!
7. Collect **green power-ups** (rival scandals) for shields, extra lives, and slow-mo!

## Party Modes

| Party | Symbol | Color | Tagline |
|-------|--------|-------|---------|
| **UDF** | ✋ | Green | *"Congress vannam, kaanam!"* |
| **LDF** | ☭ | Red | *"Lal salaam, comrade!"* |
| **NDA** | 🪷 | Saffron | *"Sabka saath, aarude vote?"* |

## Obstacles

### UDF-specific
| Emoji | Obstacle | Based On |
|-------|----------|----------|
| 😰 | Mankootathil Scandal | Rahul Mamkootathil arrest |
| 💊 | Punarjani Scam | Alternative medicine fraud |
| 🤼 | CM Post Infighting | Leaders fighting for CM seat |
| ⏳ | Decade in Opposition | 10 years without power |
| 🪑 | Musical Chairs | Seat-sharing chaos |

### LDF-specific
| Emoji | Obstacle | Based On |
|-------|----------|----------|
| 🥷 | Sabarimala Gold Scam | Temple gold theft |
| 💸 | Kannur Fund Drain | CPIM fund embezzlement |
| 🏥 | Health Collapse | Public health failures |
| ✈️ | Youth Exodus | Heightened youth migration |
| ⚽ | No Messi for Kerala | Failed to bring Messi |

### NDA-specific
| Emoji | Obstacle | Based On |
|-------|----------|----------|
| 🎭 | Suresh Gopi Antics | Vote-securing theatrics |
| 💰 | Vote Bribing | Cash/sari bribing |
| 🗳️ | Vote Chori | Vote manipulation issues |
| 💵 | No Fund Devolution | Lack of central funds |
| 🎀 | Modiji Inaugurates | Inaugurating everything |

### Common (all parties)
| Emoji | Obstacle | Based On |
|-------|----------|----------|
| 🕵️ | B-Team Agent | B-team accusations |
| 🤬 | PC George Rant | PC George swearing |
| 🔄 | Side-Switcher | Leaders switching parties |

## Power-ups
Rival parties' scandals become your power-ups!
- 🛡️ **Shield** — 3s invincibility
- 💚 **Extra Life** — +1 heart
- ⏱️ **Slow-Mo** — 4s slowdown

## Features
- 🎵 8-bit Kuttanadan Punjayile background music
- 🎨 Dynamic theming per party (road, player, HUD colors)
- 💥 Screen shake + particle effects
- 📱 Mobile-first (tap + swipe controls)
- 🏆 Best score persistence
- 📤 Share with party name included
- 🔊 Retro 8-bit sound effects

## Tech Stack
- HTML5 Canvas + Vanilla CSS + Vanilla JS
- **Zero dependencies** — no npm, no build tools

## File Structure
```
KeralaPoliticsGame/
├── index.html
├── style.css
├── data.js              # Party data, obstacles, power-ups, music
├── game.js              # Game engine
├── assets/
│   ├── logo.png
│   ├── sprites.png
│   └── gameover.png
├── README.md
├── implementation_plan.md
├── walkthrough.md
└── task.md
```

## Running
```bash
open index.html
```
