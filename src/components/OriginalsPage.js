import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { currentModeValue } from "../features/watchlist/watchlistSlice";
import { lazy, Suspense, useState, useEffect } from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import "./OriginalsPage.css";

import { Result, Statistic, Row, Col } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const Originals = lazy(() => import("./Originals"));
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 12 + 1000 * 30; // Moment is also OK

function OriginalsPage() {
  const mode = useSelector(currentModeValue);
  const history = useHistory();
  const [hasCountdown, setHasCountdown] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const dispatch = useDispatch();
  let originals = [];

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      history.push("/");
      alert("Please login first!");
    }
  }, []);

  useEffect(() => {
    document.title = "Disney+ Clone | Originals";
    db.collection("movies").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        switch (doc.data().type) {
          case "original":
            originals = [...originals, { id: doc.id, ...doc.data() }];
            break;
        }
      });

      dispatch(
        setMovies({
          original: originals,
        })
      );
    });

    //delay in showing countdown
    setTimeout(() => setShowCountdown(true), 5000);
  }, []);

  function onFinish() {
    setHasCountdown(false);
  }

  return (
    <Container mode={mode}>
      <Suspense
        fallback={
          <Loading>
            <Spin size="large" tip="Loading..." />
          </Loading>
        }
      >
        <Originals />
      </Suspense>
      {hasCountdown && showCountdown && (
        <>
          <Row style={{ marginTop: "10vh", marginLeft: "27.5vw" }} gutter={16}>
            <h4 style={{ color: "white", fontSize: "150%" }}>
              Stay tuned! New contents are coming in
            </h4>
            <Col span={12}>
              <Countdown onFinish={onFinish} value={deadline} />
            </Col>
          </Row>
          <Result icon={<SmileOutlined />} />
        </>
      )}
    </Container>
  );
}
const Container = styled.main`
  position: relative;
  min-height: calc(128.8vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 70px;
  padding: 20px calc(3.5vw + 5px);

  @media (max-width: 768px) {
    ${(props) =>
      props.mode == "false"
        ? `background-color: #192133`
        : `background-image: linear-gradient(rgba(131, 124, 124,0),rgba(214, 202, 202,1));`}
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
const Loading = styled.div`
margin: 200px 0 0 0;
margin-bottom: 20px;
padding: 30px 50px;
text-align: center;
/* background: rgba(0, 0, 0, 0.05); */
border-radius: 4px;
  }
`;

export default OriginalsPage;
