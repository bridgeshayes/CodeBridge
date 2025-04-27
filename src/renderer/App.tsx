import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import Terminal from './components/Terminal';
import GitPanel from './components/GitPanel';
import Collaboration from './components/Collaboration';

const App: React.FC = () => {
  const [code, setCode] = useState('// Start coding here...');
  const [activePanel, setActivePanel] = useState<'git' | 'collab' | 'terminal'>('terminal');
  const [sidebarWidth, setSidebarWidth] = useState(250);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      {/* Top Bar */}
      <div className="h-12 bg-[#2d2d2d] flex items-center px-4 border-b border-[#1e1e1e]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="ml-4 text-[#858585] text-sm">CodeBridge</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div 
          className="bg-[#252526] w-[250px] flex flex-col border-r border-[#1e1e1e]"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* File Explorer Header */}
          <div className="h-10 flex items-center px-4 text-[#858585] text-xs uppercase tracking-wider font-medium">
            Explorer
          </div>
          
          {/* File Tree (placeholder) */}
          <div className="flex-1 overflow-auto px-2">
            <div className="text-[#858585] text-sm py-1 hover:bg-[#2a2d2e] px-2 rounded cursor-pointer">
              📁 src
            </div>
            <div className="text-[#858585] text-sm py-1 hover:bg-[#2a2d2e] px-2 rounded cursor-pointer ml-4">
              📄 App.tsx
            </div>
            <div className="text-[#858585] text-sm py-1 hover:bg-[#2a2d2e] px-2 rounded cursor-pointer ml-4">
              📄 index.tsx
            </div>
          </div>
        </div>

        {/* Editor and Panels */}
        <div className="flex-1 flex flex-col">
          <Split
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={4}
            gutterStyle={() => ({
              backgroundColor: '#1e1e1e'
            })}
            className="flex-1"
          >
            {/* Editor */}
            <div className="h-full">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                  minimap: {
                    enabled: true,
                    scale: 10,
                    renderCharacters: false
                  },
                  scrollbar: {
                    verticalScrollbarSize: 12,
                    horizontalScrollbarSize: 12
                  },
                  padding: { top: 10, bottom: 10 },
                  wordWrap: 'on',
                  automaticLayout: true,
                  lineNumbers: 'on',
                  glyphMargin: true,
                  folding: true,
                  lineDecorationsWidth: 10,
                }}
              />
            </div>

            {/* Bottom Panel */}
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              {/* Panel Tabs */}
              <div className="h-9 flex border-b border-[#2d2d2d]">
                <button
                  className={`px-4 h-full flex items-center text-sm ${
                    activePanel === 'terminal'
                      ? 'text-white bg-[#1e1e1e] border-t-2 border-[#007acc]'
                      : 'text-[#858585] hover:text-white'
                  }`}
                  onClick={() => setActivePanel('terminal')}
                >
                  Terminal
                </button>
                <button
                  className={`px-4 h-full flex items-center text-sm ${
                    activePanel === 'git'
                      ? 'text-white bg-[#1e1e1e] border-t-2 border-[#007acc]'
                      : 'text-[#858585] hover:text-white'
                  }`}
                  onClick={() => setActivePanel('git')}
                >
                  Git
                </button>
                <button
                  className={`px-4 h-full flex items-center text-sm ${
                    activePanel === 'collab'
                      ? 'text-white bg-[#1e1e1e] border-t-2 border-[#007acc]'
                      : 'text-[#858585] hover:text-white'
                  }`}
                  onClick={() => setActivePanel('collab')}
                >
                  Collaboration
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1">
                {activePanel === 'terminal' && <Terminal />}
                {activePanel === 'git' && <GitPanel />}
                {activePanel === 'collab' && <Collaboration />}
              </div>
            </div>
          </Split>
        </div>
      </div>
    </div>
  );
};

export default App; 