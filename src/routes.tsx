import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Tasks from './pages/TasksPage';
import NewTask from './pages/NewTaskPage';
import UpdateTask from './pages/UpdateTaskPage';
import CompletedTasks from './pages/CompletedTasksPage';
import Trash from './pages/TrashPage';
import Profile from './pages/UserProfilePage';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Landing />},
            { path: 'login', element: <Login />},
            { path: 'register', element: <Register />},
            { path: 'tasks', element: <Tasks />},
            { path: 'tasks/new', element: <NewTask />},
            { path: 'tasks/update/:id', element: <UpdateTask />},
            { path: 'tasks/completed', element: <CompletedTasks />},
            { path: 'tasks/trash', element: <Trash />},
            { path: 'profile', element: <Profile />},
        ],
    },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;