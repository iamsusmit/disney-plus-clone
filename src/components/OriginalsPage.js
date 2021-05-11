import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { lazy, Suspense, useState, useEffect } from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import "./OriginalsPage.css";

import { Result, Statistic, Row, Col } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const Originals = lazy(() => import("./Originals"));
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 12 + 1000 * 30; // Moment is also OK

function OriginalsPage() {
  const [hasCountdown, setHasCountdown] = useState(true);
  const dispatch = useDispatch();
  let originals = [];

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
  }, []);

  function onFinish() {
    setHasCountdown(false);
  }

  return (
    <Container>
      <Suspense
        fallback={
          <Loading>
            <Spin size="large" tip="Loading..." />
          </Loading>
        }
      >
        <Originals />
      </Suspense>
      {hasCountdown && (
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
margin: 200px 0 0 0;
margin-bottom: 20px;
padding: 30px 50px;
text-align: center;
/* background: rgba(0, 0, 0, 0.05); */
border-radius: 4px;
  }
`;

export default OriginalsPage;
