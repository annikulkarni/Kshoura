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
        
        return { thithi, vasara, nakshatra };
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
    
    // Generate dates from today to end of year
    const today = new Date();
    const startDate = new Date(year, today.getMonth(), today.getDate()); // Start from today
    const endDate = new Date(year, 11, 31); // Dec 31
    
    // If year is past, scrape full year; if future, skip
    if (year < today.getFullYear()) {
        console.log(`Year ${year} is in the past. Scraping full year.`);
        startDate.setMonth(0);
        startDate.setDate(1);
    } else if (year > today.getFullYear()) {
        console.log(`Year ${year} is in the future. Starting from Jan 1.`);
        startDate.setMonth(0);
        startDate.setDate(1);
    } else {
        console.log(`Starting from today: ${formatDate(startDate)}`);
    }
    
    try {
        // Navigate to the page first
        console.log('Loading page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await wait(3000); // Wait for dynamic content
        
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
                
                // Wait for data to load
                await wait(2000);
                
                // Extract the data
                const rawData = await extractPanchanga(page);
                
                // Parse and normalize
                panchangaData[dateStr] = {
                    thithi: parseThithi(rawData.thithi),
                    nakshatra: parseNakshatra(rawData.nakshatra),
                    vasara: parseVasara(rawData.vasara)
                };
                
                console.log(`✓ ${panchangaData[dateStr].thithi}, ${panchangaData[dateStr].nakshatra}, ${panchangaData[dateStr].vasara}`);
                
                // Save progress every 30 days
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
    
    return panchangaData;
}

// Run for specified year or current year
const year = process.argv[2] ? parseInt(process.argv[2]) : new Date().getFullYear();
scrapeYear(year).then(() => {
    console.log('Scraping complete!');
}).catch(err => {
    console.error('Scraping failed:', err);
    process.exit(1);
});

