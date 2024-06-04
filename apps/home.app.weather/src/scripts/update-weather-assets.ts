import fs from 'fs';
import weatherDescriptions from '../services/weather/descriptions';

const baseUrl = 'http://openweathermap.org/img/wn/';
const imageFolder = './public/assets/weather-icons'; // Replace with the path to your local folder

const downloadImages = async () => {
  // Create the folder if it doesn't exist
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder, { recursive: true });
  }

  try {
    for (const key in weatherDescriptions) {
      const weather = weatherDescriptions[key as keyof typeof weatherDescriptions];
      await downloadImage(weather.day.image);
      await downloadImage(weather.night.image);
    }

    console.log('Images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

const downloadImage = async (imageName: string) => {
  const response = await fetch(`${baseUrl}${imageName}`);
  const imageBuffer = await response.arrayBuffer();
  fs.writeFileSync(`${imageFolder}/${imageName}`, Buffer.from(imageBuffer));
};

downloadImages();
