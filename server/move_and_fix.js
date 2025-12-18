const fs = require('fs');
const path = require('path');

const ROOT_UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const SERVER_UPLOADS_DIR = path.join(__dirname, 'uploads');
const APPS_FILE = path.join(__dirname, 'data', 'applications.json');

// Ensure server uploads dir exists
if (!fs.existsSync(SERVER_UPLOADS_DIR)) {
    fs.mkdirSync(SERVER_UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(APPS_FILE)) {
    console.log("No apps file");
    process.exit(1);
}

const apps = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
let dbChanged = false;

// 1. Scan ROOT uploads for stray files
if (fs.existsSync(ROOT_UPLOADS_DIR)) {
    const rootFiles = fs.readdirSync(ROOT_UPLOADS_DIR);

    rootFiles.forEach(file => {
        // Only interested in our PDF files (timestamp-prefixed)
        if (!file.match(/^\d{13}-\d+-/)) return;

        const srcPath = path.join(ROOT_UPLOADS_DIR, file);

        // Determine sanitized name
        const parts = file.split('-');
        if (parts.length < 3) return;
        const prefix = parts[0] + '-' + parts[1];
        const originalName = parts.slice(2).join('-');

        // Correct sanitize logic
        const sanitizedSuffix = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
        const newFilename = prefix + '-' + sanitizedSuffix;

        const destPath = path.join(SERVER_UPLOADS_DIR, newFilename);

        try {
            // Move and rename
            fs.renameSync(srcPath, destPath);
            console.log(`Moved & Fixed: \n  ${file} \n  -> ${newFilename} (in server/uploads)`);

            // Find which app owned this file
            // We match by prefix because the stored filename in DB might be the "bad" encoding version
            const app = apps.find(a => a.cvPath && a.cvPath.startsWith(prefix));
            if (app) {
                console.log(`  Updating DB for user: ${app.name}`);
                app.cvPath = newFilename;
                dbChanged = true;
            } else {
                console.warn(`  Warning: No app found for this file.`);
            }

        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    });
}

if (dbChanged) {
    fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));
    console.log("Database updated successfully.");
} else {
    console.log("Database already up to date or no matching files moved.");
}
