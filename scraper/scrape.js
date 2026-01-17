/**
 * Panchanga Scraper for srsmatha.org
 * 
 * This script uses Puppeteer to scrape panchanga data for an entire year.
 * Run with: node scrape.js
 * 
 * Prerequisites:
 * npm install puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://srsmatha.org/srsbook/?page=app/app&appcontent=app_panchanga';

// Wait helper
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse thithi from text (e.g., "Truteeya Tithi" -> "Tritiya")
function parseThithi(text) {
    if (!text) return null;
    // Remove "Tithi" suffix and normalize
    const clean = text.replace(/\s*tithi\s*/i, '').trim().toLowerCase();
    
    const thithiMap = {
        'prathama': 'Prathama', 'pratipada': 'Prathama',
        'dwiteeya': 'Dvitiya', 'dvitiya': 'Dvitiya', 'dwitiya': 'Dvitiya',
        'truteeya': 'Tritiya', 'tritiya': 'Tritiya', 'triteeya': 'Tritiya',
        'chaturthi': 'Chaturthi', 'chathurthi': 'Chaturthi',
        'panchami': 'Panchami', 'panchmi': 'Panchami',
        'shashthi': 'Shashthi', 'shashti': 'Shashthi',
        'saptami': 'Saptami', 'sapthami': 'Saptami',
        'ashtami': 'Ashtami', 'ashtmi': 'Ashtami',
        'navami': 'Navami', 'navmi': 'Navami',
        'dashami': 'Dashami', 'dashmi': 'Dashami',
        'ekadashi': 'Ekadashi', 'ekadasi': 'Ekadashi',
        'dwadashi': 'Dwadashi', 'dvadashi': 'Dwadashi',
        'trayodashi': 'Trayodashi', 'trayodasi': 'Trayodashi',
        'chaturdashi': 'Chaturdashi', 'chaturdasi': 'Chaturdashi',
        'purnima': 'Purnima', 'poornima': 'Purnima',
        'amavasya': 'Amavasya', 'amavasi': 'Amavasya'
    };
    
    return thithiMap[clean] || clean.charAt(0).toUpperCase() + clean.slice(1);
}

// Parse vasara from text (e.g., "Maṅgalavāsaraḥ" -> "Mangalavara")
function parseVasara(text) {
    if (!text) return null;
    const clean = text.toLowerCase()
        .replace(/[āàáâ]/g, 'a')
        .replace(/[īìíî]/g, 'i')
        .replace(/[ūùúû]/g, 'u')
        .replace(/[ṅṇñ]/g, 'n')
        .replace(/[ṃṁ]/g, 'm')
        .replace(/ḥ/g, '')
        .replace(/vasarah?$/i, 'vara')
        .trim();
    
    const vasaraMap = {
        'ravivara': 'Ravivara', 'ravivasara': 'Ravivara',
        'somavara': 'Somavara', 'somavasara': 'Somavara',
        'mangalavara': 'Mangalavara', 'mangalavasara': 'Mangalavara',
        'budhavara': 'Budhavara', 'budhavasara': 'Budhavara',
        'guruvara': 'Guruvara', 'guruvasara': 'Guruvara',
        'shukravara': 'Shukravara', 'shukravasara': 'Shukravara',
        'shanivara': 'Shanivara', 'shanivasara': 'Shanivara'
    };
    
    return vasaraMap[clean] || clean.charAt(0).toUpperCase() + clean.slice(1);
}

