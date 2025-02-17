'use client';
import { baseUrl } from "@/app/api/urlconfig";
import { connectionIdToColor } from "@/lib/utils";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { useRoom, useSelf } from "../../../liveblocks.config";

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

      // Initialize with content if provided
      if (initialContent) {
        try {
          const content = JSON.parse(initialContent);
          Y.applyUpdate(yDoc, new Uint8Array(content));
        } catch (error) {
          console.error("Error applying initial content:", error);
        }
      }

      // Set up awareness update handling
      yProvider.awareness.on('update', () => {
        console.log('Awareness updated');
      });

      // Listen for provider syncing
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

      // Connect the provider
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
  const currentUser = useSelf((me) => me.info);
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<any>(null);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name: currentUser?.name || "Anonymous",
        color: connectionIdToColor() || "#000000",
      },
    },
    domAttributes: {
      editor: {
        class: "min-h-[500px] p-4",
      },
    },
  });

  useEffect(() => {
    if (!editor || !doc) return;
    
    editorRef.current = editor;

    // Monitor provider connection status
    provider.on('sync', (isSynced: boolean) => {
      setIsConnected(isSynced);
      console.log('Provider sync status:', isSynced);
    });

    // Set up document update handling
    const fragment = doc.getXmlFragment(fileId);
    
    // Handle local updates
    const handleLocalUpdate = () => {
      const content = Y.encodeStateAsUpdate(doc);
      const data = {
        id: fileId,
        content: JSON.stringify(Array.from(content)),
      };
      console.log("Sending update to server");
      socket.emit("updateFile", data);
    };

    // Handle remote updates
    fragment.observe(() => {
      console.log('Document fragment updated');
      if (editorRef.current) {
        // Force editor to sync with latest document state
        editorRef.current.updateContent();
      }
    });

    doc.on("update", handleLocalUpdate);

    // Handle socket updates
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
      // provider.off('sync');   uncomment if not working
    };
  }, [editor, doc, fileId, provider]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {!isConnected && (
        <div className="absolute top-0 right-0 bg-yellow-100 p-2 rounded-md text-sm">
          Connecting...
        </div>
      )}
      <BlockNoteView editor={editor} />
    </div>
  );
}