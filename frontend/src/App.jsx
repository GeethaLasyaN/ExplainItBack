import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpFeedback, setFollowUpFeedback] = useState(null);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  const startLearning = () => {
    setPage("learn");
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo(0, 0);
  };

  /* =========================
     INTERACTIVE 3D
     ========================= */

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 8;

    setTilt({
      x: rotateX,
      y: rotateY,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      x: 0,
      y: 0,
    });
  };

  /* =========================
     AI EVALUATION
     ========================= */

  const evaluateExplanation = async () => {
    if (!topic.trim() || !explanation.trim()) {
      alert("Please enter a concept and explain it in your own words.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setFollowUpAnswer("");
    setFollowUpFeedback(null);

    try {
      const response = await fetch(
        "https://explainitback-wktr.onrender.com/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic.trim(),
            explanation: explanation.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setAnalysis(data);
    } catch (error) {
      console.error("Evaluation error:", error);

      alert(
        "Could not evaluate your explanation. Make sure the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FOLLOW UP
     ========================= */

  const submitFollowUp = async () => {
    if (!followUpAnswer.trim()) {
      alert("Please answer the follow-up question first.");
      return;
    }

    const evaluation = analysis?.evaluation;

    if (!evaluation?.follow_up) {
      alert("No follow-up question is available.");
      return;
    }

    setFollowUpLoading(true);
    setFollowUpFeedback(null);

    try {
      const response = await fetch(
        "https://explainitback-wktr.onrender.com/follow-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
            question: evaluation.follow_up,
            answer: followUpAnswer.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setFollowUpFeedback(data);
    } catch (error) {
      console.error("Follow-up error:", error);

      alert(
        "Could not evaluate your answer. Make sure the backend is running and try again."
      );
    } finally {
      setFollowUpLoading(false);
    }
  };

  const tryAnother = () => {
    setTopic("");
    setExplanation("");
    setAnalysis(null);
    setFollowUpAnswer("");
    setFollowUpFeedback(null);

    window.scrollTo(0, 0);
  };

  const evaluation = analysis?.evaluation || null;

  return (
    <div className="app">
      {page === "home" ? (
        <>
          {/* NAVBAR */}

          <nav className="navbar">
            <div className="logo" onClick={goHome}>
              <span className="logo-mark">E</span>
              <span>ExplainItBack</span>
            </div>

            <div className="nav-links">
              <button onClick={goHome}>Home</button>

              <button
                onClick={() =>
                  document
                    .getElementById("why")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                About
              </button>

              <button className="nav-cta" onClick={startLearning}>
                Let's Learn
              </button>
            </div>
          </nav>

          {/* HERO */}

          <main className="hero">
            <div className="hero-content">
              <div className="eyebrow">AI-POWERED LEARNING</div>

              <h1>
                Turn confusion
                <br />
                <span>into clarity.</span>
              </h1>

              <p>
                Don't just answer.
                <br />
                <strong>Prove that you understand.</strong>
              </p>

              <button className="hero-button" onClick={startLearning}>
                Let's Learn
                <span>→</span>
              </button>
            </div>

            {/* INTERACTIVE 3D VISUAL */}

            <div
              className="hero-visual"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>

              <div className="glow-dot"></div>

              <div
                className="three-d-scene"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                <div className="glass-back-card"></div>

                <div className="glass-card">
                  <div className="glass-shine"></div>

                  <div className="glass-top">
                    <span className="glass-logo">E</span>
                    <span>AI LEARNING</span>
                  </div>

                  <div className="glass-title">
                    EXPLAINITBACK
                  </div>

                  <div className="glass-steps">
                    <div>
                      <span>01</span>
                      <p>Explain.</p>
                    </div>

                    <div>
                      <span>02</span>
                      <p>Reflect.</p>
                    </div>

                    <div>
                      <span>03</span>
                      <p>Understand.</p>
                    </div>
                  </div>

                  <div className="glass-bottom">
                    AI evaluates what you actually understand.
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* WHY SECTION */}

          <section className="why-section" id="why">
            <div className="why-label">WHY EXPLAINITBACK</div>

            <h2>
              Understanding starts
              <br />
              <span>when you explain.</span>
            </h2>

            <p>
              Explain a concept in your own words. Our AI evaluates your
              understanding, finds what you're missing, and helps you improve.
            </p>
          </section>
        </>
      ) : (
        <>
          {/* LEARNING NAVBAR */}

          <nav className="learn-navbar">
            <div className="logo" onClick={goHome}>
              <span className="logo-mark">E</span>
              <span>ExplainItBack</span>
            </div>

            <div className="learn-nav-center">
              AI LEARNING LAB
            </div>

            <button className="back-button" onClick={goHome}>
              ← Back Home
            </button>
          </nav>

          {/* LEARNING PAGE */}

          <main
            className="learn-page"
            style={{
              paddingTop: "0px",
            }}
          >
            <section
              className="learn-intro"
              style={{
                marginTop: "0px",
                marginBottom: "28px",
              }}
            >
              <h1>
                Explain it <span>back.</span>
              </h1>

              <p>
                Pick a concept and explain it as if you were teaching it to
                someone else.
              </p>
            </section>

            {/* INPUT */}

            <section className="input-card">
              <div className="field">
                <label>
                  WHAT CONCEPT DO YOU WANT TO EXPLAIN?
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Neural Networks"
                />
              </div>

              <div className="field">
                <div className="label-row">
                  <label>
                    EXPLAIN IT IN YOUR OWN WORDS
                  </label>

                  <span className="character-count">
                    {explanation.length} characters
                  </span>
                </div>

                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain the concept as if you were teaching it to a friend..."
                  rows="8"
                />
              </div>

              <button
                className="evaluate-button"
                onClick={evaluateExplanation}
                disabled={loading}
              >
                {loading
                  ? "Analyzing your understanding..."
                  : "Evaluate My Understanding →"}
              </button>
            </section>

            {/* AI ANALYSIS */}

            {analysis && evaluation && (
              <section className="analysis-section">
                <div className="analysis-heading">
                  <div className="eyebrow">AI ANALYSIS</div>

                  <h2>Your Understanding</h2>

                  <p>
                    Evaluated concept:{" "}
                    <strong>{analysis.topic}</strong>
                  </p>
                </div>

                {/* SCORE */}

                <div className="score-card">
                  <div>
                    <span className="score-label">
                      UNDERSTANDING SCORE
                    </span>

                    <div className="score-number">
                      {evaluation.score}
                      <span>/100</span>
                    </div>
                  </div>

                  <div className="score-message">
                    {evaluation.score >= 80
                      ? "Strong understanding"
                      : evaluation.score >= 60
                      ? "Good foundation"
                      : evaluation.score >= 40
                      ? "Some gaps to work on"
                      : "Let's strengthen the basics"}
                  </div>
                </div>

                {/* ANALYSIS CARDS */}

                <div className="analysis-grid">
                  <div className="feedback-card correct-card">
                    <div className="feedback-label">
                      ✓ STRENGTHS
                    </div>

                    <h3>What you got right</h3>

                    {Array.isArray(evaluation.correct) &&
                    evaluation.correct.length > 0 ? (
                      <ul>
                        {evaluation.correct.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No specific strengths were identified.</p>
                    )}
                  </div>

                  <div className="feedback-card missed-card">
                    <div className="feedback-label">
                      ◐ GAPS
                    </div>

                    <h3>What you're missing</h3>

                    {Array.isArray(evaluation.missed) &&
                    evaluation.missed.length > 0 ? (
                      <ul>
                        {evaluation.missed.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No major gaps were identified.</p>
                    )}
                  </div>

                  <div className="feedback-card misconception-card">
                    <div className="feedback-label">
                      ! MISCONCEPTIONS
                    </div>

                    <h3>Watch out for</h3>

                    {Array.isArray(evaluation.misconceptions) &&
                    evaluation.misconceptions.length > 0 ? (
                      <ul>
                        {evaluation.misconceptions.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No misconceptions identified.</p>
                    )}
                  </div>

                  <div className="feedback-card improvement-card">
                    <div className="feedback-label">
                      → NEXT STEP
                    </div>

                    <h3>How to improve</h3>

                    <p>
                      {evaluation.improvement ||
                        "Keep practicing by explaining the concept in your own words."}
                    </p>
                  </div>
                </div>

                {/* FOLLOW UP */}

                {evaluation.follow_up && (
                  <div className="follow-up-section">
                    <div className="eyebrow">
                      TEST YOUR UNDERSTANDING
                    </div>

                    <h2>One more question.</h2>

                    <p className="follow-up-question">
                      {evaluation.follow_up}
                    </p>

                    <textarea
                      value={followUpAnswer}
                      onChange={(e) =>
                        setFollowUpAnswer(e.target.value)
                      }
                      placeholder="Answer in your own words..."
                      rows="5"
                    />

                    <button
                      className="evaluate-button"
                      onClick={submitFollowUp}
                      disabled={followUpLoading}
                    >
                      {followUpLoading
                        ? "Checking your answer..."
                        : "Submit Answer →"}
                    </button>

                    {followUpFeedback && (
                      <div className="follow-up-feedback">
                        <div className="follow-up-score">
                          <span>FOLLOW-UP SCORE</span>

                          <strong>
                            {followUpFeedback.score}
                            <small>/100</small>
                          </strong>
                        </div>

                        <div className="follow-up-content">
                          <div>
                            <span>WHAT YOU GOT RIGHT</span>

                            <p>
                              {followUpFeedback.correct ||
                                "Keep building on your explanation."}
                            </p>
                          </div>

                          <div>
                            <span>FEEDBACK</span>

                            <p>
                              {followUpFeedback.feedback ||
                                "Keep practicing your explanation."}
                            </p>
                          </div>

                          <div>
                            <span>NEXT STEP</span>

                            <p>
                              {followUpFeedback.next_step ||
                                "Try explaining the concept again using the feedback above."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ACTION BUTTONS */}

                <div className="analysis-actions">
                  <button
                    className="secondary-button"
                    onClick={tryAnother}
                  >
                    Try Another Concept
                  </button>

                  <button
                    className="primary-button"
                    onClick={goHome}
                  >
                    Back to Home
                  </button>
                </div>
              </section>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;