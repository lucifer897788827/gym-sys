import type { ReactNode } from "react";

type PageHeaderProps = {
  tag: string;
  title: string;
  description?: string;
  action?: ReactNode;
  gradient?: boolean;
};

export function PageHeader({
  tag,
  title,
  description,
  action,
  gradient = true,
}: PageHeaderProps) {
  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-muted)" }}
          >
            {tag}
          </p>
          <h1
            className={`text-3xl font-bold tracking-tight sm:text-4xl font-display ${
              gradient ? "gradient-text" : ""
            }`}
            style={gradient ? undefined : { color: "var(--text-primary)" }}
          >
            {title}
          </h1>
          {description ? (
            <p
              className="max-w-2xl text-sm leading-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
