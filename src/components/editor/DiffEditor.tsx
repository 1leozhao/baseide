import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';
import { getFileType } from '@/utils/fileIcons';

export default function DiffEditor() {
  const { openFiles, activeFileId, originalCode, theme } = useEditorStore();
  const activeFile = openFiles.find(f => f.id === activeFileId);
  const fileType = activeFile ? getFileType(activeFile.fileName) : 'text';

  if (!activeFile) return null;

  return (
    <div className="h-[calc(100vh-8rem)]">
      <MonacoDiffEditor
        height="100%"
        language={fileType}
        theme="based-light"
        original={originalCode || activeFile.code}
        modified={activeFile.code}
        beforeMount={(monaco) => {
          monaco.editor.setTheme('based-light');
        }}
        options={{
          renderSideBySide: true,
          originalEditable: false,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          diffWordWrap: 'off',
        }}
      />
    </div>
  );
} 