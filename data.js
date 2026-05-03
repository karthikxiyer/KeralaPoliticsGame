/* ============================================================
   Kerala Konishtt v2.0 — Party Data & Configuration
   ============================================================ */

const PARTIES = {
    udf: {
        id: 'udf',
        name: 'UDF',
        fullName: 'United Democratic Front',
        symbol: '✋',
        tagline: 'Congress Nayikkumo?',
        color: '#00cc66',
        colorDark: '#003d1f',
        roadTint: 'rgba(0,107,63,0.15)',
        laneDivider: 'rgba(0,204,102,0.25)',
        shirtColor: '#006B3F',
        obstacles: [
            {
                id: 'mankootathil', emoji: '😏', label: 'Who Cares', color: '#FF6B6B',
                title: '"Who Cares?". The public does',
                quote: '"Three complaints, one bail. Who cares? Not Rahul."',
                story: 'Rahul Mamkootathil, MLA from Palakkad — arrested, jailed, bailed. His response? A smirk and a shrug. Who cares, indeed.'
            },
            {
                id: 'punarjani', emoji: '💊', label: 'Punarjani Scam', color: '#E74C3C',
                title: 'Punarjani Scam caught you.',
                quote: '"Kuruvi Kuruvi Veedevide?"',
                story: 'Nobody realized "Punarjani" meant the money gets a second life in someone else\'s bank account'
            },
            {
                id: 'cm_fight', emoji: '🤼', label: 'CM Vadamvali', color: '#F39C12',
                title: 'CM Vadamvali crushed you.',
                quote: '"Everyone wants the chair. Who will get it?"',
                story: 'Three leaders, one CM post. The only thing UDF fights harder than LDF is itself.'
            },
            {
                id: 'rahul_gandhi', emoji: '📋', label: 'Delhi Diktats', color: '#1E90FF',
                title: 'Delhi Diktats silenced you.',
                quote: '"Orders from Delhi. No questions, no answers."',
                story: 'The high command in Delhi makes the decisions. Kerala party workers just smile and nod. Independent thinking? Not on the menu.'
            }
        ]
    },
    ldf: {
        id: 'ldf',
        name: 'LDF',
        fullName: 'Left Democratic Front',
        symbol: '☭',
        tagline: 'Lal salaam, Sakhave!',
        color: '#ff4444',
        colorDark: '#3d0000',
        roadTint: 'rgba(204,0,0,0.12)',
        laneDivider: 'rgba(255,68,68,0.25)',
        shirtColor: '#CC0000',
        obstacles: [
            {
                id: 'gold_scam', emoji: '🥷', label: 'Swamiye SWARNAM\nAyyappa', color: '#FFD700',
                title: 'Swamiye SWARNAM Ayyappa got you.',
                quote: '"Swami Ayyappa\'s gold vanished. So did accountability."',
                story: 'A man in mundu ran off with the temple gold. Sabarimala\'s holiest treasure disappeared under everyone\'s watch.'
            },
            {
                id: 'kannur_fund', emoji: '💸', label: 'Kannur Fund\nEmbezzlement', color: '#E74C3C',
                title: 'Kannur Fund Embezzlement got you.',
                quote: '"Party funds create Vimathar, not cadre"',
                story: 'In Kannur, "financial transparency" just means we can all clearly see that the money is gone. It\s impressive how they managed to redistribute the wealth—mostly to themselves.'
            },
            {
                id: 'health_collapse', emoji: '🏥', label: 'Health Infra\nCollapse', color: '#3498DB',
                title: 'Health Infra Collapse crushed you.',
                quote: '"Quality healthcare! (Terms: Public health may be in the casualty ward)"',
                story: 'Persistent lapses in public health infrastructure. Hospitals crumble while press conferences flourish.'
            },
            {
                id: 'youth_exodus', emoji: '✈️', label: 'Youth Exodus', color: '#2ECC71',
                title: 'Youth Exodus swept you away.',
                quote: '"Dubai, Canada, UK \u2014 anywhere but here. Thanks, Kerala."',
                story: 'Heightened youth migration. Flights to Dubai, Canada, and the UK are always full. Kerala produces graduates, the world employs them.'
            },
            {
                id: 'no_messi', emoji: '⚽', label: 'Messi Vannilla', color: '#9B59B6',
                title: 'Messi dribbled past you.',
                quote: '"Messi Varum. Messi Varum. Messi ivide mathram vannilla"',
                story: 'The government promised Messi in Kerala. Messi smiled and went elsewhere. The only goal scored was an own goal.'
            }
        ]
    },
    nda: {
        id: 'nda',
        name: 'NDA',
        fullName: 'National Democratic Alliance',
        symbol: '🪷',
        tagline: 'Sabka saath, Evide vote?',
        color: '#ff9933',
        colorDark: '#3d2200',
        roadTint: 'rgba(255,102,0,0.12)',
        laneDivider: 'rgba(255,153,51,0.25)',
        shirtColor: '#FF6600',
        obstacles: [
            {
                id: 'suresh_gopi', emoji: '😎', label: 'Enikk Thrissur\nVenam', color: '#E74C3C',
                title: 'Enikk Thrissur Venam got you.',
                quote: '"Enikk Thrissur venam! But Thrissur doesn\'t want you back."',
                story: 'Suresh Gopi wanted Thrissur. Got Thrissur. Then forgot everything, and ippo namakk AIIMS illa. Star power meets disappearing act.'
            },
            {
                id: 'vote_bribe', emoji: '💰', label: 'Election Bribe\nAllegations', color: '#FFD700',
                title: 'Election Bribe Allegations caught you.',
                quote: '"₹500, a sari, and a grocery kit. Democracy delivered!"',
                story: 'Cash in envelopes, saris in bags, grocery kits at the door — allegations of vote bribing haunt every election cycle.'
            },
            {
                id: 'vote_chori', emoji: '🗳️', label: 'Vote Chori', color: '#FF6B6B',
                title: 'Vote Chori issues exposed you.',
                quote: '"Votes appeared. Votes disappeared. Nobody saw nothing."',
                story: 'The ballot box has more mysteries than an Agatha Christie novel. Every election, new plot twists.'
            },
            {
                id: 'no_funds', emoji: '🚫', label: 'No Fund\nDevolution', color: '#3498DB',
                title: 'No Fund Devolution starved you.',
                quote: '"Central funds? Sorry, Kerala isn\'t on the map."',
                story: 'Lack of devolution of funds to Kerala. The center sends thoughts and prayers. Kerala needed roads and relief.'
            },
            {
                id: 'modiji', emoji: '🎀', label: 'Modiji Inaugurates', color: '#FF9933',
                title: 'Modiji Inaugurated your game over.',
                quote: '"Modiji inaugurated your defeat. Grand ceremony."',
                story: 'Another ribbon cut, another photo op. Modiji inaugurates everything — including things that already exist.'
            }
        ]
    }
};

