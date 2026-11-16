import { NavLink } from 'react-router-dom'
import './Sidebar.css'

// items: [{ to, label, end? }]
export default function Sidebar({ title, items }) {
  return (
    <aside className="sidebar">
      {title && <h2 className="sidebar__title">{title}</h2>}
      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="sidebar__link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
