import React from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { ContentArea } from './ContentArea';
import { StatusBar } from './StatusBar';
import { CommandPalette } from '../CommandPalette';
import { AutoDetectBanner } from '../ai/AutoDetectBanner';
import { useTheme } from '../../hooks/useTheme';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAutoDetect } from '../../hooks/useAutoDetect';
import { useAppStore } from '../../stores/app-store';

export const AppShell: React.FC = () => {
  useTheme();
  useKeyboardShortcuts();

  const activeTool = useAppStore((state) => state.activeTool);
  const { detection, clearDetection } = useAutoDetect();
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  // Don't show banner if already on the suggested tool
  const showDetection = detection && detection.toolId !== activeTool;

  const handleAcceptDetection = () => {
    if (detection) {
      setActiveTool(detection.toolId);
      clearDetection();
    }
  };

  const handleDismissDetection = () => {
    clearDetection();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Ambient mesh gradient — the living background */}
      <div className="mesh-gradient-bg" />

      {/* App chrome floating above */}
      <div className="relative z-10 flex flex-col h-full">
        <TitleBar />

        {showDetection && (
          <AutoDetectBanner
            detection={detection}
            onAccept={handleAcceptDetection}
            onDismiss={handleDismissDetection}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ContentArea />
        </div>

        <StatusBar />
      </div>

      <CommandPalette />
    </div>
  );
};
