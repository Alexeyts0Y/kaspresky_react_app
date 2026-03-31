import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WelcomePage from './pages/Welcome';
import UsersPage from './pages/Users';
import GroupsPage from './pages/Groups';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="groups" element={<GroupsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;