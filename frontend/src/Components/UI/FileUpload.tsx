import React, { useRef, useState } from "react";
import "../../styles/file_upload.css";
import { UploadIcon } from "lucide-react";

const FileUpload = ({ maxFiles = 5, accept = "*", onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.filter(
      (file) => !files.some((f) => f.name === file.name && f.size === file.size)
    );

    const totalFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(totalFiles);
    if (onFilesChange) onFilesChange(totalFiles);
    e.target.value = "";
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container">
      <div className="custom-file-button" onClick={triggerFileSelect}>
      <UploadIcon size={16} className="upload_icon"/>  Upload Files
      </div>
      <input
        type="file"
        multiple
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // hide the default input
      />
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index}>
            {file.name}
            <span className="remove-btn" onClick={() => removeFile(index)}>
              ×
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
