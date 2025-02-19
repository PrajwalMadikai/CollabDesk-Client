'use client';
import { baseUrl } from "@/app/api/urlconfig";
import { connectionIdToColor } from "@/lib/utils";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { Box, Group, Text, ThemeIcon } from "@mantine/core";
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

interface Props {
  fileId: string;
  initialContent?: string;
}

export function CollaborativeEditor({ fileId, initialContent }: Props) {
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
          // Force a re-render of the document when synced
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
  const router=useRouter()
  const currentUser = useSelf((me) => me.info);
  const { connectionId } = useSelf();
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<any>(null);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name: currentUser?.name || "Anonymous",
        color: connectionIdToColor(connectionId),
      },
    },
    domAttributes: {
      editor: {
        class: "min-h-screen ",
         
      },
    },
  });

   

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

  // Force editor to sync with latest document state
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
      // provider.off('sync',);  
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

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor).map((item) => ({
      ...item,
      render: (props: { onClick: () => void }) => (
        <Box
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f0f0f0",   
          },
        }}
          onClick={props.onClick}
        >
          <Group gap="sm">
            {item.icon && (
              <ThemeIcon size="sm" radius="xl">
                {item.icon}
              </ThemeIcon>
            )}
            <div>
              <Text size="sm" fw={500}>
                {item.title}
              </Text>
              {item.subtext && (
                <Text size="xs" color="dimmed">
                  {item.subtext}
                </Text>
              )}
            </div>
          </Group>
        </Box>
      ),
    })),
  ];

  if (!editor) {
    return null;
  }

  return (
       
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="w-full h-full"
       >
      <BlockNoteView editor={editor}>
        <SuggestionMenuController triggerCharacter={'/'}
         getItems={async query=>
          filterSuggestionItems(getCustomSlashMenuItems(editor),query)
         }
        /> 
      </BlockNoteView>
    </div>
  );
}