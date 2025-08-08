import { ReactNode } from 'react';
import { Progress } from './Progress';

export function GameShell({ title, subtitle, progress, children, onReset }: {
  title: string;
  subtitle?: string;
  progress: number;
  children: ReactNode;
  onReset?: () => void;
}) {
  return (
    <div className="glass card" style={{ display: 'grid', gap: 16 }}>
      <div className="hero glass" style={{ padding: 16 }}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {onReset && <button className="btn ghost" onClick={onReset}>Reset</button>}
      </div>
      <Progress value={progress} />
      <div>
        {children}
      </div>
    </div>
  );
}
