import fs from 'fs';
import path from 'path';

function iterateDir(files: String[], dir: string): String[] {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) iterateDir(files, filePath);
        else files.push(filePath + '');
    });
    return files;
};

export default function (dir: string): String[] {
    return iterateDir([], dir);
}