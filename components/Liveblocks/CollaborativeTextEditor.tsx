"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";
import { Avatars } from "./avatar/Avatar";
import { LiveCursors } from "./LiveCursor";

const Loader = () => <div className="flex justify-center items-center h-full text-white">Loading...</div>;

export function CollaborativeEditor() {
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
    return <Loader />;
  }

  return <BlockNote doc={doc} provider={provider} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

function BlockNote({ doc, provider }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  if (!userInfo) return <Loader />;

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: userInfo.color || "#000000"
      },
    },
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const changeTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

  return (
    <div className="flex flex-col  h-full bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Button
          className="bg-transparent text-white hover:bg-gray-800 p-2 rounded-md"
          variant="subtle"
          onClick={changeTheme}
          aria-label="Switch Theme"
        >
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </Button>
        <Avatars />
      </div>
      <div className="flex-grow bg-gray-800 p-4 rounded-md relative">
        <LiveCursors/>
        <BlockNoteView editor={editor} className="h-full" theme={theme} />
      </div>
    </div>
  );
}