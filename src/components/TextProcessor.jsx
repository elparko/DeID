import React from 'react';
import { FileText, Shield } from 'lucide-react';

export function TextProcessor({ 
  inputText, 
  outputText, 
  onInputChange, 
  isProcessing,
  detectedPII 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="text-gray-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Input Text</h2>
          {detectedPII && detectedPII.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {detectedPII.length} PII detected
            </span>
          )}
        </div>
        
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste your text here. The app will automatically detect and replace sensitive information like emails, phone numbers, SSNs, etc."
            className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Characters: {inputText.length}</p>
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="text-green-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Deidentified Output</h2>
          {outputText && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ready to use
            </span>
          )}
        </div>
        
        <div className="relative">
          <textarea
            value={outputText}
            readOnly
            placeholder="Processed text will appear here..."
            className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none bg-gray-50 font-mono text-sm"
          />
          {!outputText && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Shield size={48} className="mx-auto mb-2 opacity-50" />
                <p>Click "Process Text" to deidentify your content</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Characters: {outputText.length}</p>
        </div>
      </div>
    </div>
  );
}