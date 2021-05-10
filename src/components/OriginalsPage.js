import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { useState, useEffect } from "react";
import Originals from "./Originals";
import "./OriginalsPage.css";

import { Result, Statistic, Row, Col } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
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
      <Originals />
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

export default OriginalsPage;
