(function () {
  "use strict";

  var root = document.getElementById("editions-list");
  if (!root || !window.TechForgeEditions) return;

  var base = window.TECHFORGE_ASSET_BASE || "";
  var editions = window.TechForgeEditions.getAll();

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function metaIcons() {
    return {
      calendar:
        '<svg class="edition-row__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      pin:
        '<svg class="edition-row__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10.8" r="2.1" stroke="currentColor" stroke-width="1.8"/></svg>',
    };
  }

  function renderMeta(edition) {
    var icons = metaIcons();
    var parts = [];

    if (edition.datePrimary) {
      parts.push(
        '<div class="edition-row__meta-item">' +
          icons.calendar +
          '<div><p class="edition-row__meta-primary">' +
          esc(edition.datePrimary) +
          "</p>" +
          (edition.dateSecondary
            ? '<p class="edition-row__meta-secondary">' +
              esc(edition.dateSecondary) +
              "</p>"
            : "") +
          "</div></div>"
      );
    }

    if (edition.venuePrimary) {
      parts.push(
        '<div class="edition-row__meta-item">' +
          icons.pin +
          '<div><p class="edition-row__meta-primary">' +
          esc(edition.venuePrimary) +
          "</p>" +
          (edition.venueSecondary
            ? '<p class="edition-row__meta-secondary">' +
              esc(edition.venueSecondary) +
              "</p>"
            : "") +
          "</div></div>"
      );
    }

    if (!parts.length) return "";
    return '<div class="edition-row__meta">' + parts.join("") + "</div>";
  }

  function renderCta(edition) {
    if (edition.status === "upcoming") {
      return (
        '<a class="btn btn--primary" href="' +
        esc(
          window.TechForgeEditions.page(
            "",
            edition.ticketHref || "index.html#tickets"
          )
        ) +
        '">Get Your Ticket →</a>'
      );
    }

    return (
      '<a class="btn btn--outline" href="editions-' +
      edition.year +
      '.html">View Highlights →</a>'
    );
  }

  function renderBadge(edition) {
    if (edition.status === "upcoming") {
      return '<span class="edition-badge edition-badge--latest">Latest edition</span>';
    }
    return '<span class="edition-badge edition-badge--past">Past edition</span>';
  }

  root.innerHTML = editions
    .map(function (edition, index) {
      var flip = index % 2 === 1 ? " edition-row--flip" : "";
      return (
        '<article class="edition-row' +
        flip +
        '" id="edition-' +
        edition.year +
        '">' +
        '<div class="edition-row__media">' +
        '<figure class="edition-row__photo">' +
        '<img src="' +
        esc(window.TechForgeEditions.asset(base, edition.listImage)) +
        '" alt="' +
        esc(edition.listImageAlt || edition.title) +
        '" width="1536" height="1024" loading="lazy" />' +
        "</figure>" +
        "</div>" +
        '<div class="edition-row__copy">' +
        renderBadge(edition) +
        '<h2 class="edition-row__title">' +
        esc(edition.title) +
        "</h2>" +
        (edition.theme
          ? '<p class="edition-row__theme">' + esc(edition.theme) + "</p>"
          : "") +
        renderMeta(edition) +
        (edition.summary
          ? '<p class="edition-row__summary">' + esc(edition.summary) + "</p>"
          : "") +
        renderCta(edition) +
        "</div>" +
        "</article>"
      );
    })
    .join("");
})();
