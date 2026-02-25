import type { ReactNode } from 'react';

interface PageSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="rounded-lg border border-muted bg-panel px-4 py-3 md:px-5 md:py-4">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-text">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

