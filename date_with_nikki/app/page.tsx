"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const NO_BUTTON_WIDTH = 84;
const NO_BUTTON_HEIGHT = 42;

export default function Home() {
  const backgroundIconPool = [
    "/background-icons/20241114_104303_399669____1_____1200x1200-removebg-preview.png",
    "/background-icons/71e0jHKq6AL._AC_UF350_350_QL80_-removebg-preview.png",
    "/background-icons/what-is-crybaby-crybunny-cryteddy-singapore-where-to-buy-removebg-preview.png",
  ];

  const figures = Array.from({ length: 26 }, (_, index) => {
    const size = (26 + ((index * 9) % 30)) * 5;
    const top = (index * 29) % 100;
    const left = (index * 17 + 11) % 100;
    const delay = ((index % 6) * 0.35).toFixed(2);
    const duration = (5 + (index % 5) * 1.25).toFixed(2);

    return {
      id: index,
      icon: backgroundIconPool[index % backgroundIconPool.length],
      style: {
        "--figure-size": `${size}px`,
        "--figure-top": `${top}%`,
        "--figure-left": `${left}%`,
        "--figure-delay": `${delay}s`,
        "--figure-duration": `${duration}s`,
      } as React.CSSProperties,
    };
  });

  const playZoneRef = useRef<HTMLDivElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 232, y: 6 });
  const [accepted, setAccepted] = useState(false);

  const moveNoButton = useCallback(() => {
    const zone = playZoneRef.current;
    if (!zone) {
      return;
    }

    const horizontalLimit = Math.max(
      0,
      zone.clientWidth - NO_BUTTON_WIDTH - 10,
    );
    const verticalLimit = Math.max(0, zone.clientHeight - NO_BUTTON_HEIGHT - 6);

    setNoPosition({
      x: Math.floor(Math.random() * (horizontalLimit + 1)),
      y: Math.floor(Math.random() * (verticalLimit + 1)),
    });
  }, []);

  return (
    <div className="scene">
      <div className="background-field" aria-hidden="true">
        {figures.map((figure) => (
          <span key={figure.id} className="background-figure" style={figure.style}>
            <Image src={figure.icon} alt="" width={96} height={96} />
          </span>
        ))}
      </div>

      <main className="question-card">
        <Image
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3ZxODUxN2lhNTJkM2VkazZ2Nm1yemUxaWc4b3J1bXZ4Nzh5azk2cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/otC3E9VpgzSdEDUglZ/giphy.gif"
          alt="Character icon"
          width={78}
          height={78}
          className="avatar"
          unoptimized
          priority
        />

        <h1 className="question">❀ Will you go on a date with me? ❀</h1>

        <div className="button-zone" ref={playZoneRef}>
          <button type="button" className="yes-button" onClick={() => setAccepted(true)}>
            YES 💞
          </button>

          <button
            type="button"
            className="no-button"
            style={{ left: `${noPosition.x}px`, top: `${noPosition.y}px` }}
            onMouseEnter={moveNoButton}
            onFocus={moveNoButton}
            onTouchStart={moveNoButton}
            onClick={(event) => {
              event.preventDefault();
              moveNoButton();
            }}
          >
            no ..
          </button>
        </div>

        <p className={`result ${accepted ? "result--show" : ""}`}>Yay, see you soon 💗</p>
      </main>
    </div>
  );
}
