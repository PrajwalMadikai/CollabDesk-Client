"use client";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Json, LiveList } from "@liveblocks/client";
import { useMutation, useStorage } from "@liveblocks/react";
import { useCallback, useEffect } from "react";

type Presence = {
  cursor: { x: number; y: number } | null;
  selection?: any;
  isTyping: boolean;
  lastActive: number;
};

// Define a serializable object type
type SerializableObject = {
  [key: string]: Json;
};

// Define the BlockContent type
type BlockContent = Array<{
  type: "text";
  text: string;
  styles: SerializableObject; // Ensure styles are serializable
}>;

// Define the BlockProps type
type BlockProps = {
  textAlignment: "left" | "center" | "right" | "justify";
  backgroundColor: string;
  textColor: string;
};

// Define the Block type
type Block = {
  id: string;
  type: "paragraph";
  content: BlockContent; // Ensure content is a mutable array
  props: BlockProps;
  children: Block[]; // Ensure children are mutable blocks
};

// Default initial block
const defaultBlock: Block = {
  id: crypto.randomUUID(), // Generate a unique ID for the block
  type: "paragraph",
  content: [
    {
      type: "text",
      text: "",
      styles: {}, // Ensure styles are serializable
    },
  ],
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
  },
  children: [], // Add an empty array for nested blocks
};

export const CollaborativeEditor: React.FC<{ roomId: string }> = ({ roomId }) => {
  // Get the LiveList from storage
  const documentList = useStorage((root) => root.document);
  console.log('data:',documentList);
  

  // Initialize the editor with default content
  const editor = useCreateBlockNote({
    domAttributes: {
      editor: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none text-white",
      },
    },
    initialContent: [defaultBlock],
  });

  // Update document mutation
  const updateDocument = useMutation(({ storage }, newContent: Block[]) => {
    const documentRef = storage.get("document");
    if (documentRef instanceof LiveList) {
      documentRef.clear();
      // Convert blocks to mutable format before storing
      const mutableBlocks = newContent.map((block) => ({
        ...block,
        id: block.id || crypto.randomUUID(), // Ensure `id` exists
        content: [...(block.content || [])], // Ensure `content` is mutable
        props: { ...block.props }, // Ensure `props` is mutable
        children: [...(block.children || [])], // Ensure `children` is mutable
      })) as Block[];
      mutableBlocks.forEach((block) => documentRef.push(block));
    }
  }, []);

  // Sync from LiveList to editor
  useEffect(() => {
    if (documentList instanceof LiveList) {
      const blocks = documentList.toArray();
      if (blocks.length > 0) {
        // Ensure each block has an `id` and `children` property
        const validBlocks = blocks.map((block) => ({
          ...block,
          id: block.id || crypto.randomUUID(), // Ensure `id` exists
          content: [...(block.content || [])], // Ensure `content` is mutable
          props: { ...block.props }, // Ensure `props` is mutable
          children: [...(block.children || [])], // Ensure `children` is mutable
        })) as Block[];
        editor.replaceBlocks(editor.topLevelBlocks, validBlocks);
      }
    }
  }, [documentList, editor]);

  // Handle content changes
  const handleContentChange = useCallback(() => {
    const newContent = editor.topLevelBlocks;
    if (Array.isArray(newContent) && newContent.length > 0) {
      updateDocument(newContent as Block[]);
    }
  }, [editor, updateDocument]);

  // Set up content change listener
  useEffect(() => {
    editor.onEditorContentChange(handleContentChange);
    return () => {
      // Remove listener using the same callback reference
      editor.onEditorContentChange(handleContentChange);
    };
  }, [editor, handleContentChange]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <BlockNoteView editor={editor} />
    </div>
  );
};