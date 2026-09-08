(function () {
  "use strict";
  const ENQUIRY_TYPES = {
    general: { label: "General Enquiry", routeKey: "general" },
    partnerships: { label: "Partnerships", routeKey: "partnerships" },
    sponsorship: { label: "Sponsorship", routeKey: "sponsorship" },
    speaking: { label: "Speaking Opportunity", routeKey: "speaking" },
    media: { label: "Media & Press", routeKey: "media" },
    volunteering: { label: "Volunteering", routeKey: "volunteering" },
    community: { label: "Community", routeKey: "community" },
    "event-support": { label: "Event Support", routeKey: "event-support" },
    other: { label: "Other", routeKey: "other" },
  };
  const ENQUIRY_DESTINATIONS = {};

  const SHORTCUT_TO_ENQUIRY = {
    partnerships: "partnerships",
    speaking: "speaking",
    media: "media",
    general: "general",
  };

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const statusEl = document.getElementById("contact-status");
  const submitBtn = form.querySelector("[data-submit-btn]");
  const enquirySelect = form.querySelector("[data-enquiry-select]");
  const panel = document.getElementById("contact-form-panel");

  const fields = {
    name: form.querySelector("#contact-name"),
    email: form.querySelector("#contact-email"),
    enquiry: enquirySelect,
    subject: form.querySelector("#contact-subject"),
    message: form.querySelector("#contact-message"),
  };

  function getErrorEl(field) {
    return document.getElementById(field.id + "-error");
  }

  function setFieldError(field, message) {
    const errorEl = getErrorEl(field);
    if (!errorEl) return;
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      field.classList.add("field__control--invalid");
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", errorEl.id);
    } else {
      errorEl.textContent = "";
      errorEl.hidden = true;
      field.classList.remove("field__control--invalid");
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }
  }

  function clearErrors() {
    Object.values(fields).forEach(function (field) {
      if (field) setFieldError(field, "");
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    clearErrors();
    let firstInvalid = null;

    if (!fields.name.value.trim()) {
      setFieldError(fields.name, "Please enter your full name.");
      firstInvalid = firstInvalid || fields.name;
    }

    const email = fields.email.value.trim();
    if (!email) {
      setFieldError(fields.email, "Please enter your email address.");
      firstInvalid = firstInvalid || fields.email;
    } else if (!isValidEmail(email)) {
      setFieldError(fields.email, "Please enter a valid email address.");
      firstInvalid = firstInvalid || fields.email;
    }

    if (!fields.enquiry.value) {
      setFieldError(fields.enquiry, "Please select what this is about.");
      firstInvalid = firstInvalid || fields.enquiry;
    }

    if (!fields.subject.value.trim()) {
      setFieldError(fields.subject, "Please enter a subject.");
      firstInvalid = firstInvalid || fields.subject;
    }

    if (!fields.message.value.trim()) {
      setFieldError(fields.message, "Please enter a message.");
      firstInvalid = firstInvalid || fields.message;
    } else if (fields.message.value.trim().length < 10) {
      setFieldError(fields.message, "Please share a little more detail.");
      firstInvalid = firstInvalid || fields.message;
    }

    return firstInvalid;
  }

  function showStatus(type, title, body) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.className = "contact-status contact-status--" + type;
    statusEl.innerHTML =
      "<p class=\"contact-status__title\">" +
      title +
      "</p><p class=\"contact-status__body\">" +
      body +
      "</p>";
  }

  function hideStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.className = "contact-status";
    statusEl.innerHTML = "";
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.setAttribute("aria-busy", isLoading ? "true" : "false");
    submitBtn.textContent = isLoading ? "Sending…" : "Send Message →";
  }

  function buildPayload() {
    const enquiryValue = fields.enquiry.value;
    const enquiryMeta = ENQUIRY_TYPES[enquiryValue] || {
      label: enquiryValue,
      routeKey: enquiryValue,
    };

    return {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      subject: fields.subject.value.trim(),
      message: fields.message.value.trim(),
      enquiry: {
        value: enquiryValue,
        label: enquiryMeta.label,
        routeKey: enquiryMeta.routeKey,
        destination: ENQUIRY_DESTINATIONS[enquiryMeta.routeKey] || null,
      },
      submittedAt: new Date().toISOString(),
      source: "techforge-contact-page",
    };
  }
  async function submitContactMessage(payload) {
    const endpoint =
      typeof window.TECHFORGE_CONTACT_ENDPOINT === "string"
        ? window.TECHFORGE_CONTACT_ENDPOINT
        : "";

    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = new Error("Request failed");
        err.status = response.status;
        throw err;
      }

      try {
        return await response.json();
      } catch (_) {
        return { ok: true };
      }
    }

    // No backend yet — simulate a successful submit so UI states can be tested.
    await new Promise(function (resolve) {
      setTimeout(resolve, 700);
    });
    return { ok: true, simulated: true, payload: payload };
  }

  function selectEnquiry(value) {
    if (!enquirySelect || !ENQUIRY_TYPES[value]) return;
    enquirySelect.value = value;
    setFieldError(enquirySelect, "");
    enquirySelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function focusForm(enquiryValue) {
    if (enquiryValue) selectEnquiry(enquiryValue);
    hideStatus();
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.setTimeout(function () {
      if (enquirySelect) enquirySelect.focus();
    }, 350);
  }

  document.querySelectorAll("[data-enquiry-shortcut]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.getAttribute("data-enquiry-shortcut");
      const enquiryValue = SHORTCUT_TO_ENQUIRY[key] || key;
      focusForm(enquiryValue);
    });
  });

  Object.values(fields).forEach(function (field) {
    if (!field) return;
    field.addEventListener("input", function () {
      setFieldError(field, "");
    });
    field.addEventListener("change", function () {
      setFieldError(field, "");
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideStatus();

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus(
        "error",
        "Please check the form.",
        "Some required fields need attention before we can send your message."
      );
      return;
    }

    const payload = buildPayload();
    setLoading(true);

    try {
      await submitContactMessage(payload);
      form.reset();
      // Keep placeholder selected state after reset
      if (enquirySelect) {
        enquirySelect.value = "";
      }
      showStatus(
        "success",
        "Thanks for reaching out.",
        "We’ve received your message and someone from the Tech Forge team will get back to you soon."
      );
      if (statusEl) {
        statusEl.focus();
        statusEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (_) {
      showStatus(
        "error",
        "Something went wrong.",
        "We couldn’t send your message just now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  });

  // Deep-link support: contact.html?enquiry=speaking
  const params = new URLSearchParams(window.location.search);
  const enquiryParam = params.get("enquiry");
  if (enquiryParam && ENQUIRY_TYPES[enquiryParam]) {
    focusForm(enquiryParam);
  }
})();
