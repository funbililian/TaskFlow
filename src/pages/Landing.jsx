
import { Link } from "react-router-dom";

function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="auth-brand landing-brand">
          TaskFlow<span>.</span>
        </Link>

        <Link to="/login" className="landing-login">
          Log in
        </Link>
      </nav>

      <section className="landing-hero">
        <p className="auth-eyebrow">YOUR DAY, UNDER CONTROL</p>

        <h1>
          Make room for
          <br />
          <span>meaningful progress.</span>
        </h1>

        <p className="landing-description">
          Organise your tasks, focus on what matters, and turn small steps
          into real progress. A calmer way to get things done, one day at a
          time.
        </p>

        <div className="landing-actions">
          <Link to="/register" className="landing-primary">
            Get started <span aria-hidden="true">→</span>
          </Link>

          <Link to="/login" className="landing-secondary">
            I already have an account
          </Link>
        </div>

        <div className="landing-preview">
          <div className="landing-preview-top">
            <div>
              <span className="landing-preview-dot" />
              <span className="landing-preview-dot" />
              <span className="landing-preview-dot" />
            </div>
            <span>YOUR WORKSPACE</span>
          </div>

          <div className="landing-preview-content">
            <p className="landing-preview-label">TODAY'S FOCUS</p>
            <h2>Small steps. Big progress.</h2>

            <div className="landing-demo-task">
              <span className="landing-demo-check">✓</span>
              <span>Plan your priorities</span>
              <span className="landing-demo-done">Done</span>
            </div>

            <div className="landing-demo-task">
              <span className="landing-demo-empty" />
              <span>Focus on your next task</span>
              <span className="landing-demo-tag">In progress</span>
            </div>

            <div className="landing-demo-task">
              <span className="landing-demo-empty" />
              <span>Celebrate your progress</span>
              <span className="landing-demo-tag">Upcoming</span>
            </div>
          </div>
        </div>

        <p className="landing-footer">
          A little progress every day adds up.
        </p>
      </section>
    </main>
  );
}

export default Landing;
