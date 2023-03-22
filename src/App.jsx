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
import { useContext, useEffect } from "react";
import { AuthContext } from "./Database/context/AuthContext";
import { useSelector, useDispatch } from 'react-redux'
import { check_login } from "./Slices/authSlice";

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
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("hiya")
    dispatch(check_login({}))
  }, [])

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  console.log(isLoggedIn)
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route
          path="Signup"
          element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="Login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />

        <Route index element={isLoggedIn ? <Home /> : <Navigate to="/Login" />} />
        <Route
          path="Social"
          element={isLoggedIn ? <Social /> : <Navigate to="/Login" />}
        />
        <Route
          path="Game"
          element={isLoggedIn ? <Game /> : <Navigate to="/Login" />}
        />
        <Route
          path="Character"
          element={isLoggedIn ? <Character /> : <Navigate to="/Login" />}
        />
        <Route
          path="Gacha"
          element={isLoggedIn ? <Gacha /> : <Navigate to="/Login" />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
