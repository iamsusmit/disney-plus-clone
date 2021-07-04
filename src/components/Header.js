import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { auth, provider } from "../firebase";
import {
  selectUserName,
  selectUserPhoto,
  setUserLoginDetails,
  setSignOutState,
} from "../features/user/userSlice";
import {
  currentWatchlistStatus,
  tValue,
  currentBackButtonValue,
  currentWatchlistValue,
  settoggleMode,
  currentModeValue,
} from "../features/watchlist/watchlistSlice";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const Header = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const status = useSelector(currentWatchlistStatus); //for showing realtime watchlist count in header
  const toggle = useSelector(tValue);
  const backButtonStatus = useSelector(currentBackButtonValue);
  const currentWlValue = useSelector(currentWatchlistValue); //for reflecting the realtime watchlist value while going back from the browser
  const mode = useSelector(currentModeValue);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // history.push("/home");
      }
    });
  }, [userName]);

  useEffect(() => {
    let temp = sessionStorage.getItem("movieList");
    let res = temp?.split("+");
    res != "" ? setWatchlistCount(res?.length) : setWatchlistCount(0);
  }, [currentWlValue, backButtonStatus, status, toggle]);

  const handleAuth = () => {
    if (!userName) {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          setUser(result.user);
          history.push("/home");
          sessionStorage.setItem("isLoggedIn", "true");
          dispatch(
            settoggleMode({
              toggleMode: "false",
            })
          );
        })
        .catch((error) => {
          alert(error.message);
        });
    } else if (userName) {
      auth
        .signOut()
        .then(() => {
          dispatch(setSignOutState());
          history.push("/");
          sessionStorage.clear();
          document.title = "Disney+ Clone";
          dispatch(
            settoggleMode({
              toggleMode: "false",
            })
          );
        })
        .catch((err) => alert(err.message));
    }
  };

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );
  };

  const toggleMode = (e) => {
    let currentMode = e.target.innerText;
    if (currentMode == "Light Mode") {
      dispatch(
        settoggleMode({
          toggleMode: "true",
        })
      );
    } else if (currentMode == "Dark Mode") {
      dispatch(
        settoggleMode({
          toggleMode: "false",
        })
      );
    }
  };
  const disneyWiki = () => {
    if (userName && userName!="") {
      let number = Math.floor(Math.random() * 10);
      const wiki = [
        "Disney+ was launched on November 12, 2019, in the United States, Canada, and the Netherlands, and expanded to Australia, New Zealand, and Puerto Rico a week later.",
        "Ten million users had subscribed to Disney+ by the end of its first day of operation.",
        "The service had 103 million global subscribers as of April 2021.",
        "It became available in select European countries in March 2020 and in India in April through Star India's Hotstar streaming service, which was rebranded as Disney+ Hotstar.",
        "It is suggested that Disney+ has approximately 7,000 television episodes and 500 films,[51] including original television series and films from Disney Channel and Freeform, and select titles from 20th Television and ABC Signature.",
        "Disney+ is available for streaming via web browsers on PC and Mac, as well as apps on Apple iOS devices and Apple TV, Android mobile devices and Android TV, Amazon devices.",
        "Disney+ allows seven user profiles per account, with the ability to stream on four devices concurrently and unlimited downloads for offline viewing.",
        "Parent of this	OTT video streaming platform is Disney Media and Entertainment Distribution",
        "Disney+ relies on technology developed by Disney Streaming Services, which was originally established as BAMTech in 2015 when it was spun off from MLB Advanced Media (MLBAM).",
        "In the United States, Disney+ sits alongside Hulu and ESPN+ as Disney's three primary streaming platforms for the US market.",
        "With BAMTech helping to launch ESPN+ in early 2018, and Disney's streaming distribution deal with Netflix ending in 2019, Disney took the opportunity to use technologies being developed for ESPN+ to establish a Disney-branded streaming service that would feature its content.",
      ];
      notification.open({
        message: "Disney+ Wikipedia",
        description: wiki[number],
        placement: "topLeft",
        top: 80,
        duration: 10,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    } else {
      notification.open({
        message: "Disney+",
        description: "Hey,there! Please login to experience most of it.",
        placement: "topLeft",
        top: 80,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    }
  };

  return (
    <Nav mode={mode}>
      <Logo data-tut="reactour__logo">
        <img src="/images/logo.svg" alt="Disney+" onClick={disneyWiki} />
      </Logo>

      {!userName ? (
        <Login onClick={handleAuth}>Login</Login>
      ) : (
        <>
          <NavMenu>
            <Link to="/home" data-tut="reactour__home">
              <img src="/images/home-icon.svg" alt="HOME" />
              <span>HOME</span>
            </Link>
            <Link to="/search" data-tut="reactour__search">
              <img src="/images/search-icon.svg" alt="SEARCH" />
              <span>SEARCH</span>
            </Link>
            <Link to="/watchlist" data-tut="reactour__watchlist">
              <img src="/images/watchlist-icon.svg" alt="WATCHLIST" />
              <span>
                WATCHLIST{" "}
                {watchlistCount != 0 && (
                  <sup style={{ fontSize: "100%" }}>{watchlistCount}</sup>
                )}
              </span>
            </Link>
            <Link to="/originals" data-tut="reactour__original">
              <img src="/images/original-icon.svg" alt="ORIGINALS" />
              <span>ORIGINALS</span>
            </Link>
            <Link to="/movies" data-tut="reactour__movies">
              <img src="/images/movie-icon.svg" alt="MOVIES" />
              <span>MOVIES</span>
            </Link>
            <Link to="/series" data-tut="reactour__series">
              <img src="/images/series-icon.svg" alt="SERIES" />
              <span>SERIES</span>
            </Link>
          </NavMenu>
          <SignOut data-tut="reactour__signOut">
            <UserImg src={userPhoto} alt={userName} />
            <DropDown>
              <span onClick={handleAuth} style={{ color: "white" }}>
                Sign Out
              </span>
              <hr style={{ width: "100%" }} />
              <span onClick={toggleMode} style={{ color: "white" }}>
                {mode == "false" ? "Light Mode" : "Dark Mode"}
              </span>
            </DropDown>
          </SignOut>
        </>
      )}
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  background-image: ${(props) =>
    props.mode == "true" &&
    `linear-gradient(rgba(131, 124, 124,0),rgba(214, 202, 202,1));`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;
`;

const Logo = styled.a`
  padding: 0;
  width: 80px;
  margin-top: 4px;
  max-height: 70px;
  font-size: 0;
  display: inline-block;

  img {
    display: block;
    width: 100%;
  }
`;

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;

    img {
      height: 20px;
      min-width: 20px;
      width: 20px;
      z-index: auto;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 13px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;

      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: "";
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }

    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
    @media (max-width: 768px) {
      justify-content: space-between;
      flex: 100%;
    }
  }

  // for first 3 elements
  a:nth-child(-n + 3) {
    @media (max-width: 600px) {
      margin-left: -30vw;
    }
    @media (min-width: 601px) and (max-width: 768px) {
      margin-right: auto;
    }
  }

  // for all from 4th elements
  a:nth-child(n + 4) {
    @media (min-width: 601px) and (max-width: 768px) {
      margin-right: -90px;
      // margin-left:auto;
    }
    @media (max-width: 600px) {
      margin-left: -5vw;
    }
  }

  a:nth-child(1) {
    @media (max-width: 600px) {
      margin-left: -38vw;
    }
  }

  a:nth-child(2) {
    @media (max-width: 600px) {
      margin-left: -35vw;
    }
  }

  a:nth-child(4) {
    @media (max-width: 768px) {
      margin-top: -70px;
      margin-right: -110px;
    }
  }
  a:nth-child(5) {
    @media (max-width: 600px) {
      margin-left: 18vw;
    }
  }
  a:nth-child(6) {
    @media (max-width: 768px) {
      margin-right: -82px;
    }
  }

  @media (max-width: 768px) {
    // display: none;
    flex-direction: column;
    justify-content: space-between;
    flex: 50%;
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
    cursor: pointer;
  }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 25px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 3px;
  font-size: 12px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    right: -35px;
    top: 50px;
    padding: 1px;
    font-size: 10px;
    width: 90px;
  }

  @media (min-width: 992px) {
    right: 50px;
    top: -10px;
    padding: 3px;
    font-size: 14px;
    width: 110px;
  }

  span {
    &:hover {
      background-color: #1890ff;
      cursor: pointer;
      border-radius: 4px;
    }
  }
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  &:hover {
    ${DropDown} {
      opacity: 0.75;
      transition-duration: 1s;
    }
  }
`;

export default Header;
