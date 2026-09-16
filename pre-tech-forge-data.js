(function (global) {
  "use strict";

  /**
   * Pre-Tech Forge sessions by edition year.
   * Replace placeholder entries with real speakers/sessions before launch.
   * Set isPlaceholder: false (or remove the field) for published sessions.
   */
  /**
   * DEV PLACEHOLDERS — replace these objects with real sessions.
   * Remove isPlaceholder (or set false) when publishing.
   * Leave the array empty [] to hide session cards until you have data.
   */
  var SESSIONS = [
    {
      id: "ptf-2026-placeholder-1",
      year: 2026,
      isPlaceholder: true,
      speaker: {
        name: "[Speaker Name]",
        role: "[Role]",
        company: "[Company]",
        image: "",
      },
      title: "[Session title — replace me]",
      description:
        "Replace this with a short description of the online session.",
      date: "2026-10-10",
      time: "18:00",
      timezone: "WAT",
      platform: "Google Meet",
      registrationUrl: "#",
      recordingUrl: null,
      status: "upcoming",
    },
    {
      id: "ptf-2026-placeholder-2",
      year: 2026,
      isPlaceholder: true,
      speaker: {
        name: "[Speaker Name]",
        role: "[Role]",
        company: "[Company]",
        image: "",
      },
      title: "[Session title — replace me]",
      description:
        "Replace this with a short description of the online session.",
      date: "2026-10-24",
      time: "18:00",
      timezone: "WAT",
      platform: "Google Meet",
      registrationUrl: "#",
      recordingUrl: null,
      status: "upcoming",
    },
  ];

  function parseDate(session) {
    if (!session.date) return 0;
    return Date.parse(session.date + "T" + (session.time || "00:00") + ":00") || 0;
  }

  function formatDate(isoDate) {
    if (!isoDate) return "";
    var parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var month = months[Number(parts[1]) - 1] || parts[1];
    return month + " " + Number(parts[2]) + ", " + parts[0];
  }

  function formatTime(session) {
    if (!session.time) return "";
    return session.time + (session.timezone ? " " + session.timezone : "");
  }

  function getAll() {
    return SESSIONS.slice();
  }

  function getByYear(year) {
    var y = Number(year);
    return SESSIONS.filter(function (s) {
      return s.year === y;
    });
  }

  function getUpcoming(year, limit) {
    var list = getByYear(year)
      .filter(function (s) {
        return s.status === "upcoming";
      })
      .sort(function (a, b) {
        return parseDate(a) - parseDate(b);
      });
    if (typeof limit === "number") return list.slice(0, limit);
    return list;
  }

  function getPast(year) {
    return getByYear(year)
      .filter(function (s) {
        return s.status === "completed";
      })
      .sort(function (a, b) {
        return parseDate(b) - parseDate(a);
      });
  }

  global.TechForgePreSessions = {
    currentYear: 2026,
    getAll: getAll,
    getByYear: getByYear,
    getUpcoming: getUpcoming,
    getPast: getPast,
    parseDate: parseDate,
    formatDate: formatDate,
    formatTime: formatTime,
  };
})(window);
