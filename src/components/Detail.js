import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import db from "../firebase";
import { message } from "antd";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import {
  setWatchlist,
  removeWatchlist,
  setBackButtonValue,
  setWatchlistValue,
} from "../features/watchlist/watchlistSlice";
import { Popover, Button } from "antd";
import "antd/dist/antd.css";

const Detail = (props) => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [isPresent, setIsPresent] = useState(false);
  const [list, setList] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("movies")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDetailData(doc.data());
        } else {
          console.log("no such document in firebase 🔥");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [id]);

  useEffect(() => {
    document.title = detailData.title
      ? `Disney+ Clone | ${detailData.title}`
      : "Disney+ Clone";
  }, [detailData]);

  useEffect(() => {
    let temp = sessionStorage.getItem("movieList");
    let res = temp?.split("+");
    res?.includes(detailData?.title) && setIsPresent(true);
  }, [detailData]);

  //do something when going back from browser
  useEffect(() => {
    window.onpopstate = () => {
      dispatch(
        setBackButtonValue({
          backButtonValue: Math.floor(Math.random() * 10),
        })
      );
    };
  }, []);

  const handleTrailer = () => {
    window.open(`${detailData?.trailer}`, "_blank");
  };

  const addToWatchlist = () => {
    if (isPresent) {
      message.warning(
        `${detailData.title} is already present in your watchlist`
      );
    } else {
      setList(true);
      dispatch(setWatchlist()); //for showing realtime watchlist count in header
      dispatch(
        setWatchlistValue({
          watchlistValue: Math.floor(Math.random() * 10),
        })
      );
      message.success(`${detailData.title} is added to your watchlist`);
      var temp = sessionStorage.getItem("movieList");
      temp != null
        ? sessionStorage.setItem("movieList", `${temp}+${detailData.title}`)
        : sessionStorage.setItem("movieList", detailData.title);
    }
  };

  const removeFromWatchlist = () => {
    setList(false);
    dispatch(removeWatchlist()); //for showing realtime watchlist count in header
    message.error(`${detailData.title} is removed from your watchlist`);
    var temp = sessionStorage.getItem("movieList");
    var res = temp?.split("+");
    if (res?.length == 1) {
      sessionStorage.clear();
    } else {
      const updatedList = res?.filter((movie) => {
        return movie.toLowerCase() != detailData.title.toLowerCase() && movie;
      });
      sessionStorage.setItem("movieList", `${updatedList.join("+")}`);
    }
  };

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>

      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <Player onClick={() => alert("Exclusive for Premier users only!")}>
            <img src="/images/play-icon-black.png" alt="" />
            <span>Play</span>
          </Player>
          <Trailer onClick={handleTrailer}>
            <img src="/images/play-icon-white.png" alt="" />
            <span>Trailer</span>
          </Trailer>
          {list == false ? (
            <AddList onClick={() => addToWatchlist()}>
              <span />
              <span />
            </AddList>
          ) : (
            <AddList
              style={{ fontSize: "200%" }}
              onClick={() => removeFromWatchlist()}
            >
              ✔
            </AddList>
          )}
          <Popover
            content={
              <p style={{ color: "blue" }}>Available for VIP subscribers</p>
            }
            title="Group Watch"
            trigger="click"
          >
            <GroupWatch>
              <div>
                <img src="/images/group-icon.png" alt="" />
              </div>
            </GroupWatch>
          </Popover>
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: calc(100vh-250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb (249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;

  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;

    img {
      width: 100%;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default Detail;
