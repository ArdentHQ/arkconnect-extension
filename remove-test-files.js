import fs from 'fs';
import path from 'path';

// Directories to scan
const dirsToScan = [
	'src/lib/helpers',
	'src/lib/intl',
	'src/lib/mainsail',
	'src/lib/markets',
	'src/lib/profiles',
];

// Recursive delete function
function deleteTestFiles(dir) {
    console.log(dir);
	if (!fs.existsSync(dir)) return;

	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			deleteTestFiles(fullPath); // recurse into subdirectory
		} else if (stats.isFile() && /\.test\.ts$/.test(file)) {
			fs.unlinkSync(fullPath);
			console.log(`Deleted: ${fullPath}`);
		}
	}
}

// Run for each directory
dirsToScan.forEach(deleteTestFiles);

console.log('Done removing test.ts files.');
