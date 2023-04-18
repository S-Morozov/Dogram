'use strict';
const sharp = require('sharp');
const ExifImage = require('exif').ExifImage;

const getCoordinates = (imgFile) => {
    // imgFile = full path to uploaded image
    return new Promise((resolve, reject) => {
        try {
            // TODO: Use node-exif to get longitude and latitude from imgFile
            // coordinates below should be an array of GPS coordinates in decimal format: [longitude, latitude]
            new ExifImage({ image: imgFile }, function (error, exifData) {
                if (error) {
                    reject(error);
                } else {
                    const coordinates = [
                        gpsToDecimal(exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef),
                        gpsToDecimal(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef)
                    ];
                    resolve(coordinates);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// convert GPS coordinates to decimal format
// for longitude, send exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef
// for latitude, send exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef
const gpsToDecimal = (gpsData, hem) => {
    let d =
        parseFloat(gpsData[0]) +
        parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return hem === 'S' || hem === 'W' ? (d *= -1) : d;
};
const makeThumbnail = async (file, thumbname) => {
    // file = full path to image (req.file.path)
    // thumbname = filename (req.file.filename)
    // TODO: use sharp to create a png thumbnail of 160x160px
    // use async await
    await sharp(file).resize(160).png().toFile('thumbnails/' + thumbname);
};

module.exports = {
    makeThumbnail, getCoordinates
};