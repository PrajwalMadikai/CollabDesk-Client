"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useOthers, useRoom, useSelf } from "@liveblocks/react/suspense";
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

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  room: any;
};
interface CollaborativeEditorProps {
  roomId: string;
}
export const CollaborativeEditor: React.FC<CollaborativeEditorProps> =()=> {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const setupDocument = async () => {
      const yDoc = new Y.Doc();
      const yProvider = new LiveblocksYjsProvider(room, yDoc);
      try {
        // Retrieve the room storage
        const { root } = await room.getStorage();
  
        // Initialize the document store if it doesn't exist
        const rootMap = yDoc.getMap("document-store");
        if (!rootMap.get("content")) {
          const initialContent = new Y.XmlFragment();
          rootMap.set("content", initialContent);
        }
  
        setDoc(yDoc);
        setProvider(yProvider);
        setIsStorageReady(true);
      } catch (error) {
        console.error("Error setting up document:", error);
      }
    };
  
    setupDocument();
  
    return () => {
      doc?.destroy();
      provider?.destroy();
    };
  }, [room]);
  if (!doc || !provider || !isStorageReady) {
    return <LoadingSpinner />;
  }

  return <BlockNote doc={doc} provider={provider} room={room} />;
}

function BlockNote({ doc, provider, room }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const others = useOthers();

  if (!userInfo) return <LoadingSpinner />;

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getMap("document-store").get("content") as Y.XmlFragment,
      user: {
        name: userInfo?.name,
        color: userInfo.color || "#000000",
      },
    },
    domAttributes: {
      editor: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !provider?.awareness) {
      return;
    }

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
      
      // Sync the content with room storage
      const content = editor.topLevelBlocks;
      doc.getMap("document-store").set("content", content);
    };

    editor.onEditorContentChange(handleUpdate);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [editor, provider, doc, room]);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const changeTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

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
        <BlockNoteView
          editor={editor}
          theme={theme}
          slashMenu={true}
          className="slash-menu-container" // Add this class for custom styling
        />
      </div>
    </div>
  );
}