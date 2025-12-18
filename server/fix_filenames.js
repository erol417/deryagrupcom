const fs = require('fs');
const path = require('path');

const APPS_FILE = path.join(__dirname, 'data', 'applications.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(APPS_FILE)) {
    console.log('Applications file not found.');
    process.exit(1);
}

const apps = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
let changed = false;

// List all files in directory to assist in matching
const allFiles = fs.readdirSync(UPLOADS_DIR);

apps.forEach(app => {
    if (!app.cvPath) return;

    const oldFilename = app.cvPath;
    // We want to keep the unique prefix (timestamp-random-) and sanitize the rest
    // Pattern: {prefix}-{originalName}
    // But prefix itself contains hyphens. 
    // Format: Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
    // Example: 1765997653953-618613428-OTO BRAVO...

    // Find the second hyphen to split prefix and original name
    const parts = oldFilename.split('-');
    if (parts.length < 3) return; // Unexpected format

    const prefix = parts[0] + '-' + parts[1];
    const originalName = parts.slice(2).join('-'); // Join back the rest in case original name had hyphens

    // Sanitize logic matches server/index.js
    const descriptors = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const newFilename = prefix + '-' + descriptors;

    // Skip if already correct
    if (oldFilename === newFilename) return;

    // Try to find the file on disk by prefix match
    // This ignores encoding differences in the suffix
    const foundFile = allFiles.find(f => f.startsWith(prefix));

    if (foundFile) {
        const oldPath = path.join(UPLOADS_DIR, foundFile);
        const newPath = path.join(UPLOADS_DIR, newFilename);

        // Only rename if the names are actually different
        if (foundFile !== newFilename) {
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Renamed (by prefix): \n  ${foundFile} \n  -> ${newFilename}`);
                app.cvPath = newFilename;
                changed = true;
            } catch (err) {
                console.error(`Error renaming ${foundFile}:`, err.message);
            }
        } else if (oldFilename !== newFilename) {
            // File is already sanitized on disk, but DB has old name
            console.log(`File already sanitized on disk, updating DB: ${newFilename}`);
            app.cvPath = newFilename;
            changed = true;
        }
    } else {
        console.warn(`File REALLY not found for prefix ${prefix} (DB: ${oldFilename})`);
    }
});

if (changed) {
    fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));
    console.log('Applications database updated.');
} else {
    console.log('No changes needed.');
}
