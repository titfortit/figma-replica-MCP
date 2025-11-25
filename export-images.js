import { readFile, writeFile } from 'fs/promises';

const FIGMA_API_KEY = process.env.FIGMA_API_KEY || 'figd_H90Or0x2roN1D1way7_nKP_vUFrkb92nnicdfD1i';
const FILE_KEY = 'XJETBSzefFXS8hLHAlKYy1';

// Node IDs for the components we need
const NODE_IDS = [
    '85:373', // SB/Record component
    '111:586', // Compass component (Property 1=1)
    '85:374'  // Weather component
];

async function exportImages() {
    try {
        console.log('🎨 Exporting images from Figma...\n');

        // Get image URLs from Figma
        const nodeIdsParam = NODE_IDS.join(',');
        const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIdsParam}&format=svg&scale=2`;

        console.log('📡 Fetching image URLs...');
        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': FIGMA_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Got image URLs:\n');
        console.log(JSON.stringify(data, null, 2));

        // Save the URLs
        await writeFile('figma-image-urls.json', JSON.stringify(data, null, 2));
        console.log('\n💾 Saved to figma-image-urls.json');

        // Download each SVG
        if (data.images) {
            console.log('\n📥 Downloading SVGs...\n');

            for (const [nodeId, imageUrl] of Object.entries(data.images)) {
                if (imageUrl) {
                    console.log(`  Downloading ${nodeId}...`);
                    const svgResponse = await fetch(imageUrl);
                    const svgContent = await svgResponse.text();

                    const filename = `public/${nodeId.replace(':', '-')}.svg`;
                    await writeFile(filename, svgContent);
                    console.log(`  ✅ Saved to ${filename}`);
                }
            }
        }

        console.log('\n🎉 Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

exportImages();
