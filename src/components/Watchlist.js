import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAll } from "../features/movie/movieSlice";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import {
  currentWatchlistStatus,
  removeWatchlist,
  setToggleValue,
  setWatchlistValue,
} from "../features/watchlist/watchlistSlice";
import { useState, useEffect } from "react";
import { Result, Button, Popover, message, Alert } from "antd";
import "antd/dist/antd.css";
import Zoom from "react-reveal/Zoom";
// import "./Watchlist.css";

const Watchlist = (props) => {
  const movies = useSelector(selectAll);
  const status = useSelector(currentWatchlistStatus);
  const dispatch = useDispatch();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [tracker, setTracker] = useState();
  const [content, setContent] = useState();
  const [showRemoveAll, setShowRemoveAll] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  let all = [];

  useEffect(() => {
    document.title = "Disney+ Clone | Watchlist";
    db.collection("movies").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        all = [...all, { id: doc.id, ...doc.data() }];
      });

      dispatch(
        setMovies({
          all: all,
        })
      );
    });
  }, []);

  useEffect(() => {
    var temp = sessionStorage.getItem("movieList");
    let res = temp?.split("+");
    let unique = [...new Set(res)]; //removes the duplicate value
    const newMovies = unique.map((item) =>
      movies?.filter((movie) => {
        return movie.title.toLowerCase() == item.toLowerCase() && movie;
      })
    );

    newMovies && setFilteredMovies(newMovies);
  }, [movies, status, tracker, isRemoved]); //entire watchlist will be re-rendered when status/tracker gets changed i.e. when removeItem is called

  //delay in showing remove all button
  useEffect(() => {
    setTimeout(() => setShowRemoveAll(true), 5000);
  }, []);

  const removeItem = (e) => {
    var targetValue = e.target.attributes.value.value;
    message.error(`${targetValue} is removed from your watchlist`);
    var temp = sessionStorage.getItem("movieList");
    let res = temp?.split("+");
    setContent(res?.length);
    const updatedList = res?.filter((movie) => {
      return movie.toLowerCase() != targetValue.toLowerCase() && movie;
    });
    sessionStorage.setItem("movieList", `${updatedList.join("+")}`);
    dispatch(removeWatchlist()); //for showing realtime watchlist count in header
    setTracker(Math.floor(Math.random() * 10));
    dispatch(
      setToggleValue({
        toggle: Math.floor(Math.random() * 10),
      })
    );
    if (res?.length == 1) {
      sessionStorage.clear();
    }
  };

  const removeAll = () => {
    sessionStorage.clear();
    setIsRemoved(true);
    dispatch(
      setWatchlistValue({
        watchlistValue: Math.floor(Math.random() * 10),
      })
    ); //realtime watchlist count update in header
    // window.location.reload();
  };

  return (
    <Container>
      {filteredMovies.length > 0 && (
        <Alert
          message="Tips"
          description="Hold or Hover over each movie to remove the particular one."
          type="success"
          style={{ marginBottom: "5vh" }}
          afterClose={() => message.success(`Happy Watching 🎬`)}
          showIcon
          closable
        />
      )}
      <Content>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((item) =>
            item?.map((movie, key) => (
              <Zoom bottom>
                <Popover
                  content={
                    <strong
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={removeItem}
                      value={movie.title}
                    >
                      Remove
                    </strong>
                  }
                  title="Want to remove from watchlist ?"
                  trigger="hover"
                >
                  <Wrap key={key}>
                    {movie.id}
                    <Link to={`/detail/` + movie.id}>
                      <img src={movie.cardImg} alt={movie.title} />
                    </Link>
                  </Wrap>
                </Popover>
              </Zoom>
            ))
          )
        ) : filteredMovies.length <= 0 || content == 1 ? (
          <Result
            className="error"
            status="403"
            title="403"
            subTitle="Sorry, your watchlist is empty."
            style={{ paddingLeft: "35vw", margin: "auto" }}
            extra={
              <Button className="watchlist__button" href="/home" type="primary">
                Back Home
              </Button>
            }
          />
        ) : null}
        {filteredMovies.length > 0 && showRemoveAll && (
          <Button
            onClick={removeAll}
            style={{
              width: "fit-content",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            type="primary"
          >
            Remove All
          </Button>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(128.8vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 70px;
  padding: 20px calc(3.5vw + 5px);

  @media (max-width: 768px) {
    min-height: 87.5vh;
  }

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  padding-top: 56.25%;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);

  img {
    inset: 0px;
    display: block;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    position: absolute;
    transition: opacity 500ms ease-in-out 0s;
    width: 100%;
    z-index: 1;
    top: 0;
  }

  &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;

export default Watchlist;
