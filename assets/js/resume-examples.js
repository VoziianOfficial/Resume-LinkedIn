(function () {
    "use strict";

    const SELECTORS = {
        achievementsList:
            "[data-examples-achievements-list]",
        itAnatomy: "[data-examples-it-anatomy]",
        newcomerRows: "[data-examples-newcomer-rows]",
        executiveScope: "[data-examples-executive-scope]",
        wordingGrid: "[data-examples-wording-grid]",
        checklist: "[data-examples-checklist]",
        parallaxMedia: "[data-examples-parallax]",
        revealGroup: "[data-examples-reveal-group]",
        revealItem: "[data-examples-reveal-item]"
    };

    const FALLBACK_ACHIEVEMENTS = [
        {
            label: "Project contribution",
            title: "Show what changed because of the work",
            weak:
                "Worked on improving an internal reporting system.",
            clearer:
                "Redesigned reporting workflows for three internal teams, reducing manual preparation and giving managers faster access to weekly performance data."
        },
        {
            label: "Technical delivery",
            title: "Connect tools with practical contribution",
            weak:
                "Used JavaScript, React and APIs on different projects.",
            clearer:
                "Built reusable React interfaces and integrated REST APIs for customer-facing workflows, improving consistency across several product screens."
        },
        {
            label: "Team leadership",
            title: "Explain the scope of leadership",
            weak:
                "Managed a team and completed important projects.",
            clearer:
                "Led a cross-functional team of eight through the delivery of a new operational process, coordinating priorities, stakeholder reviews and implementation planning."
        },
        {
            label: "Customer support",
            title: "Add context to service responsibilities",
            weak:
                "Helped customers and answered their questions.",
            clearer:
                "Resolved product and account inquiries across email and live support while documenting recurring issues for the product and operations teams."
        },
        {
            label: "Career transition",
            title: "Frame transferable experience clearly",
            weak:
                "Looking to move from hospitality into administration.",
            clearer:
                "Brings five years of customer coordination, scheduling and issue-resolution experience to an administrative support direction."
        }
    ];

    const FALLBACK_IT_ANATOMY = [
        {
            title: "Technical direction",
            text:
                "Clarify the type of technical work, product environment or engineering responsibility being targeted.",
            icon: "compass"
        },
        {
            title: "Technology context",
            text:
                "Show where tools were applied rather than presenting an isolated list of technologies.",
            icon: "code-2"
        },
        {
            title: "Delivery scope",
            text:
                "Explain the feature, workflow, system or operational problem connected with the work.",
            icon: "layers-3"
        },
        {
            title: "Individual contribution",
            text:
                "Make personal responsibilities understandable within collaborative technical work.",
            icon: "user-round-cog"
        },
        {
            title: "Quality and reliability",
            text:
                "Include testing, review, performance, accessibility or maintainability context when relevant.",
            icon: "shield-check"
        },
        {
            title: "Practical outcome",
            text:
                "Describe an observable improvement without inventing unsupported performance claims.",
            icon: "chart-no-axes-combined"
        },
        {
            title: "Team environment",
            text:
                "Provide enough context about collaboration, stakeholders and working methods.",
            icon: "users-round"
        },
        {
            title: "Continued learning",
            text:
                "Present relevant education and skill development in relation to the intended role.",
            icon: "graduation-cap"
        }
    ];

    const FALLBACK_NEWCOMER_ROWS = [
        {
            title: "Keep prior experience visible",
            text:
                "International experience should not be removed simply because it was gained in another country.",
            icon: "globe-2"
        },
        {
            title: "Translate professional context",
            text:
                "Explain responsibilities in language that a new employment market can understand.",
            icon: "languages"
        },
        {
            title: "Highlight transferable skills",
            text:
                "Connect previous work with the needs of the new professional direction.",
            icon: "arrow-left-right"
        },
        {
            title: "Clarify education and credentials",
            text:
                "Provide understandable context without overstating equivalency or recognition.",
            icon: "graduation-cap"
        },
        {
            title: "Adapt formatting conventions",
            text:
                "Review document structure, terminology and information that may vary between markets.",
            icon: "layout-template"
        },
        {
            title: "Avoid unsupported localization",
            text:
                "Do not invent local experience, credentials, references or employment status.",
            icon: "shield-alert"
        }
    ];

    const FALLBACK_EXECUTIVE_SCOPE = [
        {
            title: "Leadership scale",
            text:
                "Clarify the teams, functions, regions or business areas connected with the role.",
            icon: "users-round"
        },
        {
            title: "Strategic context",
            text:
                "Explain the business challenge, priority or transformation behind senior-level decisions.",
            icon: "milestone"
        },
        {
            title: "Decision ownership",
            text:
                "Show where the executive influenced priorities, resources, governance or operational direction.",
            icon: "git-branch"
        },
        {
            title: "Business contribution",
            text:
                "Connect leadership actions with credible operational, commercial or organizational outcomes.",
            icon: "chart-no-axes-combined"
        },
        {
            title: "Stakeholder environment",
            text:
                "Include relevant board, investor, client, partner or cross-functional communication context.",
            icon: "network"
        },
        {
            title: "Transformation narrative",
            text:
                "Present major change initiatives as a coherent leadership story rather than disconnected tasks.",
            icon: "refresh-cw"
        }
    ];

    const FALLBACK_WORDING = [
        {
            topic: "Professional summary",
            title: "Replace broad adjectives with useful direction",
            weak:
                "Highly motivated and results-driven professional with excellent communication skills.",
            clearer:
                "Operations coordinator with five years of experience supporting scheduling, customer communication and process documentation in fast-moving service environments."
        },
        {
            topic: "Responsibility statement",
            title: "Add context to routine responsibilities",
            weak:
                "Responsible for managing customer accounts.",
            clearer:
                "Coordinated account updates, service requests and issue resolution for a portfolio of business customers across several service categories."
        },
        {
            topic: "Technical experience",
            title: "Show how technology was used",
            weak:
                "Experienced with React, JavaScript and Git.",
            clearer:
                "Developed responsive React interfaces, maintained reusable JavaScript components and collaborated through Git-based review workflows."
        },
        {
            topic: "Leadership experience",
            title: "Explain what leadership involved",
            weak:
                "Strong leader with proven management skills.",
            clearer:
                "Managed daily priorities for a six-person support team, introduced clearer escalation procedures and coordinated performance reviews with department leadership."
        }
    ];

    const FALLBACK_CHECKLIST = [
        {
            text:
                "The intended role or professional direction is understandable.",
            icon: "check"
        },
        {
            text:
                "Recent and relevant experience receives appropriate emphasis.",
            icon: "check"
        },
        {
            text:
                "Responsibilities include enough context to be meaningful.",
            icon: "check"
        },
        {
            text:
                "Achievements are supported by credible information.",
            icon: "check"
        },
        {
            text:
                "Technical skills are connected with practical use.",
            icon: "check"
        },
        {
            text:
                "Dates, titles and formatting are consistent.",
            icon: "check"
        },
        {
            text:
                "The language avoids unsupported guarantees and inflated claims.",
            icon: "check"
        },
        {
            text:
                "The resume, LinkedIn profile and cover letter support the same direction.",
            icon: "check"
        },
        {
            text:
                "Personal information is limited to what is relevant and appropriate.",
            icon: "check"
        },
        {
            text:
                "The document can be read clearly on desktop and mobile screens.",
            icon: "check"
        }
    ];

    const state = {
        initialized: false,
        revealObserver: null,
        parallaxElements: [],
        parallaxFrame: null,
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
            return entry;
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

    function getAchievements() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.achievements.items",
                "pages.resumeExamples.achievements",
                "resumeExamples.achievements",
                "pages.examples.achievements"
            ],
            FALLBACK_ACHIEVEMENTS
        );
    }

    function getItAnatomy() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.itAnatomy.items",
                "pages.resumeExamples.itAnatomy",
                "resumeExamples.itAnatomy",
                "pages.examples.itAnatomy"
            ],
            FALLBACK_IT_ANATOMY
        );
    }

    function getNewcomerRows() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.newcomer.items",
                "pages.resumeExamples.newcomer",
                "resumeExamples.newcomer",
                "pages.examples.newcomer"
            ],
            FALLBACK_NEWCOMER_ROWS
        );
    }

    function getExecutiveScope() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.executive.items",
                "pages.resumeExamples.executive",
                "resumeExamples.executive",
                "pages.examples.executive"
            ],
            FALLBACK_EXECUTIVE_SCOPE
        );
    }

    function getWordingExamples() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.wording.items",
                "pages.resumeExamples.wording",
                "resumeExamples.wording",
                "pages.examples.wording"
            ],
            FALLBACK_WORDING
        );
    }

    function getChecklistItems() {
        return getConfiguredArray(
            [
                "pages.resumeExamples.checklist.items",
                "pages.resumeExamples.checklist",
                "resumeExamples.checklist",
                "pages.examples.checklist"
            ],
            FALLBACK_CHECKLIST
        );
    }

    function normalizeComparisonEntry(entry, index) {
        if (typeof entry === "string") {
            return {
                label: `Example ${index + 1}`,
                title: entry,
                weak: "",
                clearer: ""
            };
        }

        return {
            label: firstDefined(
                entry.label,
                entry.topic,
                entry.category,
                `Example ${index + 1}`
            ),
            title: firstDefined(
                entry.title,
                entry.name,
                `Resume example ${index + 1}`
            ),
            weak: firstDefined(
                entry.weak,
                entry.before,
                entry.original,
                entry.lessClear,
                ""
            ),
            clearer: firstDefined(
                entry.clearer,
                entry.after,
                entry.revised,
                entry.improved,
                ""
            )
        };
    }

    function renderAchievements() {
        const mount = document.querySelector(
            SELECTORS.achievementsList
        );

        if (!mount) {
            return;
        }

        const achievements = getAchievements();

        mount.innerHTML = achievements
            .map((entry, index) => {
                const comparison =
                    normalizeComparisonEntry(entry, index);

                return `
          <article
            class="examples-achievements__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 65, 195)}"
          >
            <div class="examples-achievements__topic">
              <span class="examples-achievements__topic-label">
                ${escapeHtml(comparison.label)}
              </span>

              <h3 class="examples-achievements__topic-title">
                ${escapeHtml(comparison.title)}
              </h3>
            </div>

            <div class="examples-achievements__comparison">
              <div class="examples-achievements__statement">
                <span class="examples-achievements__statement-label">
                  Less specific
                </span>

                <p class="examples-achievements__statement-text">
                  ${escapeHtml(comparison.weak)}
                </p>
              </div>

              <div
                class="examples-achievements__statement examples-achievements__statement--clearer"
              >
                <span class="examples-achievements__statement-label">
                  Clearer direction
                </span>

                <p class="examples-achievements__statement-text">
                  ${escapeHtml(comparison.clearer)}
                </p>
              </div>
            </div>
          </article>
        `;
            })
            .join("");
    }

    function renderItAnatomy() {
        const mount = document.querySelector(
            SELECTORS.itAnatomy
        );

        if (!mount) {
            return;
        }

        const entries = getItAnatomy().slice(0, 8);

        mount.innerHTML = entries
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Technical area ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "code-2"
                );

                return `
          <article
            class="examples-it-anatomy__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 2) * 70, 70)}"
          >
            <span class="examples-it-anatomy__icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="examples-it-anatomy__entry-title">
              ${escapeHtml(title)}
            </h3>

            ${text
                        ? `
                  <p class="examples-it-anatomy__entry-text">
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

    function renderNewcomerRows() {
        const mount = document.querySelector(
            SELECTORS.newcomerRows
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getNewcomerRows()
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Newcomer consideration ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "globe-2"
                );

                return `
          <article
            class="examples-newcomer__row"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 55, 220)}"
          >
            <span class="examples-newcomer__row-icon">
              ${renderIcon(icon)}
            </span>

            <div class="examples-newcomer__row-content">
              <h3 class="examples-newcomer__row-title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="examples-newcomer__row-text">
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

    function renderExecutiveScope() {
        const mount = document.querySelector(
            SELECTORS.executiveScope
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getExecutiveScope()
            .slice(0, 6)
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Executive area ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "briefcase-business"
                );

                return `
          <article
            class="examples-executive__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 2) * 70, 70)}"
          >
            <span class="examples-executive__icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="examples-executive__entry-title">
              ${escapeHtml(title)}
            </h3>

            ${text
                        ? `
                  <p class="examples-executive__entry-text">
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

    function renderWordingExamples() {
        const mount = document.querySelector(
            SELECTORS.wordingGrid
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getWordingExamples()
            .map((entry, index) => {
                const comparison =
                    normalizeComparisonEntry(entry, index);

                return `
          <article
            class="examples-wording__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 2) * 80, 80)}"
          >
            <div class="examples-wording__entry-top">
              <span class="examples-wording__topic">
                ${escapeHtml(comparison.label)}
              </span>

              <h3 class="examples-wording__entry-title">
                ${escapeHtml(comparison.title)}
              </h3>
            </div>

            <div class="examples-wording__comparison">
              <div class="examples-wording__statement">
                <span class="examples-wording__statement-label">
                  Generic wording
                </span>

                <p class="examples-wording__statement-text">
                  ${escapeHtml(comparison.weak)}
                </p>
              </div>

              <div
                class="examples-wording__statement examples-wording__statement--clearer"
              >
                <span class="examples-wording__statement-label">
                  Clearer wording
                </span>

                <p class="examples-wording__statement-text">
                  ${escapeHtml(comparison.clearer)}
                </p>
              </div>
            </div>

            <p class="examples-wording__notice">
              Educational example using fictionalized wording.
            </p>
          </article>
        `;
            })
            .join("");
    }

    function renderChecklist() {
        const mount = document.querySelector(
            SELECTORS.checklist
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getChecklistItems()
            .map((entry, index) => {
                const text =
                    typeof entry === "string"
                        ? entry
                        : firstDefined(
                            entry.text,
                            entry.title,
                            entry.label,
                            `Checklist item ${index + 1}`
                        );

                const icon = getEntryIcon(entry, "check");

                return `
          <div
            class="examples-checklist__entry"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 40, 200)}"
          >
            <span class="examples-checklist__icon">
              ${renderIcon(icon)}
            </span>

            <p class="examples-checklist__text-item">
              ${escapeHtml(text)}
            </p>
          </div>
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

    function updateParallax() {
        state.parallaxFrame = null;

        if (
            state.reducedMotion ||
            window.innerWidth < 1025
        ) {
            state.parallaxElements.forEach((element) => {
                element.style.removeProperty(
                    "--examples-parallax-offset"
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
                element.dataset.examplesParallaxSpeed ||
                0.032
            );

            const maximumOffset = Number(
                element.dataset.examplesParallaxMax ||
                18
            );

            const rawOffset = distance * speed;

            const offset = Math.max(
                maximumOffset * -1,
                Math.min(maximumOffset, rawOffset)
            );

            element.style.setProperty(
                "--examples-parallax-offset",
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
                "translate3d(0, var(--examples-parallax-offset, 0px), 0) scale(1.04)";
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

    function injectEducationalSchema() {
        const existingSchema = document.getElementById(
            "nimomark-resume-examples-schema"
        );

        existingSchema?.remove();

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const baseUrl = firstDefined(
            getConfigValue("seo.baseUrl"),
            getConfigValue("company.website"),
            window.location.origin
        );

        const description = firstDefined(
            getConfigValue(
                "pages.resumeExamples.seo.description"
            ),
            getConfigValue(
                "pages.resumeExamples.metaDescription"
            ),
            "Educational resume examples showing clearer ways to communicate professional experience."
        );

        const schema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${brandName} Resume Examples`,
            description,
            url: new URL(
                "resume-examples.html",
                baseUrl
            ).href,
            isPartOf: {
                "@type": "WebSite",
                name: brandName,
                url: baseUrl
            },
            about: [
                {
                    "@type": "Thing",
                    name: "Resume writing"
                },
                {
                    "@type": "Thing",
                    name: "Career positioning"
                },
                {
                    "@type": "Thing",
                    name: "Professional communication"
                }
            ]
        };

        const script = document.createElement("script");

        script.id =
            "nimomark-resume-examples-schema";

        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);

        document.head.append(script);
    }

    (function () {
        "use strict";

        function formatSlideNumber(value) {
            return String(value).padStart(2, "0");
        }

        function refreshInsightIcons(scope) {
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

        function initializeExamplesInsightSlider() {
            const slider = document.querySelector(
                "[data-examples-insight-slider]"
            );

            if (!slider || slider.swiper) {
                return;
            }

            if (typeof window.Swiper !== "function") {
                window.setTimeout(
                    initializeExamplesInsightSlider,
                    100
                );

                return;
            }

            const section = slider.closest(
                ".examples-insight-slider"
            );

            if (!section) {
                return;
            }

            const previousButton = section.querySelector(
                "[data-examples-insight-previous]"
            );

            const nextButton = section.querySelector(
                "[data-examples-insight-next]"
            );

            const currentElement = section.querySelector(
                "[data-examples-insight-current]"
            );

            const totalElement = section.querySelector(
                "[data-examples-insight-total]"
            );

            const progressElement = section.querySelector(
                "[data-examples-insight-progress]"
            );

            const totalSlides = slider.querySelectorAll(
                ".swiper-slide"
            ).length;

            if (totalElement) {
                totalElement.textContent =
                    formatSlideNumber(totalSlides);
            }

            function updateProgress(swiper) {
                const currentIndex = swiper.realIndex + 1;
                const progress =
                    totalSlides > 0
                        ? (currentIndex / totalSlides) * 100
                        : 0;

                if (currentElement) {
                    currentElement.textContent =
                        formatSlideNumber(currentIndex);
                }

                if (progressElement) {
                    progressElement.style.width =
                        `${progress}%`;
                }

                refreshInsightIcons(section);
            }

            new window.Swiper(slider, {
                slidesPerView: 1,
                slidesPerGroup: 1,
                speed: 760,
                loop: true,
                autoHeight: true,
                effect: "fade",
                fadeEffect: {
                    crossFade: true
                },
                allowTouchMove: true,
                grabCursor: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                navigation: {
                    prevEl: previousButton,
                    nextEl: nextButton
                },
                a11y: {
                    enabled: true,
                    prevSlideMessage:
                        "Previous resume example insight",
                    nextSlideMessage:
                        "Next resume example insight"
                },
                on: {
                    init(swiper) {
                        updateProgress(swiper);
                    },

                    slideChange(swiper) {
                        updateProgress(swiper);
                    }
                }
            });
        }

        if (document.readyState === "loading") {
            document.addEventListener(
                "DOMContentLoaded",
                initializeExamplesInsightSlider,
                {
                    once: true
                }
            );
        } else {
            initializeExamplesInsightSlider();
        }
    })();

    function initializeResumeExamplesPage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        state.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        renderAchievements();
        renderItAnatomy();
        renderNewcomerRows();
        renderExecutiveScope();
        renderWordingExamples();
        renderChecklist();

        initializeRevealGroups();
        initializeParallax();
        injectEducationalSchema();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
            requestParallaxUpdate();
        });

        document.dispatchEvent(
            new CustomEvent(
                "nimomark:resume-examples-ready",
                {
                    detail: {
                        achievements: getAchievements(),
                        itAnatomy: getItAnatomy(),
                        newcomer: getNewcomerRows(),
                        executive: getExecutiveScope(),
                        wording: getWordingExamples(),
                        checklist: getChecklistItems()
                    }
                }
            )
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(
            initializeResumeExamplesPage
        );
    });
})();