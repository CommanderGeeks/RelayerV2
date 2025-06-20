/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    // fs.copySync('./src/public', './dist/public');
} catch (err) {
    console.error(err as any);
}
