import React, { useState, useEffect } from 'react';
import { Shield, Github, Info } from 'lucide-react';
import { TextProcessor } from './components/TextProcessor';
import { ActionButtons } from './components/ActionButtons';
import { MappingDisplay } from './components/MappingDisplay';
import { MLControls } from './components/MLControls';
import { FeedbackPanel } from './components/FeedbackPanel';
import { deidentifier } from './utils/deidentifier';
import { mlDetector } from './utils/simpleMlDetector';
import { clipboard, sessionStorage } from './utils/storage';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [detectedPII, setDetectedPII] = useState([]);
  const [mappings, setMappings] = useState({});
  const [showMappings, setShowMappings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState('idle');
  const [mlEnabled, setMLEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [mlStats, setMLStats] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.load('deidentifier-session');
    if (savedData) {
      setInputText(savedData.inputText || '');
      setOutputText(savedData.outputText || '');
      setMappings(savedData.mappings || {});
      setDetectedPII(savedData.detectedPII || []);
      setMLEnabled(savedData.mlEnabled !== undefined ? savedData.mlEnabled : true);
      setConfidenceThreshold(savedData.confidenceThreshold || 0.7);
    }
  }, []);

  useEffect(() => {
    sessionStorage.save('deidentifier-session', {
      inputText,
      outputText,
      mappings,
      detectedPII,
      mlEnabled,
      confidenceThreshold
    });
  }, [inputText, outputText, mappings, detectedPII, mlEnabled, confidenceThreshold]);

  // Update deidentifier settings when ML settings change
  useEffect(() => {
    deidentifier.setMLEnabled(mlEnabled);
    deidentifier.setConfidenceThreshold(confidenceThreshold);
  }, [mlEnabled, confidenceThreshold]);

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing time for better UX
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
    
    if (success) {
      setCopiedStatus('copied');
      setTimeout(() => setCopiedStatus('idle'), 2000);
    } else {
      setCopiedStatus('error');
      setTimeout(() => setCopiedStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setMappings({});
    setDetectedPII([]);
    setShowMappings(false);
    setShowFeedback(false);
    setMLStats(null);
    deidentifier.reset();
    sessionStorage.remove('deidentifier-session');
  };

  const handleToggleMappings = () => {
    setShowMappings(!showMappings);
  };

  const handleMLToggle = (enabled) => {
    setMLEnabled(enabled);
  };

  const handleConfidenceChange = (threshold) => {
    setConfidenceThreshold(threshold);
  };

  const handleFeedback = (text, type, isCorrect) => {
    mlDetector.addFeedback(text, type, isCorrect);
  };

  const handleToggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">
              Data Deidentifier
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered privacy protection that automatically detects and replaces sensitive information 
            before sharing text with external services. Enhanced with machine learning for comprehensive detection.
          </p>
          
          {/* Privacy Notice */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="text-green-600 mt-0.5" size={20} />
              <div className="text-left">
                <h3 className="font-semibold text-green-800 mb-1">100% Client-Side Processing</h3>
                <p className="text-green-700 text-sm">
                  All data processing happens locally in your browser. No information is sent to external servers, 
                  ensuring complete privacy and security of your sensitive data.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* ML Controls */}
          <MLControls
            mlEnabled={mlEnabled}
            onToggleML={handleMLToggle}
            confidenceThreshold={confidenceThreshold}
            onConfidenceChange={handleConfidenceChange}
            mlStats={mlStats}
          />

          <TextProcessor
            inputText={inputText}
            outputText={outputText}
            onInputChange={setInputText}
            isProcessing={isProcessing}
            detectedPII={detectedPII}
          />

          <ActionButtons
            onProcess={handleProcess}
            onCopy={handleCopy}
            onReset={handleReset}
            onToggleMappings={handleToggleMappings}
            showMappings={showMappings}
            isProcessing={isProcessing}
            hasOutput={!!outputText}
            copiedStatus={copiedStatus}
          />

          {/* Feedback Panel for ML Detections */}
          <FeedbackPanel
            detectedPII={detectedPII}
            onFeedback={handleFeedback}
            isVisible={showFeedback}
            onToggle={handleToggleFeedback}
          />

          {Object.keys(mappings).length > 0 && (
            <MappingDisplay
              mappings={mappings}
              detectedPII={detectedPII}
              isVisible={showMappings}
              onToggle={handleToggleMappings}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <Github size={16} />
              View on GitHub
            </a>
          </div>
          <p>
            Built with React, Tailwind CSS, and privacy in mind. 
            No data collection, no external dependencies.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
