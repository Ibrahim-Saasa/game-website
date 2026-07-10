// ========== MODAL FUNCTIONALITY ==========
class Modal {
  constructor(modalSelector) {
    this.modal = document.querySelector(modalSelector);
    this.overlay = document.querySelector(".modal-overlay");
    this.closeBtn = this.modal?.querySelector(".modal-close");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.close());
    }
  }

  open() {
    if (this.modal) {
      this.modal.style.display = "flex";
      if (this.overlay) this.overlay.style.display = "block";
    }
  }

  close() {
    if (this.modal) {
      this.modal.style.display = "none";
      if (this.overlay) this.overlay.style.display = "none";
    }
  }
}

// ========== FORM VALIDATION ==========
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateForm()) {
      this.showSuccessModal();
      this.form.reset();
    }
  }

  validateForm() {
    const nameInput = this.form.querySelector('input[name="name"]');
    const emailInput = this.form.querySelector('input[name="email"]');
    const messageInput = this.form.querySelector('textarea[name="message"]');

    let isValid = true;

    // Validate name
    if (!nameInput?.value.trim()) {
      this.showError(nameInput, "Name is required");
      isValid = false;
    } else {
      this.clearError(nameInput);
    }

    // Validate email
    if (!emailInput?.value.trim()) {
      this.showError(emailInput, "Email is required");
      isValid = false;
    } else if (!this.isValidEmail(emailInput.value)) {
      this.showError(emailInput, "Please enter a valid email");
      isValid = false;
    } else {
      this.clearError(emailInput);
    }

    // Validate message
    if (!messageInput?.value.trim()) {
      this.showError(messageInput, "Message is required");
      isValid = false;
    } else {
      this.clearError(messageInput);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(input, message) {
    input?.classList.add("error");
    let errorMsg = input?.parentElement.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("p");
      errorMsg.className = "error-message";
      input?.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  clearError(input) {
    input?.classList.remove("error");
    const errorMsg = input?.parentElement.querySelector(".error-message");
    if (errorMsg) errorMsg.remove();
  }

  showSuccessModal() {
    const modal = new Modal("#successModal");
    modal.open();

    // Auto close after 3 seconds
    setTimeout(() => modal.close(), 3000);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  new FormValidator("#contactForm");
});
