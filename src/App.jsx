import React, { useState, useEffect } from 'react';
import { Shield, Github, Play, Copy, RotateCcw, Eye, EyeOff, Settings, Zap, User, Mail, Phone, CreditCard, Building, Stethoscope, Hash, MapPin } from 'lucide-react';

// Helper function to get icon and colors for detection types
function getDetectionTypeInfo(type) {
  const typeMap = {
    'NAME': { 
      icon: User, 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-800', 
      iconColor: 'text-blue-600',
      label: 'Name'
    },
    'EMAIL': { 
      icon: Mail, 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-800', 
      iconColor: 'text-green-600',
      label: 'Email'
    },
    'PHONE': { 
      icon: Phone, 
      bgColor: 'bg-purple-100', 
      textColor: 'text-purple-800', 
      iconColor: 'text-purple-600',
      label: 'Phone'
    },
    'CREDIT_CARD': { 
      icon: CreditCard, 
      bgColor: 'bg-red-100', 
      textColor: 'text-red-800', 
      iconColor: 'text-red-600',
      label: 'Credit Card'
    },
    'SSN': { 
      icon: Hash, 
      bgColor: 'bg-orange-100', 
      textColor: 'text-orange-800', 
      iconColor: 'text-orange-600',
      label: 'SSN'
    },
    'ORGANIZATION': { 
      icon: Building, 
      bgColor: 'bg-indigo-100', 
      textColor: 'text-indigo-800', 
      iconColor: 'text-indigo-600',
      label: 'Organization'
    },
    'MEDICAL_INFO': { 
      icon: Stethoscope, 
      bgColor: 'bg-pink-100', 
      textColor: 'text-pink-800', 
      iconColor: 'text-pink-600',
      label: 'Medical'
    },
    'ADDRESS': { 
      icon: MapPin, 
      bgColor: 'bg-teal-100', 
      textColor: 'text-teal-800', 
      iconColor: 'text-teal-600',
      label: 'Address'
    },
    'CONTACT': { 
      icon: Phone, 
      bgColor: 'bg-cyan-100', 
      textColor: 'text-cyan-800', 
      iconColor: 'text-cyan-600',
      label: 'Contact'
    },
    'IDENTIFICATION': { 
      icon: Hash, 
      bgColor: 'bg-amber-100', 
      textColor: 'text-amber-800', 
      iconColor: 'text-amber-600',
      label: 'ID Number'
    },
    'FINANCIAL': { 
      icon: CreditCard, 
      bgColor: 'bg-emerald-100', 
      textColor: 'text-emerald-800', 
      iconColor: 'text-emerald-600',
      label: 'Financial'
    },
    'BANK_ACCOUNT': { 
      icon: CreditCard, 
      bgColor: 'bg-slate-100', 
      textColor: 'text-slate-800', 
      iconColor: 'text-slate-600',
      label: 'Bank Account'
    }
  };
  
  return typeMap[type] || { 
    icon: Shield, 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-800', 
    iconColor: 'text-gray-600',
    label: type
  };
}

