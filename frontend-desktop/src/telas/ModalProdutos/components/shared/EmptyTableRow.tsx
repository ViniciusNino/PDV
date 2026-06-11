import type { CSSProperties } from 'react';

interface EmptyTableRowProps {
  colSpan: number;
  message: string;
  className?: string;
  style?: CSSProperties;
}

export function EmptyTableRow({
  colSpan,
  message,
  className = '',
  style
}: EmptyTableRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={className}
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          ...style
        }}
      >
        {message}
      </td>
    </tr>
  );
}
