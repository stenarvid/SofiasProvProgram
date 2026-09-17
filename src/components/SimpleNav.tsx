import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Start", icon: "⌂", end: true },
  { to: "/topics", label: "Lär dig", icon: "▤" },
  { to: "/train", label: "Träna", icon: "⌨" },
  { to: "/test", label: "Testa dig", icon: "✓" },
  { to: "/progress-hub", label: "Progress", icon: "↗" }
];

export default function SimpleNav() {
  return (
    <nav className="simple-nav" aria-label="Huvudnavigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
