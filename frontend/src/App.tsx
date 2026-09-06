
import { useQuery } from '@apollo/client/react';
import './App.css'
import { ME_Query } from './graphql/queries/auth';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import PostDetails from './pages/PostDetails';
import CategoryPosts from './pages/CategoryPosts';
import Dashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import CreatePosts from './pages/admin/CreatePosts';
import EditPosts from './pages/admin/EditPosts';
import Categries from './pages/admin/Categries';
import Comments from './pages/admin/Comments';
import type { AuthUser } from './components/ProtectRoute';
import GuestRoute from './components/GuestRoute';
import ProtectRoute from './components/ProtectRoute';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import IsLoading from './components/IsLoading';


type MeQuery = {
  me: AuthUser | null | undefined;
};

function App() {

  const { data, loading } = useQuery<MeQuery>(ME_Query);

  if (loading) {
    return <IsLoading/>
  }

  const auth = data?.me;
  console.log(auth);

  return (
    <div className='min-h-screen bg-white relative overflow-hidden'>
    <Toaster/>
      <div>
        <Navbar auth={auth}/>
      <Routes>
        <Route path='/' element={auth?.role !== "admin" ? <Home/> : <Navigate to="/admin"/>} />
        <Route path='/login' element={<GuestRoute auth={auth}><Login /></GuestRoute> } />
        <Route path='/register' element={<GuestRoute auth={auth}><Register /></GuestRoute> } />
        <Route path='/post' element={ <PostDetails />} />
        <Route path='/category' element={<CategoryPosts />} />
        <Route path='/admin' element={<ProtectRoute auth={auth} requireAdmin> <Dashboard/> </ProtectRoute>  }>
          <Route  index element={<Analytics/> } />
          <Route path='analytics' element={<Analytics />} />
          <Route path='posts/create' element={<CreatePosts />} />
          <Route path='edit/posts' element={<EditPosts />} />
          <Route path='comments' element={<Comments />} />
          <Route path='categories/create' element={<Categries />} />
        </Route>
      </Routes>
      </div>
    </div>
  );
}

export default App
