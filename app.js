// Ayushkarma Auspiciousness Checker

// Language State
let currentLang = 'kn';

// Translations
const TRANSLATIONS = {
    en: {
        title: "Kshoura",
        subtitle: "Ayushkarma Panchanga",
        today: "Today",
        loading: "Loading...",
        thithi: "Thithi",
        nakshatra: "Nakshatra",
        vasara: "Vasara",
        uttamaLeg: "Uttama (3 match)",
        madhyamaLeg: "Madhyama (2 match)",
        adhamaLeg: "Adhama (1 match)",
        varjyaLeg: "Varjya (0 match)",
        upcomingTitle: "📅 Upcoming Auspicious Days",
        upcomingSubtitle: "Best days for Kshoura in the next 15 days",
        emergencyOptions: "⚠️ Emergency Options (Adhama - 1 match)",
        source: "Data source:",
        noData: "No auspicious days found in the next 15 days",
        noAdhama: "No Adhama days in the next 15 days",

        // Ratings
        Uttama: "Uttama",
        Madhyama: "Madhyama",
        Adhama: "Adhama",
        Varjya: "Varjya",

        // Descriptions
        desc_Uttama: "Excellent for hair cutting!",
        desc_Madhyama: "Good day for hair cutting",
        desc_Adhama: "Acceptable, but not ideal",
        desc_Varjya: "Avoid hair cutting today",

        // Match status
        matched: "matched"
    },
    kn: {
        title: "ಕ್ಷೌರ",
        subtitle: "ಆಯುಷ್ಕರ್ಮ ಪಂಚಾಂಗ",
        today: "ಇಂದು",
        loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        thithi: "ತಿಥಿ",
        nakshatra: "ನಕ್ಷತ್ರ",
        vasara: "ವಾರ",
        uttamaLeg: "ಉತ್ತಮ (3 ಹೊಂದಾಣಿಕೆ)",
        madhyamaLeg: "ಮಧ್ಯಮ (2 ಹೊಂದಾಣಿಕೆ)",
        adhamaLeg: "ಅಧಮ (1 ಹೊಂದಾಣಿಕೆ)",
        varjyaLeg: "ವರ್ಜ್ಯ (0 ಹೊಂದಾಣಿಕೆ)",
        upcomingTitle: "📅 ಮುಂಬರುವ ಶುಭ ದಿನಗಳು",
        upcomingSubtitle: "ಮುಂದಿನ 15 ದಿನಗಳಲ್ಲಿ ಕ್ಷೌರಕ್ಕೆ ಉತ್ತಮ ದಿನಗಳು",
        emergencyOptions: "⚠️ ತುರ್ತು ಆಯ್ಕೆಗಳು (ಅಧಮ - 1 ಹೊಂದಾಣಿಕೆ)",
        source: "ಮಾಹಿತಿ ಮೂಲ:",
        noData: "ಮುಂದಿನ 15 ದಿನಗಳಲ್ಲಿ ಯಾವುದೇ ಶುಭ ದಿನಗಳಿಲ್ಲ",
        noAdhama: "ಮುಂದಿನ 15 ದಿನಗಳಲ್ಲಿ ಅಧಮ ದಿನಗಳಿಲ್ಲ",

        // Ratings
        Uttama: "ಉತ್ತಮ",
        Madhyama: "ಮಧ್ಯಮ",
        Adhama: "ಅಧಮ",
        Varjya: "ವರ್ಜ್ಯ",

        // Descriptions
        desc_Uttama: "ಕ್ಷೌರಕ್ಕೆ ಅತ್ಯುತ್ತಮ ದಿನ!",
        desc_Madhyama: "ಕ್ಷೌರಕ್ಕೆ ಒಳ್ಳೆಯ ದಿನ",
        desc_Adhama: "ಪರವಾಗಿಲ್ಲ, ಆದರೆ ಶ್ರೇಷ್ಠವಲ್ಲ",
        desc_Varjya: "ಇಂದು ಕ್ಷೌರ ಮಾಡಿಸಬಾರದು",

        // Match status
        matched: "ಹೊಂದಾಣಿಕೆ"
    },
    // Panchanga Terms (Mapping to Kannada)
    terms: {
        // Thithis
        'Prathama': 'ಪ್ರಥಮ', 'Pratipada': 'ಪ್ರಥಮ',
        'Dvitiya': 'ದ್ವಿತೀಯ', 'Dwitiya': 'ದ್ವಿತೀಯ', 'Dwithiya': 'ದ್ವಿತೀಯ',
        'Tritiya': 'ತೃತೀಯ', 'Thrithiya': 'ತೃತೀಯ', 'Triteeya': 'ತೃತೀಯ',
        'Chaturthi': 'ಚತುರ್ಥಿ', 'Chathurthi': 'ಚತುರ್ಥಿ',
        'Panchami': 'ಪಂಚಮಿ',
        'Shashthi': 'ಷಷ್ಠಿ', 'Shashti': 'ಷಷ್ಠಿ',
        'Saptami': 'ಸಪ್ತಮಿ', 'Sapthami': 'ಸಪ್ತಮಿ',
        'Ashtami': 'ಅಷ್ಟಮಿ',
        'Navami': 'ನವಮಿ',
        'Dashami': 'ದಶಮಿ',
        'Ekadashi': 'ಏಕಾದಶಿ', 'Ekadasi': 'ಏಕಾದಶಿ',
        'Dwadashi': 'ದ್ವಾದಶಿ', 'Dvadashi': 'ದ್ವಾದಶಿ',
        'Trayodashi': 'ತ್ರಯೋದಶಿ', 'Trayodasi': 'ತ್ರಯೋದಶಿ',
        'Chaturdashi': 'ಚತುರ್ದಶಿ', 'Chaturdasi': 'ಚತುರ್ದಶಿ',
        'Purnima': 'ಹುಣ್ಣಿಮೆ', 'Poornima': 'ಹುಣ್ಣಿಮೆ',
        'Amavasya': 'ಅಮಾವಾಸ್ಯೆ', 'Amavasi': 'ಅಮಾವಾಸ್ಯೆ',

        // Weekdays
        'Ravivara': 'ಭಾನುವಾರ', 'Ravi': 'ಭಾನುವಾರ', 'Sunday': 'ಭಾನುವಾರ',
        'Somavara': 'ಸೋಮವಾರ', 'Soma': 'ಸೋಮವಾರ', 'Monday': 'ಸೋಮವಾರ',
        'Mangalavara': 'ಮಂಗಳವಾರ', 'Mangala': 'ಮಂಗಳವಾರ', 'Tuesday': 'ಮಂಗಳವಾರ',
        'Budhavara': 'ಬುಧವಾರ', 'Budha': 'ಬುಧವಾರ', 'Wednesday': 'ಬುಧವಾರ',
        'Guruvara': 'ಗುರುವಾರ', 'Guru': 'ಗುರುವಾರ', 'Thursday': 'ಗುರುವಾರ',
        'Shukravara': 'ಶುಕ್ರವಾರ', 'Shukra': 'ಶುಕ್ರವಾರ', 'Friday': 'ಶುಕ್ರವಾರ',
        'Shanivara': 'ಶನಿವಾರ', 'Shani': 'ಶನಿವಾರ', 'Saturday': 'ಶನಿವಾರ',

        // Nakshatras
        'Ashwini': 'ಅಶ್ವಿನಿ', 'Aswini': 'ಅಶ್ವಿನಿ',
        'Bharani': 'ಭರಣಿ',
        'Krittika': 'ಕೃತ್ತಿಕಾ', 'Kruttika': 'ಕೃತ್ತಿಕಾ',
        'Rohini': 'ರೋಹಿಣಿ',
        'Mrugashira': 'ಮೃಗಶಿರಾ', 'Mrigashira': 'ಮೃಗಶಿರಾ', 'Mrigashirsha': 'ಮೃಗಶಿರಾ',
        'Ardra': 'ಆರ್ದ್ರಾ', 'Arudra': 'ಆರ್ದ್ರಾ',
        'Punarvasu': 'ಪುನರ್ವಸು',
        'Pushya': 'ಪುಷ್ಯ', 'Pushyami': 'ಪುಷ್ಯ',
        'Ashlesha': 'ಆಶ್ಲೇಷ', 'Ashresha': 'ಆಶ್ಲೇಷ',
        'Magha': 'ಮಘಾ',
        'Purva Phalguni': 'ಪೂರ್ವ ಫಲ್ಗುಣಿ', 'Uttara Phalguni': 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
        'Hasta': 'ಹಸ್ತ',
        'Chitta': 'ಚಿತ್ತಾ', 'Chitra': 'ಚಿತ್ತಾ', 'Chittaa': 'ಚಿತ್ತಾ',
        'Swati': 'ಸ್ವಾತಿ', 'Swathi': 'ಸ್ವಾತಿ',
        'Vishakha': 'ವಿಶಾಖ', 'Vishaka': 'ವಿಶಾಖ',
        'Anuradha': 'ಅನುರಾಧ',
        'Jyeshtha': 'ಜ್ಯೇಷ್ಠ', 'Jyesta': 'ಜ್ಯೇಷ್ಠ', 'Jyeshta': 'ಜ್ಯೇಷ್ಠ',
        'Moola': 'ಮೂಲ', 'Mula': 'ಮೂಲ',
        'Purvashadha': 'ಪೂರ್ವಾಷಾಢ', 'Uttarashadha': 'ಉತ್ತರಾಷಾಢ',
        'Shravana': 'ಶ್ರವಣ', 'Sravana': 'ಶ್ರವಣ',
        'Dhanista': 'ಧನಿಷ್ಠ', 'Dhanishta': 'ಧನಿಷ್ಠ', 'Dhanishtha': 'ಧನಿಷ್ಠ', 'Shravishtha': 'ಧನಿಷ್ಠ',
        'Shatabhisha': 'ಶತಭಿಷ', 'Shatabisha': 'ಶತಭಿಷ', 'Shatabhishak': 'ಶತಭಿಷ',
        'Purva Bhadrapada': 'ಪೂರ್ವಾಭಾದ್ರ', 'Purvabhadra': 'ಪೂರ್ವಾಭಾದ್ರ',
        'Uttara Bhadrapada': 'ಉತ್ತರಾಭಾದ್ರ', 'Uttarabhadra': 'ಉತ್ತರಾಭಾದ್ರ',
        'Revati': 'ರೇವತಿ', 'Revathi': 'ರೇವತಿ'
    }
};