// Parse nakshatra from text (e.g., "Shravana nakshatra" -> "Shravana")
function parseNakshatra(text) {
    if (!text) return null;
    const clean = text.replace(/\s*nakshatra\s*/i, '').trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

// Extract panchanga data from the page
async function extractPanchanga(page) {
    return await page.evaluate(() => {
        // Get thithi from .thithi class
        const thithiEl = document.querySelector('.thithi');
        const thithi = thithiEl ? thithiEl.textContent.trim() : null;
        
        // Get vasara and nakshatra from .dys class
        const dysEl = document.querySelector('.dys');
        let vasara = null;
        let nakshatra = null;
        
        if (dysEl) {
            const text = dysEl.innerHTML;
            const lines = text.split(/<br[^>]*>/i).map(l => l.trim()).filter(l => l);
            
            // First line is vasara
            if (lines[0]) vasara = lines[0];
            // Second line contains nakshatra
            if (lines[1]) nakshatra = lines[1];
        }
        
        // Extract Dharmashastra Details
        let dharmashastra = null;

        // Find the Dharmashastra Details section - look for h2 with "Dharmashastra Details"
        const headers = document.querySelectorAll('h2, .mtitle h2');
        for (const header of headers) {
            if (header.textContent.includes('Dharmashastra Details')) {
                // Get the parent container and find the text content after the header
                const parent = header.closest('.mtitle') || header.parentElement;
                if (parent) {
                    // Get all text content excluding the header
                    const allText = parent.textContent.replace('Dharmashastra Details', '').trim();
                    if (allText && allText.length > 0) {
                        dharmashastra = allText;
                    }
                }
                break;
            }
        }

        // Alternative: look for div.mtitle which typically contains the dharmashastra info
        if (!dharmashastra) {
            const mtitle = document.querySelector('.mtitle');
            if (mtitle) {
                const text = mtitle.textContent.replace('Dharmashastra Details', '').trim();
                if (text && text.length > 0) {
                    dharmashastra = text;
                }
            }
        }

        return { thithi, vasara, nakshatra, dharmashastra };
    });
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Main scraping function
async function scrapeYear(year) {
    console.log(`Starting scrape for year ${year}...`);
    
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const panchangaData = {};
    
    // Generate dates
    const today = new Date();
    let startDate;

    if (year < today.getFullYear()) {
        // Past year - full year
        startDate = new Date(year, 0, 1);
    } else if (year === today.getFullYear()) {
        // Current year - from today
        startDate = new Date(year, today.getMonth(), today.getDate());
    } else {
        // Future year - from Jan 1
        startDate = new Date(year, 0, 1);
    }
    
    const endDate = new Date(year, 11, 31); // Dec 31

    console.log(`Scraping from ${formatDate(startDate)} to ${formatDate(endDate)}`);

    try {
        // Navigate to the page first
        console.log('Loading page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await wait(3000); // Wait for dynamic content
        
        let consecutiveNulls = 0;
        const MAX_CONSECUTIVE_NULLS = 3; // Stop after 3 consecutive null entries

        // For each date in the year
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDate(d);
            process.stdout.write(`Scraping ${dateStr}... `);
            
            try {
                // Change the date using the date input
                await page.evaluate((date) => {
                    const dateInput = document.querySelector('input.mydate');
                    if (dateInput) {
                        dateInput.value = date;
                        // Trigger the onchange event
                        dateInput.dispatchEvent(new Event('change'));
                    }
                }, dateStr);
                
                // Wait for data to load (3.5 seconds for reliability)
                await wait(3500);
                
                // Extract the data
                const rawData = await extractPanchanga(page);
                
                // Check if we got valid data (null/empty or garbage like "Yoga" in nakshatra means end of panchanga year)
                const thithiEmpty = !rawData.thithi || rawData.thithi.trim() === '';
                const nakshatraInvalid = rawData.nakshatra && rawData.nakshatra.toLowerCase().includes('yoga');

                if (thithiEmpty || nakshatraInvalid) {
                    consecutiveNulls++;
                    console.log(`⚠ Invalid data detected (${consecutiveNulls}/${MAX_CONSECUTIVE_NULLS})`);

                    if (consecutiveNulls >= MAX_CONSECUTIVE_NULLS) {
                        console.log(`\n🛑 Detected end of panchanga year (Ugadi). Stopping scrape.`);
                        break;
                    }
                    continue;
                }

                // Reset counter on valid data
                consecutiveNulls = 0;

                // Parse and normalize
                const entry = {
                    thithi: parseThithi(rawData.thithi),
                    nakshatra: parseNakshatra(rawData.nakshatra),
                    vasara: parseVasara(rawData.vasara)
                };
                
                // Only add dharmashastra if it exists and is not empty
                if (rawData.dharmashastra && rawData.dharmashastra.trim().length > 0) {
                    entry.dharmashastra = rawData.dharmashastra.trim();
                }

                panchangaData[dateStr] = entry;

                const dharmaInfo = entry.dharmashastra ? ` | ${entry.dharmashastra.substring(0, 40)}...` : '';
                console.log(`✓ ${entry.thithi}, ${entry.nakshatra}, ${entry.vasara}${dharmaInfo}`);
                
                // Save progress every 15 days
                if (d.getDate() === 1 || d.getDate() === 15) {
                    const outputPath = `../panchanga-${year}.json`;
                    fs.writeFileSync(outputPath, JSON.stringify(panchangaData, null, 2));
                    console.log(`  [Progress saved]`);
                }
                
            } catch (err) {
                console.log(`✗ Error: ${err.message}`);
                panchangaData[dateStr] = { error: err.message };
            }
        }
        
    } finally {
        await browser.close();
    }
    
    // Save final output
    const outputPath = `../panchanga-${year}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(panchangaData, null, 2));
    console.log(`\nSaved to ${outputPath}`);
    console.log(`Total entries: ${Object.keys(panchangaData).length}`);
    
    return panchangaData;
}

// Get last date from existing JSON file
function getLastDateFromJson(year) {
    const filePath = `../panchanga-${year}.json`;
    try {
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const dates = Object.keys(data).sort();
            if (dates.length > 0) {
                return dates[dates.length - 1];
            }
        }
    } catch (e) {
        console.log(`Could not read existing file: ${e.message}`);
    }
    return null;
}

// Run for specified year or current year
// Usage: node scrape.js [year] [--continue]
const args = process.argv.slice(2);
const year = args.find(a => !a.startsWith('--')) ? parseInt(args.find(a => !a.startsWith('--'))) : new Date().getFullYear();
const shouldContinue = args.includes('--continue');

if (shouldContinue) {
    const lastDate = getLastDateFromJson(year);
    if (lastDate) {
        console.log(`Continuing from last scraped date: ${lastDate}`);
    }
}

scrapeYear(year).then(() => {
    console.log('Scraping complete!');
}).catch(err => {
    console.error('Scraping failed:', err);
    process.exit(1);
});