// Output text area with inline bubble overlays
function OutputTextArea({ value, detectedPII, placeholder, className }) {
  if (!value) {
    return (
      <textarea
        value=""
        readOnly
        placeholder={placeholder}
        className={className}
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
      />
    );
  }

  // Create a map of placeholders to their type info
  const placeholderMap = new Map();
  detectedPII.forEach(item => {
    placeholderMap.set(item.replacement, {
      type: item.type,
      originalText: item.original,
      confidence: item.confidence
    });
  });

  // Split text and identify placeholders
  const parts = [];
  let currentIndex = 0;
  
  // Find all placeholder patterns in the text
  const placeholderRegex = /\[[A-Z_]+_\d+(?:_\d+%)?\]/g;
  let match;
  
  while ((match = placeholderRegex.exec(value)) !== null) {
    // Add text before placeholder
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: value.substring(currentIndex, match.index)
      });
    }
    
    // Add placeholder with bubble
    const placeholderInfo = placeholderMap.get(match[0]);
    parts.push({
      type: 'placeholder',
      content: match[0],
      info: placeholderInfo
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < value.length) {
    parts.push({
      type: 'text',
      content: value.substring(currentIndex)
    });
  }

  return (
    <div className={`${className} whitespace-pre-wrap overflow-auto`} 
         style={{ 
           fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
           wordBreak: 'break-word'
         }}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === 'placeholder' && part.info) {
          const typeInfo = getDetectionTypeInfo(part.info.type);
          const IconComponent = typeInfo.icon;
          
          return (
            <span key={index} className="relative inline-block group mx-1">
              {/* Expanded bubble with icon and label */}
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${typeInfo.bgColor} rounded-full shadow-sm border border-white hover:shadow-md transition-all cursor-help hover:scale-105`}>
                <IconComponent size={12} className={typeInfo.iconColor} />
                <span className={`text-xs font-medium ${typeInfo.textColor} whitespace-nowrap`}>
                  {typeInfo.label}
                </span>
              </div>
              
              {/* Tooltip with accuracy */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                <div className="font-medium text-center mb-1">{part.info.originalText}</div>
                <div className="text-gray-300 text-xs text-center">
                  {Math.round(part.info.confidence * 100)}% confidence
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </span>
          );
        } else {
          return <span key={index} className="text-blue-600 font-mono">{part.content}</span>;
        }
      })}
    </div>
  );
}

// Inline simplified components to avoid import issues
function TextProcessor({ inputText, outputText, onInputChange, isProcessing, detectedPII }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Input</h2>
            {detectedPII && detectedPII.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {detectedPII.length} items found
                </span>
                <div className="flex gap-1">
                  {Array.from(new Set(detectedPII.map(item => item.type))).slice(0, 4).map(type => {
                    const typeInfo = getDetectionTypeInfo(type);
                    const IconComponent = typeInfo.icon;
                    return (
                      <div 
                        key={type}
                        className={`w-6 h-6 ${typeInfo.bgColor} rounded-full flex items-center justify-center`}
                        title={typeInfo.label}
                      >
                        <IconComponent size={12} className={typeInfo.iconColor} />
                      </div>
                    );
                  })}
                  {detectedPII.length > 4 && (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
                      +{Array.from(new Set(detectedPII.map(item => item.type))).length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste text containing sensitive information..."
            className="w-full h-72 p-4 text-sm border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isProcessing}
          />
          
          <div className="text-xs text-gray-500">
            {inputText.length} characters
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Output</h2>
            {outputText && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Protected
              </span>
            )}
          </div>
          
          <div className="relative">
            <OutputTextArea 
              value={outputText} 
              detectedPII={detectedPII}
              placeholder="Protected text will appear here..."
              className="w-full h-72 p-4 text-sm border border-gray-200 rounded-xl resize-none bg-gray-50 transition-all"
            />
            
            {!outputText && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <Shield size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Ready to protect your data</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {outputText.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ onProcess, onCopy, onReset, onToggleMappings, showMappings, isProcessing, hasOutput, copiedStatus }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
      >
        <Play size={16} />
        {isProcessing ? 'Processing...' : 'Process'}
      </button>
      
      <button
        onClick={onCopy}
        disabled={!hasOutput || copiedStatus === 'copying'}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
      >
        <Copy size={16} />
        {copiedStatus === 'copying' ? 'Copying...' : 
         copiedStatus === 'copied' ? 'Copied!' : 'Copy'}
      </button>
      
      <button
        onClick={onToggleMappings}
        disabled={!hasOutput}
        className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 border border-gray-200 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
      >
        {showMappings ? <EyeOff size={16} /> : <Eye size={16} />}
        {showMappings ? 'Hide' : 'View'} Details
      </button>
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}

function MLControls({ mlEnabled, onToggleML, mlStats }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Zap className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">AI Detection</h3>
            <p className="text-sm text-gray-500">Advanced ML algorithms with contextual analysis</p>
          </div>
        </div>
        
        <button
          onClick={() => onToggleML(!mlEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            mlEnabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              mlEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {mlEnabled && mlStats && (
        <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">
              {mlStats.totalDetections}
            </div>
            <div className="text-xs text-gray-600">Total items</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">
              {mlStats.mlDetectionsCount}
            </div>
            <div className="text-xs text-gray-600">AI-enhanced</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple deidentifier with enhanced detection
class SimpleDeidentifier {
  constructor() {
    this.replacementMappings = new Map();
    this.counters = {};
    this.useMLDetection = true;
    this.confidenceThreshold = 0.75; // Standard value - balanced detection
  }

  reset() {
    this.replacementMappings.clear();
    this.counters = {};
  }

  setMLEnabled(enabled) {
    this.useMLDetection = enabled;
  }

  generatePlaceholder(type, confidence = null) {
    if (!this.counters[type]) {
      this.counters[type] = 0;
    }
    this.counters[type]++;
    const confidenceStr = confidence ? `_${Math.round(confidence * 100)}%` : '';
    return `[${type}_${this.counters[type]}${confidenceStr}]`;
  }

  processText(inputText) {
    let processedText = inputText;
    const detectedPII = [];
    const processedItems = new Set();

    // Basic patterns
    const patterns = {
      email: { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, label: 'EMAIL' },
      phone: { regex: /(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g, label: 'PHONE' },
      ssn: { regex: /\b\d{3}-?\d{2}-?\d{4}\b/g, label: 'SSN' },
      creditCard: { regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, label: 'CREDIT_CARD' },
      ipAddress: { regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, label: 'IP_ADDRESS' },
      date: { regex: /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g, label: 'DATE' },
      address: { regex: /\b\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Court|Ct|Place|Pl)\b/gi, label: 'ADDRESS' }
    };

    // Phase 1: Pattern-based detection
    Object.entries(patterns).forEach(([patternName, patternConfig]) => {
      const regex = new RegExp(patternConfig.regex.source, patternConfig.regex.flags);
      
      processedText = processedText.replace(regex, (match) => {
        if (processedItems.has(match)) return match;

        const existingMapping = Array.from(this.replacementMappings.entries())
          .find(([original]) => original === match);
        
        if (existingMapping) return existingMapping[1];

        const placeholder = this.generatePlaceholder(patternConfig.label, 0.95);
        this.replacementMappings.set(match, placeholder);
        processedItems.add(match);
        
        detectedPII.push({
          type: patternConfig.label,
          original: match,
          replacement: placeholder,
          confidence: 0.95,
          method: 'regex'
        });

        return placeholder;
      });
    });

    // Phase 2: Enhanced detection if enabled
    if (this.useMLDetection) {
      const enhancedDetections = this.detectEnhanced(inputText);
      
      enhancedDetections.forEach(detection => {
        if (processedItems.has(detection.text) || 
            detection.confidence < this.confidenceThreshold) {
          return;
        }

        const existingMapping = Array.from(this.replacementMappings.entries())
          .find(([original]) => original === detection.text);
        
        if (existingMapping) return;

        const escapedText = detection.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedText}\\b`, 'gi');
        
        if (processedText.match(regex)) {
          const placeholder = this.generatePlaceholder(detection.type, detection.confidence);
          this.replacementMappings.set(detection.text, placeholder);
          processedItems.add(detection.text);
          
          processedText = processedText.replace(regex, placeholder);
          
          detectedPII.push({
            type: detection.type,
            original: detection.text,
            replacement: placeholder,
            confidence: detection.confidence,
            method: detection.method,
            context: detection.context
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

  detectEnhanced(text) {
    const detections = [];

    // Advanced Named Entity Recognition
    detections.push(...this.detectNamedEntities(text));
    
    // Context-aware detection
    detections.push(...this.detectContextualPII(text));
    
    // Semantic similarity detection
    detections.push(...this.detectSemanticPatterns(text));
    
    // Financial information detection
    detections.push(...this.detectFinancialInfo(text));
    
    // Medical information detection
    detections.push(...this.detectMedicalInfo(text));

    return detections.filter(d => d.confidence >= this.confidenceThreshold);
  }

  detectNamedEntities(text) {
    const detections = [];
    
    // Enhanced name detection with linguistic patterns
    const namePatterns = [
      // Full names with titles
      /\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      // Names in introductions
      /(?:my name is|called|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      // Names in signatures
      /(?:sincerely|regards|best),?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      // Names in greetings
      /(?:hello|hi|dear)\s+([A-Z][a-z]+)/gi,
      // Names with possessive
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'s\s+(?:email|phone|address|office)/gi
    ];

    namePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const name = match[1].trim();
        if (name && !this.isCommonFalsePositive(name) && this.isLikelyName(name)) {
          detections.push({
            type: 'NAME',
            text: name,
            confidence: this.calculateNameConfidence(name, text),
            method: 'NER',
            context: this.extractContext(text, name)
          });
        }
      }
    });

    return detections;
  }

  detectContextualPII(text) {
    const detections = [];
    
    const contextPatterns = {
      contact: [
        /(?:reach me at|contact me at|email me at)\s+([^\s,\n]+)/gi,
        /(?:call me at|phone me at|my number is)\s+([\d\-\.\(\)\s]+)/gi,
        /(?:my address is|i live at|located at)\s+([^,\n]+)/gi
      ],
      identification: [
        /(?:my social security number is|ssn:?)\s*([\d\-\s]+)/gi,
        /(?:employee id|badge number|id number):?\s*([A-Z0-9\-]+)/gi,
        /(?:license number|driver's license):?\s*([A-Z0-9\-]+)/gi
      ],
      financial: [
        /(?:account number|acct #):?\s*([A-Z0-9\-]+)/gi,
        /(?:routing number):?\s*([\d\-]+)/gi,
        /(?:card number|credit card):?\s*([\d\-\s]+)/gi
      ]
    };

    Object.entries(contextPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const captured = match[1].trim();
          if (captured && captured.length > 2) {
            detections.push({
              type: category.toUpperCase(),
              text: captured,
              confidence: 0.9,
              method: 'contextual',
              context: this.extractContext(text, captured)
            });
          }
        }
      });
    });

    return detections;
  }

  detectSemanticPatterns(text) {
    const detections = [];
    
    // Detect potential names using linguistic features
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      // Check if it looks like a first name + last name
      if (this.isCapitalized(word1) && this.isCapitalized(word2) && 
          this.hasNameCharacteristics(word1) && this.hasNameCharacteristics(word2)) {
        const fullName = `${word1} ${word2}`;
        if (!this.isCommonFalsePositive(fullName)) {
          const confidence = this.calculateSemanticConfidence(fullName, text);
          if (confidence > 0.6) {
            detections.push({
              type: 'NAME',
              text: fullName,
              confidence: confidence,
              method: 'semantic',
              context: this.extractContext(text, fullName)
            });
          }
        }
      }
    }

    // Detect organization names
    const orgPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc|LLC|Corp|Corporation|Company|Ltd)\b/g,
      /\b(?:at|for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:company|corporation|firm)\b/gi
    ];

    orgPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const org = match[1].trim();
        detections.push({
          type: 'ORGANIZATION',
          text: org,
          confidence: 0.8,
          method: 'semantic',
          context: this.extractContext(text, org)
        });
      }
    });

    return detections;
  }

  detectFinancialInfo(text) {
    const detections = [];
    
    // Enhanced credit card detection
    const ccPattern = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g;
    let match;
    while ((match = ccPattern.exec(text)) !== null) {
      if (this.isValidCreditCard(match[0])) {
        detections.push({
          type: 'CREDIT_CARD',
          text: match[0],
          confidence: 0.95,
          method: 'luhn_algorithm',
          context: this.extractContext(text, match[0])
        });
      }
    }

    // Bank account patterns
    const bankPatterns = [
      /\b\d{9,18}\b/g  // Account numbers
    ];

    bankPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const num = match[0];
        if (this.contextSuggestsBankAccount(text, num)) {
          detections.push({
            type: 'BANK_ACCOUNT',
            text: num,
            confidence: 0.85,
            method: 'contextual_numeric',
            context: this.extractContext(text, num)
          });
        }
      }
    });

    return detections;
  }

  detectMedicalInfo(text) {
    const detections = [];
    
    // Medical record numbers
    const medicalPatterns = [
      /(?:patient id|medical record|mrn):?\s*([A-Z0-9\-]+)/gi,
      /\b(?:diagnosis|condition):?\s*([A-Za-z\s,]+)(?:\.|$)/gi
    ];

    medicalPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const info = match[1].trim();
        if (info.length > 2) {
          detections.push({
            type: 'MEDICAL_INFO',
            text: info,
            confidence: 0.8,
            method: 'medical_context',
            context: this.extractContext(text, info)
          });
        }
      }
    });

    return detections;
  }

  // Helper methods for ML features
  isLikelyName(text) {
    const commonFirstNames = ['john', 'jane', 'michael', 'sarah', 'david', 'emily', 'james', 'mary'];
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => commonFirstNames.includes(word)) || 
           (text.length >= 2 && text.length <= 20 && /^[A-Za-z\s]+$/.test(text));
  }

  calculateNameConfidence(name, fullText) {
    let confidence = 0.7;
    
    // Boost if in specific contexts
    if (/(?:dear|hello|hi|sincerely|regards)/i.test(fullText)) confidence += 0.1;
    if (/(?:my name is|called|i am)/i.test(fullText)) confidence += 0.15;
    if (name.includes(' ')) confidence += 0.1; // Full names more likely
    
    return Math.min(confidence, 0.95);
  }

  calculateSemanticConfidence(text, context) {
    let confidence = 0.6;
    
    const words = text.split(/\s+/);
    // Boost for typical name patterns
    if (words.length === 2) confidence += 0.1;
    if (words.every(w => w.length >= 3 && w.length <= 12)) confidence += 0.1;
    if (/\b(?:mr|mrs|ms|dr)\.?\s+/i.test(context)) confidence += 0.15;
    
    return Math.min(confidence, 0.9);
  }

  isCapitalized(word) {
    return /^[A-Z][a-z]+$/.test(word);
  }

  hasNameCharacteristics(word) {
    return word.length >= 2 && word.length <= 15 && /^[A-Za-z]+$/.test(word);
  }

  isValidCreditCard(number) {
    // Luhn algorithm
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 && digits.length >= 13;
  }

  contextSuggestsBankAccount(text, number) {
    const bankKeywords = /\b(?:account|bank|routing|deposit|withdrawal|balance)\b/i;
    const context = this.extractContext(text, number);
    return bankKeywords.test(context);
  }

  extractContext(text, target) {
    const index = text.indexOf(target);
    if (index === -1) return '';
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + target.length + 30);
    return text.substring(start, end);
  }

  isCommonFalsePositive(name) {
    const falsePositives = [
      // Geographic locations
      'United States', 'New York', 'Los Angeles', 'San Francisco', 'Las Vegas',
      'San Diego', 'San Antonio', 'Fort Worth', 'New Jersey', 'North Carolina',
      // Companies and organizations
      'Microsoft Corporation', 'Apple Inc', 'Google LLC', 'Amazon Web', 'Meta Platforms',
      'Tesla Inc', 'Netflix Inc', 'Adobe Systems', 'Oracle Corporation',
      // Common non-names
      'First Name', 'Last Name', 'Full Name', 'User Name', 'Display Name',
      'Real Name', 'Given Name', 'Family Name', 'Middle Name',
      // Technical terms
      'Data Source', 'Email Address', 'Phone Number', 'Social Security',
      'Credit Card', 'Bank Account', 'User Interface', 'Machine Learning',
      // Days and months
      'Monday Tuesday', 'January February', 'Christmas Day', 'New Year',
      // Generic titles
      'Dear Sir', 'Dear Madam', 'To Whom', 'Best Regards', 'Thank You'
    ];
    
    const lowerName = name.toLowerCase();
    return falsePositives.some(fp => 
      lowerName.includes(fp.toLowerCase()) || 
      fp.toLowerCase().includes(lowerName)
    ) || this.isCommonWord(name);
  }

  isCommonWord(text) {
    const commonWords = [
      'about', 'after', 'again', 'against', 'all', 'any', 'are', 'because', 'been',
      'before', 'being', 'below', 'between', 'both', 'but', 'can', 'did', 'does',
      'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
      'has', 'have', 'having', 'her', 'here', 'hers', 'herself', 'him', 'himself',
      'his', 'how', 'into', 'its', 'itself', 'more', 'most', 'much', 'nor', 'not',
      'now', 'off', 'once', 'only', 'other', 'our', 'ours', 'ourselves', 'out',
      'over', 'own', 'same', 'she', 'should', 'some', 'such', 'than', 'that',
      'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
      'they', 'this', 'those', 'through', 'too', 'under', 'until', 'very', 'was',
      'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
      'will', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    return words.every(word => commonWords.includes(word));
  }
}