const COMMON_OBSTACLES = [
    {
        id: 'bteam', emoji: '✋☭🪷', label: 'B-Team\nAllegations', color: '#FF8C42',
        title: 'B-Team Allegations got you.',
        quote: '"Whose B-team? Everyone\'s accusing everyone."',
        story: 'UDF says LDF is BJP\'s B-team. LDF says UDF is. BJP says both are theirs. Hand, hammer-sickle, and lotus — all in one secret handshake.'
    }
];

const POWERUP_EFFECTS = {
    shield: { label: '🛡️ SHIELD!', duration: 3000, hudText: '🛡️ SHIELDED', hudColor: '#00ff88' },
    extralife: { label: '💚 +1 LIFE!', duration: 0, hudText: '💚 +1 LIFE', hudColor: '#ff6699' },
    slowmo: { label: '⏱️ SLOW-MO!', duration: 4000, hudText: '⏱️ SLOW-MO', hudColor: '#66ccff' }
};

const POWERUP_KEYS = ['shield', 'extralife', 'slowmo'];

// ═══════════════════════════════════════════════════════════════════════════
// Kuttanadan Punjayile — Post-0:26  (8-bit chiptune arrangement)
// Boat-race rhythm: 130 BPM ≈ 0.185s/beat (dotted-eighth feel)
// Scale (Carnatic/Khamaj hybrid):
//   ni2=G#3(207) Sa=A3(220) Re=B3(247) Ga=C#4(277) Ma=D4(294)
//   Pa=E4(330) Dha=F#4(370) Ni=G#4(415) Sa'=A4(440) Re'=B4(494) Ga'=C#5(554)
//
// ★ "Thi Thi Thara Thi Thi Thayy" = Pa Pa Dha | Pa Pa Ma
//    played on TWO oscillators (melody + bass 5th) for fullness
// ═══════════════════════════════════════════════════════════════════════════

