document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const label = document.getElementById("formLabel");
  const title = document.getElementById("formTitle");
  const description = document.getElementById("formDescription");
  const status = document.getElementById("authStatus");

  function showMode(mode) {
    const signup = mode === "signup";
    loginTab.classList.toggle("active", !signup);
    signupTab.classList.toggle("active", signup);
    loginTab.setAttribute("aria-selected", String(!signup));
    signupTab.setAttribute("aria-selected", String(signup));
    loginForm.classList.toggle("hidden", signup);
    signupForm.classList.toggle("hidden", !signup);
    label.textContent = signup ? "JOIN THE REPUBLIC" : "WELCOME BACK, PLAYER";
    title.textContent = signup
      ? "Claim your callsign"
      : "Continue your journey";
    description.textContent = signup
      ? "Create your account and save your place in the Nexus."
      : "Log in to access your saved worlds and collections.";
    status.textContent = "";
  }

  function setError(input, message) {
    input.classList.toggle("error", Boolean(message));
    input.closest(".auth-field").querySelector(".field-error").textContent =
      message;
  }

  function validateEmail(input) {
    if (!input.value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))
      return "Enter a valid email address.";
    return "";
  }

  function validatePassword(input, signup) {
    if (!input.value) return "Password is required.";
    if (signup && input.value.length < 8) return "Use at least 8 characters.";
    return "";
  }

  function handleSubmit(event, signup) {
    event.preventDefault();
    const form = signup ? signupForm : loginForm;
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    const name = form.querySelector('input[name="name"]');
    let valid = true;

    if (name && !name.value.trim()) {
      setError(name, "Choose a player name.");
      valid = false;
    } else if (name) setError(name, "");
    const emailError = validateEmail(email);
    setError(email, emailError);
    valid = !emailError && valid;
    const passwordError = validatePassword(password, signup);
    setError(password, passwordError);
    valid = !passwordError && valid;
    if (signup && !form.querySelector('input[name="terms"]').checked) {
      status.textContent = "Accept the Nexus terms to continue.";
      status.style.color = "#e37d8e";
      valid = false;
    }
    if (!valid) return;

    status.style.color = "#73d2a7";
    status.textContent = signup
      ? "Access profile ready for secure registration."
      : "Login details validated. Backend connection pending.";
  }

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.setAttribute(
        "aria-label",
        visible ? "Show password" : "Hide password",
      );
      button.innerHTML = `<i class='bx ${visible ? "bx-show" : "bx-hide"}'></i>`;
    });
  });

  const signupPassword = document.getElementById("signupPassword");
  signupPassword.addEventListener("input", () => {
    const score = Math.min(
      100,
      signupPassword.value.length * 8 +
        (/[A-Z]/.test(signupPassword.value) ? 15 : 0) +
        (/[0-9]/.test(signupPassword.value) ? 15 : 0) +
        (/[^A-Za-z0-9]/.test(signupPassword.value) ? 15 : 0),
    );
    const meter = signupPassword
      .closest(".auth-field")
      .querySelector(".password-meter span");
    meter.style.width = `${score}%`;
    meter.style.background =
      score > 70 ? "#73d2a7" : score > 40 ? "#78c6eb" : "#e37d8e";
  });

  loginTab.addEventListener("click", () => showMode("login"));
  signupTab.addEventListener("click", () => showMode("signup"));
  loginForm.addEventListener("submit", (event) => handleSubmit(event, false));
  signupForm.addEventListener("submit", (event) => handleSubmit(event, true));
});
