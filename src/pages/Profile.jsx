
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  updateProfile,
  logoutUser,
} from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!localStorage.getItem("taskflow_token")) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await getCurrentUser();

        if (active) {
          setProfile({
            fullName: data.user.fullName || "",
            email: data.user.email || "",
            bio: data.user.bio || "",
          });
        }
      } catch (err) {
        if (!active) return;

        setError(err.message || "Unable to load your profile.");

        if (
          /authentication|required|token|log in|session|account not found/i.test(
            err.message || ""
          )
        ) {
          logoutUser();
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (saving) return;

    const fullName = profile.fullName.trim();
    const bio = profile.bio.trim();

    if (fullName.length < 2 || fullName.length > 80) {
      setError("Full name must be between 2 and 80 characters.");
      return;
    }

    if (bio.length > 300) {
      setError("About me must be 300 characters or fewer.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await updateProfile({ fullName, bio });

      setProfile((current) => ({
        ...current,
        fullName: data.user.fullName,
        email: data.user.email,
        bio: data.user.bio || "",
      }));

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      const message = err.message || "Unable to update your profile.";

      setError(message);

      if (
        /authentication|required|token|session|log in|account not found/i.test(
          message
        )
      ) {
        logoutUser();
        navigate("/login", { replace: true });
      }
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  const initials = profile.fullName.trim()
    ? profile.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "TF";

  if (loading) {
    return (
      <main className="auth-page">
        <section className="auth-card profile-card">
          <Link to="/" className="auth-brand">
            TaskFlow<span>.</span>
          </Link>
          <p className="auth-description">Loading your profile...</p>
        </section>
      </main>
    );
  }

  if (error && !profile.email) {
    return (
      <main className="auth-page">
        <section className="auth-card profile-card">
          <Link to="/" className="auth-brand">
            TaskFlow<span>.</span>
          </Link>

          <h1>Unable to load profile</h1>

          <p className="auth-message auth-error" role="alert">
            {error}
          </p>

          <button
            type="button"
            className="auth-submit"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>

          <Link to="/login" className="auth-back">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card profile-card">
        <Link to="/" className="auth-brand">
          TaskFlow<span>.</span>
        </Link>

        <p className="auth-eyebrow">YOUR ACCOUNT</p>
        <h1>My profile</h1>

        <p className="auth-description">
          Update your personal details and tell us a little about yourself.
        </p>

        <div
          className="profile-avatar"
          aria-label={`Initials: ${initials}`}
        >
          {initials}
        </div>

        <form className="auth-form" onSubmit={handleSave}>
          <label htmlFor="profileName">Full name</label>
          <input
            id="profileName"
            name="fullName"
            type="text"
            value={profile.fullName}
            onChange={handleChange}
            minLength={2}
            maxLength={80}
            required
          />

          <label htmlFor="profileEmail">Email address</label>
          <input
            id="profileEmail"
            type="email"
            value={profile.email}
            readOnly
          />

          <label htmlFor="profileBio">About me</label>
          <textarea
            id="profileBio"
            name="bio"
            rows={4}
            value={profile.bio}
            onChange={handleChange}
            maxLength={300}
            placeholder="Tell us a little about yourself..."
          />

          <p className="auth-description">
            {profile.bio.length}/300 characters
          </p>

          {error && (
            <p className="auth-message auth-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-message" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={saving}
          >
            {saving ? "Saving changes..." : "Save changes"}
          </button>

          <button
            type="button"
            className="auth-submit"
            onClick={handleLogout}
            disabled={saving}
          >
            Log out
          </button>
        </form>

        <Link to="/dashboard" className="auth-back">
          ← Back to dashboard
        </Link>
      </section>
    </main>
  );
}

export default Profile;
