import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Character from "./Pages/Character/Character";
import Gacha from "./Pages/Gacha/Gacha";
import Game from "./Pages/Game/Game";
import Home from "./Pages/Home/Home";
import Social from "./Pages/Social/Social";
import Nav from "./Components/Nav";
import Signup from "./Pages/Authentication/Signup";
import Login from "./Pages/Authentication/Login";
import { useContext } from "react";
import { AuthContext } from "./Database/context/AuthContext";

const RootLayout = () => {
  const { userLoaded } = useContext(AuthContext);
  return (
    <div className="root-layout">
      {userLoaded && (
        <>
          <Nav />
          <Outlet />
        </>
      )}
    </div>
  );
};

function App() {
  const { user } = useContext(AuthContext);
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route
          path="Signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="Login" element={user ? <Navigate to="/" /> : <Login />} />

        <Route index element={user ? <Home /> : <Navigate to="/Login" />} />
        <Route
          path="Social"
          element={user ? <Social /> : <Navigate to="/Login" />}
        />
        <Route
          path="Game"
          element={user ? <Game /> : <Navigate to="/Login" />}
        />
        <Route
          path="Character"
          element={user ? <Character /> : <Navigate to="/Login" />}
        />
        <Route
          path="Gacha"
          element={user ? <Gacha /> : <Navigate to="/Login" />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
