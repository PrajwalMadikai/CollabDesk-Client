"use client";

import { useMyPresence, useOthers } from "@/config/liveblocks.config";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteViewRaw, useBlockNote } from "@blocknote/react";
import { RoomProvider } from "@liveblocks/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  roomId: string;
  initialContent: string;
  onSave: (content: string) => void;
}

export default function LiveblocksProvider({ children, roomId, initialContent, onSave }: Props) {
  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null, isTyping: false }}>
      <CollaborativeEditor initialContent={initialContent} onSave={onSave}>{children}</CollaborativeEditor>
    </RoomProvider>
  );
}

function CollaborativeEditor({ children, initialContent, onSave }: { children: ReactNode; initialContent: string; onSave: (content: string) => void; }) {
  const [presence, updatePresence] = useMyPresence();
  const others = useOthers();

  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    collaboration: {
      provider: "yjs",
      fragment: "blocknote",
      user: { name: presence.userName || "Anonymous" },
    },
    onUpdate: () => {
      if (editor) {
        const content = JSON.stringify(editor.topLevelBlocks);
        onSave(content);
      }
    },
  });

  return (
    <div className="editor-container relative">
      {editor ? (
        <BlockNoteViewRaw editor={editor} theme="dark" />
      ) : (
        <div>Loading editor...</div>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        {others.map(({ connectionId, presence }) => (
          <div key={connectionId} className="bg-gray-800 px-2 py-1 rounded text-sm text-white">
            {presence.userName} {presence.isTyping ? "is typing..." : ""}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
