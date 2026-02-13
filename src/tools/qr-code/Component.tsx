import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

export const QrCodeComponent: React.FC = () => {
  const [input, setInput] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  useToolAction(setInput);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas from the SVG
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert SVG to blob URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Load image and draw to canvas
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      // Download canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'qrcode.png';
          link.click();
          URL.revokeObjectURL(downloadUrl);
        }
      });

      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const errorLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Good for clean environments' },
    { value: 'M', label: 'Medium (15%)', description: 'Balanced option' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Better error correction' },
    { value: 'H', label: 'High (30%)', description: 'Maximum reliability' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Input */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Text or URL
        </label>
        <input
          type="text"
          className="input-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or URL to encode..."
          style={{ width: '100%', fontSize: '14px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {/* QR Code Preview */}
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              QR CODE PREVIEW
            </div>
            <button
              onClick={handleDownload}
              className="btn-macos"
              disabled={!input}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 10px',
              }}
            >
              <Download size={14} />
              Download PNG
            </button>
          </div>
          <div
            ref={qrRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              minHeight: '300px',
            }}
          >
            {input ? (
              <QRCodeSVG
                value={input}
                size={size}
                level={errorLevel}
                includeMargin={true}
              />
            ) : (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
                Enter text to generate QR code
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            SETTINGS
          </div>

          {/* Size Slider */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              Size: {size}px
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          {/* Error Correction Level */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              Error Correction Level
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {errorLevels.map((level) => (
                <label
                  key={level.value}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: errorLevel === level.value ? 'var(--bg-secondary)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="errorLevel"
                    value={level.value}
                    checked={errorLevel === level.value}
                    onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    style={{ marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {level.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          ABOUT QR CODES
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          QR codes can store up to 4,296 alphanumeric characters. Higher error correction levels allow the QR code to be read even if partially damaged or obscured, but require more data capacity.
        </div>
      </div>
    </div>
  );
};
