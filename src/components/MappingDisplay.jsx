import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function MappingDisplay({ mappings, isVisible, onToggle, detectedPII }) {
  if (!mappings || Object.keys(mappings).length === 0) {
    return null;
  }

  const mappingEntries = Object.entries(mappings);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left font-medium text-gray-700 transition-colors"
      >
        <span>Replacement Mappings ({mappingEntries.length} items)</span>
        {isVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isVisible && (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Replacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {detectedPII?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono break-all">
                    {item.original}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-mono break-all">
                    {item.replacement}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getMethodColor(item.method)}`}>
                      {item.method || 'regex'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xs font-medium text-gray-900">
                        {Math.round((item.confidence || 0.95) * 100)}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(item.confidence || 0.95) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              )) || mappingEntries.map(([original, replacement], index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      DETECTED
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono break-all">
                    {original}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-mono break-all">
                    {replacement}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      regex
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xs font-medium text-gray-900">95%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full w-full"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getTypeColor(type) {
  const colors = {
    EMAIL: 'bg-blue-100 text-blue-800',
    PHONE: 'bg-green-100 text-green-800',
    SSN: 'bg-red-100 text-red-800',
    CREDIT_CARD: 'bg-purple-100 text-purple-800',
    IP_ADDRESS: 'bg-yellow-100 text-yellow-800',
    DATE: 'bg-indigo-100 text-indigo-800',
    NAME: 'bg-pink-100 text-pink-800',
    ADDRESS: 'bg-orange-100 text-orange-800',
    CONTACT: 'bg-teal-100 text-teal-800',
    PERSONAL: 'bg-purple-100 text-purple-800',
    FINANCIAL: 'bg-green-100 text-green-800',
    LOCATION: 'bg-orange-100 text-orange-800',
    ID_NUMBER: 'bg-red-100 text-red-800',
    AGE: 'bg-indigo-100 text-indigo-800',
    ORGANIZATION: 'bg-gray-100 text-gray-800',
  };
  
  return colors[type] || 'bg-gray-100 text-gray-800';
}

function getMethodColor(method) {
  const colors = {
    regex: 'bg-blue-100 text-blue-800',
    nlp: 'bg-purple-100 text-purple-800',
    context: 'bg-green-100 text-green-800',
    fuzzy: 'bg-orange-100 text-orange-800',
    semantic: 'bg-indigo-100 text-indigo-800',
  };
  
  return colors[method] || 'bg-gray-100 text-gray-800';
}