(function () {
  "use strict";

  var mount = document.getElementById("edition-page");
  if (!mount || !window.TechForgeEditions) return;

  var year = Number(window.TECHFORGE_EDITION_YEAR);
  var base = window.TECHFORGE_ASSET_BASE || "";
  var edition = window.TechForgeEditions.getByYear(year);

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (!edition || edition.status !== "completed" || !edition.highlights) {
    mount.innerHTML =
      '<div class="container section--compact">' +
      '<p class="body-text">This edition page is not available yet.</p>' +
      '<a class="btn btn--outline" href="editions.html">← Back to Editions</a>' +
      "</div>";
    return;
  }

  var h = edition.highlights;
  var asset = window.TechForgeEditions.asset;

  document.title = edition.title + " — Tech Forge";

  function iconCalendar() {
    return (
      '<svg class="edition-detail__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function iconPin() {
    return (
      '<svg class="edition-detail__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="10.8" r="2.1" stroke="currentColor" stroke-width="1.8"/>' +
      "</svg>"
    );
  }

  var breadcrumb =
    '<nav class="breadcrumb container" aria-label="Breadcrumb">' +
    '<a href="index.html">Home</a>' +
    '<span class="breadcrumb__sep" aria-hidden="true">→</span>' +
    '<a href="editions.html">Editions</a>' +
    '<span class="breadcrumb__sep" aria-hidden="true">→</span>' +
    '<span aria-current="page">' +
    esc(edition.title) +
    "</span>" +
    "</nav>";

  var metaBits = [];
  if (h.datePrimary) {
    metaBits.push(
      '<div class="edition-detail__meta-item">' +
        iconCalendar() +
        '<div><p class="edition-detail__meta-primary">' +
        esc(h.datePrimary) +
        "</p>" +
        (h.dateSecondary
          ? '<p class="edition-detail__meta-secondary">' +
            esc(h.dateSecondary) +
            "</p>"
          : "") +
        "</div></div>"
    );
  }
  if (h.venuePrimary) {
    metaBits.push(
      '<div class="edition-detail__meta-item">' +
        iconPin() +
        '<div><p class="edition-detail__meta-primary">' +
        esc(h.venuePrimary) +
        "</p>" +
        (h.venueSecondary
          ? '<p class="edition-detail__meta-secondary">' +
            esc(h.venueSecondary) +
            "</p>"
          : "") +
        "</div></div>"
    );
  }

  var intro =
    '<section class="edition-detail section--compact" aria-labelledby="edition-heading">' +
    '<div class="container edition-detail__grid">' +
    '<div class="edition-detail__copy">' +
    '<p class="eyebrow">Tech Forge ' +
    esc(String(edition.year)) +
    "</p>" +
    '<h1 class="heading-lg edition-detail__title" id="edition-heading">' +
    esc(h.headlineDark) +
    ' <span class="text-blue">' +
    esc(h.headlineBlue) +
    "</span></h1>" +
    '<p class="edition-detail__lede">' +
    esc(h.retrospective) +
    "</p>" +
    (metaBits.length
      ? '<div class="edition-detail__meta">' + metaBits.join("") + "</div>"
      : "") +
    "</div>" +
    '<div class="edition-detail__media">' +
    (h.showNote
      ? '<aside class="edition-detail__note script" aria-hidden="true">Same People.<br />Bigger<br />Possibilities.</aside>'
      : "") +
    '<span class="edition-detail__accent" aria-hidden="true"></span>' +
    '<figure class="edition-detail__photo">' +
    '<img src="' +
    esc(asset(base, h.heroImage)) +
    '" alt="' +
    esc(h.heroImageAlt || edition.title) +
    '" width="1536" height="1024" />' +
    "</figure>" +
    "</div>" +
    "</div>" +
    "</section>";

  var statsHtml = "";
  if (h.stats && h.stats.length) {
    statsHtml =
      '<section class="edition-stats" aria-label="Edition numbers">' +
      '<div class="container edition-stats__grid">' +
      h.stats
        .map(function (stat) {
          return (
            '<div class="edition-stats__item">' +
            '<p class="edition-stats__value">' +
            esc(stat.value) +
            "</p>" +
            '<p class="edition-stats__label">' +
            esc(stat.label) +
            "</p>" +
            (stat.detail
              ? '<p class="edition-stats__detail">' + esc(stat.detail) + "</p>"
              : "") +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      "</section>";
  }

  var galleryHtml = "";
  if (h.gallery && h.gallery.length) {
    var galleryLink = h.galleryHref || "editions.html";

    galleryHtml =
      '<section class="edition-gallery section--compact" aria-labelledby="gallery-heading">' +
      '<div class="container edition-gallery__layout">' +
      '<div class="edition-gallery__intro">' +
      '<p class="eyebrow">Event Gallery</p>' +
      '<h2 class="heading-lg" id="gallery-heading">Moments<br /><span class="text-blue">that mattered.</span></h2>' +
      '<p class="edition-gallery__lede">A glimpse into the energy, conversations and community that made Tech Forge ' +
      esc(String(edition.year)) +
      " special.</p>" +
      '<a class="btn btn--outline" href="' +
      esc(galleryLink) +
      '">View Full Gallery →</a>' +
      "</div>" +
      '<div class="edition-gallery__collage">' +
      h.gallery
        .map(function (img, i) {
          return (
            '<figure class="edition-gallery__item edition-gallery__item--' +
            esc(img.size || "square") +
            (i === 0 ? " edition-gallery__item--lead" : "") +
            '"><img src="' +
            esc(asset(base, img.src)) +
            '" alt="' +
            esc(img.alt || "") +
            '" loading="lazy" width="1536" height="1024" /></figure>'
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</section>";
  }

  var speakersHtml = "";
  if (h.speakers && h.speakers.length) {
    speakersHtml =
      '<section class="edition-speakers section--compact" aria-labelledby="edition-speakers-heading">' +
      '<div class="container">' +
      '<div class="edition-speakers__head">' +
      "<div>" +
      '<p class="eyebrow">Featured Speakers</p>' +
      '<h2 class="heading-lg" id="edition-speakers-heading">Incredible people.<br /><span class="text-blue">Real insights.</span></h2>' +
      "</div>" +
      (h.speakersHref
        ? '<a class="btn btn--outline" href="' +
          esc(h.speakersHref) +
          '">View All Speakers →</a>'
        : "") +
      "</div>" +
      '<ul class="edition-speakers__grid">' +
      h.speakers
        .map(function (sp) {
          return (
            '<li class="edition-speaker">' +
            '<div class="edition-speaker__media"><img src="' +
            esc(asset(base, sp.image)) +
            '" alt="' +
            esc(sp.name) +
            '" width="400" height="400" loading="lazy" /></div>' +
            '<h3 class="edition-speaker__name">' +
            esc(sp.name) +
            "</h3>" +
            '<p class="edition-speaker__role">' +
            esc(sp.role || "") +
            "</p>" +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      "</div>" +
      "</section>";
  }

  var recordingsHtml = "";
  if (h.recordings && h.recordings.length) {
    recordingsHtml =
      '<section class="edition-moments section--compact" aria-labelledby="moments-heading">' +
      '<div class="container">' +
      '<p class="eyebrow">Key Moments</p>' +
      '<h2 class="heading-lg" id="moments-heading">Ideas. People.<br /><span class="text-blue">Progress.</span></h2>' +
      '<ul class="edition-moments__grid">' +
      h.recordings
        .map(function (rec) {
          return (
            '<li class="edition-moment">' +
            '<a class="edition-moment__link" href="' +
            esc(rec.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            '<div class="edition-moment__thumb">' +
            '<img src="' +
            esc(asset(base, rec.thumbnail)) +
            '" alt="" loading="lazy" />' +
            '<span class="edition-moment__play" aria-hidden="true"></span>' +
            (rec.duration
              ? '<span class="edition-moment__time">' +
                esc(rec.duration) +
                "</span>"
              : "") +
            "</div>" +
            '<p class="edition-moment__kind">' +
            esc(rec.kind || "") +
            "</p>" +
            '<h3 class="edition-moment__title">' +
            esc(rec.title) +
            "</h3>" +
            '<p class="edition-moment__meta">' +
            esc(rec.speaker || "") +
            (rec.speaker ? " · " : "") +
            esc(edition.title) +
            "</p>" +
            "</a>" +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      "</div>" +
      "</section>";
  }

  mount.innerHTML =
    breadcrumb + intro + statsHtml + galleryHtml + speakersHtml + recordingsHtml;
})();
