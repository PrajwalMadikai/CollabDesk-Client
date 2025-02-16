"use client";

import { baseUrl } from "@/app/api/urlconfig";
import { connectionIdToColor } from "@/lib/utils";
import {
  BlockNoteViewRaw,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import * as Y from "yjs";
import {
  useMutation,
  useRoom,
  useSelf,
} from "../../../liveblocks.config";

const socket=io(baseUrl,{
  withCredentials:true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
})


type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  fileId: string;
};

interface Props {
  fileId: string;
}

export function CollaborativeEditor({ fileId }: Props) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);

  useEffect(() => {

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    socket.on('fileUpdated', (updatedData: { id: string, content: string }) => {
      if (updatedData.id === fileId && doc) {
        try {
          const content = JSON.parse(updatedData.content);
          const fragment = doc.getXmlFragment(fileId);
          if (fragment && content) {
            // Update the document without triggering a new socket event
            Y.applyUpdate(doc, new Uint8Array(content));
          }
        } catch (error) {
          console.error('Error applying remote update:', error);
        }
      }
    });
  


    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return <div>Loading editor...</div>;
  }

  return (
    <BlockNote
      doc={doc}
      provider={provider}
      fileId={fileId}
    />
  );
}

function BlockNote({ doc, provider, fileId }: EditorProps) {
  const currentUser = useSelf();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name: currentUser.info?.name || "Anonymous",
        color: connectionIdToColor(currentUser.connectionId),
      },
    },
    domAttributes: {
      editor: {
        class: "min-h-[500px] p-4",
      },
    },
  });
  const debouncedUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdate > 500) { // Debounce threshold of 500ms
      const data = {
        id: fileId,
        content: JSON.stringify(editor.document)
      };
      socket?.emit("updateFile", data);
      setLastUpdate(now);
    }
  }, [fileId, editor, lastUpdate]);


 
  useEffect(() => {
    if (!editor) return;

    const updateHandler = (update: Uint8Array) => {
      debouncedUpdate();
    };

    doc.on('update', updateHandler);

    return () => {
      doc.off('update', updateHandler);
    };
  }, [editor, doc, debouncedUpdate]);


  // const updateStorage = useMutation(
  //   ({ storage }, content: string) => {
  //     if (!isStorageLoaded) return;
  //     storage.set(fileId, content);
  //   },
  //   [isStorageLoaded]
  // );

  // useEffect(() => {
  //   setIsStorageLoaded(true);
    
  //   const syncDocument = () => {
  //     if (editor && isStorageLoaded) {
  //       const content = JSON.stringify(editor.document);
  //       updateStorage(content);
  //     }
  //   };

  //   if (editor) {
  //     editor.onEditorContentChange(syncDocument);
  //   }

  //   return () => {
  //     if (editor) {
  //       editor.onEditorContentChange(() => {});
  //     }
  //   };
  // }, [editor, updateStorage, isStorageLoaded]);

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

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => {
      setMyPresence({ cursor: null });
    },
    []
  );

  if (!editor) {
    return null;
  }

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative"
    >
      <BlockNoteViewRaw
        editor={editor}
      />
    </div>
  );
}