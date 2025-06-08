import { patterns } from './patterns.js';
import { mlDetector } from './simpleMlDetector.js';

class DeidentificationEngine {
  constructor() {
    this.replacementMappings = new Map();
    this.counters = {};
    this.useMLDetection = true;
    this.confidenceThreshold = 0.7;
  }

  reset() {
    this.replacementMappings.clear();
    this.counters = {};
  }

  setMLEnabled(enabled) {
    this.useMLDetection = enabled;
  }

  setConfidenceThreshold(threshold) {
    this.confidenceThreshold = threshold;
  }

  generatePlaceholder(type, originalText, confidence = null) {
    if (!this.counters[type]) {
      this.counters[type] = 0;
    }
    this.counters[type]++;
    
    // Include confidence in placeholder if available
    const confidenceStr = confidence ? `_${Math.round(confidence * 100)}%` : '';
    return `[${type}_${this.counters[type]}${confidenceStr}]`;
  }

  processText(inputText) {
    let processedText = inputText;
    const detectedPII = [];
    const processedItems = new Set(); // Track what we've already processed

    // Phase 1: Traditional regex-based detection
    Object.entries(patterns).forEach(([patternName, patternConfig]) => {
      const regex = new RegExp(patternConfig.regex.source, patternConfig.regex.flags);
      
      processedText = processedText.replace(regex, (match, ...groups) => {
        // Skip if already processed
        if (processedItems.has(match)) {
          return match;
        }

        // Check if we've already seen this exact match
        const existingMapping = Array.from(this.replacementMappings.entries())
          .find(([original]) => original === match);
        
        if (existingMapping) {
          return existingMapping[1];
        }

        // Generate new placeholder
        const placeholder = this.generatePlaceholder(patternConfig.label, match, 0.95);
        this.replacementMappings.set(match, placeholder);
        processedItems.add(match);
        
        detectedPII.push({
          type: patternConfig.label,
          original: match,
          replacement: placeholder,
          pattern: patternName,
          confidence: 0.95,
          method: 'regex'
        });

        return placeholder;
      });
    });

    // Phase 2: ML-based detection for items that slipped through
    if (this.useMLDetection) {
      const mlDetections = mlDetector.detectComprehensive(inputText);
      const filteredDetections = mlDetector.applyUserFeedback(mlDetections);

      filteredDetections.forEach(detection => {
        // Skip if already processed by regex or confidence too low
        if (processedItems.has(detection.text) || 
            detection.confidence < this.confidenceThreshold) {
          return;
        }

        // Check if we've already seen this exact match
        const existingMapping = Array.from(this.replacementMappings.entries())
          .find(([original]) => original === detection.text);
        
        if (existingMapping) {
          return;
        }

        // Replace in processed text
        const escapedText = detection.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedText}\\b`, 'gi');
        
        if (processedText.match(regex)) {
          const placeholder = this.generatePlaceholder(detection.type, detection.text, detection.confidence);
          this.replacementMappings.set(detection.text, placeholder);
          processedItems.add(detection.text);
          
          processedText = processedText.replace(regex, placeholder);
          
          detectedPII.push({
            type: detection.type,
            original: detection.text,
            replacement: placeholder,
            confidence: detection.confidence,
            method: detection.method,
            context: detection.context,
            category: detection.category
          });
        }
      });
    }

    return {
      processedText,
      detectedPII: detectedPII.sort((a, b) => b.confidence - a.confidence),
      mappings: Object.fromEntries(this.replacementMappings),
      mlDetectionsCount: detectedPII.filter(d => d.method !== 'regex').length,
      totalDetections: detectedPII.length
    };
  }

  reverseText(deidentifiedText) {
    let restoredText = deidentifiedText;
    
    this.replacementMappings.forEach((placeholder, original) => {
      restoredText = restoredText.replaceAll(placeholder, original);
    });

    return restoredText;
  }

  getMappings() {
    return Object.fromEntries(this.replacementMappings);
  }

  highlightPII(inputText) {
    let highlightedText = inputText;
    const highlights = [];

    Object.entries(patterns).forEach(([patternName, patternConfig]) => {
      const regex = new RegExp(patternConfig.regex.source, patternConfig.regex.flags);
      let match;
      
      while ((match = regex.exec(inputText)) !== null) {
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          type: patternConfig.label,
          text: match[0]
        });
      }
    });

    return highlights.sort((a, b) => a.start - b.start);
  }
}

export const deidentifier = new DeidentificationEngine();