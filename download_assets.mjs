import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  'logos.png',
  'logos.png.webp',
  'ATV-KALIURANG-1.jpeg',
  'ATV-KALIURANG-2.jpeg',
  'ATV-KALIURANG-3.jpeg',
  'ATV-KALIURANG-5.jpeg',
  'ATV-KALIURANG-6.jpeg',
  'atv-kaliurang-merapi-1.jpeg',
  'atv-kaliurang-merapi-2.jpeg',
  'atv-kaliurang-merapi-3.jpeg',
  'atv-kaliurang-merapi-4.jpeg',
  'atv-kaliurang-merapi-5.jpeg',
  'atv-kaliurang-merapi-6.jpeg',
  'atv-kaliurang-merapi-7.jpeg',
  'atv-kaliurang-merapi-9.jpeg',
  'atv-kaliurang-merapi-10.jpeg',
  'atv-kaliurang-merapi-11.jpeg',
  'atv-kaliurang-merapi-12.jpeg',
  'Triangle-design-element.png',
  'Rectangle-design-our-portfolio.png',
  'Web-designing-service-icon.png',
  'Web-developement-services-icon.png',
  'UI-UX-design-services-icon.png'
];

const destDir = path.resolve('public/images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function download(file) {
  const urls = [
    `https://ojeatvkaliurang.com/wp-content/uploads/2023/08/${file}`,
    `https://0ce726a8.delivery.rocketcdn.me/wp-content/uploads/2023/08/${file}`,
    `https://0ce726a8.delivery.rocketcdn.me/wp-content/uploads/2023/08/${file}.webp`
  ];

  for (const url of urls) {
    try {
      const success = await new Promise((resolve) => {
        const req = https.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://ojeatvkaliurang.com/'
          }
        }, (res) => {
          if (res.statusCode === 200) {
            const filePath = path.join(destDir, file);
            const stream = fs.createWriteStream(filePath);
            res.pipe(stream);
            stream.on('finish', () => {
              stream.close();
              resolve(true);
            });
          } else {
            resolve(false);
          }
        });
        req.on('error', () => resolve(false));
        req.setTimeout(8000, () => {
          req.destroy();
          resolve(false);
        });
      });

      if (success) {
        console.log(`✓ Downloaded: ${file}`);
        return;
      }
    } catch (e) {
      // continue next url
    }
  }
  console.log(`✗ Failed to download: ${file}`);
}

async function main() {
  console.log('Downloading assets to public/images...');
  for (const img of images) {
    await download(img);
  }
  console.log('Done!');
}

main();
