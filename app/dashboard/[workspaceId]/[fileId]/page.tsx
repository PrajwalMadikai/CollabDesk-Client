"use client";
import { CollaborativeEditor } from "@/components/Liveblocks/CollaborativeTextEditor";

 

export default function FileEditor() {
  // const { fileId } = useParams();
  // const [fileContent, setFileContent] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const user = useSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   if (fileId) {
  //     fetchFileContent();
  //   }
  // }, [fileId]);

  // const fetchFileContent = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await API.get(`/file/content/${fileId}`, { withCredentials: true });
  //     setFileContent(response.data.content);
  //   } catch (error) {
  //     console.error("Error fetching file content:", error);
  //     setFileContent("Failed to load file content.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSave = async (content: string) => {
  //   try {
  //     await API.put(`/file/content/${fileId}`, { content }, { withCredentials: true });
  //   } catch (error) {
  //     console.error("Error saving file content:", error);
  //   }
  // };

  // if (!fileId || isLoading) return <div>Loading...</div>;

  return (
    <CollaborativeEditor/>
  );
}
