(function () {
  "use strict";

  if (!window.TechForgePreSessions) return;

  var api = window.TechForgePreSessions;
  var year = api.currentYear;

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function roleLine(speaker) {
    var bits = [];
    if (speaker.role) bits.push(speaker.role);
    if (speaker.company) bits.push(speaker.company);
    return bits.join(", ");
  }

  function mediaHtml(session, className) {
    var img = session.speaker && session.speaker.image;
    var badge =
      '<span class="speaker-badge speaker-badge--online">' +
      (className === "speaker-card__media"
        ? "Pre-Tech Forge · Online"
        : "Online session") +
      "</span>";
    if (img) {
      return (
        '<div class="' +
        className +
        '">' +
        '<img src="' +
        esc(img) +
        '" alt="' +
        esc(session.speaker.name) +
        '" width="400" height="400" loading="lazy" />' +
        badge +
        "</div>"
      );
    }
    return (
      '<div class="' +
      className +
      ' ptf-media--empty" role="img" aria-label="' +
      esc(session.speaker.name) +
      '">' +
      badge +
      "</div>"
    );
  }

  function cta(session) {
    if (session.status === "upcoming" && session.registrationUrl) {
      return (
        '<a class="btn btn--primary ptf-card__cta" href="' +
        esc(session.registrationUrl) +
        '"' +
        (session.registrationUrl.indexOf("http") === 0
          ? ' target="_blank" rel="noopener noreferrer"'
          : "") +
        ">Register →</a>"
      );
    }
    if (
      session.status === "completed" &&
      session.recordingUrl
    ) {
      return (
        '<a class="btn btn--outline ptf-card__cta" href="' +
        esc(session.recordingUrl) +
        '" target="_blank" rel="noopener noreferrer">Watch Session →</a>'
      );
    }
    return "";
  }

  function previewCard(session) {
    return (
      '<article class="ptf-preview' +
      (session.isPlaceholder ? " ptf-preview--placeholder" : "") +
      '">' +
      mediaHtml(session, "ptf-preview__media") +
      '<div class="ptf-preview__body">' +
      '<p class="ptf-preview__name">' +
      esc(session.speaker.name) +
      "</p>" +
      '<p class="ptf-preview__role">' +
      esc(roleLine(session.speaker)) +
      "</p>" +
      '<h3 class="ptf-preview__title">' +
      esc(session.title) +
      "</h3>" +
      '<p class="ptf-preview__meta">' +
      esc(api.formatDate(session.date)) +
      " · " +
      esc(api.formatTime(session)) +
      "</p>" +
      '<p class="ptf-preview__platform">Online · ' +
      esc(session.platform || "Google Meet") +
      "</p>" +
      cta(session) +
      "</div>" +
      "</article>"
    );
  }

  function speakerCard(session) {
    return (
      '<li class="speaker-card speaker-card--ptf' +
      (session.isPlaceholder ? " speaker-card--placeholder" : "") +
      '">' +
      mediaHtml(session, "speaker-card__media") +
      '<div class="speaker-card__body">' +
      '<h3 class="speaker-card__name">' +
      esc(session.speaker.name) +
      "</h3>" +
      '<p class="speaker-card__role">' +
      esc(session.speaker.role || "") +
      (session.speaker.company
        ? "<br />" + esc(session.speaker.company)
        : "") +
      "</p>" +
      '<span class="speaker-card__rule speaker-card__rule--online"></span>' +
      '<p class="speaker-card__session">' +
      esc(session.title) +
      "</p>" +
      '<p class="ptf-card__when">' +
      esc(api.formatDate(session.date)) +
      " · " +
      esc(api.formatTime(session)) +
      "</p>" +
      '<p class="ptf-card__platform">Online · ' +
      esc(session.platform || "Google Meet") +
      "</p>" +
      cta(session) +
      "</div>" +
      "</li>"
    );
  }

  function sessionRow(session, detailed) {
    return (
      '<article class="ptf-session' +
      (session.isPlaceholder ? " ptf-session--placeholder" : "") +
      '">' +
      mediaHtml(session, "ptf-session__media") +
      '<div class="ptf-session__copy">' +
      '<p class="ptf-session__speaker">' +
      esc(session.speaker.name) +
      "</p>" +
      '<p class="ptf-session__role">' +
      esc(roleLine(session.speaker)) +
      "</p>" +
      '<h3 class="ptf-session__title">' +
      esc(session.title) +
      "</h3>" +
      (detailed && session.description
        ? '<p class="ptf-session__desc">' + esc(session.description) + "</p>"
        : "") +
      '<div class="ptf-session__meta">' +
      "<span>" +
      esc(api.formatDate(session.date)) +
      "</span>" +
      "<span>" +
      esc(api.formatTime(session)) +
      "</span>" +
      "<span>Online · " +
      esc(session.platform || "Google Meet") +
      "</span>" +
      "</div>" +
      cta(session) +
      "</div>" +
      "</article>"
    );
  }

  function pastRow(session) {
    var action = "";
    if (session.recordingUrl) {
      action =
        '<a class="link-arrow" href="' +
        esc(session.recordingUrl) +
        '" target="_blank" rel="noopener noreferrer">Watch Session <span class="link-arrow__glyph" aria-hidden="true">→</span></a>';
    }

    return (
      '<article class="ptf-past' +
      (session.isPlaceholder ? " ptf-past--placeholder" : "") +
      '">' +
      '<div class="ptf-past__main">' +
      '<p class="ptf-past__speaker">' +
      esc(session.speaker.name) +
      "</p>" +
      '<h3 class="ptf-past__title">' +
      esc(session.title) +
      "</h3>" +
      '<p class="ptf-past__date">' +
      esc(api.formatDate(session.date)) +
      "</p>" +
      "</div>" +
      (action ? '<div class="ptf-past__action">' + action + "</div>" : "") +
      "</article>"
    );
  }

  // Homepage: compact intro + up to 2 upcoming
  var homeRoot = document.getElementById("ptf-home");
  if (homeRoot) {
    var upcomingHome = api.getUpcoming(year, 2);
    var previewHtml = "";
    if (upcomingHome.length) {
      previewHtml =
        '<div class="ptf-home__previews">' +
        upcomingHome.map(previewCard).join("") +
        "</div>";
    }
    homeRoot.innerHTML =
      '<div class="container ptf-home__grid">' +
      '<div class="ptf-home__copy">' +
      '<p class="section-label">Pre-Tech Forge</p>' +
      '<h2 class="heading-md" id="ptf-home-heading">The conversations start before December 5.</h2>' +
      '<p class="body-text">Join our online sessions with builders and industry experts in the lead-up to Tech Forge 2026.</p>' +
      '<p class="ptf-meta">Online · Google Meet</p>' +
      '<a class="btn btn--outline" href="pre-tech-forge.html">Explore Pre-Tech Forge →</a>' +
      "</div>" +
      previewHtml +
      "</div>";
  }

  // Speakers page section
  var speakersRoot = document.getElementById("ptf-speakers");
  if (speakersRoot) {
    var allYear = api
      .getByYear(year)
      .slice()
      .sort(function (a, b) {
        if (a.status !== b.status) {
          return a.status === "upcoming" ? -1 : 1;
        }
        return api.parseDate(a) - api.parseDate(b);
      });

    var cards =
      allYear.length > 0
        ? '<ul class="speakers-grid ptf-speakers__grid">' +
          allYear.map(speakerCard).join("") +
          "</ul>"
        : '<p class="speakers-grid__note">Pre-Tech Forge sessions will be announced soon.</p>';

    speakersRoot.innerHTML =
      '<div class="container">' +
      '<div class="ptf-speakers__head">' +
      '<div>' +
      '<p class="section-label">Pre-Tech Forge</p>' +
      '<h2 class="heading-lg" id="ptf-speakers-heading">The conversations start before December 5.</h2>' +
      '<p class="body-text">Meet the builders and industry experts joining us online in the lead-up to Tech Forge 2026.</p>' +
      '<p class="ptf-meta">Online · Google Meet</p>' +
      "</div>" +
      '<a class="btn btn--outline" href="pre-tech-forge.html">Explore Pre-Tech Forge →</a>' +
      "</div>" +
      cards +
      "</div>";
  }

  // Dedicated page lists
  var upcomingRoot = document.getElementById("ptf-upcoming");
  if (upcomingRoot) {
    var upcoming = api.getUpcoming(year);
    upcomingRoot.innerHTML = upcoming.length
      ? upcoming.map(function (s) {
          return sessionRow(s, true);
        }).join("")
      : '<p class="body-text">Upcoming sessions will be announced soon.</p>';
  }

  var pastRoot = document.getElementById("ptf-past");
  if (pastRoot) {
    var past = api.getPast(year);
    pastRoot.innerHTML = past.length
      ? past.map(pastRow).join("")
      : '<p class="body-text">Past sessions will appear here after they go live.</p>';
  }
})();