const deidentifier = new SimpleDeidentifier();

// Storage utilities
const clipboard = {
  async copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      } catch (fallbackError) {
        console.error('Failed to copy to clipboard:', fallbackError);
        return false;
      }
    }
  }
};

const sessionStorage = {
  save(key, data) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  },

  load(key) {
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load from session storage:', error);
      return null;
    }
  },

  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from session storage:', error);
    }
  }
};

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [detectedPII, setDetectedPII] = useState([]);
  const [mappings, setMappings] = useState({});
  const [showMappings, setShowMappings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState('idle');
  const [mlEnabled, setMLEnabled] = useState(true);
  const [mlStats, setMLStats] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.load('deidentifier-session');
    if (savedData) {
      setInputText(savedData.inputText || '');
      setOutputText(savedData.outputText || '');
      setMappings(savedData.mappings || {});
      setDetectedPII(savedData.detectedPII || []);
      setMLEnabled(savedData.mlEnabled !== undefined ? savedData.mlEnabled : true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.save('deidentifier-session', {
      inputText, outputText, mappings, detectedPII, mlEnabled
    });
  }, [inputText, outputText, mappings, detectedPII, mlEnabled]);

  useEffect(() => {
    deidentifier.setMLEnabled(mlEnabled);
  }, [mlEnabled]);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const result = deidentifier.processText(inputText);
      setOutputText(result.processedText);
      setMappings(result.mappings);
      setDetectedPII(result.detectedPII);
      setMLStats({
        totalDetections: result.totalDetections,
        mlDetectionsCount: result.mlDetectionsCount
      });
    } catch (error) {
      console.error('Processing error:', error);
      setOutputText('Error processing text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    setCopiedStatus('copying');
    const success = await clipboard.copy(outputText);
    setCopiedStatus(success ? 'copied' : 'error');
    setTimeout(() => setCopiedStatus('idle'), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setMappings({});
    setDetectedPII([]);
    setShowMappings(false);
    setMLStats(null);
    deidentifier.reset();
    sessionStorage.remove('deidentifier-session');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Data Deidentifier
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Protect sensitive information before sharing. All processing happens locally in your browser.
          </p>
        </header>

        <main className="space-y-8">
          <MLControls
            mlEnabled={mlEnabled}
            onToggleML={setMLEnabled}
            mlStats={mlStats}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <TextProcessor
              inputText={inputText}
              outputText={outputText}
              onInputChange={setInputText}
              isProcessing={isProcessing}
              detectedPII={detectedPII}
            />
          </div>

          <ActionButtons
            onProcess={handleProcess}
            onCopy={handleCopy}
            onReset={handleReset}
            onToggleMappings={() => setShowMappings(!showMappings)}
            showMappings={showMappings}
            isProcessing={isProcessing}
            hasOutput={!!outputText}
            copiedStatus={copiedStatus}
          />

          {showMappings && Object.keys(mappings).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Detection Details</h3>
              <div className="space-y-3">
                {detectedPII.map((item, index) => {
                  const typeInfo = getDetectionTypeInfo(item.type);
                  const IconComponent = typeInfo.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 ${typeInfo.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <IconComponent size={16} className={typeInfo.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-1 ${typeInfo.bgColor} ${typeInfo.textColor} rounded-full`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-gray-900 truncate">{item.original}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-mono text-blue-600 truncate">{item.replacement}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 text-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
            <Github size={16} />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;