(function () {
    "use strict";

    const SELECTORS = {
        purposeStatements: "[data-about-purpose-statements]",
        purposeValues: "[data-about-purpose-values]",
        audiences: "[data-about-audiences]",
        platformDirectory: "[data-about-platform-directory]",
        transparencyList: "[data-about-transparency-list]",
        processTrack: "[data-about-process-track]",
        qualityPrinciples: "[data-about-quality-principles]",
        partnershipTags: "[data-about-partnership-tags]",
        testimonialsSlider: "[data-about-testimonials-slider]",
        testimonialsPrevious: "[data-about-testimonials-prev]",
        testimonialsNext: "[data-about-testimonials-next]",
        testimonialsPagination:
            "[data-about-testimonials-pagination]",
        parallaxMedia: "[data-about-parallax]",
        revealGroup: "[data-about-reveal-group]",
        revealItem: "[data-about-reveal-item]"
    };

    const FALLBACK_PURPOSE_STATEMENTS = [
        {
            label: "Our purpose",
            title: "Make career positioning easier to understand.",
            text:
                "NimoMark helps professionals explore practical career-support categories, understand what each service may involve and submit a focused inquiry without exaggerated promises."
        },
        {
            label: "Our role",
            title: "Connect questions with potentially relevant support.",
            text:
                "The platform organizes information around resumes, LinkedIn profiles, cover letters, interviews and international positioning. Submitted inquiries may be reviewed and, where appropriate, connected with independent specialists."
        }
    ];

    const FALLBACK_VALUES = [
        {
            title: "Clarity before complexity",
            icon: "scan-text"
        },
        {
            title: "Honest expectations",
            icon: "scale"
        },
        {
            title: "Relevant career context",
            icon: "waypoints"
        },
        {
            title: "Respect for personal information",
            icon: "shield-check"
        },
        {
            title: "No guaranteed outcomes",
            icon: "badge-alert"
        }
    ];

    const FALLBACK_AUDIENCES = [
        {
            title: "Professionals changing direction",
            text:
                "People repositioning existing experience toward a new function, industry or level of responsibility.",
            icon: "route"
        },
        {
            title: "International professionals",
            text:
                "Professionals communicating experience across countries, hiring conventions and employment markets.",
            icon: "globe-2"
        },
        {
            title: "Technology specialists",
            text:
                "Developers, analysts, engineers and other technical professionals who need clearer contribution-focused wording.",
            icon: "code-2"
        },
        {
            title: "Newcomers",
            text:
                "Professionals adapting prior experience to a new market without understating transferable skills.",
            icon: "plane"
        },
        {
            title: "Managers and executives",
            text:
                "Senior professionals refining leadership scope, strategic contribution and business-impact communication.",
            icon: "briefcase-business"
        },
        {
            title: "Interview candidates",
            text:
                "Professionals preparing structured examples and more focused responses for upcoming conversations.",
            icon: "messages-square"
        }
    ];

    const FALLBACK_PLATFORM_ENTRIES = [
        {
            title: "Resume Writing",
            text:
                "Support focused on structure, positioning, relevant evidence and readable presentation.",
            href: "resume-writing.html",
            icon: "file-text"
        },
        {
            title: "LinkedIn Profile Optimization",
            text:
                "Support for clearer messaging across headlines, summaries, experience and skills.",
            href: "linkedin-profile-optimization.html",
            icon: "linkedin"
        },
        {
            title: "Cover Letter Writing",
            text:
                "Focused communication connecting professional experience with a specific opportunity.",
            href: "cover-letter-writing.html",
            icon: "mail-open"
        },
        {
            title: "IT Resume Services",
            text:
                "Career-document support for technical professionals communicating tools, scope and contribution.",
            href: "it-resume-services.html",
            icon: "code-2"
        },
        {
            title: "Resume for Newcomers",
            text:
                "Positioning support for professionals adapting experience to a different employment market.",
            href: "resume-for-newcomers.html",
            icon: "plane"
        },
        {
            title: "Executive Resume Services",
            text:
                "Senior-level positioning focused on leadership context, decisions and measurable business contribution.",
            href: "executive-resume-services.html",
            icon: "briefcase-business"
        },
        {
            title: "Interview Preparation",
            text:
                "Structured preparation for clearer examples, focused answers and stronger readiness.",
            href: "interview-preparation.html",
            icon: "messages-square"
        },
        {
            title: "International Job Positioning",
            text:
                "Career-positioning support for communicating professional experience across countries and markets.",
            href: "international-job-positioning.html",
            icon: "globe-2"
        }
    ];

    const FALLBACK_TRANSPARENCY = [
        {
            text:
                "NimoMark is an independent career-support and inquiry platform.",
            icon: "circle-check"
        },
        {
            text:
                "The platform is not an employer or recruitment agency.",
            icon: "circle-check"
        },
        {
            text:
                "Employment, interview, salary and placement outcomes are not guaranteed.",
            icon: "circle-check"
        },
        {
            text:
                "The platform does not provide legal, immigration or visa advice.",
            icon: "circle-check"
        },
        {
            text:
                "Availability, scope, pricing and delivery terms may vary by specialist and inquiry.",
            icon: "circle-check"
        },
        {
            text:
                "Personal information should only be submitted when relevant to the inquiry.",
            icon: "circle-check"
        }
    ];

    const FALLBACK_PROCESS = [
        {
            title: "Explore",
            text:
                "Review service categories and educational information relevant to your current career question.",
            icon: "search"
        },
        {
            title: "Describe",
            text:
                "Share enough context to explain your direction, current materials and the support you are considering.",
            icon: "message-square-text"
        },
        {
            title: "Review",
            text:
                "The inquiry may be reviewed to identify potentially relevant support options or independent specialists.",
            icon: "clipboard-check"
        },
        {
            title: "Decide",
            text:
                "Review any proposed scope, timing and terms before deciding whether to proceed.",
            icon: "check-check"
        }
    ];

    const FALLBACK_QUALITY = [
        {
            title: "Career-specific context",
            text:
                "Information should reflect the professional’s actual direction rather than generic claims.",
            icon: "target"
        },
        {
            title: "Readable structure",
            text:
                "Career materials should make relevant information easier to locate and understand.",
            icon: "layout-list"
        },
        {
            title: "Evidence-led wording",
            text:
                "Professional communication is stronger when responsibilities and contribution are explained with appropriate evidence.",
            icon: "file-check-2"
        },
        {
            title: "Consistent positioning",
            text:
                "Resumes, profiles, cover letters and interview examples should support a coherent professional story.",
            icon: "git-merge"
        },
        {
            title: "Appropriate boundaries",
            text:
                "Career support should avoid inventing experience, credentials, outcomes or unsupported claims.",
            icon: "shield-alert"
        },
        {
            title: "Practical next steps",
            text:
                "Recommendations should help the professional understand what to review, prepare or clarify next.",
            icon: "move-right"
        }
    ];

    const FALLBACK_PARTNERSHIP_TAGS = [
        {
            label: "Career specialists"
        },
        {
            label: "Independent providers"
        },
        {
            label: "Professional communities"
        }
    ];

    const state = {
        initialized: false,
        revealObserver: null,
        testimonialsSlider: null,
        parallaxFrame: null,
        parallaxElements: [],
        reducedMotion: false
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
            entry.fullTitle,
            entry.shortTitle,
            entry.heroTitle,
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
            entry.shortDescription,
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

    function getEntryHref(entry, fallback = "#") {
        if (typeof entry === "string") {
            return fallback;
        }

        return firstDefined(
            entry.href,
            entry.url,
            entry.pageUrl,
            fallback
        );
    }

    function getPurposeStatements() {
        return getConfiguredArray(
            [
                "pages.about.purpose.statements",
                "pages.about.statements",
                "about.purpose.statements"
            ],
            FALLBACK_PURPOSE_STATEMENTS
        );
    }

    function getValues() {
        return getConfiguredArray(
            [
                "pages.about.purpose.values",
                "pages.about.values",
                "about.values"
            ],
            FALLBACK_VALUES
        );
    }

    function getAudiences() {
        return getConfiguredArray(
            [
                "pages.about.audiences.items",
                "pages.about.audiences",
                "about.audiences"
            ],
            FALLBACK_AUDIENCES
        );
    }

    function getPlatformEntries() {
        const configuredEntries = getConfiguredArray(
            [
                "pages.about.platform.items",
                "pages.about.services",
                "about.platform.items"
            ],
            []
        );

        if (configuredEntries.length) {
            return configuredEntries;
        }

        const services = toArray(
            firstDefined(
                getConfigValue("services"),
                getConfigValue("pages.services.items"),
                []
            )
        );

        if (services.length) {
            return services;
        }

        return FALLBACK_PLATFORM_ENTRIES;
    }

    function getTransparencyItems() {
        return getConfiguredArray(
            [
                "pages.about.transparency.items",
                "pages.about.transparency",
                "about.transparency"
            ],
            FALLBACK_TRANSPARENCY
        );
    }

    function getProcessSteps() {
        return getConfiguredArray(
            [
                "pages.about.process.steps",
                "pages.about.process",
                "about.process"
            ],
            FALLBACK_PROCESS
        ).slice(0, 4);
    }

    function getQualityPrinciples() {
        return getConfiguredArray(
            [
                "pages.about.quality.principles",
                "pages.about.quality",
                "about.quality"
            ],
            FALLBACK_QUALITY
        );
    }

    function getPartnershipTags() {
        return getConfiguredArray(
            [
                "pages.about.partnership.tags",
                "pages.about.partnership.items",
                "about.partnership.tags"
            ],
            FALLBACK_PARTNERSHIP_TAGS
        ).slice(0, 3);
    }

    function renderPurposeStatements() {
        const mount = document.querySelector(
            SELECTORS.purposeStatements
        );

        if (!mount) {
            return;
        }

        const statements = getPurposeStatements();

        mount.innerHTML = statements
            .map((statement, index) => {
                const label =
                    typeof statement === "string"
                        ? `Statement ${index + 1}`
                        : firstDefined(
                            statement.label,
                            statement.eyebrow,
                            statement.category,
                            `Statement ${index + 1}`
                        );

                const title = getEntryTitle(
                    statement,
                    `Career support statement ${index + 1}`
                );

                const text = getEntryText(statement);

                return `
          <article
            class="about-purpose__statement"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 80, 240)}"
          >
            <span class="about-purpose__statement-label">
              ${escapeHtml(label)}
            </span>

            <h3 class="about-purpose__statement-title">
              ${escapeHtml(title)}
            </h3>

            ${text
                        ? `
                  <p class="about-purpose__statement-text">
                    ${escapeHtml(text)}
                  </p>
                `
                        : ""
                    }
          </article>
        `;
            })
            .join("");
    }

    function renderPurposeValues() {
        const mount = document.querySelector(
            SELECTORS.purposeValues
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getValues()
            .map((value, index) => {
                const title = getEntryTitle(
                    value,
                    `Value ${index + 1}`
                );

                const icon = getEntryIcon(
                    value,
                    "circle-check"
                );

                return `
          <article
            class="about-purpose__value"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 55, 220)}"
          >
            <span class="about-purpose__value-icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="about-purpose__value-name">
              ${escapeHtml(title)}
            </h3>

            <span
              class="about-purpose__value-mark"
              aria-hidden="true"
            ></span>
          </article>
        `;
            })
            .join("");
    }

    function renderAudiences() {
        const mount = document.querySelector(
            SELECTORS.audiences
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getAudiences()
            .slice(0, 6)
            .map((audience, index) => {
                const title = getEntryTitle(
                    audience,
                    `Audience ${index + 1}`
                );

                const text = getEntryText(audience);
                const icon = getEntryIcon(
                    audience,
                    "user-round"
                );

                return `
          <article
            class="about-audiences__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 3) * 70, 140)}"
          >
            <div class="about-audiences__entry-inner">
              <span class="about-audiences__entry-icon">
                ${renderIcon(icon)}
              </span>

              <h3 class="about-audiences__entry-title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="about-audiences__entry-text">
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

    function normalizeServiceEntry(entry) {
        const slug = firstDefined(
            entry.slug,
            entry.id,
            ""
        );

        const serviceNames = {
            "resume-writing": "Resume Writing",
            "linkedin-profile-optimization":
                "LinkedIn Profile Optimization",
            "cover-letter-writing": "Cover Letter Writing",
            "it-resume-services": "IT Resume Services",
            "resume-for-newcomers": "Resume for Newcomers",
            "executive-resume-services":
                "Executive Resume Services",
            "interview-preparation": "Interview Preparation",
            "international-job-positioning":
                "International Job Positioning"
        };

        return {
            title: firstDefined(
                serviceNames[slug],
                getEntryTitle(entry, "Career support service")
            ),
            text: getEntryText(entry),
            icon: getEntryIcon(
                entry,
                "briefcase-business"
            ),
            href: getEntryHref(
                entry,
                slug ? `${slug}.html` : "services.html"
            )
        };
    }

    function renderPlatformDirectory() {
        const mount = document.querySelector(
            SELECTORS.platformDirectory
        );

        if (!mount) {
            return;
        }

        const entries = getPlatformEntries()
            .slice(0, 8)
            .map(normalizeServiceEntry);

        mount.innerHTML = entries
            .map((entry, index) => {
                return `
          <article
            class="about-platform__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 45, 180)}"
          >
            <span class="about-platform__entry-icon">
              ${renderIcon(entry.icon)}
            </span>

            <div class="about-platform__entry-content">
              <h3 class="about-platform__entry-title">
                ${escapeHtml(entry.title)}
              </h3>

              ${entry.text
                        ? `
                    <p class="about-platform__entry-text">
                      ${escapeHtml(entry.text)}
                    </p>
                  `
                        : ""
                    }
            </div>

            <a
              class="about-platform__entry-link"
              href="${escapeAttribute(entry.href)}"
              aria-label="Explore ${escapeAttribute(entry.title)}"
            >
              ${renderIcon("arrow-right")}
            </a>
          </article>
        `;
            })
            .join("");
    }

    function renderTransparencyList() {
        const mount = document.querySelector(
            SELECTORS.transparencyList
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getTransparencyItems()
            .map((entry, index) => {
                const text =
                    typeof entry === "string"
                        ? entry
                        : firstDefined(
                            entry.text,
                            entry.title,
                            entry.label,
                            ""
                        );

                const icon = getEntryIcon(
                    entry,
                    "circle-check"
                );

                return `
          <div
            class="about-transparency__entry"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 50, 220)}"
          >
            <span class="about-transparency__entry-icon">
              ${renderIcon(icon)}
            </span>

            <p class="about-transparency__entry-text">
              ${escapeHtml(text)}
            </p>
          </div>
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
            .map((step, index) => {
                const title = getEntryTitle(
                    step,
                    `Step ${index + 1}`
                );

                const text = getEntryText(step);
                const icon = getEntryIcon(
                    step,
                    "circle-dot"
                );

                return `
          <article
            class="about-process__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 80, 240)}"
          >
            <span class="about-process__icon">
              ${renderIcon(icon)}
            </span>

            <div class="about-process__content">
              <span class="site-eyebrow">
                Step ${String(index + 1).padStart(2, "0")}
              </span>

              <h3 class="about-process__title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="about-process__text">
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

    function renderQualityPrinciples() {
        const mount = document.querySelector(
            SELECTORS.qualityPrinciples
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getQualityPrinciples()
            .slice(0, 6)
            .map((principle, index) => {
                const title = getEntryTitle(
                    principle,
                    `Principle ${index + 1}`
                );

                const text = getEntryText(principle);
                const icon = getEntryIcon(
                    principle,
                    "badge-check"
                );

                return `
          <article
            class="about-quality__principle"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 2) * 70, 70)}"
          >
            <span class="about-quality__principle-icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="about-quality__principle-title">
              ${escapeHtml(title)}
            </h3>

            ${text
                        ? `
                  <p class="about-quality__principle-text">
                    ${escapeHtml(text)}
                  </p>
                `
                        : ""
                    }
          </article>
        `;
            })
            .join("");
    }

    function getPartnershipTagClass(index) {
        const classes = [
            "about-partnership__tag--top",
            "about-partnership__tag--right",
            "about-partnership__tag--bottom"
        ];

        return classes[index] || classes[0];
    }

    function renderPartnershipTags() {
        const mount = document.querySelector(
            SELECTORS.partnershipTags
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getPartnershipTags()
            .map((tag, index) => {
                const label =
                    typeof tag === "string"
                        ? tag
                        : firstDefined(
                            tag.label,
                            tag.title,
                            tag.name,
                            `Partnership ${index + 1}`
                        );

                return `
          <span
            class="about-partnership__tag ${getPartnershipTagClass(
                    index
                )}"
            data-aos="zoom-in"
            data-aos-delay="${Math.min(index * 90, 180)}"
          >
            ${escapeHtml(label)}
          </span>
        `;
            })
            .join("");
    }

    function initializeRevealGroups() {
        const groups = document.querySelectorAll(
            SELECTORS.revealGroup
        );

        if (!groups.length) {
            return;
        }

        if (
            state.reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            groups.forEach((group) => {
                group
                    .querySelectorAll(SELECTORS.revealItem)
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
                            }, index * 90);
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

    function updateParallax() {
        state.parallaxFrame = null;

        if (
            state.reducedMotion ||
            window.innerWidth < 1025
        ) {
            state.parallaxElements.forEach((element) => {
                element.style.removeProperty(
                    "--about-parallax-offset"
                );
            });

            return;
        }

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        state.parallaxElements.forEach((element) => {
            const rect = element.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }

            const center =
                rect.top + rect.height / 2;

            const distance =
                center - viewportHeight / 2;

            const speed = Number(
                element.dataset.aboutParallaxSpeed || 0.035
            );

            const maximumOffset = Number(
                element.dataset.aboutParallaxMax || 18
            );

            const rawOffset = distance * speed;

            const offset = Math.max(
                maximumOffset * -1,
                Math.min(maximumOffset, rawOffset)
            );

            element.style.setProperty(
                "--about-parallax-offset",
                `${offset.toFixed(2)}px`
            );
        });
    }

    function requestParallaxUpdate() {
        if (state.parallaxFrame !== null) {
            return;
        }

        state.parallaxFrame =
            window.requestAnimationFrame(updateParallax);
    }

    function initializeParallax() {
        state.parallaxElements = Array.from(
            document.querySelectorAll(
                SELECTORS.parallaxMedia
            )
        );

        if (!state.parallaxElements.length) {
            return;
        }

        state.parallaxElements.forEach((element) => {
            const image = element.matches("img")
                ? element
                : element.querySelector("img");

            if (!image) {
                return;
            }

            image.style.transform =
                "translate3d(0, var(--about-parallax-offset, 0px), 0) scale(1.04)";
        });

        if (state.reducedMotion) {
            return;
        }

        updateParallax();

        window.addEventListener(
            "scroll",
            requestParallaxUpdate,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            requestParallaxUpdate,
            {
                passive: true
            }
        );
    }

    function initializeTestimonialsSlider() {
        const slider = document.querySelector(
            SELECTORS.testimonialsSlider
        );

        if (!slider) {
            return;
        }

        if (
            !window.Swiper ||
            typeof window.Swiper !== "function"
        ) {
            slider.classList.add("swiper-unavailable");
            return;
        }

        state.testimonialsSlider = new window.Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 28,
            speed: state.reducedMotion ? 0 : 650,
            loop: true,
            grabCursor: true,
            keyboard: {
                enabled: true
            },
            navigation: {
                prevEl: SELECTORS.testimonialsPrevious,
                nextEl: SELECTORS.testimonialsNext
            },
            pagination: {
                el: SELECTORS.testimonialsPagination,
                clickable: true
            },
            a11y: {
                enabled: true,
                prevSlideMessage: "Previous feedback",
                nextSlideMessage: "Next feedback"
            }
        });
    }

    function injectAboutSchema() {
        const existingSchema = document.getElementById(
            "nimomark-about-schema"
        );

        existingSchema?.remove();

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const websiteUrl = firstDefined(
            getConfigValue("seo.baseUrl"),
            getConfigValue("company.website"),
            ""
        );

        const description = firstDefined(
            getConfigValue(
                "pages.about.seo.description"
            ),
            getConfigValue(
                "pages.about.metaDescription"
            ),
            getConfigValue("brand.shortDescription"),
            "Independent career-support and inquiry platform."
        );

        const logoPath = firstDefined(
            getConfigValue("brand.logo"),
            "assets/images/logo.svg"
        );

        const pageUrl = websiteUrl
            ? new URL("about.html", websiteUrl).href
            : window.location.href;

        const logoUrl = websiteUrl
            ? new URL(logoPath, websiteUrl).href
            : new URL(logoPath, window.location.href).href;

        const schema = {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${brandName}`,
            description,
            url: pageUrl,
            isPartOf: {
                "@type": "WebSite",
                name: brandName,
                url: websiteUrl || window.location.origin
            },
            about: {
                "@type": "Organization",
                name: brandName,
                url: websiteUrl || window.location.origin,
                logo: logoUrl,
                description
            }
        };

        const script = document.createElement("script");

        script.id = "nimomark-about-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);

        document.head.append(script);
    }

    function initializeAboutPage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        state.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        renderPurposeStatements();
        renderPurposeValues();
        renderAudiences();
        renderPlatformDirectory();
        renderTransparencyList();
        renderProcess();
        renderQualityPrinciples();
        renderPartnershipTags();

        initializeRevealGroups();
        initializeParallax();
        initializeTestimonialsSlider();
        injectAboutSchema();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
            requestParallaxUpdate();
        });

        document.dispatchEvent(
            new CustomEvent("nimomark:about-ready", {
                detail: {
                    audiences: getAudiences(),
                    process: getProcessSteps(),
                    quality: getQualityPrinciples()
                }
            })
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(initializeAboutPage);
    });
})();
