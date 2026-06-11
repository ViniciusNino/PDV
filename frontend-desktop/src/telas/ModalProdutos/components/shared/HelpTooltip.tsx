import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  iconSize?: number;
  className?: string;
  tooltipClassName?: string;
}

export function HelpTooltip({
  text,
  iconSize = 14,
  className = '',
  tooltipClassName = ''
}: HelpTooltipProps) {
  return (
    <div className={`prod-tooltip-container ${className}`}>
      <HelpCircle size={iconSize} className="prod-help-icon" />
      <div className={`prod-tooltip ${tooltipClassName}`}>
        {text}
      </div>
    </div>
  );
}
