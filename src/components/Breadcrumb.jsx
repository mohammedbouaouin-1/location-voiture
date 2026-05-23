import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  // items: [{ label, to }, { label }]  — dernier sans `to`
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm mb-6 animate-fadeIn">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          {idx > 0 && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent/40 flex-shrink-0">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {item.to ? (
            <Link to={item.to} className="text-accent/70 hover:text-primary font-medium transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
