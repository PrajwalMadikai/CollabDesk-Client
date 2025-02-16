"use client";

import { connectionIdToColor } from "@/lib/utils";
import {
  BlockNoteViewRaw,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import {
  useMutation,
  useRoom,
  useSelf
} from "../../../liveblocks.config";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  fileId: string;
};

interface Props {
  fileId: string;
}

export function CollaborativeEditor({ fileId }: Props) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
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
    return null;
  }

  return (
    <BlockNote doc={doc} provider={provider} fileId={fileId} />
  );
}

function BlockNote({ doc, provider, fileId }: EditorProps) {
  const currentUser = useSelf();

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(fileId),
      user: {
        name: currentUser.info?.name || "Anonymous",
        color: connectionIdToColor(currentUser.connectionId),
      },
    },
  });

  const updateStorage = useMutation(({ storage }, content: string) => {
    // Storage update logic if needed
  }, []);

  useEffect(() => {
    const syncDocument = () => {
      const content = JSON.stringify(editor.document);
      updateStorage(content);
    };

    editor.onEditorContentChange(syncDocument);

    return () => {
      editor.onEditorContentChange(() => {});
    };
  }, [editor, updateStorage]);

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

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="w-full h-full"
    >
      <BlockNoteViewRaw 
        editor={editor}
        theme="dark"
      />
    </div>
  );
}