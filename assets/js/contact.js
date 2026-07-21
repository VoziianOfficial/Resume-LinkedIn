(function () {
    "use strict";

    const SELECTORS = {
        inquiryTypes: "[data-contact-inquiry-types]",
        collaborationTags: "[data-contact-collaboration-tags]",
        processTrack: "[data-contact-process-track]",
        faq: "[data-contact-faq]",
        form: "[data-contact-form]",
        formStatus: "[data-contact-form-status]",
        submitButton: "[data-contact-submit]",
        submitLabel: "[data-contact-submit-label]",
        serviceSelect: '[name="service"]',
        inquiryTypeSelect: '[name="inquiryType"]',
        sourcePage: '[name="sourcePage"]',
        honeypot: '[name="company"]',
        message: '[name="message"]',
        messageCounter: "[data-message-counter]",
        field: "[data-form-field]",
        revealGroup: "[data-contact-reveal-group]",
        revealItem: "[data-contact-reveal-item]"
    };

    const FALLBACK_INQUIRY_TYPES = [
        {
            title: "Career support inquiry",
            text:
                "Share the career materials, professional direction or preparation support you are currently considering.",
            icon: "file-search",
            value: "career-support"
        },
        {
            title: "Advertise and collaborate",
            text:
                "Contact NimoMark about relevant partnerships, advertising opportunities or professional collaboration.",
            icon: "handshake",
            value: "advertise-collaborate"
        },
        {
            title: "General platform question",
            text:
                "Ask about the website, service categories, privacy, accessibility or other general information.",
            icon: "message-circle-question",
            value: "general-question"
        }
    ];

    const FALLBACK_COLLABORATION_TAGS = [
        "Career specialists",
        "Professional communities",
        "Relevant advertisers",
        "Independent providers",
        "Educational partners"
    ];

    const FALLBACK_PROCESS = [
        {
            title: "Submit your inquiry",
            text:
                "Provide relevant context about your question without including unnecessary sensitive information.",
            icon: "send"
        },
        {
            title: "Information is reviewed",
            text:
                "The inquiry may be reviewed to understand its subject, relevance and potential next step.",
            icon: "clipboard-search"
        },
        {
            title: "Receive a response",
            text:
                "Where appropriate, you may receive information about available options, timing or independent specialists.",
            icon: "mail-check"
        }
    ];

    const FALLBACK_FAQ = [
        {
            question:
                "What information should I include in my inquiry?",
            answer:
                "Describe your current professional situation, intended direction and the type of support or information you are considering. Avoid including passwords, government identification numbers, payment details or unrelated sensitive information."
        },
        {
            question:
                "Do I need to choose a service before contacting NimoMark?",
            answer:
                "No. You can select a general inquiry option and explain your situation in the message field when you are uncertain which service category may be relevant."
        },
        {
            question:
                "How quickly will I receive a response?",
            answer:
                "Response times can vary depending on inquiry volume, subject and availability. Submitting an inquiry does not guarantee a response within a particular timeframe."
        },
        {
            question:
                "Does submitting the form create a service agreement?",
            answer:
                "No. A form submission is an inquiry only. Any possible service scope, availability, timing, pricing and terms would need to be communicated and accepted separately."
        },
        {
            question:
                "Can I use the form for advertising or collaboration proposals?",
            answer:
                "Yes. Select the advertising and collaboration inquiry type and provide relevant information about the organization, proposal and intended audience."
        },
        {
            question:
                "Can NimoMark guarantee employment or interviews?",
            answer:
                "No. NimoMark does not guarantee interviews, employment, salaries, placement, immigration outcomes or other career results."
        }
    ];

    const FIELD_RULES = {
        fullName: {
            required: true,
            minLength: 2,
            maxLength: 120,
            messages: {
                required: "Enter your full name.",
                minLength:
                    "Your name must contain at least 2 characters.",
                maxLength:
                    "Your name must contain no more than 120 characters."
            }
        },
        email: {
            required: true,
            maxLength: 254,
            email: true,
            messages: {
                required: "Enter your email address.",
                maxLength:
                    "Your email address is too long.",
                email:
                    "Enter a valid email address."
            }
        },
        inquiryType: {
            required: true,
            messages: {
                required: "Choose an inquiry type."
            }
        },
        service: {
            required: false,
            messages: {
                required: "Choose a service."
            }
        },
        message: {
            required: true,
            minLength: 20,
            maxLength: 4000,
            messages: {
                required:
                    "Describe your inquiry.",
                minLength:
                    "Your message must contain at least 20 characters.",
                maxLength:
                    "Your message must contain no more than 4,000 characters."
            }
        },
        privacyConsent: {
            required: true,
            checkbox: true,
            messages: {
                required:
                    "Confirm that you have read the Privacy Policy."
            }
        }
    };

    const state = {
        initialized: false,
        submitting: false,
        revealObserver: null,
        activeRequestController: null,
        statusTimer: null
    };

    function onDocumentReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener(
                "DOMContentLoaded",
                callback,
                {
                    once: true
                }
            );

            return;
        }

        callback();
    }

    function waitForGlobalApi(callback) {
        if (window.NimoMark) {
            callback(window.NimoMark);
            return;
        }

        document.addEventListener(
            "nimomark:ready",
            (event) => {
                callback(event.detail || window.NimoMark);
            },
            {
                once: true
            }
        );
    }

    function isPlainObject(value) {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        );
    }

    function toArray(value) {
        if (Array.isArray(value)) {
            return value;
        }

        if (isPlainObject(value)) {
            return Object.values(value);
        }

        return [];
    }

    function firstDefined(...values) {
        return values.find(
            (value) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        );
    }

    function escapeHtml(value) {
        if (
            window.NimoMark &&
            typeof window.NimoMark.escapeHtml === "function"
        ) {
            return window.NimoMark.escapeHtml(value);
        }

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        if (
            window.NimoMark &&
            typeof window.NimoMark.escapeAttribute ===
            "function"
        ) {
            return window.NimoMark.escapeAttribute(value);
        }

        return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function getConfigValue(path, fallbackValue = "") {
        if (
            window.NimoMark &&
            typeof window.NimoMark.getValue === "function"
        ) {
            return window.NimoMark.getValue(
                path,
                fallbackValue
            );
        }

        const source =
            window.NIMOMARK_CONFIG ||
            window.NimoMarkConfig ||
            {};

        const segments = String(path)
            .split(".")
            .map((segment) => segment.trim())
            .filter(Boolean);

        let current = source;

        for (const segment of segments) {
            if (
                current === null ||
                current === undefined ||
                !Object.prototype.hasOwnProperty.call(
                    Object(current),
                    segment
                )
            ) {
                return fallbackValue;
            }

            current = current[segment];
        }

        return current ?? fallbackValue;
    }

    function getConfiguredArray(paths, fallbackValue) {
        for (const path of paths) {
            const entries = toArray(getConfigValue(path));

            if (entries.length) {
                return entries;
            }
        }

        return fallbackValue;
    }

    function renderIcon(iconName, className = "") {
        return `
      <i
        class="${escapeAttribute(className)}"
        data-lucide="${escapeAttribute(iconName)}"
        aria-hidden="true"
      ></i>
    `;
    }

    function refreshIcons(scope = document) {
        if (
            window.NimoMark &&
            typeof window.NimoMark.refreshIcons === "function"
        ) {
            window.NimoMark.refreshIcons(scope);
            return;
        }

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {
            window.lucide.createIcons({
                root: scope,
                attrs: {
                    "aria-hidden": "true",
                    focusable: "false"
                }
            });
        }
    }

    function refreshAos() {
        if (
            window.NimoMark &&
            typeof window.NimoMark.refreshAos === "function"
        ) {
            window.NimoMark.refreshAos();
            return;
        }

        if (
            window.AOS &&
            typeof window.AOS.refreshHard === "function"
        ) {
            window.AOS.refreshHard();
            return;
        }

        if (
            window.AOS &&
            typeof window.AOS.refresh === "function"
        ) {
            window.AOS.refresh();
        }
    }

    function getEntryTitle(entry, fallback = "") {
        if (typeof entry === "string") {
            return entry;
        }

        return firstDefined(
            entry.title,
            entry.name,
            entry.label,
            fallback
        );
    }

    function getEntryText(entry, fallback = "") {
        if (typeof entry === "string") {
            return "";
        }

        return firstDefined(
            entry.text,
            entry.description,
            entry.summary,
            fallback
        );
    }

    function getEntryIcon(entry, fallback = "circle") {
        if (typeof entry === "string") {
            return fallback;
        }

        return firstDefined(
            entry.icon,
            entry.iconName,
            entry.lucideIcon,
            fallback
        );
    }

    function getInquiryTypes() {
        return getConfiguredArray(
            [
                "pages.contact.inquiryTypes",
                "pages.contact.inquiries",
                "contact.inquiryTypes",
                "form.inquiryTypes"
            ],
            FALLBACK_INQUIRY_TYPES
        );
    }

    function getCollaborationTags() {
        return getConfiguredArray(
            [
                "pages.contact.collaboration.tags",
                "advertiseCollaborate.tags",
                "contact.collaboration.tags"
            ],
            FALLBACK_COLLABORATION_TAGS
        );
    }

    function getProcessSteps() {
        return getConfiguredArray(
            [
                "pages.contact.process.steps",
                "pages.contact.process",
                "contact.process"
            ],
            FALLBACK_PROCESS
        ).slice(0, 3);
    }

    function getFaqItems() {
        return getConfiguredArray(
            [
                "pages.contact.faq.items",
                "pages.contact.faq",
                "contact.faq"
            ],
            FALLBACK_FAQ
        );
    }

    function getServices() {
        const services = getConfiguredArray(
            [
                "pages.contact.services",
                "services"
            ],
            []
        );

        return services;
    }

    function getServiceTitle(service) {
        return getEntryTitle(
            service,
            "Career support service"
        );
    }

    function getServiceSlug(service) {
        return firstDefined(
            service.slug,
            service.id,
            service.value,
            ""
        );
    }

    function renderInquiryTypes() {
        const mount = document.querySelector(
            SELECTORS.inquiryTypes
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getInquiryTypes()
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Inquiry type ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "message-square"
                );

                const value = firstDefined(
                    entry.value,
                    entry.id,
                    entry.slug,
                    `inquiry-${index + 1}`
                );

                return `
          <button
            class="contact-introduction__type"
            type="button"
            data-inquiry-type-value="${escapeAttribute(value)}"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 70, 210)}"
          >
            <span class="contact-introduction__type-icon">
              ${renderIcon(icon)}
            </span>

            <span class="contact-introduction__type-content">
              <span class="contact-introduction__type-title">
                ${escapeHtml(title)}
              </span>

              ${text
                        ? `
                    <span class="contact-introduction__type-text">
                      ${escapeHtml(text)}
                    </span>
                  `
                        : ""
                    }
            </span>

            <span class="contact-introduction__type-arrow">
              ${renderIcon("arrow-right")}
            </span>
          </button>
        `;
            })
            .join("");

        mount
            .querySelectorAll("[data-inquiry-type-value]")
            .forEach((button) => {
                button.addEventListener("click", () => {
                    selectInquiryType(
                        button.dataset.inquiryTypeValue
                    );
                });
            });
    }

    function renderCollaborationTags() {
        const mount = document.querySelector(
            SELECTORS.collaborationTags
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getCollaborationTags()
            .map((entry) => {
                const label =
                    typeof entry === "string"
                        ? entry
                        : firstDefined(
                            entry.label,
                            entry.title,
                            entry.name,
                            ""
                        );

                return `
          <span class="contact-collaboration__visual-tag">
            ${escapeHtml(label)}
          </span>
        `;
            })
            .join("");
    }

    function renderProcess() {
        const mount = document.querySelector(
            SELECTORS.processTrack
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getProcessSteps()
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Step ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "circle-dot"
                );

                return `
          <article
            class="contact-after__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 90, 180)}"
          >
            <span class="contact-after__icon">
              ${renderIcon(icon)}
            </span>

            <div class="contact-after__content">
              <span class="site-eyebrow">
                Step ${String(index + 1).padStart(2, "0")}
              </span>

              <h3 class="contact-after__title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="contact-after__text">
                      ${escapeHtml(text)}
                    </p>
                  `
                        : ""
                    }
            </div>
          </article>
        `;
            })
            .join("");
    }

    function renderFaq() {
        const mount = document.querySelector(
            SELECTORS.faq
        );

        if (!mount) {
            return;
        }

        const items = getFaqItems();

        mount.innerHTML = items
            .map((entry, index) => {
                const question = firstDefined(
                    entry.question,
                    entry.title,
                    entry.label,
                    `Question ${index + 1}`
                );

                const answer = firstDefined(
                    entry.answer,
                    entry.text,
                    entry.description,
                    ""
                );

                const expanded =
                    entry.expanded === true || index === 0;

                return `
          <article class="shared-accordion__item">
            <h3>
              <button
                class="shared-accordion__trigger"
                type="button"
                aria-expanded="${expanded ? "true" : "false"}"
              >
                <span>${escapeHtml(question)}</span>

                <span class="shared-accordion__icon">
                  ${renderIcon("plus")}
                </span>
              </button>
            </h3>

            <div
              class="shared-accordion__panel ${expanded ? "is-open" : ""
                    }"
              aria-hidden="${expanded ? "false" : "true"}"
            >
              <div class="shared-accordion__panel-inner">
                <div class="shared-accordion__answer">
                  <p>${escapeHtml(answer)}</p>
                </div>
              </div>
            </div>
          </article>
        `;
            })
            .join("");

        if (
            window.NimoMark &&
            typeof window.NimoMark.initializeAccordions ===
            "function"
        ) {
            const accordion = mount.matches(
                "[data-accordion]"
            )
                ? mount
                : mount.closest("[data-accordion]");

            if (accordion) {
                window.NimoMark.initializeAccordions(
                    accordion.parentElement || document
                );
            }
        }

        injectFaqSchema(items);
    }

    function injectFaqSchema(items) {
        const previousSchema = document.getElementById(
            "contact-faq-schema"
        );

        previousSchema?.remove();

        const mainEntity = items
            .map((entry) => {
                const question = firstDefined(
                    entry.question,
                    entry.title,
                    entry.label,
                    ""
                );

                const answer = firstDefined(
                    entry.answer,
                    entry.text,
                    entry.description,
                    ""
                );

                if (!question || !answer) {
                    return null;
                }

                return {
                    "@type": "Question",
                    name: question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: answer
                    }
                };
            })
            .filter(Boolean);

        if (!mainEntity.length) {
            return;
        }

        const script = document.createElement("script");

        script.id = "contact-faq-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity
        });

        document.head.append(script);
    }

    function populateInquiryTypeSelect(form) {
        const select = form.querySelector(
            SELECTORS.inquiryTypeSelect
        );

        if (!select) {
            return;
        }

        const existingValue = select.value;

        const placeholder = firstDefined(
            getConfigValue(
                "form.fields.inquiryType.placeholder"
            ),
            "Choose an inquiry type"
        );

        select.innerHTML = `
      <option value="">
        ${escapeHtml(placeholder)}
      </option>

      ${getInquiryTypes()
                .map((entry, index) => {
                    const title = getEntryTitle(
                        entry,
                        `Inquiry type ${index + 1}`
                    );

                    const value = firstDefined(
                        entry.value,
                        entry.id,
                        entry.slug,
                        `inquiry-${index + 1}`
                    );

                    return `
            <option value="${escapeAttribute(value)}">
              ${escapeHtml(title)}
            </option>
          `;
                })
                .join("")}
    `;

        if (
            existingValue &&
            Array.from(select.options).some(
                (option) => option.value === existingValue
            )
        ) {
            select.value = existingValue;
        }
    }

    function populateServiceSelect(form) {
        const select = form.querySelector(
            SELECTORS.serviceSelect
        );

        if (!select) {
            return;
        }

        const existingValue = select.value;

        const placeholder = firstDefined(
            getConfigValue(
                "form.fields.service.placeholder"
            ),
            "Choose a service or leave undecided"
        );

        const services = getServices();

        select.innerHTML = `
      <option value="">
        ${escapeHtml(placeholder)}
      </option>

      <option value="not-sure">
        I am not sure yet
      </option>

      ${services
                .map((service, index) => {
                    const title = getServiceTitle(service);

                    const value = firstDefined(
                        getServiceSlug(service),
                        `service-${index + 1}`
                    );

                    return `
            <option value="${escapeAttribute(value)}">
              ${escapeHtml(title)}
            </option>
          `;
                })
                .join("")}
    `;

        if (
            existingValue &&
            Array.from(select.options).some(
                (option) => option.value === existingValue
            )
        ) {
            select.value = existingValue;
        }
    }

    function selectInquiryType(value) {
        const form = document.querySelector(
            SELECTORS.form
        );

        if (!form) {
            return;
        }

        const select = form.querySelector(
            SELECTORS.inquiryTypeSelect
        );

        if (
            select &&
            Array.from(select.options).some(
                (option) => option.value === value
            )
        ) {
            select.value = value;
            clearFieldError(select);
        }

        form.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth",
            block: "start"
        });

        window.setTimeout(() => {
            if (select) {
                select.focus();
            } else {
                form
                    .querySelector(
                        'input:not([type="hidden"]):not([type="checkbox"])'
                    )
                    ?.focus();
            }
        }, 500);
    }

    function applyQueryParameters(form) {
        const parameters = new URLSearchParams(
            window.location.search
        );

        const inquiryType = firstDefined(
            parameters.get("inquiry"),
            parameters.get("inquiryType"),
            parameters.get("type")
        );

        const service = firstDefined(
            parameters.get("service"),
            parameters.get("serviceSlug")
        );

        const packageName = parameters.get("package");

        const inquirySelect = form.querySelector(
            SELECTORS.inquiryTypeSelect
        );

        const serviceSelect = form.querySelector(
            SELECTORS.serviceSelect
        );

        if (
            inquiryType &&
            inquirySelect &&
            Array.from(inquirySelect.options).some(
                (option) => option.value === inquiryType
            )
        ) {
            inquirySelect.value = inquiryType;
        }

        if (
            service &&
            serviceSelect &&
            Array.from(serviceSelect.options).some(
                (option) => option.value === service
            )
        ) {
            serviceSelect.value = service;
        }

        if (packageName) {
            const message = form.querySelector(
                SELECTORS.message
            );

            if (message && !message.value.trim()) {
                message.value =
                    `I would like to ask about the ${formatQueryLabel(
                        packageName
                    )} package. `;
            }
        }

        updateMessageCounter(form);
    }

    function formatQueryLabel(value) {
        return String(value)
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (character) =>
                character.toUpperCase()
            );
    }

    function getFieldRule(field) {
        if (!field?.name) {
            return null;
        }

        return FIELD_RULES[field.name] || null;
    }

    function normalizeFieldValue(field) {
        if (
            field.type === "checkbox" ||
            field.type === "radio"
        ) {
            return field.checked;
        }

        return String(field.value || "").trim();
    }

    function isValidEmail(value) {
        if (!value || value.length > 254) {
            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        return emailPattern.test(value);
    }

    function validateField(field) {
        const rule = getFieldRule(field);

        if (!rule) {
            return {
                valid: true,
                message: ""
            };
        }

        const value = normalizeFieldValue(field);

        if (rule.checkbox) {
            if (rule.required && value !== true) {
                return {
                    valid: false,
                    message: rule.messages.required
                };
            }

            return {
                valid: true,
                message: ""
            };
        }

        if (
            rule.required &&
            String(value).length === 0
        ) {
            return {
                valid: false,
                message: rule.messages.required
            };
        }

        if (
            !rule.required &&
            String(value).length === 0
        ) {
            return {
                valid: true,
                message: ""
            };
        }

        if (
            rule.minLength &&
            String(value).length < rule.minLength
        ) {
            return {
                valid: false,
                message: rule.messages.minLength
            };
        }

        if (
            rule.maxLength &&
            String(value).length > rule.maxLength
        ) {
            return {
                valid: false,
                message: rule.messages.maxLength
            };
        }

        if (rule.email && !isValidEmail(String(value))) {
            return {
                valid: false,
                message: rule.messages.email
            };
        }

        return {
            valid: true,
            message: ""
        };
    }

    function getFieldWrapper(field) {
        return (
            field.closest(SELECTORS.field) ||
            field.parentElement
        );
    }

    function getErrorElementId(field) {
        if (!field.id) {
            field.id = `contact-field-${field.name}`;
        }

        return `${field.id}-error`;
    }

    function showFieldError(field, message) {
        const wrapper = getFieldWrapper(field);

        if (!wrapper) {
            return;
        }

        const errorId = getErrorElementId(field);

        let errorElement =
            wrapper.querySelector(
                `[data-error-for="${field.name}"]`
            );

        if (!errorElement) {
            errorElement =
                document.createElement("p");

            errorElement.className =
                "site-form__error";

            errorElement.dataset.errorFor =
                field.name;

            errorElement.id = errorId;

            errorElement.setAttribute(
                "role",
                "alert"
            );

            wrapper.append(errorElement);
        }

        errorElement.textContent = message;
        errorElement.hidden = false;

        field.setAttribute("aria-invalid", "true");

        const describedBy = new Set(
            String(
                field.getAttribute("aria-describedby") || ""
            )
                .split(/\s+/)
                .filter(Boolean)
        );

        describedBy.add(errorId);

        field.setAttribute(
            "aria-describedby",
            Array.from(describedBy).join(" ")
        );

        wrapper.classList.add("has-error");
    }

    function clearFieldError(field) {
        const wrapper = getFieldWrapper(field);

        if (!wrapper) {
            return;
        }

        const errorElement =
            wrapper.querySelector(
                `[data-error-for="${field.name}"]`
            );

        if (errorElement) {
            errorElement.hidden = true;
            errorElement.textContent = "";
        }

        field.removeAttribute("aria-invalid");
        wrapper.classList.remove("has-error");

        const errorId = getErrorElementId(field);

        const describedBy = String(
            field.getAttribute("aria-describedby") || ""
        )
            .split(/\s+/)
            .filter(
                (id) => id && id !== errorId
            );

        if (describedBy.length) {
            field.setAttribute(
                "aria-describedby",
                describedBy.join(" ")
            );
        } else {
            field.removeAttribute("aria-describedby");
        }
    }

    function validateForm(form) {
        const invalidFields = [];

        Object.keys(FIELD_RULES).forEach(
            (fieldName) => {
                const field = form.elements.namedItem(
                    fieldName
                );

                if (
                    !field ||
                    field instanceof RadioNodeList
                ) {
                    return;
                }

                const result = validateField(field);

                if (result.valid) {
                    clearFieldError(field);
                    return;
                }

                showFieldError(field, result.message);
                invalidFields.push(field);
            }
        );

        return invalidFields;
    }

    function initializeFieldValidation(form) {
        Object.keys(FIELD_RULES).forEach(
            (fieldName) => {
                const field = form.elements.namedItem(
                    fieldName
                );

                if (
                    !field ||
                    field instanceof RadioNodeList
                ) {
                    return;
                }

                const validateCurrentField = () => {
                    const result = validateField(field);

                    if (result.valid) {
                        clearFieldError(field);
                    } else {
                        showFieldError(
                            field,
                            result.message
                        );
                    }
                };

                field.addEventListener(
                    "blur",
                    validateCurrentField
                );

                field.addEventListener(
                    field.type === "checkbox"
                        ? "change"
                        : "input",
                    () => {
                        if (
                            field.getAttribute("aria-invalid") ===
                            "true"
                        ) {
                            validateCurrentField();
                        }

                        if (field.name === "message") {
                            updateMessageCounter(form);
                        }
                    }
                );

                if (
                    field.tagName === "SELECT"
                ) {
                    field.addEventListener(
                        "change",
                        validateCurrentField
                    );
                }
            }
        );
    }

    function updateMessageCounter(form) {
        const message = form.querySelector(
            SELECTORS.message
        );

        const counter = form.querySelector(
            SELECTORS.messageCounter
        );

        if (!message || !counter) {
            return;
        }

        const maximum =
            Number(message.maxLength) || 4000;

        const current = message.value.length;

        counter.textContent =
            `${current.toLocaleString()} / ${maximum.toLocaleString()}`;

        counter.classList.toggle(
            "is-near-limit",
            current >= maximum * 0.9
        );

        counter.classList.toggle(
            "is-at-limit",
            current >= maximum
        );
    }

    function getFormStatus(form) {
        let status = form.querySelector(
            SELECTORS.formStatus
        );

        if (status) {
            return status;
        }

        status = document.createElement("div");

        status.className = "site-form__status";
        status.dataset.contactFormStatus = "";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        status.hidden = true;

        form.prepend(status);

        return status;
    }

    function showFormStatus(
        form,
        type,
        message,
        options = {}
    ) {
        const status = getFormStatus(form);

        window.clearTimeout(state.statusTimer);

        status.hidden = false;
        status.className =
            `site-form__status site-form__status--${type}`;

        status.setAttribute(
            "role",
            type === "error" ? "alert" : "status"
        );

        status.innerHTML = `
      <span class="site-form__status-icon">
        ${renderIcon(
            type === "success"
                ? "circle-check"
                : type === "error"
                    ? "circle-alert"
                    : "loader-circle"
        )}
      </span>

      <span>${escapeHtml(message)}</span>
    `;

        refreshIcons(status);

        if (options.focus) {
            status.setAttribute("tabindex", "-1");
            status.focus({
                preventScroll: false
            });
        }

        if (options.autoHide) {
            state.statusTimer = window.setTimeout(() => {
                status.hidden = true;
            }, options.autoHide);
        }
    }

    function hideFormStatus(form) {
        const status = form.querySelector(
            SELECTORS.formStatus
        );

        if (status) {
            status.hidden = true;
            status.textContent = "";
        }
    }

    function setSubmittingState(
        form,
        submitting
    ) {
        state.submitting = submitting;

        const submitButton = form.querySelector(
            SELECTORS.submitButton
        );

        const submitLabel =
            submitButton?.querySelector(
                SELECTORS.submitLabel
            );

        if (submitButton) {
            submitButton.disabled = submitting;
            submitButton.setAttribute(
                "aria-disabled",
                String(submitting)
            );

            submitButton.classList.toggle(
                "is-loading",
                submitting
            );
        }

        if (submitLabel) {
            if (!submitLabel.dataset.originalLabel) {
                submitLabel.dataset.originalLabel =
                    submitLabel.textContent.trim();
            }

            submitLabel.textContent = submitting
                ? "Sending inquiry…"
                : submitLabel.dataset.originalLabel;
        }

        form.setAttribute(
            "aria-busy",
            String(submitting)
        );
    }

    function createFormData(form) {
        const formData = new FormData(form);

        const sourcePage = form.querySelector(
            SELECTORS.sourcePage
        );

        if (sourcePage) {
            sourcePage.value =
                window.location.pathname;

            formData.set(
                "sourcePage",
                sourcePage.value
            );
        } else {
            formData.set(
                "sourcePage",
                window.location.pathname
            );
        }

        formData.set(
            "pageTitle",
            document.title
        );

        formData.set(
            "submittedAt",
            new Date().toISOString()
        );

        return formData;
    }

    async function parseResponse(response) {
        const contentType =
            response.headers.get("content-type") || "";

        if (
            contentType.includes("application/json")
        ) {
            try {
                return await response.json();
            } catch (error) {
                return {
                    success: false,
                    message:
                        "The server returned an unreadable response."
                };
            }
        }

        const text = await response.text();

        return {
            success: response.ok,
            message: text.trim()
        };
    }

    function getSuccessMessage(responseData) {
        return firstDefined(
            responseData.message,
            getConfigValue("form.successMessage"),
            "Thank you. Your inquiry has been submitted for review."
        );
    }

    function getErrorMessage(responseData) {
        return firstDefined(
            responseData.message,
            getConfigValue("form.errorMessage"),
            "Your inquiry could not be sent. Please review the form and try again."
        );
    }

    function resetFormAfterSuccess(form) {
        const inquiryType = form.querySelector(
            SELECTORS.inquiryTypeSelect
        );

        const service = form.querySelector(
            SELECTORS.serviceSelect
        );

        const sourcePage = form.querySelector(
            SELECTORS.sourcePage
        );

        const inquiryValue =
            inquiryType?.value || "";

        const serviceValue =
            service?.value || "";

        form.reset();

        if (sourcePage) {
            sourcePage.value =
                window.location.pathname;
        }

        if (inquiryType && inquiryValue) {
            inquiryType.value = inquiryValue;
        }

        if (service && serviceValue) {
            service.value = serviceValue;
        }

        Object.keys(FIELD_RULES).forEach(
            (fieldName) => {
                const field = form.elements.namedItem(
                    fieldName
                );

                if (
                    field &&
                    !(field instanceof RadioNodeList)
                ) {
                    clearFieldError(field);
                }
            }
        );

        updateMessageCounter(form);
    }

    async function submitForm(form) {
        if (state.submitting) {
            return;
        }

        hideFormStatus(form);

        const honeypot = form.querySelector(
            SELECTORS.honeypot
        );

        if (
            honeypot &&
            String(honeypot.value || "").trim()
        ) {
            showFormStatus(
                form,
                "success",
                getSuccessMessage({})
            );

            form.reset();
            return;
        }

        const invalidFields = validateForm(form);

        if (invalidFields.length) {
            showFormStatus(
                form,
                "error",
                "Review the highlighted fields before sending your inquiry."
            );

            invalidFields[0].focus();
            return;
        }

        setSubmittingState(form, true);

        showFormStatus(
            form,
            "loading",
            "Sending your inquiry…"
        );

        const action = firstDefined(
            form.getAttribute("action"),
            "contact.php"
        );

        state.activeRequestController?.abort();

        const controller =
            new AbortController();

        state.activeRequestController =
            controller;

        const timeout = window.setTimeout(() => {
            controller.abort();
        }, 20000);

        try {
            const response = await fetch(action, {
                method: "POST",
                body: createFormData(form),
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "same-origin",
                signal: controller.signal
            });

            const responseData =
                await parseResponse(response);

            if (
                !response.ok ||
                responseData.success === false
            ) {
                throw new Error(
                    getErrorMessage(responseData)
                );
            }

            const successMessage =
                getSuccessMessage(responseData);

            resetFormAfterSuccess(form);

            showFormStatus(
                form,
                "success",
                successMessage,
                {
                    focus: true
                }
            );

            document.dispatchEvent(
                new CustomEvent(
                    "nimomark:contact-submitted",
                    {
                        detail: {
                            success: true,
                            response: responseData
                        }
                    }
                )
            );
        } catch (error) {
            const aborted =
                error.name === "AbortError";

            const message = aborted
                ? "The request took too long. Please check your connection and try again."
                : firstDefined(
                    error.message,
                    getConfigValue(
                        "form.errorMessage"
                    ),
                    "Your inquiry could not be sent. Please try again."
                );

            showFormStatus(
                form,
                "error",
                message,
                {
                    focus: true
                }
            );

            document.dispatchEvent(
                new CustomEvent(
                    "nimomark:contact-submitted",
                    {
                        detail: {
                            success: false,
                            error
                        }
                    }
                )
            );
        } finally {
            window.clearTimeout(timeout);
            state.activeRequestController = null;
            setSubmittingState(form, false);
        }
    }

    function initializeForm() {
        const form = document.querySelector(
            SELECTORS.form
        );

        if (!form) {
            return;
        }

        form.method = "post";

        if (!form.getAttribute("action")) {
            form.action = "contact.php";
        }

        form.setAttribute("novalidate", "");

        populateInquiryTypeSelect(form);
        populateServiceSelect(form);
        applyQueryParameters(form);
        initializeFieldValidation(form);
        updateMessageCounter(form);

        const sourcePage = form.querySelector(
            SELECTORS.sourcePage
        );

        if (sourcePage) {
            sourcePage.value =
                window.location.pathname;
        }

        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                submitForm(form);
            }
        );

        form.addEventListener(
            "reset",
            () => {
                window.requestAnimationFrame(() => {
                    Object.keys(FIELD_RULES).forEach(
                        (fieldName) => {
                            const field =
                                form.elements.namedItem(fieldName);

                            if (
                                field &&
                                !(field instanceof RadioNodeList)
                            ) {
                                clearFieldError(field);
                            }
                        }
                    );

                    hideFormStatus(form);
                    updateMessageCounter(form);

                    if (sourcePage) {
                        sourcePage.value =
                            window.location.pathname;
                    }
                });
            }
        );
    }

    function initializeRevealGroups() {
        const groups = document.querySelectorAll(
            SELECTORS.revealGroup
        );

        if (!groups.length) {
            return;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            groups.forEach((group) => {
                group
                    .querySelectorAll(
                        SELECTORS.revealItem
                    )
                    .forEach((item) => {
                        item.classList.add("is-visible");
                    });
            });

            return;
        }

        state.revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        const items =
                            entry.target.querySelectorAll(
                                SELECTORS.revealItem
                            );

                        items.forEach((item, index) => {
                            window.setTimeout(() => {
                                item.classList.add("is-visible");
                            }, index * 80);
                        });

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -8% 0px"
                }
            );

        groups.forEach((group) => {
            state.revealObserver.observe(group);
        });
    }

    function injectContactSchema() {
        const previousSchema = document.getElementById(
            "nimomark-contact-schema"
        );

        previousSchema?.remove();

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const email = firstDefined(
            getConfigValue("contact.email"),
            getConfigValue("company.email"),
            ""
        );

        const baseUrl = firstDefined(
            getConfigValue("seo.baseUrl"),
            getConfigValue("company.website"),
            window.location.origin
        );

        const schema = {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${brandName}`,
            url: new URL(
                "contact.html",
                baseUrl
            ).href,
            isPartOf: {
                "@type": "WebSite",
                name: brandName,
                url: baseUrl
            },
            mainEntity: {
                "@type": "Organization",
                name: brandName,
                url: baseUrl
            }
        };

        if (
            email &&
            !email.endsWith(".example")
        ) {
            schema.mainEntity.email = email;
        }

        const script = document.createElement("script");

        script.id = "nimomark-contact-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);

        document.head.append(script);
    }

    function initializeContactPage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        renderInquiryTypes();
        renderCollaborationTags();
        renderProcess();
        renderFaq();

        initializeForm();
        initializeRevealGroups();
        injectContactSchema();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
        });

        document.dispatchEvent(
            new CustomEvent("nimomark:contact-ready", {
                detail: {
                    inquiryTypes: getInquiryTypes(),
                    services: getServices(),
                    process: getProcessSteps()
                }
            })
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(initializeContactPage);
    });
})();