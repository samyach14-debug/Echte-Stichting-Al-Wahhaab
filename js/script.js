/**
 * Stichting Al-Wahhaab — Hoofdscript
 * Mobiel menu en kleine UX-verbeteringen
 */

(function () {
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

})();
