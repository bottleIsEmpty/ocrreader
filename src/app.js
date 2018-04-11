const models = require('./models');
const log4js = require('log4js');
const config = require('./config/config');
const util = require('util');
const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');
const jimp = require('jimp');

log4js.configure(config.logger);

const logger = log4js.getLogger();
//const syncSequelize = util.promisify(sequelize.sync);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const cmdGet = util.promisify(cmd.get);

async function getImages() {
    try {
        let files = await readDir(config.directories.images);
        files = files.filter(value => path.extname(value) === '.bmp');

        files = files.map(file => file = `${config.directories.images}/${file}`);

        logger.debug(files);

        return files;
    } catch (error) {
        throw(error);
    }
}

async function readText(imagePath) {
    try {
        const smallImages = await divideImage(imagePath);

        const song = await cmdGet(
            `Capture2Text_CLI.exe -i "${smallImages[0]}" -l "Chinese - Simplified"`
        );

        const singer = await cmdGet(
            `Capture2Text_CLI.exe -i "${smallImages[1]}" -l "Chinese - Simplified"`
        );
        
        logger.debug(song, singer);

    } catch (error) {
        throw(error);
    }
}

async function divideImage(imagePath) {
    async function cropAndWrite(img, crp, path) {
        img = await jimp.read(img);
        img = await img.crop(crp[0], crp[1], crp[2], crp[3]);
        await img.write(path);

        return true;
    }

    try {
        const img = await readFile(imagePath);

        let imgName = path.basename(imagePath);
        let result = [];

        imgName = imgName.slice(0, imgName.length - 4);

        const img1Path = `${config.directories.images}/${imgName}_temp1.bmp`;
        const img2Path = `${config.directories.images}/${imgName}_temp2.bmp`;

        logger.debug(img1Path);
            
        await cropAndWrite(img, [1, 1 , 199, 22], img1Path);
        await cropAndWrite(img, [1, 23, 199, 39], img2Path);

        result.push(img1Path);
        result.push(img2Path);

        return result;
        
    } catch (error) {
        throw(error);
    }  
}

// main
(async () => {
    await models.sequelize.sync();

    // const images = await getImages();

    // images.forEach(image => {
    //     readText(image);
    // });

    //logger.info('HEY');
})()

