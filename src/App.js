import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import "./App.css";
import Home from "./components/Home";
import Detail from "./components/Detail";
import Movies from "./components/Movies";
import Search from "./components/Search";
import Watchlist from "./components/Watchlist";
import OriginalsPage from "./components/OriginalsPage";
import Series from "./components/Series";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/movies">
            <Movies />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/watchlist">
            <Watchlist />
          </Route>
          <Route path="/originals">
            <OriginalsPage />
          </Route>
          <Route path="/series">
            <Series />
          </Route>
          <Route path="/detail/:id">
            <Detail />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
