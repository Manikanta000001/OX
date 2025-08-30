import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "./components/Background/Background";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import "./Homepage.css";

function Homepage() {
  let heroData = [
    { text1: "Dare  !", text2: "to rule" },
    { text1: "Master", text2: "for the crown" },
    { text1: "Seize", text2: "the win!" },
  ];
  const [herocount, sethercount] = useState(2);
  const [playerstauts, setplayerstauts] = useState(false);
  const [username, setusername] = useState("");
  const [roomid, setroomid] = useState("");
  const navigate = useNavigate();

  //handling the join request

  const hadlejoin = () => {
    if (!username || !roomid) {
      toast.warn("Fill all details. !");
      return;
    } else if (username.length >= 15) {
      toast.warn("Max 15 letters.");
      return;
    } else if (isNaN(roomid) || roomid.length > 4) {
      toast.warn("Room ID: numbers only, limit 4.");
      return;
    }

    // storing data for reconnection
    localStorage.setItem("oxduel_username", username);
    localStorage.setItem("oxduel_room", roomid);
    navigate(`/loading/${roomid}/${username}`);
  };

  // slider effect
  useEffect(() => {
    localStorage.removeItem("oxduel_username");
    localStorage.removeItem("oxduel_room");
    setInterval(() => {
      sethercount((prevcount) => {
        return prevcount == 2 ? 0 : prevcount + 1;
      });
    }, 10000);
  }, []);

  return (
    <>
      <Navbar />
      <Background playerstauts={playerstauts} herocount={herocount} />
      <Hero
        setplayerstauts={setplayerstauts}
        heroData={heroData[herocount]}
        herocount={herocount}
        sethercount={sethercount}
        playerstauts={playerstauts}
        setusername={setusername}
        setroomid={setroomid}
        hadlejoin={hadlejoin}
      />
    </>
  );
}

export default Homepage;
