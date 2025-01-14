import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
    onFilesSelected: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles(acceptedFiles);
        onFilesSelected(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.xlsx',
        onDrop,
    });

    return (
        <div {...getRootProps()} className="upload-zone" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Drag & drop Excel files here, or click to select files</p>
            {uploadedFiles.length > 0 && (
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUpload;