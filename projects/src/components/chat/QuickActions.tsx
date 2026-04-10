'use client';

import { Button } from '@/components/ui/button';

interface QuickAction {
  label: string;
  prompt: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickActions({ actions, onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className="rounded-full text-xs"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
