type SectionHeaderProps = {
  title: string;
  moreLabel?: string;
};

export function SectionHeader({ title, moreLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4 md:mb-5">
      <h2 className="font-display text-[20px] md:text-[22px] font-black tracking-tight whitespace-nowrap text-mv-black">{title}</h2>
      <div className="flex-1 h-[2px] bg-mv-border relative">
        <div className="absolute left-0 top-0 w-10 h-[2px] bg-mv-red" />
      </div>
      {moreLabel && (
        <a href="#" className="text-[11px] md:text-[12px] font-bold text-mv-red hover:text-mv-red-dark transition-colors tracking-wide whitespace-nowrap ml-2">
          {moreLabel}
        </a>
      )}
    </div>
  );
}
