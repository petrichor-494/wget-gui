import React, { useState } from 'react';
import { Download, History, Settings, Link, Folder, CheckCircle, XCircle, Loader, Trash2, Copy } from 'lucide-react';

export default function WgetGUI() {
  const [activeTab, setActiveTab] = useState('download');
  const [url, setUrl] = useState('');
  const [outputPath, setOutputPath] = useState('~/Downloads');
  const [options, setOptions] = useState({
    continue: true,
    recursive: false,
    limit: false,
    timestamping: false,
    noCache: false,
    userAgent: false
  });
  const [downloadHistory, setDownloadHistory] = useState([
    { id: 1, url: 'https://example.com/file.pdf', status: 'completed', time: '2 hours ago', size: '2.4 MB' },
    { id: 2, url: 'https://example.com/archive.zip', status: 'completed', time: '5 hours ago', size: '15.8 MB' }
  ]);
  const [currentDownload, setCurrentDownload] = useState(null);

  const generateCommand = () => {
    let cmd = 'wget';
    if (options.continue) cmd += ' -c';
    if (options.recursive) cmd += ' -r';
    if (options.timestamping) cmd += ' -N';
    if (options.noCache) cmd += ' --no-cache';
    if (options.userAgent) cmd += ' --user-agent="Mozilla/5.0"';
    if (outputPath !== '~/Downloads') cmd += ` -P ${outputPath}`;
    cmd += ` "${url}"`;
    return cmd;
  };

  const handleDownload = () => {
    if (!url) return;
    
    setCurrentDownload({
      url: url,
      progress: 0,
      status: 'downloading'
    });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDownloadHistory([
            { 
              id: Date.now(), 
              url: url, 
              status: 'completed', 
              time: 'just now',
              size: `${(Math.random() * 50 + 1).toFixed(1)} MB`
            },
            ...downloadHistory
          ]);
          setCurrentDownload(null);
          setUrl(''); 
        }, 500);
      }
      setCurrentDownload(prev => ({...prev, progress: Math.min(progress, 100)}));
    }, 300);
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generateCommand());
  };

  const deleteHistoryItem = (id) => {
    setDownloadHistory(downloadHistory.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Download className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">wget Manager</h1>
              <p className="text-gray-600">Modern download interface for wget</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'download' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>

        {/* Download Tab */}
        {activeTab === 'download' && (
          <div className="space-y-6">
            {/* URL Input */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Link size={16} />
                Download URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.zip"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Output Path */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Folder size={16} />
                Save Location
              </label>
              <input
                type="text"
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                <Settings size={16} />
                Download Options
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries({
                  continue: 'Continue partial downloads (-c)',
                  recursive: 'Recursive download (-r)',
                  timestamping: 'Use timestamping (-N)',
                  noCache: 'Bypass cache (--no-cache)',
                  userAgent: 'Custom user agent',
                  limit: 'Limit download speed'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({...options, [key]: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generated Command */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">Generated Command</label>
                <button
                  onClick={copyCommand}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                >
                  <Copy size={14} />
                  Copy
                </button>
              </div>
              <code className="block text-green-400 font-mono text-sm break-all">
                {generateCommand()}
              </code>
            </div>

            {/* Current Download */}
            {currentDownload && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Loader className="text-blue-600 animate-spin" size={20} />
                  <span className="font-semibold text-gray-900">Downloading...</span>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-2 truncate">{currentDownload.url}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{width: `${currentDownload.progress}%`}}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {Math.round(currentDownload.progress)}%
                  </div>
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!url || currentDownload}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {currentDownload ? 'Downloading...' : 'Start Download'}
            </button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Download History</h2>
              <p className="text-sm text-gray-600 mt-1">{downloadHistory.length} downloads</p>
            </div>
            <div className="divide-y divide-gray-100">
              {downloadHistory.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <History size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No downloads yet</p>
                </div>
              ) : (
                downloadHistory.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === 'completed' ? (
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle size={18} className="text-red-600 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {item.url.split('/').pop() || item.url}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">{item.url}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.time}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}