// Auspicious Criteria
const AUSPICIOUS = {
    thithi: [
        'dvitiya', 'tritiya', 'panchami', 'saptami', 'dashami', 'trayodashi'
    ],
    vasara: [
        'somavara', 'budhavara', 'guruvara'
    ],
    nakshatra: [
        'ashwini', 'mrugashira', 'punarvasu', 'pushya', 
        'hasta', 'chitta', 'swati', 'jyesta',
        'shravana', 'dhanista', 'shatabhisha', 'revati'
    ]
};

// Normalization mappings for spelling variations
const NORMALIZE = {
    thithi: {
        'prathama': 'prathama', 'pratipada': 'prathama',
        'dvitiya': 'dvitiya', 'dwitiya': 'dvitiya', 'dwithiya': 'dvitiya', 'dwiteeya': 'dvitiya',
        'tritiya': 'tritiya', 'thrithiya': 'tritiya', 'truteeya': 'tritiya', 'triteeya': 'tritiya',
        'chaturthi': 'chaturthi', 'chathurthi': 'chaturthi',
        'panchami': 'panchami', 'panchmi': 'panchami',
        'shashthi': 'shashthi', 'shashti': 'shashthi',
        'saptami': 'saptami', 'sapthami': 'saptami',
        'ashtami': 'ashtami', 'ashtmi': 'ashtami',
        'navami': 'navami', 'navmi': 'navami',
        'dashami': 'dashami', 'dashmi': 'dashami',
        'ekadashi': 'ekadashi', 'ekadasi': 'ekadashi',
        'dwadashi': 'dwadashi', 'dvadashi': 'dwadashi',
        'trayodashi': 'trayodashi', 'trayodasi': 'trayodashi',
        'chaturdashi': 'chaturdashi', 'chaturdasi': 'chaturdashi',
        'purnima': 'purnima', 'poornima': 'purnima', 'hunnime': 'purnima',
        'amavasya': 'amavasya', 'amavasi': 'amavasya'
    },
    vasara: {
        'ravivara': 'ravivara', 'ravi': 'ravivara', 'sunday': 'ravivara',
        'somavara': 'somavara', 'soma': 'somavara', 'monday': 'somavara',
        'mangalavara': 'mangalavara', 'mangala': 'mangalavara', 'tuesday': 'mangalavara',
        'budhavara': 'budhavara', 'budha': 'budhavara', 'wednesday': 'budhavara',
        'guruvara': 'guruvara', 'guru': 'guruvara', 'thursday': 'guruvara',
        'shukravara': 'shukravara', 'shukra': 'shukravara', 'friday': 'shukravara', 'śukravara': 'shukravara',
        'shanivara': 'shanivara', 'shani': 'shanivara', 'saturday': 'shanivara', 'śanivara': 'shanivara'
    },
    nakshatra: {
        'ashwini': 'ashwini', 'aswini': 'ashwini',
        'bharani': 'bharani',
        'krittika': 'krittika', 'kruthika': 'krittika', 'kruttika': 'krittika',
        'rohini': 'rohini',
        'mrugashira': 'mrugashira', 'mrigashira': 'mrugashira', 'mrigashirsha': 'mrugashira',
        'ardra': 'ardra', 'arudra': 'ardra', 'ardhraa': 'ardra',
        'punarvasu': 'punarvasu',
        'pushya': 'pushya', 'pushyami': 'pushya',
        'ashlesha': 'ashlesha', 'ashresha': 'ashlesha',
        'magha': 'magha',
        'purva phalguni': 'purva phalguni', 'pubba': 'purva phalguni',
        'uttara phalguni': 'uttara phalguni', 'uttara': 'uttara phalguni',
        'hasta': 'hasta',
        'chitta': 'chitta', 'chitra': 'chitta', 'chittaa': 'chitta',
        'swati': 'swati', 'swathi': 'swati', 'swaati': 'swati',
        'vishakha': 'vishakha',
        'anuradha': 'anuradha',
        'jyesta': 'jyesta', 'jyeshta': 'jyesta', 'jyeshtha': 'jyesta',
        'moola': 'moola', 'mula': 'moola',
        'purvashadha': 'purvashadha', 'purva ashadha': 'purvashadha',
        'uttarashadha': 'uttarashadha', 'uttara ashadha': 'uttarashadha',
        'shravana': 'shravana', 'sravana': 'shravana', 'shravan': 'shravana',
        'dhanista': 'dhanista', 'dhanishta': 'dhanista', 'dhanishtha': 'dhanista', 'shravishtha': 'dhanista',
        'shatabhisha': 'shatabhisha', 'shatabhishak': 'shatabhisha', 'shatataraka': 'shatabhisha', 'shatabisha': 'shatabhisha',
        'purva bhadrapada': 'purva bhadrapada', 'purvabhadra': 'purva bhadrapada', 'purvaabhaadra': 'purva bhadrapada',
        'uttara bhadrapada': 'uttara bhadrapada', 'uttarabhadra': 'uttara bhadrapada', 'uttaraabhaadra': 'uttara bhadrapada',
        'revati': 'revati', 'revathi': 'revati'
    }
};

