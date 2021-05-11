import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { lazy, Suspense, useEffect } from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";

const NewDisney = lazy(() => import("./NewDisney"));
const Originals = lazy(() => import("./Originals"));
const Recommends = lazy(() => import("./Recommends"));
const Trending = lazy(() => import("./Trending"));

function Movies() {
  const dispatch = useDispatch();
  let recommends = [];
  let newDisneys = [];
  let originals = [];
  let trending = [];

  useEffect(() => {
    document.title = "Disney+ Clone | Movies";
    db.collection("movies").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        switch (doc.data().type) {
          case "recommend":
            recommends = [...recommends, { id: doc.id, ...doc.data() }];
            break;

          case "new":
            newDisneys = [...newDisneys, { id: doc.id, ...doc.data() }];
            break;

          case "original":
            originals = [...originals, { id: doc.id, ...doc.data() }];
            break;

          case "trending":
            trending = [...trending, { id: doc.id, ...doc.data() }];
            break;
        }
      });

      dispatch(
        setMovies({
          recommend: recommends,
          newDisney: newDisneys,
          original: originals,
          trending: trending,
        })
      );
    });
  }, []);

  return (
    <Container>
      <Suspense
        fallback={
          <Loading>
            <Spin size="large" tip="Loading..." />
          </Loading>
        }
      >
        <Trending />
        <Originals />
        <NewDisney />
        <Recommends />
      </Suspense>
    </Container>
  );
}
const Container = styled.main`
  position: relative;
  min-height: calc(130vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 70px;
  padding: 20px calc(3.5vw + 5px);

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
const Loading = styled.div`
margin: 200px 0;
margin-bottom: 20px;
padding: 30px 50px;
text-align: center;
/* background: rgba(0, 0, 0, 0.05); */
border-radius: 4px;
  }
`;

export default Movies;
