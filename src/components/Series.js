import React from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { Result, Button } from "antd";

function Series() {
  useEffect(() => {
    document.title = "Disney+ Clone | Series";
  }, []);

  return (
    <Container>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, this section is under maintenance. Please visit after sometime."
        extra={
          <Button href="/home" type="primary">
            Back Home
          </Button>
        }
      />
    </Container>
  );
}
const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
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

export default Series;
