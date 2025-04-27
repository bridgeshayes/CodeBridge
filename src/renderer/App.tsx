import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import Terminal from './components/Terminal';
import GitPanel from './components/GitPanel';
import Collaboration from './components/Collaboration';

interface FileNode {
  type: 'file' | 'directory';
  name: string;
  path: string;
  children?: FileNode[];
}

interface Tab {
  label: string;
  icon: string;
  path: string;
  content: string;
  isDirty: boolean;
}

const TABS = [
  { label: 'App.tsx', icon: 'codicon-file-code', active: true },
  { label: 'index.tsx', icon: 'codicon-file-code', active: false },
];

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<'git' | 'collab' | 'terminal'>('terminal');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [activeSidebar, setActiveSidebar] = useState<'explorer' | 'git' | 'search'>('explorer');
  const [fileTree, setFileTree] = useState<FileNode[] | null>(null);
  const [rootPath, setRootPath] = useState<string | null>(null);

  // Monaco loader config for Electron
  useEffect(() => {
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function (_: any, label: string) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = { baseUrl: 'vs' };
          importScripts('vs/base/worker/workerMain.js');
        `)}`;
      }
    };
  }, []);

  // Open folder and load file tree
  const handleOpenFolder = async () => {
    const folderPath = await (window as any).electron.openFolder();
    if (folderPath) {
      setRootPath(folderPath);
      const tree = await (window as any).electron.readDir(folderPath);
      setFileTree(tree);
    }
  };

  // Recursively render file tree
  const renderFileTree = (nodes: FileNode[], depth = 0): React.ReactNode => (
    <div>
      {nodes.flatMap((node) => {
        const base = (
          <div key={node.path} style={{ paddingLeft: 8 + depth * 16, display: 'flex', alignItems: 'center', cursor: node.type === 'file' ? 'pointer' : 'default' }}>
            {node.type === 'directory' ? (
              <>
                <span className="codicon codicon-folder" style={{ marginRight: 6 }} />{node.name}
              </>
            ) : (
              <span
                className="codicon codicon-file-code"
                style={{ marginRight: 6 }}
                onClick={() => handleOpenFile(node)}
              />
            )}
            {node.type === 'file' ? (
              <span onClick={() => handleOpenFile(node)}>{node.name}</span>
            ) : (
              <span>{node.name}</span>
            )}
          </div>
        );
        if (node.type === 'directory' && node.children) {
          return [base, <div key={node.path + '-children'}>{renderFileTree(node.children, depth + 1)}</div>];
        }
        return [base];
      })}
    </div>
  );

  // Open file in tab
  const handleOpenFile = async (node: FileNode) => {
    if (tabs.some((tab) => tab.path === node.path)) {
      setActiveTab(tabs.findIndex((tab) => tab.path === node.path));
      return;
    }
    console.log('Opening file:', node.path);
    try {
      const content = await (window as any).electron.readFile(node.path);
      console.log('File content loaded:', content.slice(0, 100));
      const newTab: Tab = {
        label: node.name,
        icon: 'codicon-file-code',
        path: node.path,
        content,
        isDirty: false,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTab(tabs.length);
    } catch (err) {
      console.error('Error loading file:', err);
      alert('Failed to load file: ' + err);
    }
  };

  // Handle editor change
  const handleEditorChange = (value: string | undefined) => {
    if (activeTab === null) return;
    setTabs((prev) =>
      prev.map((tab, idx) =>
        idx === activeTab ? { ...tab, content: value ?? '', isDirty: true } : tab
      )
    );
  };

  // Save file
  const handleSaveFile = async () => {
    if (activeTab === null) return;
    const tab = tabs[activeTab];
    await (window as any).electron.saveFile(tab.path, tab.content);
    setTabs((prev) =>
      prev.map((t, idx) => (idx === activeTab ? { ...t, isDirty: false } : t))
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--vscode-bg)' }}>
      {/* Top Bar (Command Palette area) */}
      <div style={{ height: 30, background: 'var(--vscode-tab-bg)', borderBottom: '1px solid var(--vscode-border)', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
        <span style={{ color: '#bbb', fontSize: 13 }}>CodeBridge - Visual Studio Code</span>
        {activeTab !== null && tabs[activeTab]?.isDirty && (
          <button onClick={handleSaveFile} style={{ marginLeft: 16, background: 'var(--vscode-statusbar-bg)', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 10px', cursor: 'pointer' }}>
            Save
          </button>
        )}
      </div>
      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Activity Bar */}
        <div style={{ width: 48, background: 'var(--vscode-activitybar-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, borderRight: '1px solid var(--vscode-border)' }}>
          <button
            className={`codicon codicon-files ${activeSidebar === 'explorer' ? 'activity-active' : ''}`}
            style={{ fontSize: 24, color: activeSidebar === 'explorer' ? 'var(--vscode-activitybar-active)' : '#bbb', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveSidebar('explorer')}
            title="Explorer"
          />
          <button
            className={`codicon codicon-source-control ${activeSidebar === 'git' ? 'activity-active' : ''}`}
            style={{ fontSize: 24, color: activeSidebar === 'git' ? 'var(--vscode-activitybar-active)' : '#bbb', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveSidebar('git')}
            title="Source Control"
          />
          <button
            className={`codicon codicon-search ${activeSidebar === 'search' ? 'activity-active' : ''}`}
            style={{ fontSize: 24, color: activeSidebar === 'search' ? 'var(--vscode-activitybar-active)' : '#bbb', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveSidebar('search')}
            title="Search"
          />
        </div>
        {/* Sidebar */}
        <div style={{ width: sidebarWidth, background: 'var(--vscode-sidebar-bg)', borderRight: '1px solid var(--vscode-border)', display: activeSidebar === 'explorer' ? 'block' : 'none' }}>
          {/* Open Folder Button */}
          <div style={{ padding: 8, borderBottom: '1px solid var(--vscode-border)' }}>
            <button onClick={handleOpenFolder} style={{ background: 'var(--vscode-statusbar-bg)', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}>
              <span className="codicon codicon-folder-opened" style={{ marginRight: 6 }} />Open Folder
            </button>
          </div>
          {/* File Tree */}
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
            {fileTree ? renderFileTree(fileTree) : <div style={{ color: '#bbb', padding: 12 }}>No folder open</div>}
          </div>
        </div>
        {/* Main Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Editor Tabs */}
          <div style={{ height: 32, display: 'flex', alignItems: 'end', background: 'var(--vscode-tab-bg)', borderBottom: '1px solid var(--vscode-border)' }}>
            {tabs.map((tab, idx) => (
              <div
                key={tab.path}
                onClick={() => setActiveTab(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  height: 32,
                  background: activeTab === idx ? 'var(--vscode-tab-active-bg)' : 'var(--vscode-tab-bg)',
                  borderTop: activeTab === idx ? '2px solid var(--vscode-tab-active-border)' : '2px solid transparent',
                  borderRight: '1px solid var(--vscode-border)',
                  color: activeTab === idx ? '#fff' : '#bbb',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 14,
                  position: 'relative',
                  top: 1
                }}
              >
                <span className={`codicon ${tab.icon}`} style={{ marginRight: 8, fontSize: 16 }} />
                {tab.label}
                {tab.isDirty && <span style={{ color: '#e2c08d', marginLeft: 4 }}>*</span>}
              </div>
            ))}
          </div>
          {/* Editor and Panels */}
          <Split
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={4}
            gutterStyle={() => ({ backgroundColor: 'var(--vscode-bg)' })}
            style={{ flex: 1, minHeight: 0 }}
          >
            {/* Editor */}
            <div style={{ height: '100%' }}>
              {activeTab !== null && tabs[activeTab] ? (
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  theme="vs-dark"
                  value={tabs[activeTab].content}
                  onChange={handleEditorChange}
                  monacoPath="node_modules/monaco-editor/min/vs"
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
              ) : (
                <div style={{ color: '#bbb', padding: 24 }}>Open a file to start editing</div>
              )}
            </div>
            {/* Bottom Panel */}
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--vscode-bg)' }}>
              {/* Panel Tabs */}
              <div style={{ height: 36, display: 'flex', borderBottom: '1px solid var(--vscode-border)' }}>
                <button
                  style={{
                    padding: '0 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: activePanel === 'terminal' ? '#fff' : '#bbb',
                    borderTop: activePanel === 'terminal' ? '2px solid var(--vscode-activitybar-active)' : '2px solid transparent',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                  onClick={() => setActivePanel('terminal')}
                >
                  <span className="codicon codicon-terminal" style={{ marginRight: 6 }} />Terminal
                </button>
                <button
                  style={{
                    padding: '0 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: activePanel === 'git' ? '#fff' : '#bbb',
                    borderTop: activePanel === 'git' ? '2px solid var(--vscode-activitybar-active)' : '2px solid transparent',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                  onClick={() => setActivePanel('git')}
                >
                  <span className="codicon codicon-source-control" style={{ marginRight: 6 }} />Git
                </button>
                <button
                  style={{
                    padding: '0 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: activePanel === 'collab' ? '#fff' : '#bbb',
                    borderTop: activePanel === 'collab' ? '2px solid var(--vscode-activitybar-active)' : '2px solid transparent',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                  onClick={() => setActivePanel('collab')}
                >
                  <span className="codicon codicon-organization" style={{ marginRight: 6 }} />Collaboration
                </button>
              </div>
              {/* Panel Content */}
              <div style={{ flex: 1, minHeight: 0 }}>
                {activePanel === 'terminal' && <Terminal />}
                {activePanel === 'git' && <GitPanel repoPath={rootPath} />}
                {activePanel === 'collab' && <Collaboration />}
              </div>
            </div>
          </Split>
        </div>
      </div>
      {/* Status Bar */}
      <div style={{ height: 24, background: 'var(--vscode-statusbar-bg)', color: 'var(--vscode-statusbar-fg)', display: 'flex', alignItems: 'center', fontSize: 13, paddingLeft: 12, borderTop: '1px solid #005a9e' }}>
        <span className="codicon codicon-check" style={{ marginRight: 8, fontSize: 16 }} />
        <span>VS Code Theme Active</span>
        <span style={{ flex: 1 }} />
        <span className="codicon codicon-bell" style={{ marginRight: 16, fontSize: 16 }} />
        <span className="codicon codicon-feedback" style={{ marginRight: 16, fontSize: 16 }} />
        <span style={{ marginRight: 16 }}>Ln 1, Col 1</span>
        <span style={{ marginRight: 16 }}>Spaces: 2</span>
        <span style={{ marginRight: 16 }}>UTF-8</span>
        <span style={{ marginRight: 16 }}>LF</span>
        <span style={{ marginRight: 16 }}>TypeScript</span>
      </div>
    </div>
  );
};

export default App; 