// Rating definitions
const RATINGS = {
    3: { name: 'Uttama', class: 'uttama', icon: '✅' },
    2: { name: 'Madhyama', class: 'madhyama', icon: '👍' },
    1: { name: 'Adhama', class: 'adhama', icon: '⚠️' },
    0: { name: 'Varjya', class: 'varjya', icon: '❌' }
};

// TRANSLATION HELPER FUNCTIONS
function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

// Normalization helper for fuzzy matching
function cleanString(str) {
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents (Ś -> S)
        .replace(/aa/g, "a")
        .replace(/ee/g, "i")
        .replace(/oo/g, "u")
        .replace(/\s+/g, "");
}

// Levenshtein distance for fuzzy matching
function getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function translateTerm(term) {
    // If English, return as is
    if (currentLang === 'en') return term;
    if (!term) return '-';

    // 1. Direct lookup
    if (TRANSLATIONS.terms[term]) return TRANSLATIONS.terms[term];

    // 2. Case-insensitive lookup
    const capitalTerm = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
    if (TRANSLATIONS.terms[capitalTerm]) return TRANSLATIONS.terms[capitalTerm];

    // 3. Normalized lookup (clean accents and double vowels)
    // We iterate through keys to find a "clean" match
    const cleanInput = cleanString(term);
    const keys = Object.keys(TRANSLATIONS.terms);

    // First pass: Match cleaned versions
    for (const key of keys) {
        if (cleanString(key) === cleanInput) {
            return TRANSLATIONS.terms[key];
        }
    }

    // 4. Fuzzy lookup (Levenshtein)
    // Only if length is decent to avoid false positives on short words
    if (term.length > 3) {
        let bestMatch = null;
        let minDistance = Infinity;

        for (const key of keys) {
            const dist = getLevenshteinDistance(cleanInput, cleanString(key));
            if (dist < minDistance) {
                minDistance = dist;
                bestMatch = key;
            }
        }

        // Tolerance: 3 edits approx
        if (minDistance <= 3 && bestMatch) {
            return TRANSLATIONS.terms[bestMatch];
        }
    }

    // 5. Explicit mapping for common tricky ones
    if (term.includes('Śukravara')) return 'ಶುಕ್ರವಾರ';
    if (term.includes('Śanivara')) return 'ಶನಿವಾರ';
    if (term.includes('Uttaraabhaadra')) return 'ಉತ್ತರಾಭಾದ್ರ';

    return term; // Fallback
}

