import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAll } from "../features/movie/movieSlice";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { useState, useEffect } from "react";
import { Result, Button } from "antd";
import "antd/dist/antd.css";
// import "./Watchlist.css";

const Watchlist = (props) => {
  const movies = useSelector(selectAll);
  const dispatch = useDispatch();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isMoviePresent, setIsMoviePresent] = useState(false);
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
  }, [movies]);

  return (
    <Container>
      <Content>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((item) =>
            item?.map((movie, key) => (
              <Wrap key={key}>
                {movie.id}
                <Link to={`/detail/` + movie.id}>
                  <img src={movie.cardImg} alt={movie.title} />
                </Link>
              </Wrap>
            ))
          )
        ) : (
          <Result
            className="error"
            status="403"
            title="403"
            subTitle="Sorry, your watchlist is empty."
            extra={
              <Button className="watchlist__button" href="/home" type="primary">
                Back Home
              </Button>
            }
          />
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
