import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-shell">
      <TopNav />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