// SWITCH LANGUAGE
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.className = `lang-${lang}`; // For fonts

    // Update Toggle Button Text
    const toggleBtn = document.getElementById('langToggle');
    toggleBtn.querySelector('.lang-text').textContent = lang === 'en' ? 'ಕನ್ನಡ' : 'English';

    // Update Static Elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Re-render dynamic content (Panchanga & Upcoming)
    // We need to reload panchanga to trigger updateUI with new language
    loadPanchanga(); // Result card + details
    findUpcomingDays(); // Upcoming list
}


// Normalize a value using the mapping
function normalize(value, category) {
    if (!value) return '';
    const normalized = value.toLowerCase().trim();
    return NORMALIZE[category]?.[normalized] || normalized;
}

// Check if a value is auspicious
function isAuspicious(value, category) {
    const normalized = normalize(value, category);
    return AUSPICIOUS[category].includes(normalized);
}

// Calculate auspiciousness rating
function calculateRating(panchanga) {
    let matches = 0;
    
    const thithiMatch = isAuspicious(panchanga.thithi, 'thithi');
    const vasaraMatch = isAuspicious(panchanga.vasara, 'vasara');
    const nakshatraMatch = isAuspicious(panchanga.nakshatra, 'nakshatra');
    
    if (thithiMatch) matches++;
    if (vasaraMatch) matches++;
    if (nakshatraMatch) matches++;
    
    return {
        matches,
        rating: RATINGS[matches],
        thithiMatch,
        vasaraMatch,
        nakshatraMatch
    };
}

