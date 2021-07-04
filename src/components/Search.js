import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAll } from "../features/movie/movieSlice";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { currentModeValue } from "../features/watchlist/watchlistSlice";
import { useState, useEffect } from "react";
import { Result, Button } from "antd";
import { Input, Space } from "antd";
import Zoom from "react-reveal/Zoom";
import "antd/dist/antd.css";
import "./Search.css";

const { Search } = Input;

const SearchMovies = (props) => {
  const movies = useSelector(selectAll);
  const mode = useSelector(currentModeValue);
  const dispatch = useDispatch();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isMoviePresent, setIsMoviePresent] = useState(false);

  let all = [];

  const handleChange = (e) => {
    e.target.value == "" && setIsMoviePresent(false); //do not display the fallback while clearing the input value
  };

  const onSearch = (value) => {
    const newMovies = movies?.filter((movie) => {
      return movie.title.toLowerCase() == value.toLowerCase() && movie;
    });
    newMovies && setFilteredMovies(newMovies);
    document.title = "Disney+ Clone | Search";
    console.log("newMovies.length", newMovies.length);

    if (newMovies.length === 0 && value != "") {
      //only show the fallback UI if search doesn't match but it will not be shown while page loading OR typed search has been removed
      setIsMoviePresent(true);
      document.title = "Disney+ Clone | Error";
    }
  };

  useEffect(() => {
    document.title = "Disney+ Clone | Search";
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

  return (
    <Container mode={mode}>
      <Space direction="vertical">
        <Search
          placeholder="Enter the movie name"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          onChange={handleChange}
          style={{
            minWidth: "68.5vw",
            paddingLeft: "20vw",
            paddingTop: "5vh",
            paddingBottom: "5vh",
          }}
        />
      </Space>
      <Content>
        {filteredMovies.length != 0 ? (
          filteredMovies?.map((movie, key) => (
            <Zoom bottom cascade>
              <Wrap key={key}>
                {movie.id}
                <Link to={`/detail/` + movie.id}>
                  <img src={movie.cardImg} alt={movie.title} />
                </Link>
              </Wrap>
            </Zoom>
          ))
        ) : isMoviePresent ? (
          <Zoom bottom cascade>
            <Result
              className="error"
              status="404"
              title="404"
              subTitle="Sorry, the movie you are trying to search does not exist."
              extra={
                <Link to="/home">
                  <Button type="primary">Back Home</Button>
                </Link>
              }
            />
          </Zoom>
        ) : null}
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
  padding: 0 calc(3.5vw + 5px);

  @media (max-width: 768px) {
    min-height: 87.5vh;
    padding: 10px calc(3.5vw + 5px);
  }

  ${(props) =>
    props.mode == "false"
      ? `  &:after {
        background: url("/images/home-background.png") center center / cover
          no-repeat fixed;
        content: "";
        position: absolute;
        inset: 0px;
        opacity: 1;
        z-index: -1;
      }`
      : `background-image: linear-gradient(rgba(131, 124, 124,0),rgba(214, 202, 202,1));`}
`;

const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-left: 20vw;
  margin-top: auto;
  min-height: 50vh;
  min-width: 200vw;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 30vh;
    min-width: 125vw;
    padding: 10vh 0 0 0;
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

export default SearchMovies;
