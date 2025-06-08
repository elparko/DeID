import React from 'react';
import { Copy, RotateCcw, Play, Eye, EyeOff } from 'lucide-react';

export function ActionButtons({ 
  onProcess, 
  onCopy, 
  onReset, 
  onToggleMappings,
  showMappings,
  isProcessing,
  hasOutput,
  copiedStatus
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
      >
        <Play size={18} />
        {isProcessing ? 'Processing...' : 'Process Text'}
      </button>
      
      <button
        onClick={onCopy}
        disabled={!hasOutput || copiedStatus === 'copying'}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
      >
        <Copy size={18} />
        {copiedStatus === 'copying' ? 'Copying...' : 
         copiedStatus === 'copied' ? 'Copied!' : 'Copy Output'}
      </button>
      
      <button
        onClick={onToggleMappings}
        disabled={!hasOutput}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
      >
        {showMappings ? <EyeOff size={18} /> : <Eye size={18} />}
        {showMappings ? 'Hide' : 'Show'} Mappings
      </button>
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
      >
        <RotateCcw size={18} />
        Reset
      </button>
    </div>
  );
}