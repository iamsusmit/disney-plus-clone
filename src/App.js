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
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/movies">
            <Movies />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/watchlist">
            <Watchlist />
          </Route>
          <Route exact path="/originals">
            <OriginalsPage />
          </Route>
          <Route exact path="/series">
            <Series />
          </Route>
          <Route exact path="/detail/:id">
            <Detail />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
