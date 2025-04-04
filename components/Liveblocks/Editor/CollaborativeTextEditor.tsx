'use client';
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { Box, Text, ThemeIcon } from "@mantine/core";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { baseUrl } from "../../../app/api/urlconfig";
import { connectionIdToColor } from "../../../lib/utils";
import { useMutation, useRoom, useSelf } from "../../../liveblocks.config";

export const socket = io(baseUrl, {
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
  edit:boolean
};
interface CustomReactSuggestionItem extends DefaultReactSuggestionItem {
  render?: (props: { onClick: () => void }) => React.ReactNode;
}
interface Props {
  fileId: string;
  initialContent?: string;
  edit:boolean
}


export function CollaborativeEditor({ fileId, initialContent,edit }: Props) {
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

  return <BlockNote doc={doc} provider={provider} fileId={fileId} edit={edit} />;
}
type BlockNoteEditorRef = {
  document: any;
  updateContent: () => void;
};
function BlockNote({ doc, provider, fileId,edit }: EditorProps) {

  const currentUser = useSelf((me) => me.info);
  const { connectionId } = useSelf();
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<BlockNoteEditorRef|null>(null);
  const userPresence = useSelf();
  
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name:userPresence.presence.user?.name || currentUser?.name || "Anonymous",
        color: connectionIdToColor(connectionId),
      },
    },
    domAttributes: {
      editor: {
        class: "min-h-screen ",
         
      },
    },
  });

   const {theme}=useTheme()

   let mode: "dark" | "light" = "dark";
   if(theme=='light')
   {
    mode='light'
   }

  useEffect(() => {
    if (!editor || !doc) return;
    
    editorRef.current = editor as unknown as BlockNoteEditorRef;

    provider.on('sync', (isSynced: boolean) => {
      setIsConnected(isSynced);
    });
    console.log('connected:',isConnected);
    

    const fragment = doc.getXmlFragment(fileId);
    
    const handleLocalUpdate = () => {
      const content = Y.encodeStateAsUpdate(doc);
      const data = {
        id: fileId,
        content: JSON.stringify(Array.from(content)),
      };
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
  ): CustomReactSuggestionItem[] => 
    getDefaultReactSlashMenuItems(editor).map((item) => ({
      ...item,
      render: (props: { onClick: () => void }) => (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px", // Increased padding for better spacing
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            backgroundColor: mode === 'dark' ? '#2c2c2c' : '#ffffff',
            "&:hover": {
              backgroundColor: mode === 'dark' ? '#3c3c3c' : '#f0f0f0',
            },
          }}
          onClick={props.onClick}
          className="slash-menu-item"
        >
          {/* Icon/Emoji */}
          {item.icon && (
            <ThemeIcon
              size="sm"
              radius="xl"
              style={{
                marginRight: "12px", // Space between icon and text
                backgroundColor: mode === 'dark' ? '#3c3c3c' : '#e0e0e0',
                color: mode === 'dark' ? '#ffffff' : '#333333',
              }}
            >
              {item.icon}
            </ThemeIcon>
          )}
  
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <Text
              size="md" // Slightly larger font size
              fw={600} // Bold font weight
              color={mode === 'dark' ? 'white' : 'black'}
              style={{
                marginBottom: "2px", // Space between title and subtext
              }}
            >
              {item.title}
            </Text>
            {item.subtext && (
              <Text
                size="xs"
                color={mode === 'dark' ? 'gray.5' : 'dimmed'}
                style={{
                  lineHeight: 1.4, // Improved line height for readability
                }}
              >
                {item.subtext}
              </Text>
            )}
          </div>
        </Box>
      ),
    }));

    useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        /* Slash Menu Container */
        .bn-suggestion-menu {
          max-height: 350px !important; /* Increased height */
          overflow-y: auto !important;
          border-radius: 12px !important; /* Rounded corners */
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important; /* Softer shadow */
          border: 1px solid ${mode === 'dark' ? '#444' : '#e0e0e0'} !important;
          background-color: ${mode === 'dark' ? '#2c2c2c' : '#ffffff'} !important;
          width: 320px !important; /* Fixed width for consistency */
          z-index: 9999; /* Ensure it appears above other elements */
        }
    
        /* Individual Menu Items */
        .slash-menu-item {
          display: flex;
          align-items: center;
          padding: 10px 16px !important;
          border-bottom: 1px solid ${mode === 'dark' ? '#3c3c3c' : '#f0f0f0'} !important;
        }
    
        /* Hover Effect */
        .slash-menu-item:hover {
          background-color: ${mode === 'dark' ? '#3c3c3c' : '#f0f0f0'} !important;
        }
    
        /* Last Item Border Removal */
        .slash-menu-item:last-child {
          border-bottom: none !important;
        }
    
        /* Scrollbar Styling */
        .bn-suggestion-menu::-webkit-scrollbar {
          width: 8px;
        }
        .bn-suggestion-menu::-webkit-scrollbar-thumb {
          background: ${mode === 'dark' ? '#555' : '#ccc'};
          border-radius: 4px;
        }
        .bn-suggestion-menu::-webkit-scrollbar-track {
          background: ${mode === 'dark' ? '#2c2c2c' : '#f9f9f9'};
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }, [mode]);


  if (!editor) {
    return null;
  }

  return (
       
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="w-full h-full"
       >
        <BlockNoteView editor={editor} theme={mode} editable={edit}>
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async query =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
        </BlockNoteView>
    </div>
  );
}