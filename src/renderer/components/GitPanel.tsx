import React, { useState, useEffect } from 'react';
import { diffLines } from 'diff';
// import simpleGit from 'simple-git';

interface GitPanelProps {
  repoPath: string | null;
}

const GitPanel: React.FC<GitPanelProps> = ({ repoPath }) => {
  const [status, setStatus] = useState<any>(null);
  const [diff, setDiff] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<string>('');

  useEffect(() => {
    if (repoPath) {
      updateGitStatus();
    }
    // eslint-disable-next-line
  }, [repoPath]);

  const updateGitStatus = async () => {
    if (!repoPath) return;
    try {
      const status = await (window as any).electron.gitStatus(repoPath);
      setStatus(status);
    } catch (error) {
      console.error('Error getting git status:', error);
    }
  };

  const showDiff = async (file: string) => {
    if (!repoPath) return;
    try {
      const diffResult = await (window as any).electron.gitDiff(repoPath, file);
      setDiff(diffResult);
      setCurrentFile(file);
    } catch (error) {
      console.error('Error getting diff:', error);
    }
  };

  const renderDiff = (diffText: string) => {
    const lines = diffText.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('+')) {
        return (
          <div key={i} className="flex">
            <div className="w-8 text-right pr-2 select-none text-[#2ea043] opacity-50">+</div>
            <div className="flex-1 bg-[#1b4721] text-[#2ea043]">{line.substring(1)}</div>
          </div>
        );
      } else if (line.startsWith('-')) {
        return (
          <div key={i} className="flex">
            <div className="w-8 text-right pr-2 select-none text-[#f85149] opacity-50">-</div>
            <div className="flex-1 bg-[#4e1c19] text-[#f85149]">{line.substring(1)}</div>
          </div>
        );
      }
      return (
        <div key={i} className="flex">
          <div className="w-8 text-right pr-2 select-none text-[#6e7681]"> </div>
          <div className="flex-1 text-[#d4d4d4]">{line}</div>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex-1 overflow-auto">
        {status && (
          <div className="p-4">
            {/* Modified Files */}
            {status.modified.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="text-[#d4d4d4] text-xs uppercase tracking-wider font-medium">
                    Modified Files
                  </div>
                  <div className="ml-2 px-2 py-0.5 text-xs bg-[#2ea043] text-black rounded-full">
                    {status.modified.length}
                  </div>
                </div>
                <div className="space-y-1">
                  {status.modified.map((file: string) => (
                    <div
                      key={file}
                      className={`flex items-center px-3 py-1.5 rounded cursor-pointer ${
                        currentFile === file ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'
                      }`}
                      onClick={() => showDiff(file)}
                    >
                      <div className="text-[#f85149] mr-2">M</div>
                      <div className="text-sm">{file}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diff View */}
            {currentFile && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <div className="text-[#d4d4d4] text-xs uppercase tracking-wider font-medium">
                    Changes: {currentFile}
                  </div>
                </div>
                <div className="font-mono text-sm bg-[#1e1e1e] rounded overflow-hidden">
                  {renderDiff(diff)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitPanel; 