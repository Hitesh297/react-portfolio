import React, { useState, useRef, useEffect } from "react";
import "./CountDownTimer.css";

export default function CountDownTimer() {
  const [countdown, setCountdown] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const weddingDate = new Date("January 26, 2025 10:00:00").getTime();
      const now = new Date().getTime();
      const gap = weddingDate - now;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const textDay = Math.floor(gap / day)
        .toString()
        .padStart(3, "0");
      const textHour = Math.floor((gap % day) / hour)
        .toString()
        .padStart(2, "0");
      const textMinute = Math.floor((gap % hour) / minute)
        .toString()
        .padStart(2, "0");
      const textSecond = Math.floor((gap % minute) / second)
        .toString()
        .padStart(2, "0");

      setCountdown({
        days: textDay,
        hours: textHour,
        minutes: textMinute,
        seconds: textSecond,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section>
      <div className="countdown-container">
        <div className="countdown-item">
          <div className="countdown-box">
            <div className="countdown-glow"></div>
            <div className="countdown-content">
              <div className="countdown-number">{countdown.days}</div>
              <div className="countdown-label">Days</div>
            </div>
          </div>
        </div>

        <div className="countdown-item">
          <div className="countdown-box">
            <div className="countdown-glow"></div>
            <div className="countdown-content">
              <div className="countdown-number">{countdown.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
          </div>
        </div>

        <div className="countdown-item">
          <div className="countdown-box">
            <div className="countdown-glow"></div>
            <div className="countdown-content">
              <div className="countdown-number">{countdown.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
          </div>
        </div>

        <div className="countdown-item">
          <div className="countdown-box">
            <div className="countdown-glow"></div>
            <div className="countdown-content">
              <div className="countdown-number">{countdown.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
