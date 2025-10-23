import type { AITool } from '@/types/ai-tools';

/**
 * Parses CSV file and returns array of AITool objects
 * Handles errors gracefully with proper validation
 */
export const parseAIToolsCSV = async (filepath: string): Promise<AITool[]> => {
  try {
    const response = await fetch(filepath);

    if (!response.ok) {
      throw new Error(`Failed to load tools: ${response.statusText}`);
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('CSV file is empty');
    }

    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('CSV file has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim());

    // Validate required columns exist
    const requiredColumns = ['id', 'name', 'description', 'logo', 'category', 'pricing', 'features', 'link'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const tools: AITool[] = [];

    // Parse each data row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (!line.trim()) continue;

      try {
        // Parse CSV line with proper handling of quoted fields
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];

          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim()); // Push the last value

        // Skip malformed rows
        if (values.length < 12) {
          console.warn(`Skipping malformed row ${i + 1}: insufficient columns`);
          continue;
        }

        // Parse pricing and validate
        const pricing = values[5].trim() as AITool['pricing'];
        const validPricing: AITool['pricing'][] = ['Free', 'Freemium', 'Student Discount', 'Paid'];

        if (!validPricing.includes(pricing)) {
          console.warn(`Invalid pricing "${pricing}" at row ${i + 1}, defaulting to "Paid"`);
        }

        const tool: AITool = {
          id: values[0].trim(),
          name: values[1].trim(),
          description: values[2].trim(),
          logo: values[3].trim(),
          category: values[4].split('|').map(s => s.trim()).filter(Boolean),
          pricing: validPricing.includes(pricing) ? pricing : 'Paid',
          features: values[6].split('|').map(f => f.trim()).filter(Boolean),
          link: values[7].trim(),
          isOpenSource: values[8]?.trim().toLowerCase() === 'true',
          isPopular: values[9]?.trim().toLowerCase() === 'true',
          isNew: values[10]?.trim().toLowerCase() === 'true',
          requiresVerification: values[11]?.trim().toLowerCase() === 'true'
        };

        // Validate essential fields
        if (!tool.id || !tool.name || !tool.link) {
          console.warn(`Skipping row ${i + 1}: missing essential data`);
          continue;
        }

        tools.push(tool);
      } catch (rowError) {
        console.warn(`Error parsing row ${i + 1}:`, rowError);
        continue; // Skip this row and continue with next
      }
    }

    if (tools.length === 0) {
      throw new Error('No valid tools found in CSV file');
    }

    console.log(`Successfully loaded ${tools.length} AI tools`);
    return tools;

  } catch (error) {
    console.error('Error loading AI tools:', error);
    throw error;
  }
};

/**
 * Extracts unique streams/categories from all tools
 */
export const extractUniqueStreams = (tools: AITool[]): string[] => {
  const streamsSet = new Set<string>();

  tools.forEach(tool => {
    tool.category.forEach(cat => {
      if (cat && cat !== 'All Tools') {
        streamsSet.add(cat);
      }
    });
  });

  return Array.from(streamsSet).sort();
};
