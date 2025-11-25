import { readFile, writeFile } from 'fs/promises';
import yaml from 'js-yaml';

async function extractFrameData() {
    try {
        const data = await readFile('design.json', 'utf-8');
        const designData = JSON.parse(data);

        if (designData.content && designData.content[0] && designData.content[0].text) {
            const yamlText = designData.content[0].text;
            const parsedData = yaml.load(yamlText);

            // Save parsed data for easier inspection
            await writeFile('parsed-design.json', JSON.stringify(parsedData, null, 2));
            console.log('✅ Parsed design data saved to parsed-design.json');

            // Find the Test Browser component (90:539)
            const testBrowserNode = findNodeById(parsedData.nodes, '90:539');
            if (testBrowserNode) {
                console.log('\n📦 Found Test Browser component:');
                console.log(JSON.stringify(testBrowserNode, null, 2));
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

function findNodeById(nodes, targetId) {
    if (!nodes || !Array.isArray(nodes)) return null;

    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children) {
            const found = findNodeById(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
}

extractFrameData();
