"use client";
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/toggleTheme";
import { useFileEditor } from "@/hooks/useFileEditorHook";
import { Button, Card, CardContent } from "@mui/material";
import { Copy, Image, Upload, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import ReactCrop, { PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function FileEditor() {
  const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
  const {
    fileData,
    loading,
    showPublishMessage,
    setShowPublishMessage,
    handleImageUpload,
    handlePublishClick,
    handleCopyLink,
    isUploadOpen,
    setIsUploadOpen,
  } = useFileEditor(fileId);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<PixelCrop>({
    unit: "px", 
    width: 30,
    height: 30,
    x: 0,
    y: 0,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setImageSrc(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = async (): Promise<File | null> => {
    if (!imgRef.current) return null;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    });
  };

  const handleCroppedImageUpload = async () => {
    const croppedImageFile = await getCroppedImage();
    if (croppedImageFile) {
      const syntheticEvent = {
        target: {
          files: [croppedImageFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleImageUpload(syntheticEvent);
    }
  };

  const makePublish = async () => {
    await handlePublishClick();
    setShowPublishMessage(true);
  };

  const handleOpenUpload = () => {
    setImageSrc(null);
    setIsUploadOpen(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
  };

  const handleCancelCrop = () => {
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="relative">
          {fileData?.published ? (
            <button
              onClick={() => setShowPublishMessage((prev) => !prev)}
              className="bg-primary rounded-[2px] text-primary-foreground px-3 py-1 text-sm"
            >
              Published
            </button>
          ) : (
            <button
              onClick={() => makePublish()}
              className="bg-black rounded-[2px] text-white px-3 py-1 text-sm"
            >
              Publish
            </button>
          )}

          {showPublishMessage && fileData?.url && (
            <div className="absolute top-full left-0 mt-2 bg-white text-black p-4 rounded shadow-lg z-50 w-[270px]">
              <p className="text-sm mb-2">Your document has been published successfully!</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={fileData.url}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 rounded text-sm focus:outline-none"
                />
                <button
                  className="bg-black text-white p-2 rounded transition-colors"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <button
                className="mt-4 bg-black text-white px-2 py-1 rounded w-full hover:bg-gray-900 transition-colors"
                onClick={() => setShowPublishMessage(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>

      <div className="relative h-60 ">
        {fileData?.coverImage ? (
          <>
            <img
              src={fileData.coverImage}
              alt="Cover"
              className="w-full h-full object-center object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                className="!text-gray-400 h-4"
                onClick={handleOpenUpload}
              >
                <Image className="h-4 w-4 mr-2 text-gray-400" />
                Change cover
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full relative bg-gray-900">
            <button
              className="absolute top-[160px] left-2 text-gray-400 text-[11px] font-semibold uppercase flex items-center gap-1"
              onClick={handleOpenUpload}
            >
              <Upload className="h-4 w-4" />
              Add cover
            </button>
          </div>
        )}

        {isUploadOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <Card className="w-[600px] relative ">
              <Button
                className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
                onClick={handleCloseUpload}
              >
                <X className="h-6 w-6" />
              </Button>
              <CardContent className="p-4 bg-gray-900">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {!imageSrc ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        ref={fileInputRef}
                        onChange={onImageSelect}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-white" />
                        <p className="mt-2 text-white">Click or drag file to this area to upload</p>
                      </label>
                    </>
                  ) : (
                    <>
                      <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        aspect={16 / 9}
                      >
                        <img ref={imgRef} src={imageSrc} alt="Crop preview" />
                      </ReactCrop>
                      <div className="mt-4 flex justify-between">
                        <Button 
                          onClick={handleCancelCrop}
                          className="mr-2"
                        >
                          Select Different Image
                        </Button>
                        <Button
                          onClick={handleCroppedImageUpload}
                          color="primary"
                        >
                          Upload Cropped Image
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CollaborativeRoom roomId={fileId} fallback={<LoadingSpinner />}>
        <CollaborativeEditor fileId={fileId} initialContent={fileData?.content} edit={true} />
      </CollaborativeRoom>
    </div>
  );
}