import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">kaspersky_react_app</Link>
              <Link to="/users" className="text-gray-600 hover:text-blue-600">Сотрудники</Link>
              <Link to="/groups" className="text-gray-600 hover:text-blue-600">Отделы</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}