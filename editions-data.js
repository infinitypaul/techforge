(function (global) {
  "use strict";

  var EDITIONS = [
    {
      year: 2026,
      status: "upcoming",
      title: "Tech Forge 2026",
      theme:
        "The Builders’ Blueprint: Skills, Strategy & Innovation for the Future",
      datePrimary: "December 5, 2026",
      dateSecondary: "9:00 AM – 5:00 PM (WAT)",
      venuePrimary: "The Zone",
      venueSecondary: "Gbagada, Lagos",
      summary:
        "Our biggest edition yet. Bringing together builders, founders, technology professionals, students and emerging talent for a full day of practical learning, meaningful conversations and connections.",
      listImage: "second.png",
      listImageAlt: "Audience at Tech Forge",
      ticketHref: "index.html#tickets",
      highlights: null,
    },
    {
      year: 2025,
      status: "completed",
      title: "Tech Forge 2025",
      theme: "Building for real impact.",
      datePrimary: null,
      dateSecondary: null,
      venuePrimary: "Lagos, Nigeria",
      venueSecondary: null,
      summary:
        "A gathering of builders, founders and technology talent coming together to learn, connect and push Africa’s tech ecosystem forward.",
      listImage: "conference-stage-alt.png",
      listImageAlt: "Panel discussion at Tech Forge 2025",
      highlights: {
        headlineDark: "Building for",
        headlineBlue: "real impact.",
        retrospective:
          "Tech Forge 2025 brought builders, founders and technology professionals together for a day of practical learning, real conversations and meaningful connections across Africa’s tech community.",
        datePrimary: null,
        dateSecondary: null,
        venuePrimary: "Lagos, Nigeria",
        venueSecondary: null,
        heroImage: "conference-stage-alt.png",
        heroImageAlt: "Speakers on stage at Tech Forge 2025",
        showNote: true,
        stats: [],
        gallery: [
          {
            src: "conference-wide.png",
            alt: "Audience at Tech Forge 2025",
            size: "wide",
          },
          {
            src: "hero-stage.png",
            alt: "Keynote moment at Tech Forge 2025",
            size: "tall",
          },
          {
            src: "networking.png",
            alt: "Networking at Tech Forge 2025",
            size: "square",
          },
          {
            src: "second.png",
            alt: "Attendees at Tech Forge 2025",
            size: "square",
          },
          {
            src: "hero-audience.png",
            alt: "Community moment at Tech Forge 2025",
            size: "square",
          },
        ],
        galleryHref: "editions.html",
        speakers: [],
        speakersHref: null,
        recordings: [],
      },
    },
    {
      year: 2024,
      status: "completed",
      title: "Tech Forge 2024",
      theme: null,
      datePrimary: null,
      dateSecondary: null,
      venuePrimary: "Lagos, Nigeria",
      venueSecondary: null,
      summary:
        "An earlier Tech Forge gathering — part of the journey that continues to grow Africa’s community of builders, learners and leaders.",
      listImage: "hero-stage.png",
      listImageAlt: "Stage moment from Tech Forge 2024",
      highlights: {
        headlineDark: "Where builders",
        headlineBlue: "came together.",
        retrospective:
          "Tech Forge 2024 was an early chapter in bringing Africa’s builders together to learn, share and connect — laying the foundation for the editions that followed.",
        datePrimary: null,
        dateSecondary: null,
        venuePrimary: "Lagos, Nigeria",
        venueSecondary: null,
        heroImage: "hero-stage.png",
        heroImageAlt: "Speaker on stage at Tech Forge 2024",
        showNote: true,
        stats: [],
        gallery: [
          {
            src: "third.png",
            alt: "Conference moment from Tech Forge 2024",
            size: "wide",
          },
          {
            src: "audience.png",
            alt: "Community networking at Tech Forge 2024",
            size: "tall",
          },
          {
            src: "networking.png",
            alt: "Attendees connecting at Tech Forge 2024",
            size: "square",
          },
          {
            src: "hero-audience.png",
            alt: "Audience energy at Tech Forge 2024",
            size: "square",
          },
        ],
        galleryHref: "editions.html",
        speakers: [],
        speakersHref: null,
        recordings: [],
      },
    },
  ];

  function getEditions() {
    return EDITIONS.slice().sort(function (a, b) {
      return b.year - a.year;
    });
  }

  function getEditionByYear(year) {
    var y = Number(year);
    for (var i = 0; i < EDITIONS.length; i++) {
      if (EDITIONS[i].year === y) return EDITIONS[i];
    }
    return null;
  }

  function asset(base, path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path) || path.charAt(0) === "/") return path;
    return (base || "") + path;
  }

  function page(base, path) {
    return asset(base, path);
  }

  global.TechForgeEditions = {
    getAll: getEditions,
    getByYear: getEditionByYear,
    asset: asset,
    page: page,
  };
})(window);
