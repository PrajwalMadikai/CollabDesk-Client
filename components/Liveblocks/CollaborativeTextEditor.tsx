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
import styles from "./CollaborativeTextEditor.module.css";
import { Avatars } from "./avatar/Avatar";

const Loader = () => <div className={styles.loader}>Loading...</div>;

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
        name: userInfo?.name ,
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
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <Button
          className={styles.button}
          variant="subtle"
          onClick={changeTheme}
          aria-label="Switch Theme"
        >
          {theme === "dark" ? (
            <SunIcon style={{ width: "18px" }} />
          ) : (
            <MoonIcon style={{ width: "18px" }} />
          )}
        </Button>
        <Avatars />
      </div>
      <div className={styles.editorPanel}>
        <BlockNoteView
          editor={editor}
          className={styles.editorContainer}
          theme={theme}
        />
      </div>
    </div>
  );
}
