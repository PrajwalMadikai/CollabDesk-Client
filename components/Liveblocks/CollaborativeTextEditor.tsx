"use client";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { LiveObject } from "@liveblocks/client";
import {
  useOthers,
  useRoom,
  useSelf
} from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";
import { LoadingSpinner } from "../LoadingSpinner";
import { Avatars } from "./avatar/Avatar";
import { LiveCursors } from "./LiveCursor";

type Presence = {
  cursor: { x: number; y: number } | null;
  selection?: any;
  isTyping: boolean;
  lastActive: number;
};

declare type Storage = {
  document: LiveObject<{ content: any[] }>;
};

export function CollaborativeEditor() {
  const room = useRoom();
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    // Initialize the Yjs document with default content if empty
    const fragment = yDoc.getXmlFragment("document-store");
    if (fragment.length === 0) {
      fragment.insert(0, [new Y.XmlText()]);
    }

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) return <LoadingSpinner />;

  return <BlockNote doc={doc} provider={provider} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

function BlockNote({ doc, provider }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const others = useOthers();

  if (!userInfo) return <LoadingSpinner />;

  // Access the document content from Yjs
  const fragment = doc.getXmlFragment("document-store");

  // Initialize the BlockNote editor with the stored content
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment,
      user: {
        name: userInfo?.name,
        color: userInfo.color || "#000000",
      },
    },
    domAttributes: {
      editor: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  // Update presence when typing
  useEffect(() => {
    if (!provider?.awareness) return;

    let typingTimeout: NodeJS.Timeout;

    const updatePresence = () => {
      provider.awareness.setLocalStateField("presence", {
        isTyping: true,
        lastActive: Date.now(),
      });

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        provider.awareness.setLocalStateField("presence", {
          isTyping: false,
          lastActive: Date.now(),
        });
      }, 1000);
    };

    const handleUpdate = () => {
      updatePresence();
    };

    editor.onEditorContentChange(handleUpdate);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [editor, provider]);

  // Theme toggling logic
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const changeTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

  // Display active users
  const activeUsers = others
    .filter((other) => other.presence?.isTyping)
    .map((user) => user.info?.name)
    .join(", ");

  return (
    <div className="flex flex-col min-h-full bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          {activeUsers &&
            `${activeUsers} ${activeUsers.includes(",") ? "are" : "is"} typing...`}
        </div>
        <div className="flex items-center">
          <Avatars />
        </div>
      </div>
      <div className="flex-grow p-4 relative">
        <LiveCursors />
        <div className="relative">
          <BlockNoteView editor={editor} theme={theme} />
        </div>
      </div>
    </div>
  );
}