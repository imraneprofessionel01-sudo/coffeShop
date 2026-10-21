"use strict";

// Ce script utilise defer : le HTML est chargé avant son exécution.

// 1. Active le lien correspondant à la page, même en ouvrant index.html directement.
const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-nav .nav-link").forEach((link) => {
  const isCurrentPage = link.getAttribute("href") === currentPage;
  link.classList.toggle("active", isCurrentPage);

  if (isCurrentPage) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

// 2. Filtre les produits du menu. L'attribut hidden masque aussi les cartes au clavier.
const filterButtons = document.querySelectorAll("[data-filter]");
const menuItems = document.querySelectorAll(".menu-item");
const menuCategories = document.querySelectorAll(".menu-category");
const menuStatus = document.querySelector("#menu-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    menuItems.forEach((item) => {
      const isVisible = selectedCategory === "all" || item.dataset.category === selectedCategory;
      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    // Cache aussi le titre d'une catégorie qui n'a plus de produit visible.
    menuCategories.forEach((category) => {
      category.hidden = selectedCategory !== "all" && category.dataset.category !== selectedCategory;
    });

    if (menuStatus) {
      menuStatus.textContent = selectedCategory === "all"
        ? `${visibleCount} little reasons to stay awhile.`
        : `${visibleCount} ${button.textContent.toLowerCase()} favorites, made with care.`;
    }
  });
});

// 3. Validation locale du formulaire : aucun message n'est envoyé à un serveur.
const contactForm = document.querySelector("#contact-form");

// Cette condition permet de partager le script avec les pages sans formulaire.
if (contactForm) {
  const nameInput = contactForm.querySelector("#contact-name");
  const emailInput = contactForm.querySelector("#contact-email");
  const messageInput = contactForm.querySelector("#contact-message");
  const formStatus = document.querySelector("#form-status");
  const fields = [nameInput, emailInput, messageInput];

  // Sans JavaScript, le navigateur conserve sa validation HTML native.
  contactForm.noValidate = true;

  function validateField(field) {
    // trim() empêche de valider un nom ou un message composé d'espaces.
    field.setCustomValidity("");
    const minimumLength = field === nameInput ? 2 : field === messageInput ? 10 : 1;
    if (field.value.trim().length < minimumLength) {
      field.setCustomValidity("Please complete this field.");
    }

    // type="email" et les autres contraintes HTML sont vérifiés par validity.
    const isValid = field.validity.valid;
    field.classList.toggle("is-invalid", !isValid);
    field.setAttribute("aria-invalid", String(!isValid));
    return isValid;
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      formStatus.textContent = "";
      formStatus.className = "form-status mb-0";
      if (contactForm.dataset.submitted === "true") validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.dataset.submitted = "true";

    // map() vérifie tous les champs, puis every() vérifie le résultat global.
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      formStatus.textContent = "Please check the highlighted fields.";
      formStatus.className = "form-status is-error mb-0";
      contactForm.querySelector(".is-invalid").focus();
      return;
    }

    formStatus.textContent = "Your message looks good! This is a demo, so no email has been sent.";
    formStatus.className = "form-status is-success mb-0";
  });
}
