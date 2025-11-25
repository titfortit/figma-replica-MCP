import { readFile } from 'fs/promises';

async function parseDesignData() {
    try {
        const data = await readFile('design.json', 'utf-8');
        const designData = JSON.parse(data);

        console.log('Design Data Structure:');
        console.log('Keys:', Object.keys(designData));

        if (designData.content && designData.content[0]) {
            const content = designData.content[0];
            console.log('\nContent type:', content.type);

            if (content.text) {
                // Parse the YAML-like text content
                const lines = content.text.split('\n').slice(0, 100);
                console.log('\nFirst 100 lines of content:');
                lines.forEach((line, i) => console.log(`${i}: ${line}`));
            }
        }

    } catch (error) {
        console.error('Error parsing design data:', error.message);
    }
}

parseDesignData();
