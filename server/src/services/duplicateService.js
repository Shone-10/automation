import Complaint from '../models/Complaint.js';

/**
 * Calculates Jaccard similarity between two strings
 */
const getWordSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  // Clean and tokenize words
  const clean = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  
  const words1 = clean(str1);
  const words2 = clean(str2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(w => set2.has(w)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Check for duplicate complaints in the same category and location
 */
export const checkDuplicate = async ({ category, location, title, description }) => {
  try {
    // Find active complaints (not Closed) in the same category and location
    const potentialDuplicates = await Complaint.find({
      category,
      location,
      status: { $ne: 'Closed' }
    });

    for (const comp of potentialDuplicates) {
      // Compare title
      const titleSim = getWordSimilarity(title, comp.title);
      // Compare description
      const descSim = getWordSimilarity(description, comp.description);
      
      // If either title similarity or description similarity is high (> 0.4)
      if (titleSim > 0.4 || descSim > 0.4) {
        return {
          isDuplicate: true,
          duplicateComplaint: {
            complaintId: comp.complaintId,
            title: comp.title,
            status: comp.status,
            priority: comp.priority,
            createdAt: comp.createdAt
          }
        };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Duplicate detection error:', error.message);
    return { isDuplicate: false }; // Fail silently to not block submission
  }
};
