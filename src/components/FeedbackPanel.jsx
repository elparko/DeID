import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle } from 'lucide-react';

export function FeedbackPanel({ detectedPII, onFeedback, isVisible, onToggle }) {
  const [feedbackGiven, setFeedbackGiven] = useState(new Set());

  const handleFeedback = (detection, isCorrect) => {
    onFeedback(detection.original, detection.type, isCorrect);
    setFeedbackGiven(prev => new Set([...prev, `${detection.original}-${detection.type}`]));
  };

  const getFeedbackKey = (detection) => `${detection.original}-${detection.type}`;

  if (!detectedPII || detectedPII.length === 0) {
    return null;
  }

  // Filter ML detections that might need feedback
  const mlDetections = detectedPII.filter(d => 
    d.method !== 'regex' && d.confidence < 0.9
  );

  if (mlDetections.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-orange-100 hover:bg-orange-150 flex items-center justify-between text-left font-medium text-orange-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>AI Detection Feedback ({mlDetections.length} items)</span>
        </div>
        <span className="text-sm text-orange-600">
          Help improve accuracy
        </span>
      </button>
      
      {isVisible && (
        <div className="p-6 space-y-4">
          <p className="text-sm text-orange-700 mb-4">
            Help train the AI by confirming whether these detections are correct. 
            Your feedback improves future detection accuracy.
          </p>
          
          {mlDetections.map((detection, index) => {
            const feedbackKey = getFeedbackKey(detection);
            const hasFeedback = feedbackGiven.has(feedbackKey);
            
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDetectionTypeColor(detection.type)}`}>
                        {detection.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(detection.confidence * 100)}% confidence
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                        {detection.method}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      "{detection.original}"
                    </div>
                    {detection.context && (
                      <div className="mt-2 text-xs text-gray-600">
                        <strong>Context:</strong> ...{detection.context}...
                      </div>
                    )}
                  </div>
                </div>
                
                {!hasFeedback ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Is this correct?</span>
                    <button
                      onClick={() => handleFeedback(detection, true)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors"
                    >
                      <ThumbsUp size={14} />
                      Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(detection, false)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                    >
                      <ThumbsDown size={14} />
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle size={16} />
                    <span>Feedback recorded - thank you!</span>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="text-xs text-gray-500 bg-white p-3 rounded border">
            <strong>Note:</strong> Your feedback is stored locally and helps improve 
            detection accuracy for your current session. No data is sent to external servers.
          </div>
        </div>
      )}
    </div>
  );
}

function getDetectionTypeColor(type) {
  const colors = {
    NAME: 'bg-pink-100 text-pink-800',
    CONTACT: 'bg-blue-100 text-blue-800',
    PERSONAL: 'bg-purple-100 text-purple-800',
    FINANCIAL: 'bg-green-100 text-green-800',
    LOCATION: 'bg-orange-100 text-orange-800',
    ID_NUMBER: 'bg-red-100 text-red-800',
    AGE: 'bg-indigo-100 text-indigo-800',
    ORGANIZATION: 'bg-gray-100 text-gray-800',
  };
  
  return colors[type] || 'bg-gray-100 text-gray-800';
}