import styled from "styled-components";
import ImgSlider from "./ImgSlider";
import Viewers from "./Viewers";
import Recommends from "./Recommends";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { selectUserName } from "../features/user/userSlice";
import { Spin, Modal, message } from "antd";
import "antd/dist/antd.css";
import Tour from "reactour";

const NewDisney = lazy(() => import("./NewDisney"));
const Originals = lazy(() => import("./Originals"));
const Trending = lazy(() => import("./Trending"));

const Home = (props) => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const [isTourOpen, setIsTourOpen] = useState(false);
  let recommends = [];
  let newDisneys = [];
  let originals = [];
  let trending = [];

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    sessionStorage.getItem("isTourVisited") === "true" ? setIsModalVisible(false) : setIsModalVisible(true);
    document.title = "Disney+ Clone";
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
  }, [userName]);


  const handleOk = () => {
    setIsModalVisible(false);
    setIsTourOpen(true);
    sessionStorage.setItem("isTourVisited", "true");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    sessionStorage.setItem("isTourVisited", "true");
    message.success('Alright! Happy Exploring.');
  };


  const tourConfig = [
    {
      selector: '[data-tut="reactour__home"]',
      content: `This is the home page.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__search"]',
      content: `Search your movies from here.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__watchlist"]',
      content: `Your favorite movies are kept here.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__original"]',
      content: `Disney+ exclusive original contents are available here.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__movies"]',
      content: () => (
        <div>Unable to find your movies!!!<br />Look here for all movies.</div>
      ),
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__series"]',
      content: `This bucket is dedicated for series only.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__viewers"]',
      content: `Hover over each card to watch the trailer.`,
      style: {
        color: "black",
        fontSize:"small"
      }
    },
    {
      selector: '[data-tut="reactour__signOut"]',
      content: ({ goTo }) => (
        <div>
          Hover over your profile to sign out.{" "}
          <button
            style={{
              border: "1px solid #f7f7f7",
              background: "#1890ff",
              color: "#fff",
              padding: ".3em .7em",
              fontSize: "inherit",
              display: "block",
              cursor: "pointer",
              margin: "1em auto"
            }}
            onClick={() => goTo(0)}
          >
            Show Me Again
          </button>
        </div>
      ),
      style: {
        color: "black",
        fontSize:"small"
      }
    },
  ];


  return (
    <Container>
      <ImgSlider />
      <Viewers />
      <Recommends title />
      <Suspense
        fallback={
          <Loading>
            <Spin size="large" tip="Loading..." />
          </Loading>
        }
      >
        <NewDisney title />
        <Originals title />
        <Trending title />
      </Suspense>
      <Tour
        steps={tourConfig}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        rounded={5}//rounded border radius  
      />
      <Modal title="Tour Advisory" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Do you want to take a tour of the application?</p>
        <i><strong>Note:-</strong></i>
        <small>If you cancel then you have to login again to view the Tour Advisory.</small>
      </Modal>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(130vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 70px;
  padding: 0 calc(3.5vw + 5px);

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

export default Home;
