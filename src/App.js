import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Character from './Character/Character';
import Gacha from './Gacha/Gacha';
import Game from './Game/Game';
import Home from './Home/Home';
import Social from './Social/Social';
import Nav from './_Components/Nav';

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