// Format date to YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display
function formatDisplayDate(date) {
    // For Kannada, we might want custom formatting, but built-in works well
    const locale = currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    return date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Update UI with panchanga data
function updateUI(panchanga, result) {
    // Update date
    document.getElementById('currentDate').textContent = formatDisplayDate(new Date());
    
    // Update result card
    const resultCard = document.getElementById('resultCard');
    resultCard.className = `result-card ${result.rating.class}`;
    document.getElementById('resultIcon').textContent = result.rating.icon;

    // Translate Rating Name and Description
    document.getElementById('resultTitle').textContent = t(result.rating.name);
    document.getElementById('resultDescription').textContent = t(`desc_${result.rating.name}`);

    const matchText = `${result.matches}/3 ${t('matched')}`;
    document.getElementById('matchCount').textContent = currentLang === 'kn'
        ? `${result.matches}/3 ಮಾನದಂಡಗಳು ಪೂರೈಸಿವೆ`
        : `${result.matches}/3 criteria matched`;

    // Update panchanga values (Translated)
    document.getElementById('thithiValue').textContent = translateTerm(panchanga.thithi) || '-';
    document.getElementById('nakshatraValue').textContent = translateTerm(panchanga.nakshatra) || '-';
    document.getElementById('vasaraValue').textContent = translateTerm(panchanga.vasara) || '-';
    
    // Update match status
    updateMatchStatus('thithi', result.thithiMatch);
    updateMatchStatus('nakshatra', result.nakshatraMatch);
    updateMatchStatus('vasara', result.vasaraMatch);
}

function updateMatchStatus(category, isMatch) {
    const card = document.getElementById(`${category}Card`);
    const status = document.getElementById(`${category}Status`);
    
    if (isMatch) {
        card.classList.add('match');
        card.classList.remove('no-match');
        status.textContent = '✓';
    } else {
        card.classList.add('no-match');
        card.classList.remove('match');
        status.textContent = '✗';
    }
}

// Load panchanga data
async function loadPanchanga() {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const dateStr = formatDate(today);
        
        // Try to load data for current year
        const response = await fetch(`panchanga-${year}.json`);
        if (!response.ok) {
            showError(`Panchanga data file for ${year} not found`);
            return;
        }
        
        const data = await response.json();
        const todayPanchanga = data[dateStr];
        
        if (todayPanchanga && todayPanchanga.thithi) {
            const result = calculateRating(todayPanchanga);
            updateUI(todayPanchanga, result);
        } else {
            showError('Panchanga data not available for today');
        }
    } catch (error) {
        console.error('Error loading panchanga:', error);
        showError('Failed to load panchanga data');
    }
}

