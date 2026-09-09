/**
 * Nexora Technologies - Main Interactive Logic
 * Handles smooth navigation, interactive buttons, contact form validation & success state
 */

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll handler for all anchor links pointing to on-page IDs
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          // Close mobile navbar collapse if open
          const navbarCollapse = document.getElementById("navbarSupportedContent");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        }
      }
    });
  });

  // Contact Form Elements & Validation
  const contactForm = document.getElementById("nexoraContactForm");
  const formCard = document.getElementById("contactFormContainer");
  const successBox = document.getElementById("contactSuccessState");
  const resetBtn = document.getElementById("resetContactFormBtn");

  if (contactForm) {
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("emailAddress");
    const phoneInput = document.getElementById("phoneNumber");
    const serviceInput = document.getElementById("serviceSelected");
    const messageInput = document.getElementById("projectMessage");

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Supports 03207470787, +923207470787, 0320-7470787, +92 320 7470787
    const phoneRegex = /^(\+92\s?|0)?3[0-9]{2}[\s\-]?[0-9]{7}$/;

    function validateField(input, condition) {
      if (!input) return true;
      if (condition) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
      } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
      }
    }

    // Attach real-time validation on blur & input
    if (nameInput) {
      nameInput.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          validateField(this, this.value.trim().length >= 3);
        }
      });
      nameInput.addEventListener("blur", function () {
        validateField(this, this.value.trim().length >= 3);
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          validateField(this, emailRegex.test(this.value.trim()));
        }
      });
      emailInput.addEventListener("blur", function () {
        validateField(this, emailRegex.test(this.value.trim()));
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          validateField(this, phoneRegex.test(this.value.trim()));
        }
      });
      phoneInput.addEventListener("blur", function () {
        validateField(this, phoneRegex.test(this.value.trim()));
      });
    }

    if (messageInput) {
      messageInput.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          validateField(this, this.value.trim().length >= 10);
        }
      });
      messageInput.addEventListener("blur", function () {
        validateField(this, this.value.trim().length >= 10);
      });
    }

    // On Form Submit
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 3);
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      const isPhoneValid = validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Button loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending Details... <i class="ri-loader-4-line ri-spin"></i>`;

        setTimeout(function () {
          // Update details in success message
          const successDetails = document.getElementById("successClientDetails");
          if (successDetails) {
            successDetails.innerHTML = `<strong>Reference:</strong> We've queued a consultation for <strong>${escapeHtml(nameInput.value.trim())}</strong>. Our Pakistan team will reach out at <strong>${escapeHtml(phoneInput.value.trim())}</strong> shortly.`;
          }

          // Show success state
          contactForm.style.display = "none";
          if (successBox) {
            successBox.style.display = "block";
          }

          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          // Scroll to confirmation box
          if (formCard) {
            formCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 600);
      } else {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });

    // Reset Form button
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        contactForm.reset();
        contactForm.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
          el.classList.remove("is-valid", "is-invalid");
        });
        if (successBox) {
          successBox.style.display = "none";
        }
        contactForm.style.display = "block";
        if (nameInput) {
          nameInput.focus();
        }
      });
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
