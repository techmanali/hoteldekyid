(() => {
  const header = document.getElementById("site-header");
  const drawer = document.getElementById("nav-drawer");
  const openBtn = document.getElementById("drawer-open");
  const closeBtn = document.getElementById("drawer-close");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const form = document.getElementById("inquiry-form");
  const formNote = document.getElementById("form-note");
  const yearEl = document.getElementById("year");
  const WA_NUMBER = "919418433766";

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Sticky header */
  const onScroll = () => {
    header?.classList.toggle("is-stuck", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav drawer via <dialog> */
  const openDrawer = () => {
    if (!drawer) return;
    drawer.showModal();
    openBtn?.setAttribute("aria-expanded", "true");
  };

  const closeDrawer = () => {
    if (!drawer?.open) return;
    drawer.close();
    openBtn?.setAttribute("aria-expanded", "false");
  };

  openBtn?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);

  drawer?.addEventListener("click", (event) => {
    if (event.target === drawer) closeDrawer();
  });

  drawer?.addEventListener("close", () => {
    openBtn?.setAttribute("aria-expanded", "false");
  });

  drawer?.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => closeDrawer());
  });

  /* Smooth-ish focus for in-page anchors when reduced motion is off is handled by CSS.
     Ensure hash targets get focus for a11y after navigation. */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.pushState(null, "", id);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* Gallery lightbox */
  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxImg.hidden = false;
    lightbox.showModal();
  };

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
    if (lightboxImg) {
      lightboxImg.removeAttribute("src");
      lightboxImg.alt = "";
      lightboxImg.hidden = true;
    }
  };

  document.querySelectorAll(".gallery-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-full");
      const img = btn.querySelector("img");
      if (src) openLightbox(src, img?.alt || "");
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  /* Inquiry form → WhatsApp */
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const arrival = String(data.get("arrival") || "").trim();
    const inquiry = String(data.get("inquiry") || "").trim();

    const lines = [
      "Hello Hotel Dekyid, I would like to inquire:",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
    ];
    if (arrival) lines.push(`Arrival: ${arrival}`);
    if (inquiry) lines.push(`Inquiry: ${inquiry}`);

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    if (formNote) {
      formNote.hidden = false;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  });
})();
