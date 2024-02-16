import 'dotenv/config';
import { getTopArtists } from "./last.fm.js";
import fs from 'fs/promises';
import Fuse from 'fuse.js';
import chalk from 'chalk';
import getFolderSize from 'get-folder-size';

const username = process.env.LAST_FM_USERNAME;
const api_key = process.env.LAST_FM_API_KEY;
const period = process.env.LAST_FM_DATA_PERIOD || "overall";
const limit = 50;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function work(page, fuse) {
    console.log(chalk.gray(`Getting top artists from Last.fm, page ${page}`));
    const topArtists = await getTopArtists(username, period, limit, page, api_key);
    
    for (const artist of topArtists.artist) {
        // Stop copying if the destination directory is too big
        if (process.env.COPY_UNTIL_GB) {
            const sizeInGB = Math.round(await getFolderSize.loose(process.env.DESTINATION_DIR) / 1024 / 1024 / 1024);
            
            if (sizeInGB > parseInt(process.env.COPY_UNTIL_GB)) {
                console.log(chalk.bgCyan(`Destination directory is ${sizeInGB}GB, stopping copy.`));
                return false;
            }
        }

        // Log the artist we're processing, then fuzzy search for the directory to copy
        // Fuzzy search is used because Last.fm might return a slightly different name than the directory name, due to special characters, user error, etc.
        console.log(chalk.bgGray(`Got artist: ${artist.name} - ${artist.playcount} plays`));
        const result = fuse.search(artist.name)[0];

        // If we can't find a match, log it and continue to the next artist
        if (!result) {
            console.log(chalk.bgRed(`No match for ${artist.name}`));
            continue; // Skips to the next artist
        } else {
            console.log(chalk.green(`Matched to directory: ${result.item}`));
        }

        // Copy the directory to the destination
        const artistDir = `${process.env.MUSIC_DIR}/${result.item}`;
        try {
            await fs.cp(artistDir, `${process.env.DESTINATION_DIR}/${result.item}`, { recursive: true });
        } catch (e) {
            console.log(chalk.bgRed(`Couldn't process ${artist.name}: ${e.message}`));
        }
    }

    // Return the top artists so we can check if we should continue
    return topArtists;
}

(async () => {
    // Get all the directories in the music directory
    console.log(chalk.gray(`Getting available directories for ${process.env.MUSIC_DIR}`));
    const directories = await fs.readdir(process.env.MUSIC_DIR);

    // Create a fuse instance to search for the artist directories later
    const fuse = new Fuse(directories, {
        threshold: 0.3
    });

    // Start processing the top artists recursively
    let page = 1;
    let totalArtists = 0;
    let topArtists;
    do {
        // work() returns false if we should stop and data from Last.fm if we should keep going
        topArtists = await work(page, fuse);
        // If we're not getting any more artists, stop
        if (!topArtists) break;
        // Otherwise, continue
        totalArtists += topArtists.artist.length;
        page++;
        console.log(chalk.bgCyan(`Processed ${totalArtists} artists so far, there are ${topArtists['@attr']['total']} artists in your Last.fm history.`));

        // Wait 5 seconds before the next request to avoid rate limiting
        await sleep(5000);

    // Stop if we've copied the maximum number of artists or if we've copied all the artists in the user's history
    } while (totalArtists < (parseInt(process.env.MAX_ARTISTS_TO_COPY) || topArtists['@attr']['total']));

})();