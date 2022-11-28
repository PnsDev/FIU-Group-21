import fs from 'fs';
import path from 'path';

/**
 * Returns the path to nested files inside the folder
 * @param dir The directory to check
 * @param files The array of files to add to
 * @returns The array of files
 */
export function iterateDir(dir: string, files: string[] = []): string[] {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) iterateDir(filePath, files);
        else files.push(filePath);
    });
    return files;
};

/**
 * Creates a JSON string both the succesful and message parameters
 * @param successful Whether the operation was successful or not
 * @param message The message to send
 * @returns The JSON string
 */
export function apiResponse(successful: boolean, message: string): string {
    return JSON.stringify({
        successful: successful,
        message: message
    });
}