// Ayushkarma Auspiciousness Checker

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
    3: { name: 'Uttama', class: 'uttama', icon: '✅', description: 'Excellent for hair cutting!' },
    2: { name: 'Madhyama', class: 'madhyama', icon: '👍', description: 'Good day for hair cutting' },
    1: { name: 'Adhama', class: 'adhama', icon: '⚠️', description: 'Acceptable, but not ideal' },
    0: { name: 'Varjya', class: 'varjya', icon: '❌', description: 'Avoid hair cutting today' }
};

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
    return date.toISOString().split('T')[0];
}

// Format date for display
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-IN', {
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
    document.getElementById('resultTitle').textContent = result.rating.name;
    document.getElementById('resultDescription').textContent = result.rating.description;
    document.getElementById('matchCount').textContent = `${result.matches}/3 criteria matched`;
    
    // Update panchanga values
    document.getElementById('thithiValue').textContent = panchanga.thithi || '-';
    document.getElementById('nakshatraValue').textContent = panchanga.nakshatra || '-';
    document.getElementById('vasaraValue').textContent = panchanga.vasara || '-';
    
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
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

// Find upcoming auspicious days
async function findUpcomingDays(daysToCheck = 15) {
    const upcomingList = document.getElementById('upcomingList');
    const results = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= daysToCheck; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        
        const panchanga = await getPanchangaForDate(checkDate);
        
        if (panchanga) {
            const rating = calculateRating(panchanga);
            
            // Only show Uttama (3) and Madhyama (2) days
            if (rating.matches >= 2) {
                results.push({
                    date: checkDate,
                    panchanga,
                    rating
                });
            }
        }
    }
    
    // Display results
    if (results.length === 0) {
        upcomingList.innerHTML = '<div class="no-data-text">No auspicious days found in the next 15 days</div>';
        return;
    }
    
    upcomingList.innerHTML = results.map(item => `
        <div class="upcoming-item ${item.rating.rating.class}">
            <span class="upcoming-date">${formatShortDate(item.date)}</span>
            <span class="upcoming-details">
                ${item.panchanga.thithi} • ${item.panchanga.nakshatra} • ${item.panchanga.vasara}
            </span>
            <span class="upcoming-rating ${item.rating.rating.class}">
                ${item.rating.rating.name}
            </span>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPanchanga();
    await findUpcomingDays();
});

