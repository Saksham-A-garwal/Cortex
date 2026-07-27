import { useState, useRef, useEffect } from "react";
import { Paperclip, FileText, X, File } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const ChatInput = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (text === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    };
  }, [uploadedFileUrl]);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;

    onSubmit(text);
    setText("");
    
    // Clear the file chip after sending the message!
    setUploadedFile(null);
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
      setUploadedFileUrl(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent opening the preview when clicking X
    setUploadedFile(null);
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
      setUploadedFileUrl(null);
    }
  };

  const handleUploadDocument = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      
      // Store the file locally for preview
      setUploadedFile(file);
      setUploadedFileUrl(URL.createObjectURL(file));
      
      toast.success(`${response.data.document.filename} is ready for document questions.`, {
        style: { background: "#374151", color: "#fff" },
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || "Document upload failed.", {
        style: { background: "#374151", color: "#fff" },
      });
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Reset the file input
    }
  };

  return (
    <>
      <div className="p-4 w-full bg-gray-800">
        <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-600 rounded-3xl flex flex-col focus-within:border-gray-400 transition-colors shadow-sm">
          
          {/* 🚀 FILE UPLOAD CHIP */}
          {uploadedFile && (
            <div className="pt-4 px-4 pb-0">
              <div 
                onClick={() => setIsPreviewOpen(true)}
                className="relative group flex items-center gap-3 w-64 p-2 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors"
              >
                {/* Red PDF Icon Box */}
                <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg shrink-0">
                  <FileText className="text-white" size={20} />
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-gray-200 truncate pr-4">
                    {uploadedFile.name}
                  </span>
                  <span className="text-xs text-gray-400 uppercase font-medium">
                    {uploadedFile.name.split('.').pop()}
                  </span>
                </div>

                {/* Remove Button (X) */}
                <button
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full p-1 shadow-md transition-colors"
                  title="Remove file"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="flex items-end p-2 pl-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              onChange={handleUploadDocument}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploading}
              title="Upload PDF or TXT"
              aria-label="Upload PDF or TXT"
              className="mb-1 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Paperclip size={20} className={isUploading ? "animate-pulse" : ""} />
            </button>
            
            <textarea
              ref={textareaRef}
              placeholder="Ask anything..."
              className="w-full max-h-48 min-h-[44px] bg-transparent text-white placeholder-gray-400 p-2.5 focus:outline-none resize-none overflow-y-auto no-scrollbar rounded-xl leading-relaxed"
              rows={1}
              onInput={handleInput}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              value={text}
              disabled={isLoading}
            />

            <button
              className={`p-2.5 rounded-full transition-colors mb-1 mr-1 ${
                isLoading || isUploading || !text.trim()
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-gray-200 shadow-sm"
              }`}
              onClick={handleSend}
              disabled={isLoading || isUploading || !text.trim()}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 PDF PREVIEW MODAL */}
      {isPreviewOpen && uploadedFileUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-[#202123] w-full max-w-6xl h-full rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-gray-700">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-[#2A2B32]">
              <div className="flex items-center gap-3">
                <FileText className="text-red-400" size={24} />
                <h3 className="text-gray-200 font-semibold text-lg">{uploadedFile.name}</h3>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Iframe) */}
            <div className="flex-1 w-full bg-[#343541]">
              <iframe 
                src={uploadedFileUrl} 
                className="w-full h-full border-none" 
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;
