type EmblemProps = {
  size?: number;
  className?: string;
};

export function Emblem({ size = 54, className = "" }: EmblemProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <circle cx="27" cy="27" r="25" stroke="#C62828" strokeWidth="2" fill="none" />
      <circle cx="27" cy="27" r="20" stroke="#C62828" strokeWidth="0.5" fill="none" />
      <text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="1.2" fill="#C62828">MV</text>
      <line x1="27" y1="2" x2="27" y2="8" stroke="#C62828" strokeWidth="1.5" />
      <line x1="27" y1="46" x2="27" y2="52" stroke="#C62828" strokeWidth="1.5" />
      <line x1="2" y1="27" x2="8" y2="27" stroke="#C62828" strokeWidth="1.5" />
      <line x1="46" y1="27" x2="52" y2="27" stroke="#C62828" strokeWidth="1.5" />
      <line x1="9.1" y1="9.1" x2="13.3" y2="13.3" stroke="#C62828" strokeWidth="1" />
      <line x1="40.7" y1="40.7" x2="44.9" y2="44.9" stroke="#C62828" strokeWidth="1" />
      <line x1="44.9" y1="9.1" x2="40.7" y2="13.3" stroke="#C62828" strokeWidth="1" />
      <line x1="13.3" y1="40.7" x2="9.1" y2="44.9" stroke="#C62828" strokeWidth="1" />
    </svg>
  );
}
