"use client";

import emailjs from "@emailjs/browser";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const NO_BUTTON_WIDTH = 84;
const NO_BUTTON_HEIGHT = 42;
const serviceID = "service_o5buunn";
const templateID = "template_ocfvkz8";
const publicKey = "6zUxxpUGs9dDk27Zj";

const questionQueue = [
  {
    key: "when",
    label: "When should we go?",
    placeholder: "Friday, Saturday, or Sunday",
    inputType: "text",
  },
  {
    key: "time",
    label: "What time works best?",
    placeholder: "Around 6:30 PM",
    inputType: "text",
  },
  {
    key: "activity",
    label: "What activity do you want?",
    placeholder: "Dinner, arcade, coffee, movie...",
    inputType: "text",
  },
  {
    key: "where",
    label: "Where should we go?",
    placeholder: "Pick your favorite place",
    inputType: "text",
  },
] as const;

type QuestionKey = (typeof questionQueue)[number]["key"];
type Answers = Record<QuestionKey, string>;

type EmailState = "idle" | "sending" | "success" | "error";

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
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({
    when: "",
    time: "",
    activity: "",
    where: "",
  });
  const [emailAddress, setEmailAddress] = useState("");
  const [emailState, setEmailState] = useState<EmailState>("idle");
  const [emailMessage, setEmailMessage] = useState("");

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

  const activeQuestion =
    currentStep >= 0 && currentStep < questionQueue.length
      ? questionQueue[currentStep]
      : null;

  const handleNextStep = () => {
    if (!activeQuestion) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleSendEmail = async () => {
    if (!emailAddress.trim()) {
      setEmailState("error");
      setEmailMessage("Please enter an email address first.");
      return;
    }

    setEmailState("sending");
    setEmailMessage("Sending confirmation email...");

    try {
      await emailjs.send(
        serviceID,
        templateID,
        {
          to_email: emailAddress,
          reply_to: emailAddress,
          when: answers.when,
          time: answers.time,
          activity: answers.activity,
          where: answers.where,
        },
        { publicKey },
      );

      setEmailState("success");
      setEmailMessage("Confirmation email sent successfully.");
    } catch {
      setEmailState("error");
      setEmailMessage("Unable to send the confirmation email.");
    }
  };

  return (
    <div className="scene">
      <div className="background-field" aria-hidden="true">
        {figures.map((figure) => (
          <span key={figure.id} className="background-figure" style={figure.style}>
            <Image src={figure.icon} alt="" width={96} height={96} />
          </span>
        ))}
      </div>

      {currentStep === -1 ? (
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
            <button
              type="button"
              className="yes-button"
              onClick={() => setCurrentStep(0)}
            >
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
        </main>
      ) : currentStep < questionQueue.length && activeQuestion ? (
        <main className="question-card flow-card">
          <p className="flow-progress">
            Question {currentStep + 1} of {questionQueue.length}
          </p>
          <h2 className="flow-question">{activeQuestion.label}</h2>
          <input
            type={activeQuestion.inputType}
            className="flow-input"
            placeholder={activeQuestion.placeholder}
            value={answers[activeQuestion.key]}
            onChange={(event) =>
              setAnswers((prev) => ({
                ...prev,
                [activeQuestion.key]: event.target.value,
              }))
            }
          />
          <div className="flow-actions">
            {currentStep > 0 ? (
              <button
                type="button"
                className="flow-button flow-button--ghost"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              className="flow-button"
              onClick={handleNextStep}
              disabled={!answers[activeQuestion.key].trim()}
            >
              {currentStep === questionQueue.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </main>
      ) : currentStep === questionQueue.length ? (
        <main className="question-card flow-card email-card">
          <p className="flow-progress">Final step</p>
          <h2 className="flow-question">Send a confirmation email</h2>
          <p className="flow-copy">
            Enter your email address and I’ll send the date confirmation with
            the details you chose.
          </p>
          <div className="email-input-group">
            <input
              type="email"
              className="flow-input email-input"
              placeholder="you@example.com"
              inputMode="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
            />
          </div>
          <div className="flow-summary">
            <span>When: {answers.when}</span>
            <span>Time: {answers.time}</span>
            <span>Activity: {answers.activity}</span>
            <span>Where: {answers.where}</span>
          </div>
          <div className="flow-actions">
            <button
              type="button"
              className="flow-button"
              onClick={handleSendEmail}
              disabled={emailState === "sending"}
            >
              {emailState === "sending" ? "Sending..." : "Send email"}
            </button>
          </div>
          <p className={`result ${emailState !== "idle" ? "result--show" : ""}`}>
            {emailMessage}
          </p>
        </main>
      ) : (
        <main className="question-card flow-card">
          <h2 className="flow-question">Perfect, see you soon 💗</h2>
          <p className="result result--show">
            When: {answers.when} · Time: {answers.time} · Activity: {answers.activity} ·
            Where: {answers.where}
          </p>
        </main>
      )}
    </div>
  );
}
