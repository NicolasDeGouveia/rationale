interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{title}</p>
      <div>{children}</div>
    </div>
  );
}
