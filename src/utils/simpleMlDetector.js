// Simplified ML detector without heavy dependencies

class SimpleMlDetector {
  constructor() {
    this.confidenceThreshold = 0.7;
    this.userFeedback = new Map();
  }

  // Simple context-aware detection without external libraries
  detectWithContext(text) {
    const detections = [];

    // Context patterns that suggest PII
    const contextPatterns = {
      identity: [
        /(?:my name is|called|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
        /(?:mr\.?|mrs\.?|ms\.?|dr\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
        /(?:hello|hi)\s+([A-Z][a-z]+)/gi
      ],
      contact: [
        /(?:reach me at|contact me at|email me at)\s+([^\s,]+)/gi,
        /(?:call me at|phone me at|my number is)\s+([\d\-\.\(\)\s]+)/gi,
        /(?:my address is|i live at|located at)\s+([^,\n]+)/gi
      ],
      personal: [
        /(?:my birthday is|born on|date of birth)\s+([^\s,\n]+)/gi,
        /(?:my social is|ssn is|social security)\s*([\d\-]+)/gi,
        /(?:my card number|credit card)\s*([\d\s\-]+)/gi
      ]
    };

    // Check context patterns
    Object.entries(contextPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const captured = match[1];
          if (captured && captured.trim().length > 1) {
            detections.push({
              type: this.mapCategoryToType(category),
              text: captured.trim(),
              confidence: 0.9,
              method: 'context',
              context: this.extractContext(text, captured),
              category
            });
          }
        }
      });
    });

    return detections;
  }

  // Simple name detection based on capitalization patterns
  detectPossibleNames(text) {
    const detections = [];
    
    // Look for capitalized words that might be names
    const possibleNames = text.match(/\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g);
    
    if (possibleNames) {
      possibleNames.forEach(name => {
        // Skip common false positives
        if (!this.isCommonFalsePositive(name)) {
          detections.push({
            type: 'NAME',
            text: name,
            confidence: 0.75,
            method: 'pattern',
            context: this.extractContext(text, name)
          });
        }
      });
    }

    return detections;
  }

  // Detect numbers that might be sensitive
  detectSensitiveNumbers(text) {
    const detections = [];
    
    // Look for number patterns that might be IDs
    const patterns = [
      { regex: /\b[A-Z]{2}\d{6,}\b/g, type: 'ID_NUMBER', confidence: 0.8 },
      { regex: /\b\d{3,4}[-\s]?\d{3,4}[-\s]?\d{4,}\b/g, type: 'ID_NUMBER', confidence: 0.7 },
      { regex: /\b[A-Z]\d{8,}\b/g, type: 'ID_NUMBER', confidence: 0.75 }
    ];

    patterns.forEach(({ regex, type, confidence }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        detections.push({
          type,
          text: match[0],
          confidence,
          method: 'pattern',
          context: this.extractContext(text, match[0])
        });
      }
    });

    return detections;
  }

  // Main detection method
  detectComprehensive(text) {
    const allDetections = [];

    // Context-aware detection
    const contextDetections = this.detectWithContext(text);
    allDetections.push(...contextDetections);

    // Name detection
    const nameDetections = this.detectPossibleNames(text);
    allDetections.push(...nameDetections);

    // Sensitive number detection
    const numberDetections = this.detectSensitiveNumbers(text);
    allDetections.push(...numberDetections);

    // Filter by confidence and deduplicate
    return this.deduplicateDetections(allDetections)
      .filter(detection => detection.confidence >= this.confidenceThreshold);
  }

  // Helper methods
  extractContext(text, target) {
    const index = text.indexOf(target);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + target.length + 30);
    
    return text.substring(start, end);
  }

  mapCategoryToType(category) {
    const mapping = {
      identity: 'NAME',
      contact: 'CONTACT',
      personal: 'PERSONAL'
    };
    return mapping[category] || 'DETECTED';
  }

  isCommonFalsePositive(name) {
    const falsePositives = [
      'United States', 'New York', 'Los Angeles', 'San Francisco',
      'Microsoft Corporation', 'Apple Inc', 'Google LLC',
      'First Name', 'Last Name', 'Full Name'
    ];
    
    return falsePositives.some(fp => 
      name.toLowerCase().includes(fp.toLowerCase())
    );
  }

  deduplicateDetections(detections) {
    const unique = new Map();
    
    detections.forEach(detection => {
      const key = `${detection.text.toLowerCase()}-${detection.type}`;
      const existing = unique.get(key);
      
      if (!existing || detection.confidence > existing.confidence) {
        unique.set(key, detection);
      }
    });
    
    return Array.from(unique.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  // User feedback methods
  addFeedback(text, type, isCorrect) {
    const key = `${text.toLowerCase()}-${type}`;
    this.userFeedback.set(key, {
      text,
      type,
      isCorrect,
      timestamp: Date.now()
    });
  }

  applyUserFeedback(detections) {
    return detections.filter(detection => {
      const key = `${detection.text.toLowerCase()}-${detection.type}`;
      const feedback = this.userFeedback.get(key);
      
      if (feedback) {
        return feedback.isCorrect;
      }
      
      return true;
    });
  }
}

export const mlDetector = new SimpleMlDetector();