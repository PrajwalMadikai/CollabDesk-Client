'use client';
import { baseUrl } from "@/app/api/urlconfig";
import { connectionIdToColor } from "@/lib/utils";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { Box, Text, ThemeIcon } from "@mantine/core";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { useMutation, useRoom, useSelf } from "../../../liveblocks.config";

const socket = io(baseUrl, {
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

type YjsProvider = ReturnType<typeof getYjsProviderForRoom>;

type EditorProps = {
  doc: Y.Doc;
  provider: YjsProvider;
  fileId: string;
};

interface CustomReactSuggestionItem extends DefaultReactSuggestionItem {
  render?: (props: { onClick: () => void }) => React.ReactNode;
  shortcut?: string;
}

interface Props {
  fileId: string;
  initialContent?: string;
}

export function CollaborativeEditor({ fileId, initialContent }: Props) {
  // ... (previous CollaborativeEditor code remains unchanged)
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<YjsProvider | null>(null);
  const providerRef = useRef<YjsProvider | null>(null);

  useEffect(() => {
    const setupCollaboration = async () => {
      const yProvider = getYjsProviderForRoom(room);
      const yDoc = yProvider.getYDoc();
      providerRef.current = yProvider;

      if (initialContent) {
        try {
          const content = JSON.parse(initialContent);
          Y.applyUpdate(yDoc, new Uint8Array(content));
        } catch (error) {
          console.error("Error applying initial content:", error);
        }
      }

      yProvider.awareness.on('update', () => {
        console.log('Awareness updated');
      });

      yProvider.on('sync', (isSynced: boolean) => {
        console.log('Provider sync status:', isSynced);
        if (isSynced) {
          const fragment = yDoc.getXmlFragment(fileId);
          fragment.observe(() => {
            console.log('Document updated from remote');
          });
        }
      });

      await yProvider.connect();
      
      setDoc(yDoc);
      setProvider(yProvider);
    };

    setupCollaboration();

    return () => {
      if (providerRef.current) {
        providerRef.current.disconnect();
        providerRef.current.destroy();
      }
      if (doc) {
        doc.destroy();
      }
    };
  }, [room, fileId, initialContent]);

  if (!doc || !provider) {
    return <div>Loading editor...</div>;
  }

  return <BlockNote doc={doc} provider={provider} fileId={fileId} />;
}

function BlockNote({ doc, provider, fileId }: EditorProps) {
  const router = useRouter();
  const currentUser = useSelf((me) => me.info);
  const { connectionId } = useSelf();
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<any>(null);
  const userPresence = useSelf();
  
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name: userPresence.presence.user?.name || currentUser?.name || "Anonymous",
        color: connectionIdToColor(connectionId),
      },
    },
    domAttributes: {
      editor: {
        class: "min-h-screen",
      },
    },
  });

  const { theme } = useTheme();
  let mode: "dark" | "light" = theme === 'light' ? 'light' : 'dark';

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): CustomReactSuggestionItem[] => {
    const items = [
      {
        title: "Heading 1",
        subtext: "Used for a top-level heading",
        icon: "H1",
        shortcut: "Ctrl-Alt-1",
        onSelect: () => editor.insertBlocks(
          [{ type: "heading", props: { level: 1 }, content: "Heading 1" }],
          editor.getTextCursorPosition().block,
          "after"
        ),
      },
      {
        title: "Heading 2",
        subtext: "Used for key sections",
        icon: "H2",
        shortcut: "Ctrl-Alt-2",
        onSelect: () => editor.insertBlocks(
          [{ type: "heading", props: { level: 2 }, content: "Heading 2" }],
          editor.getTextCursorPosition().block,
          "after"
        ),
      },
      {
        title: "Heading 3",
        subtext: "Used for subsections and group headings",
        icon: "H3",
        shortcut: "Ctrl-Alt-3",
        onSelect: () => editor.insertBlocks(
          [{ type: "heading", props: { level: 3 }, content: "Heading 3" }],
          editor.getTextCursorPosition().block,
          "after"
        ),
      },
      {
        title: "Numbered List",
        subtext: "Used to display a numbered list",
        icon: "1.",
        shortcut: "Ctrl-Shift-7",
        onSelect: () => editor.insertBlocks(
          [{ type: "numberedListItem", content: "Numbered List Item" }],
          editor.getTextCursorPosition().block,
          "after"
        ),
      },
      {
        title: "Bullet List",
        subtext: "Used to display an unordered list",
        icon: "•",
        shortcut: "Ctrl-Shift-8",
        onSelect: () => editor.insertBlocks(
          [{ type: "bulletListItem", content: "Bullet List Item" }],
          editor.getTextCursorPosition().block,
          "after"
        ),
      },
    ];
  
    return items.map((item) => ({
      ...item,
      onItemClick: item.onSelect,
      render: (props: { onClick: () => void }) => (
        <Box
          onClick={props.onClick}
          className="slash-menu-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#3a3a3a' : '#f5f5f5',
            },
          }}
        >
          <ThemeIcon
            size={32}
            radius="sm"
            style={{
              backgroundColor: mode === 'dark' ? '#4a4a4a' : '#e5e5e5',
              color: mode === 'dark' ? '#fff' : '#333',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {item.icon}
          </ThemeIcon>
          
          <div style={{ flex: 1 }}>
            <Text
              size="sm"
              fw={500}
              color={mode === 'dark' ? 'white' : 'dark'}
            >
              {item.title}
            </Text>
            <Text
              size="xs"
              color={mode === 'dark' ? 'gray.4' : 'gray.6'}
            >
              {item.subtext}
            </Text>
          </div>
          
          {item.shortcut && (
            <Text
              size="xs"
              color={mode === 'dark' ? 'gray.5' : 'gray.6'}
              style={{ opacity: 0.8 }}
            >
              {item.shortcut}
            </Text>
          )}
        </Box>
      ),
    }));
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bn-suggestion-menu {
        background: ${mode === 'dark' ? '#2d2d2d' : '#ffffff'} !important;
        border: 1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'} !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, ${mode === 'dark' ? '0.3' : '0.1'}) !important;
        max-height: 400px !important;
        overflow-y: auto !important;
        width: 380px !important;
        padding: 4px !important;
      }

      .bn-suggestion-menu::-webkit-scrollbar {
        width: 6px !important;
      }

      .bn-suggestion-menu::-webkit-scrollbar-track {
        background: ${mode === 'dark' ? '#2d2d2d' : '#f5f5f5'} !important;
        border-radius: 3px !important;
      }

      .bn-suggestion-menu::-webkit-scrollbar-thumb {
        background: ${mode === 'dark' ? '#505050' : '#c1c1c1'} !important;
        border-radius: 3px !important;
      }

      .bn-suggestion-menu::-webkit-scrollbar-thumb:hover {
        background: ${mode === 'dark' ? '#606060' : '#a1a1a1'} !important;
      }

      .slash-menu-item {
        margin: 2px 0 !important;
        border-radius: 6px !important;
        transition: background-color 0.2s ease !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [mode]);

  useEffect(() => {
    if (!editor || !doc) return;
    
    editorRef.current = editor;

    provider.on('sync', (isSynced: boolean) => {
      setIsConnected(isSynced);
    });

    const fragment = doc.getXmlFragment(fileId);
    
    const handleLocalUpdate = () => {
      const content = Y.encodeStateAsUpdate(doc);
      const data = {
        id: fileId,
        content: JSON.stringify(Array.from(content)),
      };
      console.log("Sending update to server");
      socket.emit("updateFile", data);
    };

    fragment.observe(() => {
      console.log('Document fragment remote updated ');
      if (editorRef.current) {
        editorRef.current.updateContent();
      }
    });

    doc.on("update", handleLocalUpdate);

    socket.on("fileUpdated", (updatedData: { id: string; content: string }) => {
      if (updatedData.id === fileId) {
        try {
          const content = JSON.parse(updatedData.content);
          Y.applyUpdate(doc, new Uint8Array(content));
        } catch (error) {
          console.error("Error applying remote update:", error);
        }
      }
    });

    return () => {
      doc.off("update", handleLocalUpdate);
      socket.off("fileUpdated");
      fragment.unobserve(() => {});
    };
  }, [editor, doc, fileId, provider]);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY), 
      };
      setMyPresence({ cursor: current });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="w-full h-full"
    >
      <BlockNoteView editor={editor} theme={mode}>
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async query =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
}
