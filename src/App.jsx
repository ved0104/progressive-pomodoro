import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Analytics from "./components/Analytics";
import { saveSessions } from "./api";

export default function App() {
  const [state, setState] = useState("focus-stopped"); // focus-running | focus-stopped | break-running | break-stopped | stopwatch
  const [isRunning, setIsRunning] = useState(false);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [sessionData, setSessionData] = useState([]);
  const [currentSessionFocus, setCurrentSessionFocus] = useState(0);
  const [currentSessionBreak, setCurrentSessionBreak] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const lastTickRef = useRef(0);

  // Load sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("pomodoroSessions");
    if (stored) {
      setSessionData(JSON.parse(stored));
    }
  }, []);

  // Save sessions to localStorage and database
  useEffect(() => {
    localStorage.setItem("pomodoroSessions", JSON.stringify(sessionData));
    
    // Save new sessions to database (only save the new one)
    if (sessionData.length > 0) {
      const lastSession = sessionData[sessionData.length - 1];
      saveSessions([lastSession]);
    }
  }, [sessionData]);

  // Update timer when duration settings change
  useEffect(() => {
    if (!isRunning && state !== "stopwatch") {
      if (state.includes("focus")) {
        setSecondsLeft(focusMinutes * 60);
      } else if (state.includes("break")) {
        setSecondsLeft(breakMinutes * 60);
      }
    }
  }, [focusMinutes, breakMinutes, state, isRunning]);

  // Main timer logic
  useEffect(() => {
    if (!isRunning) return;

    lastTickRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickRef.current) / 1000);

      if (elapsed >= 1) {
        lastTickRef.current = now;

        if (state === "focus-running") {
          setSecondsLeft((prev) => prev - 1);
          setCurrentSessionFocus((t) => t + 1);
        } else if (state === "break-running") {
          setSecondsLeft((prev) => prev - 1);
          setCurrentSessionBreak((t) => t + 1);
        } else if (state === "stopwatch") {
          setStopwatchSeconds((prev) => prev + 1);
          setCurrentSessionFocus((t) => t + 1); // Count extra focus time
        }
      }
    }, 100); // Check every 100ms instead of 1000ms for more accurate timing

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, state]);

  // Handle focus timer reach 0 - auto-start stopwatch
  useEffect(() => {
    if (secondsLeft === 0 && state === "focus-running") {
      // Transition to stopwatch but keep isRunning true to continue counting
      setState("stopwatch");
      setStopwatchSeconds(0);
      // isRunning stays true, so stopwatch continues automatically
    }
  }, [secondsLeft, state]);

  // Handle break timer reach 0
  useEffect(() => {
    if (secondsLeft === 0 && state === "break-running") {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setState("break-stopped");
    }
  }, [secondsLeft, state]);

  const getProgressPercentage = () => {
    if (state === "focus-running") {
      const total = focusMinutes * 60;
      return ((total - secondsLeft) / total) * 100;
    } else if (state === "break-running") {
      const total = breakMinutes * 60;
      return ((total - secondsLeft) / total) * 100;
    } else if (state === "stopwatch") {
      return 0; // No progress ring for stopwatch
    }
    return 0;
  };

  const getTotalSeconds = () => {
    if (state === "focus-running") return focusMinutes * 60;
    if (state === "break-running") return breakMinutes * 60;
    return 0;
  };

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const startFocus = () => {
    sessionStartTimeRef.current = new Date();
    setState("focus-running");
    setIsRunning(true);
  };

  const pauseFocus = () => {
    setState("focus-stopped");
    setIsRunning(false);
  };

  const stopFocus = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setState("stopwatch");
    setStopwatchSeconds(0);
  };

  const stopSession = () => {
    clearInterval(timerRef.current);
    
    // Save the session with accumulated focus time (includes stopwatch extra time)
    const newSession = {
      date: new Date().toISOString().split("T")[0],
      focusDuration: currentSessionFocus,
      breakDuration: 0, // Break hasn't started yet
      timestamp: Date.now(),
    };

    setSessionData((prev) => [...prev, newSession]);

    // Auto-start the break
    setState("break-running");
    setIsRunning(true);
    setSecondsLeft(breakMinutes * 60);
    setStopwatchSeconds(0);
    setCurrentSessionFocus(0); // Reset focus counter for the session
    // Keep track of break start for later
  };

  const startBreak = () => {
    setState("break-running");
    setIsRunning(true);
    setSecondsLeft(breakMinutes * 60);
  };

  const resumeBreak = () => {
    // Resume paused break without resetting the timer
    setState("break-running");
    setIsRunning(true);
  };

  const pauseBreak = () => {
    setState("break-stopped");
    setIsRunning(false);
  };

  const restartAndAdjust = () => {
    // Save the session
    const newSession = {
      date: new Date().toISOString().split("T")[0],
      focusDuration: currentSessionFocus,
      breakDuration: currentSessionBreak,
      timestamp: Date.now(),
    };

    setSessionData((prev) => [...prev, newSession]);

    // Reset
    setCurrentSessionFocus(0);
    setCurrentSessionBreak(0);
    setStopwatchSeconds(0);
    setSecondsLeft(focusMinutes * 60);
    setState("focus-stopped");
    setIsRunning(false);
  };

  const resetAll = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentSessionFocus(0);
    setCurrentSessionBreak(0);
    setStopwatchSeconds(0);
    setSecondsLeft(focusMinutes * 60);
    setState("focus-stopped");
  };

  return (
    <div className="container">
      <h1>Progressive Pomodoro</h1>

      {showAnalytics ? (
        <Analytics sessionData={sessionData} />
      ) : (
        <>
          <div className={`timer ${state.split("-")[0]}`}>
            {/* Circular progress + digital timer */}
            {(() => {
              const radius = 80;
              const circumference = 2 * Math.PI * radius;
              const progress = getProgressPercentage();
              const offset = Math.round(
                circumference * (1 - Math.max(0, Math.min(progress, 100)) / 100)
              );

              return (
                <div className="timer-wrapper">
                  <svg
                    className="progress-ring"
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${radius * 2 + 16} ${radius * 2 + 16}`}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden
                  >
                    <g transform={`translate(8,8)`}>
                      <circle
                        className="progress-ring__bg"
                        r={radius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                        strokeWidth="12"
                      />
                      <circle
                        className="progress-ring__progress"
                        r={radius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                        strokeWidth="12"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.4s linear" }}
                      />
                    </g>
                  </svg>

                  <div className="timer-label">
                    {state === "stopwatch"
                      ? `+${format(stopwatchSeconds)}`
                      : format(secondsLeft)}
                  </div>
                </div>
              );
            })()}
          </div>

          <h3>
            {state.includes("focus")
              ? "Focus Time"
              : state.includes("break")
              ? "Break Time"
              : "Ready for next session"}
          </h3>

          <div className="session-stats">
            {!state.includes("break") && (
              <>
                <div>Session Focus: {format(currentSessionFocus)}</div>
                {currentSessionBreak > 0 && (
                  <div>Session Break: {format(currentSessionBreak)}</div>
                )}
              </>
            )}
          </div>

          <div className="controls">
            {state === "focus-running" && (
              <>
                <button onClick={stopSession} className="stop-btn">
                  Stop & Start Break
                </button>
              </>
            )}

            {state === "focus-stopped" && (
              <>
                <button onClick={startFocus}>Start Focus</button>
              </>
            )}

            {state === "stopwatch" && (
              <button onClick={stopSession} className="stop-btn">
                Stop & Start Break
              </button>
            )}

            {state === "break-running" && (
              <>
              </>
            )}

            {state === "break-stopped" && (
              <>
                <button
                  onClick={() => {
                    setState("focus-stopped");
                    setSecondsLeft(focusMinutes * 60);
                    setStopwatchSeconds(0);
                    setCurrentSessionFocus(0);
                    setCurrentSessionBreak(0);
                  }}
                  className="restart-btn"
                >
                  Start Next Session
                </button>
              </>
            )}

            {!state.includes("break") && (
              <button onClick={resetAll} className="reset-btn">
                Reset All
              </button>
            )}
          </div>

          <div className="settings">
            <label>
              Focus Minutes:
              <input
                type="number"
                value={focusMinutes}
                onChange={(e) => {
                  const value = +e.target.value;
                  setFocusMinutes(value < 1 ? 1 : value);
                }}
                disabled={isRunning}
                min="1"
              />
            </label>

            <label>
              Break Minutes:
              <input
                type="number"
                value={breakMinutes}
                onChange={(e) => {
                  const value = +e.target.value;
                  setBreakMinutes(value < 1 ? 1 : value);
                }}
                disabled={isRunning}
                min="1"
              />
            </label>
          </div>

          <button
            onClick={() => setShowAnalytics(true)}
            className="analytics-btn"
          >
            View Analytics
          </button>
        </>
      )}

      {showAnalytics && (
        <button
          onClick={() => setShowAnalytics(false)}
          className="back-btn"
        >
          Back to Timer
        </button>
      )}
    </div>
  );
}
