import { useEffect, useState } from 'react';
import { detectFormat, type FormatDetection } from '@/lib/format-detector';

export function useAutoDetect() {
  const [detection, setDetection] = useState<FormatDetection | null>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const pastedText = clipboardData.getData('text');
      if (!pastedText) return;

      const detected = detectFormat(pastedText);
      if (detected && detected.confidence >= 0.7) {
        setDetection(detected);

        // Auto-clear after 10 seconds
        setTimeout(() => {
          setDetection(null);
        }, 10000);
      }
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const clearDetection = () => {
    setDetection(null);
  };

  return {
    detection,
    clearDetection,
  };
}