function showError(message) {
    document.getElementById('resultTitle').textContent = 'Error';
    document.getElementById('resultDescription').textContent = message;
    document.getElementById('resultIcon').textContent = '⚠️';
}

// Cache for panchanga data across years
let panchangaCache = {};

// Load panchanga data for a specific year
async function loadPanchangaYear(year) {
    if (panchangaCache[year]) {
        return panchangaCache[year];
    }
    
    try {
        const response = await fetch(`panchanga-${year}.json`);
        if (response.ok) {
            panchangaCache[year] = await response.json();
            return panchangaCache[year];
        }
    } catch (e) {
        console.log(`No data for ${year}`);
    }
    return null;
}

// Get panchanga for a specific date (handles year boundaries)
async function getPanchangaForDate(date) {
    const year = date.getFullYear();
    const dateStr = formatDate(date);
    
    const data = await loadPanchangaYear(year);
    if (data && data[dateStr] && data[dateStr].thithi) {
        return data[dateStr];
    }
    return null;
}

// Format date for display in upcoming list
function formatShortDate(date) {
    const locale = currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    return date.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}
// Find upcoming auspicious days
async function findUpcomingDays(daysToCheck = 15) {
    const upcomingList = document.getElementById('upcomingList');
    const adhamaList = document.getElementById('adhamaList');
    const goodDays = [];
    const adhamaDays = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= daysToCheck; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        
        const panchanga = await getPanchangaForDate(checkDate);
        
        if (panchanga) {
            const rating = calculateRating(panchanga);
            
            const dayData = {
                date: checkDate,
                panchanga,
                rating
            };

            // Uttama (3) and Madhyama (2) -> good days
            if (rating.matches >= 2) {
                goodDays.push(dayData);
            }
            // Adhama (1) -> emergency days
            else if (rating.matches === 1) {
                adhamaDays.push(dayData);
            }
        }
    }
    
    // Helper to render list
    const renderList = (items, emptyMsg) => {
        if (items.length === 0) {
            return `<div class="no-data-text">${emptyMsg}</div>`;
        }
        return items.map(item => `
            <div class="upcoming-item ${item.rating.rating.class}">
                <span class="upcoming-date">${formatShortDate(item.date)}</span>
                <span class="upcoming-details">
                    ${translateTerm(item.panchanga.thithi)} • ${translateTerm(item.panchanga.nakshatra)} • ${translateTerm(item.panchanga.vasara)}
                </span>
                <span class="upcoming-rating ${item.rating.rating.class}">
                    ${t(item.rating.rating.name)}
                </span>
            </div>
        `).join('');
    };
    
    upcomingList.innerHTML = renderList(goodDays, t('noData'));
    adhamaList.innerHTML = renderList(adhamaDays, t('noAdhama'));
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Setup Toggle Button
    const toggleBtn = document.getElementById('langToggle');
    toggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'kn' ? 'en' : 'kn';
        setLanguage(newLang);
    });

    // Set default language
    setLanguage('kn');
});


