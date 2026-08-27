/**
 * Stichting Al-Wahhaab — Hoofdscript
 * Mobiel menu, IBAN-kopie en contactformulier (AJAX)
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const body = document.body;

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  const copyIbanBtn = document.querySelector(".copy-iban-btn");
  if (copyIbanBtn) {
    copyIbanBtn.addEventListener("click", function () {
      const iban = this.getAttribute("data-iban");
      if (!iban) return;

      navigator.clipboard.writeText(iban).then(function () {
        const original = copyIbanBtn.textContent;
        copyIbanBtn.textContent = "IBAN gekopieerd!";
        setTimeout(function () {
          copyIbanBtn.textContent = original;
        }, 2000);
      }).catch(function () {
        window.prompt("Kopieer het IBAN:", iban);
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const successBox = document.getElementById("form-success");
  const errorBox = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit");

  // Hardcoded Formspree endpoint
  const FORMSPREE_URL = "https://formspree.io/f/xgawnjvw";

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = "";
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen…";
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.style.display = "none";
        if (successBox) {
          successBox.hidden = false;
          successBox.focus();
        }
        contactForm.reset();
      } else {
        const data = await response.json();
        let message = "Er ging iets mis bij het versturen.";
        if (data && data.errors) {
          message = data.errors
            .map(function (err) {
              return err.message;
            })
            .join(" ");
        }
        throw new Error(message);
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent =
          err.message || "Er ging iets mis bij het versturen.";
        errorBox.hidden = false;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Verstuur bericht";
      }
    }
  });
});