// b=bass note played simultaneously, h=harmony note, v=volume override
const MUSIC_NOTES = [

    // ── SECTION A: "Kottu venam kuzhal venam" pickup (bars 1–2) ──────────
    // Re Ga Ma  Pa Pa  Ma Ga  Re Sa
    { f: 247, d: 0.14 }, { f: 277, d: 0.14 }, { f: 294, d: 0.18 },
    { f: 330, d: 0.14 }, { f: 330, d: 0.22 },
    { f: 294, d: 0.14 }, { f: 277, d: 0.14 }, { f: 247, d: 0.14 }, { f: 220, d: 0.28 },
    { f: 0, d: 0.12 },
    // Re Ga Pa  Dha Pa  Ma Ga Re
    { f: 247, d: 0.14 }, { f: 277, d: 0.14 }, { f: 330, d: 0.18 },
    { f: 370, d: 0.14 }, { f: 330, d: 0.22 },
    { f: 294, d: 0.14 }, { f: 277, d: 0.14 }, { f: 247, d: 0.28 },
    { f: 0, d: 0.14 },

    // ── SECTION B ★★★ THI THI THARA — bar 1 (mid octave) ★★★ ─────────────
    // Pa Pa | Dha — | Pa Pa | Ma ——
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 370, d: 0.32 },
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 294, d: 0.38 },
    { f: 0, d: 0.10 },
    // ★★★ THI THI THARA — bar 2 (same phrase, louder feel via repetition) ★★★
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 370, d: 0.32 },
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 294, d: 0.38 },
    { f: 0, d: 0.10 },

    // ── SECTION C: "Thaka thimi" bridge (ascending run) ─────────────────
    // Ma Pa Dha  Sa' Ni Dha  Pa Ma
    { f: 294, d: 0.14 }, { f: 330, d: 0.14 }, { f: 370, d: 0.18 },
    { f: 440, d: 0.14 }, { f: 415, d: 0.14 }, { f: 370, d: 0.18 },
    { f: 330, d: 0.22 }, { f: 294, d: 0.32 },
    { f: 0, d: 0.12 },

    // ── SECTION D ★★★ THI THI THARA — HIGH OCTAVE (Sa' Sa' Ni | Sa' Sa' Dha) ★★★
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 415, d: 0.32 },
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 370, d: 0.38 },
    { f: 0, d: 0.10 },
    // ★★★ Repeat high — the big hook ★★★
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 415, d: 0.32 },
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 370, d: 0.38 },
    { f: 0, d: 0.10 },

    // ── SECTION E: Descending "Thaka thimi" ornament ─────────────────────
    // Sa' Ni Dha  Pa Ma Ga  Re Sa
    { f: 440, d: 0.14 }, { f: 415, d: 0.14 }, { f: 370, d: 0.18 },
    { f: 330, d: 0.14 }, { f: 294, d: 0.14 }, { f: 277, d: 0.14 },
    { f: 247, d: 0.22 }, { f: 220, d: 0.30 },
    { f: 0, d: 0.14 },

    // ── SECTION F ★★★ THI THI THARA — CALL (mid) + RESPONSE (high) ★★★ ───
    // Call: Pa Pa Dha | Pa Pa Ma
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 370, d: 0.32 },
    { f: 330, d: 0.16 }, { f: 330, d: 0.16 },
    { f: 294, d: 0.38 },
    { f: 0, d: 0.08 },
    // Response: Sa' Sa' Ni | Sa' Sa' Dha (immediate echo, slightly louder)
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 415, d: 0.32 },
    { f: 440, d: 0.16 }, { f: 440, d: 0.16 },
    { f: 370, d: 0.38 },
    { f: 0, d: 0.08 },

    // ── SECTION G: Verse cadence — back to Sa ────────────────────────────
    // Pa Ma Ga Re  Sa —— (boat gliding back)
    { f: 330, d: 0.14 }, { f: 294, d: 0.14 },
    { f: 277, d: 0.14 }, { f: 247, d: 0.14 },
    { f: 220, d: 0.45 },
    { f: 0, d: 0.55 },  // pause before loop
];

// Party-specific powerup configurations
const PARTY_POWERUPS = {
    udf: {
        extralife: { label: 'Anti-Incumbancy Wave', image: 'anti_incumbancy.png', hudText: '📊 WAVE', hudColor: '#00ff88', duration: 0 },
        slowmo: { label: 'Swamiye SWARNAM Ayyappa', image: 'gold_scam.png', hudText: '⏱️ SACRED', hudColor: '#66ccff', duration: 4000 },
        shield: { label: 'Social Welfare Promises', image: 'social_welfare.png', hudText: '🛡️ WELFARE', hudColor: '#ffcc00', duration: 3000 }
    },
    ldf: {
        extralife: { label: 'Punarjani Scam', image: 'punarjani.png', hudText: '💉 REVIVAL', hudColor: '#00ff88', duration: 0 },
        slowmo: { label: 'No Central Funds', image: 'no_central_funds.png', hudText: '⏱️ STARVED', hudColor: '#66ccff', duration: 4000 },
        shield: { label: 'Rahul Mankootathil Issue', image: 'rahul_issue.png', hudText: '🛡️ CONFUSION', hudColor: '#ffcc00', duration: 3000 }
    },
    nda: {
        extralife: { label: 'Swamiye SWARNAM Ayyappa', image: 'gold_scam.png', hudText: '💚 SACRED', hudColor: '#00ff88', duration: 0 },
        slowmo: { label: 'Anti-Incumbancy Wave', image: 'anti_incumbancy.png', hudText: '⏱️ WAVE', hudColor: '#66ccff', duration: 4000 },
        shield: { label: 'Economic Development Promises', image: 'economic_development.png', hudText: '🛡️ GROWTH', hudColor: '#ffcc00', duration: 3000 }
    }
};
