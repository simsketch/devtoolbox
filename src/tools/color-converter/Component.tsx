import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
}

export const ColorConverterComponent: React.FC = () => {
  const [input, setInput] = useState('#3b82f6');
  const [colors, setColors] = useState<ColorFormats>({ hex: '', rgb: '', hsl: '' });
  const [error, setError] = useState('');

  useToolAction(setInput);

  useEffect(() => {
    convertColor(input);
  }, [input]);

  const convertColor = (value: string) => {
    if (!value.trim()) {
      setColors({ hex: '', rgb: '', hsl: '' });
      setError('');
      return;
    }

    try {
      let r = 0, g = 0, b = 0;

      // Parse hex
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        r = parseInt(value.slice(1, 3), 16);
        g = parseInt(value.slice(3, 5), 16);
        b = parseInt(value.slice(5, 7), 16);
      }
      // Parse short hex
      else if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
        r = parseInt(value[1] + value[1], 16);
        g = parseInt(value[2] + value[2], 16);
        b = parseInt(value[3] + value[3], 16);
      }
      // Parse rgb
      else if (/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.test(value)) {
        const match = value.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (match) {
          r = parseInt(match[1]);
          g = parseInt(match[2]);
          b = parseInt(match[3]);
        }
      }
      // Parse hsl
      else if (/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i.test(value)) {
        const match = value.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
        if (match) {
          const h = parseInt(match[1]) / 360;
          const s = parseInt(match[2]) / 100;
          const l = parseInt(match[3]) / 100;
          [r, g, b] = hslToRgb(h, s, l);
        }
      } else {
        throw new Error('Invalid color format');
      }

      // Validate RGB values
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('RGB values must be between 0 and 255');
      }

      // Convert to all formats
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      const rgb = `rgb(${r}, ${g}, ${b})`;
      const [h, s, l] = rgbToHsl(r, g, b);
      const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

      setColors({ hex, rgb, hsl });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Invalid color format');
      setColors({ hex: '', rgb: '', hsl: '' });
    }
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return [h, s, l];
  };

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
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
          Color Input
        </label>
        <input
          type="text"
          className="input-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter color (e.g., #3b82f6, rgb(59, 130, 246), hsl(217, 91%, 60%))"
          style={{
            width: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
          }}
        />
        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500', marginTop: 'var(--spacing-sm)' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-xl)',
          gap: 'var(--spacing-xl)',
        }}
      >
        {/* Color preview */}
        {colors.hex && (
          <div
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: colors.hex,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}

        {/* Color formats */}
        {colors.hex && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              width: '100%',
              maxWidth: '500px',
            }}
          >
            {/* HEX */}
            <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    HEX
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '16px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                    }}
                  >
                    {colors.hex}
                  </div>
                </div>
                <CopyButton text={colors.hex} />
              </div>
            </div>

            {/* RGB */}
            <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    RGB
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '16px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                    }}
                  >
                    {colors.rgb}
                  </div>
                </div>
                <CopyButton text={colors.rgb} />
              </div>
            </div>

            {/* HSL */}
            <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    HSL
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '16px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                    }}
                  >
                    {colors.hsl}
                  </div>
                </div>
                <CopyButton text={colors.hsl} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
