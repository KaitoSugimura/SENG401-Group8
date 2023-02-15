import { createHashRouter, createRoutesFromElements, Route, RouterProvider, Outlet } from 'react-router-dom';
import Character from './Pages/Character/Character';
import Gacha from './Pages/Gacha/Gacha';
import Game from './Pages/Game/Game';
import Home from './Pages/Home/Home';
import Social from './Pages/Social/Social';
import Nav from './Components/Nav';

const RootLayout = () => {
  return (<div className='root-layout'>
    <Nav />
    <Outlet />
  </div>)
}

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} >
      <Route index element={<Home />} />
      <Route path="Social" element={<Social />} />
      <Route path="Game" element={<Game />} />
      <Route path="Character" element={<Character />} />
      <Route path="Gacha" element={<Gacha />} />
    </Route>,
  ),
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
