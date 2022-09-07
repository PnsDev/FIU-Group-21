import fs from 'fs';
import path from 'path';


export default (dir: string) : String[] => {
    const files: String[] = [];

    const iterateDir = (dir: string) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                iterateDir(filePath);
            } else {
                let tempPath = (filePath + '').replace(/\\/g, '/');
                tempPath = tempPath.replace('src/routes', '').replace('.ts', '');
                files.push(tempPath);
            }
        });
    };

    iterateDir(dir);

    return files;

}