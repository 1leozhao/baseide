'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { configureMonaco } from '@/config/monaco';
import { useEditorStore } from '@/store/editorStore';
import DiffEditor from './DiffEditor';
import Terminal from '../terminal/Terminal';

export default function CodeEditor() {
  const { code, fileName, setCode, isDiffViewEnabled, toggleDiffView, theme, toggleTheme, explorerWidth } = useEditorStore();
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(256);
  const activityBarWidth = 48;
  const totalSidebarWidth = explorerWidth + activityBarWidth;

  useEffect(() => {
    configureMonaco();
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  return (
    <div 
      className="fixed top-14 bottom-0 flex flex-col bg-[var(--editor-bg)]"
      style={{ 
        left: `${totalSidebarWidth}px`,
        right: 0
      }}
    >
      {/* Tabs */}
      <div className="h-10 border-b border-[var(--border-color)] flex items-center justify-between px-4">
        <div className="px-4 py-2 bg-[var(--navbar-bg)] text-[var(--text-primary)] border-r border-[var(--border-color)] flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              isTerminalVisible
                ? 'bg-[var(--primary-color)] text-white'
                : 'hover:bg-[var(--hover-bg)]'
            }`}
            title="Toggle Terminal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleDiffView}
            className={`px-3 py-1 rounded-lg transition-colors ${
              isDiffViewEnabled
                ? 'bg-[var(--primary-color)] text-white'
                : 'hover:bg-[var(--hover-bg)]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0 relative">
        {isDiffViewEnabled ? (
          <DiffEditor />
        ) : (
          <Editor
            height="100%"
            language="solidity"
            theme={`based-${theme}`}
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              padding: { top: 0, bottom: 0 },
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
            }}
            className="h-full w-full absolute inset-0"
          />
        )}
      </div>

      {/* Terminal */}
      {isTerminalVisible && (
        <Terminal 
          isVisible={isTerminalVisible} 
          onResize={setTerminalHeight}
        />
      )}

      {/* Status Bar */}
      <div className="h-6 bg-[var(--navbar-bg)] border-t border-[var(--border-color)] flex items-center justify-between px-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center space-x-4">
          <span>Solidity 0.8.24</span>
          <span>Base Sepolia</span>
          <span>Gas: 0 gwei</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{code.split('\n').length} lines</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}