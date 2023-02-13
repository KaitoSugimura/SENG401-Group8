import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Character from './Pages/Character/Character';
import Gacha from './Pages/Gacha/Gacha';
import Game from './Pages/Game/Game';
import Home from './Pages/Home/Home';
import Social from './Pages/Social/Social';
import Nav from './Components/Nav';

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Nav/>

        <Switch>
          <Route exact path="/" component={Home}/> 
          <Route path="/social" component={Social}/> 
          <Route path="/game" component={Game}/> 
          <Route path="/character" component={Character}/> 
          <Route path="/gacha" component={Gacha}/> 
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
