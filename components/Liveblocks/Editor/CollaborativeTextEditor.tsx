'use client';
import { baseUrl } from "@/app/api/urlconfig";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
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
provider: any;
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
const docRef = useRef<Y.Doc | null>(null);
useEffect(() => {
socket.on("connect_error", (error) => {
console.error("Socket connection error:", error);
});
socket.on("fileUpdated", (updatedData: { id: string; content: string }) => {
if (updatedData.id === fileId && docRef.current) {
try {
const content = JSON.parse(updatedData.content);
const fragment = docRef.current.getXmlFragment(fileId);
if (fragment && content) {
Y.applyUpdate(docRef.current, new Uint8Array(content));
}
} catch (error) {
console.error("Error applying remote update:", error);
}
}
});
const yDoc = new Y.Doc();
docRef.current = yDoc;
if (initialContent) {
try {
const content = JSON.parse(initialContent);
Y.applyUpdate(yDoc, new Uint8Array(content));
} catch (error) {
console.error("Error applying initial content:", error);
}
}
const yProvider = getYjsProviderForRoom(room);

setDoc(yDoc);
setProvider(yProvider);
return () => {
yDoc?.destroy();
yProvider?.destroy();
socket.off("fileUpdated");
socket.off("connect_error");
};
}, [room, fileId, initialContent]);
if (!doc || !provider) {
return <div>Loading editor...</div>;
}
return (
<BlockNote doc={provider.getYDoc()} provider={provider} fileId={fileId} />
);
}
function BlockNote({ doc, provider, fileId }: EditorProps) {
const currentUser = useSelf((me)=>me.info);
const editor = useCreateBlockNote({
collaboration: {
provider,
fragment: doc.getXmlFragment(fileId),
user: {
name: currentUser?.name || "Anonymous",
color: 'red',
},
},
domAttributes: {
editor: {
class: "min-h-[500px] p-4",
},
},
});
console.log('currentUser:',currentUser);

useEffect(() => {
if (!editor) return;
const handleUpdate = (update: Uint8Array, origin: any, doc: Y.Doc) => {
console.log('updating through socket');

const content = Y.encodeStateAsUpdate(doc);
const data = {
id: fileId,
content: JSON.stringify(Array.from(content)),
};
socket.emit("updateFile", data);
};
doc.on('update', handleUpdate);
return () => {
doc.off('update', handleUpdate);
};
}, [editor, doc, fileId]);

const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
e.preventDefault();
const current = {
x: Math.round(e.clientX),
y: Math.round(e.clientY),
};
setMyPresence({ cursor: current });
}, []);
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
className="relative"
>
<BlockNoteView editor={editor} />
</div>
);
}