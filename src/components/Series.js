import React from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { Result, Button } from "antd";
import { useSelector } from "react-redux";
import { currentModeValue } from "../features/watchlist/watchlistSlice";
import { Link, useHistory } from "react-router-dom";

function Series() {
  const mode = useSelector(currentModeValue);
  const history = useHistory();

  useEffect(() => {
    document.title = "Disney+ Clone | Series";
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      history.push("/");
      alert("Please login first!");
    }
  }, []);

  return (
    <Container mode={mode}>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, this section is under maintenance. Please visit after sometime."
        extra={
          <Link to="/home">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Container>
  );
}
const Container = styled.main`
  position: relative;
  min-height: calc(140vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 70px;
  padding: 30px calc(3.5vw + 5px);

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

export default Series;
