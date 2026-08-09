import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import '../options.css'

export default function SiteLayout() {
  return (
    <div className="options-site-shell">
      <SiteHeader />
      <main className="options-site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
