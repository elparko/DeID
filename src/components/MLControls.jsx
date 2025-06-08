import React from 'react';
import { Brain, Settings, TrendingUp } from 'lucide-react';

export function MLControls({ 
  mlEnabled, 
  onToggleML, 
  confidenceThreshold, 
  onConfidenceChange,
  mlStats 
}) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">AI-Enhanced Detection</h3>
        {mlStats && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {mlStats.mlDetectionsCount} ML detections
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* ML Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Machine Learning Detection
            </span>
          </div>
          <button
            onClick={onToggleML}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              mlEnabled 
                ? 'bg-purple-600' 
                : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mlEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Confidence Threshold */}
        {mlEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Confidence Threshold: {Math.round(confidenceThreshold * 100)}%
              </label>
              <TrendingUp size={16} className="text-gray-500" />
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Less Strict (50%)</span>
              <span>More Strict (100%)</span>
            </div>
          </div>
        )}

        {/* ML Stats */}
        {mlStats && mlEnabled && (
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-purple-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {mlStats.totalDetections}
              </div>
              <div className="text-xs text-gray-600">Total Found</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">
                {mlStats.mlDetectionsCount}
              </div>
              <div className="text-xs text-gray-600">AI Detected</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {mlStats.totalDetections - mlStats.mlDetectionsCount}
              </div>
              <div className="text-xs text-gray-600">Pattern Match</div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="text-xs text-gray-600 bg-white p-3 rounded border border-purple-100">
          <p className="mb-2">
            <strong>AI Detection includes:</strong>
          </p>
          <ul className="space-y-1 pl-2">
            <li>• Context-aware name recognition</li>
            <li>• Semantic analysis for personal info</li>
            <li>• Fuzzy matching for typos and variations</li>
            <li>• Financial and identification patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}