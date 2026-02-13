import React, { useState, useRef } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Upload, X } from 'lucide-react';

export const ImageBase64Component: React.FC = () => {
  const [imageData, setImageData] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [base64Size, setBase64Size] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageData(result);
      setImagePreview(result);
      setBase64Size(result.length);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setImageData('');
    setImagePreview('');
    setFileName('');
    setFileSize(0);
    setBase64Size(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Drop Zone */}
      {!imageData && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-primary)'}`,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: dragActive ? 'var(--bg-secondary)' : 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            padding: 'var(--spacing-xl)',
            minHeight: '300px',
          }}
        >
          <Upload
            size={48}
            style={{
              color: dragActive ? 'var(--accent)' : 'var(--text-tertiary)',
              marginBottom: 'var(--spacing-md)',
            }}
          />
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
            {dragActive ? 'Drop image here' : 'Drop an image or click to browse'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            Supports PNG, JPEG, GIF, WebP, SVG, and more
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Preview and Output */}
      {imageData && (
        <>
          {/* Preview Card */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                IMAGE PREVIEW
              </div>
              <button
                onClick={handleClear}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
                Clear
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                minHeight: '200px',
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-sm)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div>
                <strong>File:</strong> {fileName}
              </div>
              <div>
                <strong>Size:</strong> {formatBytes(fileSize)}
              </div>
              <div>
                <strong>Base64 Size:</strong> {formatBytes(base64Size)}
              </div>
            </div>
          </div>

          {/* Base64 Output */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)', flex: 1, minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                BASE64 DATA URL
              </div>
              <CopyButton text={imageData} />
            </div>
            <textarea
              className="textarea-macos"
              value={imageData}
              readOnly
              style={{
                flex: 1,
                minHeight: '150px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                resize: 'vertical',
              }}
            />
            <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              This data URL can be used directly in HTML img src attributes or CSS
            </div>
          </div>
        </>
      )}
    </div>
  );
};
