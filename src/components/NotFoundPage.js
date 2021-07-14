import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentModeValue } from "../features/watchlist/watchlistSlice";
import { useEffect } from "react";
import { Result, Button } from "antd";
import "antd/dist/antd.css";

const NotFoundPage = (props) => {
  const mode = useSelector(currentModeValue);
  useEffect(() => {
    document.title = "Disney+ Clone | Page not found";
  }, []);

  return (
    <Container mode={mode}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/home">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
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

export default NotFoundPage;
