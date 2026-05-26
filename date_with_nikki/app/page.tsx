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
  const [showFunnyConfirm, setShowFunnyConfirm] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    when: "",
    time: "",
    activity: "",
    where: "",
  });
  const [emailAddress, setEmailAddress] = useState("");
  const [emailState, setEmailState] = useState<EmailState>("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];

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

  // --- Input validation and blocked-words handling ---
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);

  const blockedWords = [
    "tite",
    "nigga",
    "di ko alam",
    "idk",
    "i dont know",
  ];

  function isNumbersOnly(s: string) {
    return /^\s*\(?\d+\)?\s*$/.test(s);
  }

  function isScrambledLetters(s: string) {
    const letters = (s || "").toLowerCase().replace(/[^a-z]/g, "");
    if (letters.length < 5) return false;
    const vowels = letters.replace(/[^aeiou]/g, "").length;
    const ratio = vowels / letters.length;
    return ratio < 0.20; // very low vowel ratio → likely gibberish
  }

  function isBlockedInput(raw: string) {
    if (!raw) return false;
    const s = raw.toLowerCase().trim();
    for (const w of blockedWords) {
      if (s.includes(w)) return true;
    }
    if (isNumbersOnly(s)) return true;
    if (isScrambledLetters(s)) return true;
    return false;
  }

  function handleAnswerChange(key: QuestionKey, value: string) {
    if (isBlockedInput(value)) {
      setShowBlockedPopup(true);
      setAnswers((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleEmailChange(value: string) {
    if (isBlockedInput(value)) {
      setShowBlockedPopup(true);
      setEmailAddress("");
      return;
    }

    setEmailAddress(value);
  }

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
      // send to the recipient
      const recipientParams = {
        to_email: emailAddress,
        reply_to: emailAddress,
        when: answers.when,
        time: answers.time,
        activity: answers.activity,
        where: answers.where,
      };
      console.log("[email-debug] sending to recipient:", emailAddress, recipientParams);
      await emailjs.send(serviceID, templateID, recipientParams, publicKey);

      // also send a copy to the owner's personal email for records
      const ownerEmail = "zoletaarvin661@gmail.com";  
      try {
        const ownerParams = {
          to_email: ownerEmail,
          reply_to: emailAddress,
          when: answers.when,
          time: answers.time,
          activity: answers.activity,
          where: answers.where,
        };
        console.log("[email-debug] sending owner copy to:", ownerEmail, ownerParams);
        await emailjs.send(serviceID, templateID, ownerParams, publicKey);

        setEmailState("success");
        setEmailMessage("check mo email mo or spam :))");
      } catch (ownerErr) {
        setEmailState("success");
        setEmailMessage(
          "Confirmation sent to recipient, but failed to save a copy to owner email.",
        );
      }
    } catch (err: any) {
      console.error("[email-debug] send error:", err);
      setEmailState("error");
      setEmailMessage(
        err?.message || "Unable to send the confirmation email.",
      );
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

      {currentStep === -1 && !showFunnyConfirm ? (
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
              onClick={() => setShowFunnyConfirm(true)}
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
      ) : null}

      {currentStep === -1 && showFunnyConfirm ? (
        <main className="question-card funny-card">
          <Image
            src="/background-icons/tenor.gif"
            alt="Celebration"
            width={92}
            height={92}
            className="avatar"
            unoptimized
            priority
          />

          <h1 className="question">WAIT YOU ACTUALLY SAID YES?? 😭</h1>
          <p className="funny-sub">ayaw pa mo?</p>

          <div className="button-zone">
            <button
              type="button"
              className="flow-button"
              onClick={() => {
                setShowFunnyConfirm(false);
                setCurrentStep(0);
              }}
            >
              kkk, whatever →
            </button>
          </div>
        </main>
      ) : currentStep >= 0 && currentStep < questionQueue.length && activeQuestion ? (
        <main className="question-card flow-card">
          <p className="flow-progress">
            Question {currentStep + 1} of {questionQueue.length}
          </p>
          <h2 className="flow-question">{activeQuestion.label}</h2>
          {activeQuestion.key === "activity" ? (
            <p className="flow-subtitle">cons: ikaw magd-decide</p>
          ) : null}
          {activeQuestion.key === "where" ? (
            <p className="flow-subtitle">cons: ikaw ulit magd-decide</p>
          ) : null}
          {activeQuestion.key === "when" ? (
            <input
              type="date"
              className="flow-input"
              value={answers.when}
              min={today}
              onChange={(event) =>
                handleAnswerChange("when", event.target.value)
              }
            />
          ) : activeQuestion.key === "time" ? (
            <select
              className="flow-input"
              value={answers.time}
              onChange={(event) =>
                setAnswers((prev) => ({ ...prev, time: event.target.value }))
              }
            >
              <option value="">Select a time...</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
              <option value="6:30 PM">6:00 PM</option>
              <option value="8:00 PM">8:00 PM</option>
              <option value="9:00 PM">9:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
            </select>
          ) : (
            <input
              type={activeQuestion.inputType}
              className="flow-input"
              placeholder={activeQuestion.placeholder}
              value={answers[activeQuestion.key]}
              onChange={(event) =>
                handleAnswerChange(activeQuestion.key as QuestionKey, event.target.value)
              }
            />
          )}
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
              className={`flow-button ${
                currentStep === questionQueue.length - 1 ? "set-button" : ""
              }`}
              onClick={handleNextStep}
              disabled={
                activeQuestion.key === "when"
                  ? !answers.when || answers.when < today
                  : !answers[activeQuestion.key].trim()
              }
            >
              {currentStep === questionQueue.length - 1 ? "set the date! ♥" : "Next"}
            </button>
          </div>
        </main>
      ) : currentStep === questionQueue.length ? (
        <main className="question-card flow-card email-card">
          <p className="flow-progress">Final step</p>
          <h2 className="flow-question">Send a confirmation email</h2>
          <p className="flow-copy">
            Enter your email address, bab
          </p>
          <div className="email-input-group">
            <input
              type="email"
              className="flow-input email-input"
              placeholder="you@example.com"
              inputMode="email"
              value={emailAddress}
              onChange={(event) => handleEmailChange(event.target.value)}
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
      ) : showBlockedPopup ? (
        <div className="blocked-overlay" role="dialog" aria-modal="true">
          <div className="blocked-popup">
            <p className="blocked-text">parang gago naman</p>
            <div style={{ textAlign: "center", marginTop: "0.6rem" }}>
              <button
                type="button"
                className="flow-button"
                onClick={() => setShowBlockedPopup(false)}
              >
                okay
              </button>
            </div>
          </div>
        </div>
      ) : currentStep > questionQueue.length ? (
        <main className="question-card flow-card">
          <h2 className="flow-question">Perfect, see you soon 💗</h2>
          <p className="result result--show">
            When: {answers.when} · Time: {answers.time} · Activity: {answers.activity} ·
            Where: {answers.where}
          </p>
        </main>
      ) : null}
    </div>
  );
}
