import "./index.css";
import { useState, useEffect, useRef } from "react";
import notice from "./assets/notification.mp3";
import ReactAudioPlayer from "react-audio-player";
import Logo from "./assets/appetitlogo.png";


function App() {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const clearCompleteOrdersTimeout = useRef(null);
  const inputRef = useRef(null);
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const click = () => setAudioPlayed(true);

  useEffect(() => {
    inputRef?.current.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();

    if (inputValue === "") {
      return;
    }

    const findWait = waitingOrders.find((item) => item === inputValue);

    if (findWait) {
      setAudioPlayed(true);

      const filterWait = waitingOrders.filter((item) => item !== inputValue);
      setWaitingOrders(filterWait);
      setCompleteOrders((prev) => [...prev, inputValue]);

      // Create a useRef hook to store the timeout ID

      // Clear any previous timeout before setting a new one
      if (clearCompleteOrdersTimeout.current) {
        clearTimeout(clearCompleteOrdersTimeout.current);
      }

      // Set the timeout
      clearCompleteOrdersTimeout.current = setTimeout(() => {
        setCompleteOrders([]);
      }, 15000);

      setInputValue("");
      inputRef?.current.focus();
    } else {
      setInputValue("");
      inputRef?.current.focus();
      setWaitingOrders((prev) => [...prev, inputValue]);
    }
  };

  useEffect(() => {
    if (inputValue.length === 3) {
      submit(new Event("submit"));
    }
  }, [inputValue]);

  useEffect(() => {
    return () => {
      if (clearCompleteOrdersTimeout.current) {
        clearTimeout(clearCompleteOrdersTimeout.current);
      }
    };
  }, []);

  return (
    <main className="container">
      {audioPlayed && (
        <ReactAudioPlayer
          src={notice}
          autoPlay={audioPlayed}
          onEnded={() => {
            setAudioPlayed(false);
          }}
          onError={(error) => console.error("Audio error:", error)}
        />
      )}
      <div className="top">
        <section className="half left">
          <dl className="bg-secondary text-primary">
            <dt>
              <i>Tayyorlanmoqda</i>
            </dt>
            <dd>
              <i>Готовиться</i>
            </dd>
          </dl>
          <p className="centered text-white">appetit</p>
          <ul className="items">
            {waitingOrders.map((item, i) => (
              <li key={i} className="item">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="half right">
          <dl className="bg-primary text-secondary" onClick={() => click()}>
            <dt>
              <i>Tayyor</i>
            </dt>
            <dd>
              <i>Готов</i>
            </dd>
          </dl>
          <p className="centered text-gray">appetit</p>
          <ul className="items">
            {completeOrders.map((item, i) => (
              <li key={i} className="item">
                {item}
              </li>
            ))}{" "}
          </ul>
        </section>
      </div>
      <div className="bottom">
        <div className="img-container">
          <img src={Logo} alt="" />
        </div>
      </div>
      <form onSubmit={submit}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">click</button>
      </form>
    </main>
  );
}

export default App;
