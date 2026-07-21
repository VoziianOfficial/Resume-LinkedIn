(function () {
    "use strict";

    const SELECTORS = {
        legalPage: "[data-legal-page]",
        legalDocument: "[data-legal-document]",
        legalSection: ".legal-section",
        legalSectionTitle: ".legal-section__title",
        legalSectionNumber: ".legal-section__number",
        desktopNavigationList:
            "[data-legal-navigation-list]",
        mobileNavigationList:
            "[data-legal-mobile-navigation-list]",
        mobileNavigationToggle:
            "[data-legal-mobile-navigation-toggle]",
        mobileNavigationPanel:
            "[data-legal-mobile-navigation-panel]",
        navigationLink: "[data-legal-navigation-link]",
        sectionAnchor: "[data-legal-section-anchor]",
        copyAnchor: "[data-legal-copy-anchor]",
        printButton: "[data-legal-print]",
        backToTop: "[data-legal-back-to-top]",
        effectiveDate: "[data-legal-effective-date]",
        legalTitle: "[data-legal-title]",
        legalDescription: "[data-legal-description]",
        cookieAcceptAll:
            "[data-cookie-preference-accept-all]",
        cookieEssentialOnly:
            "[data-cookie-preference-essential]",
        cookieCurrentStatus:
            "[data-cookie-current-status]",
        cookieUpdatedAt:
            "[data-cookie-updated-at]",
        cookiePreferenceAction:
            "[data-cookie-preference-action]",
        revealGroup: "[data-legal-reveal-group]",
        revealItem: "[data-legal-reveal-item]",
        notFoundPage: "[data-not-found-page]",
        notFoundHome: "[data-not-found-home]",
        notFoundBack: "[data-not-found-back]"
    };

    const PAGE_DEFINITIONS = {
        "privacy-policy.html": {
            key: "privacy",
            title: "Privacy Policy",
            description:
                "Information about how NimoMark may collect, use, retain and protect personal information submitted through the website.",
            schemaType: "WebPage"
        },
        "terms-of-service.html": {
            key: "terms",
            title: "Terms of Service",
            description:
                "The terms governing access to and use of the NimoMark website, information, inquiry features and related platform content.",
            schemaType: "WebPage"
        },
        "cookie-policy.html": {
            key: "cookie",
            title: "Cookie Policy",
            description:
                "Information about essential browser storage, cookie preferences and related website functionality.",
            schemaType: "WebPage"
        },
        "404.html": {
            key: "notFound",
            title: "Page Not Found",
            description:
                "The requested NimoMark page could not be found.",
            schemaType: "WebPage"
        }
    };

    const FALLBACK_SECTION_LABELS = {
        privacy: [
            "Overview",
            "Information We May Collect",
            "How Information May Be Used",
            "Legal Bases and Permissions",
            "Inquiry Handling",
            "Service Providers",
            "International Processing",
            "Data Retention",
            "Information Security",
            "Your Privacy Choices",
            "Children’s Privacy",
            "Third-Party Links",
            "Policy Updates",
            "Contact"
        ],
        terms: [
            "Overview",
            "Platform Role",
            "Eligibility",
            "Acceptable Use",
            "Career Information",
            "Inquiry Submissions",
            "Independent Providers",
            "No Guaranteed Outcomes",
            "Fees and Service Terms",
            "Intellectual Property",
            "Third-Party Services",
            "Disclaimers",
            "Limitation of Liability",
            "Indemnification",
            "Termination",
            "Governing Terms",
            "Changes",
            "Contact"
        ],
        cookie: [
            "Overview",
            "What Cookies Are",
            "Essential Storage",
            "Preference Storage",
            "Third-Party Technologies",
            "Managing Preferences",
            "Browser Controls",
            "Retention",
            "Policy Updates",
            "Contact"
        ]
    };

    const state = {
        initialized: false,
        currentFile: "",
        pageDefinition: null,
        sections: [],
        activeSectionId: "",
        sectionObserver: null,
        revealObserver: null,
        historyUpdateTimer: null,
        copyResetTimers: new Map(),
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

    function getCurrentFileName() {
        if (
            window.NimoMark &&
            typeof window.NimoMark.getCurrentFileName ===
            "function"
        ) {
            return window.NimoMark.getCurrentFileName();
        }

        return (
            window.location.pathname
                .split("/")
                .filter(Boolean)
                .pop() || "index.html"
        );
    }

    function getPageDefinition() {
        return (
            PAGE_DEFINITIONS[state.currentFile] || {
                key: "legal",
                title: "Legal Information",
                description:
                    "Legal and policy information for the NimoMark website.",
                schemaType: "WebPage"
            }
        );
    }

    function getPageConfigBase() {
        const key = state.pageDefinition.key;

        if (key === "notFound") {
            return "pages.notFound";
        }

        return `legal.${key}`;
    }

    function getLegalEffectiveDate() {
        const configBase = getPageConfigBase();

        return firstDefined(
            getConfigValue(`${configBase}.effectiveDate`),
            getConfigValue("legal.effectiveDate"),
            "July 21, 2026"
        );
    }

    function formatDateValue(value) {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(date);
    }

    function applyLegalPageBindings() {
        const configBase = getPageConfigBase();

        const title = firstDefined(
            getConfigValue(`${configBase}.title`),
            getConfigValue(
                `pages.${state.pageDefinition.key}.title`
            ),
            state.pageDefinition.title
        );

        const description = firstDefined(
            getConfigValue(`${configBase}.description`),
            getConfigValue(
                `pages.${state.pageDefinition.key}.description`
            ),
            state.pageDefinition.description
        );

        const effectiveDate =
            getLegalEffectiveDate();

        document
            .querySelectorAll(SELECTORS.legalTitle)
            .forEach((element) => {
                element.textContent = title;
            });

        document
            .querySelectorAll(SELECTORS.legalDescription)
            .forEach((element) => {
                element.textContent = description;
            });

        document
            .querySelectorAll(SELECTORS.effectiveDate)
            .forEach((element) => {
                element.textContent =
                    formatDateValue(effectiveDate);
            });

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const desiredDocumentTitle = firstDefined(
            getConfigValue(`${configBase}.seoTitle`),
            getConfigValue(
                `${configBase}.metaTitle`
            ),
            `${title} | ${brandName}`
        );

        document.title = desiredDocumentTitle;

        let metaDescription = document.querySelector(
            'meta[name="description"]'
        );

        if (!metaDescription) {
            metaDescription =
                document.createElement("meta");

            metaDescription.name = "description";
            document.head.append(metaDescription);
        }

        metaDescription.content = description;

        document
            .querySelectorAll(
                'meta[property="og:title"], meta[name="twitter:title"]'
            )
            .forEach((meta) => {
                meta.content = desiredDocumentTitle;
            });

        document
            .querySelectorAll(
                'meta[property="og:description"], meta[name="twitter:description"]'
            )
            .forEach((meta) => {
                meta.content = description;
            });
    }

    function slugify(value) {
        return String(value || "")
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);
    }

    function createUniqueId(baseId, usedIds) {
        let candidate = baseId || "legal-section";
        let counter = 2;

        while (usedIds.has(candidate)) {
            candidate = `${baseId}-${counter}`;
            counter += 1;
        }

        usedIds.add(candidate);

        return candidate;
    }

    function getFallbackSectionLabel(index) {
        const labels =
            FALLBACK_SECTION_LABELS[
            state.pageDefinition.key
            ] || [];

        return (
            labels[index] ||
            `Section ${index + 1}`
        );
    }

    function collectLegalSections() {
        const documentRoot =
            document.querySelector(
                SELECTORS.legalDocument
            ) || document;

        const usedIds = new Set();

        state.sections = Array.from(
            documentRoot.querySelectorAll(
                SELECTORS.legalSection
            )
        ).map((section, index) => {
            const titleElement = section.querySelector(
                SELECTORS.legalSectionTitle
            );

            const numberElement = section.querySelector(
                SELECTORS.legalSectionNumber
            );

            const fallbackLabel =
                getFallbackSectionLabel(index);

            const title = firstDefined(
                section.dataset.legalTitle,
                titleElement?.textContent?.trim(),
                fallbackLabel
            );

            const preferredId = firstDefined(
                section.id,
                section.dataset.legalId,
                slugify(title),
                `legal-section-${index + 1}`
            );

            const id = createUniqueId(
                preferredId,
                usedIds
            );

            section.id = id;
            section.dataset.legalSectionIndex =
                String(index);

            if (numberElement) {
                const existingNumber =
                    numberElement.textContent.trim();

                if (!existingNumber) {
                    numberElement.textContent =
                        `Section ${String(index + 1).padStart(
                            2,
                            "0"
                        )}`;
                }
            }

            ensureSectionAnchor(
                section,
                title,
                id
            );

            return {
                id,
                title,
                section,
                index
            };
        });
    }

    function ensureSectionAnchor(
        section,
        title,
        id
    ) {
        const header = section.querySelector(
            ".legal-section__header"
        );

        if (!header) {
            return;
        }

        let anchor = header.querySelector(
            SELECTORS.sectionAnchor
        );

        if (!anchor) {
            anchor = document.createElement("a");
            anchor.className = "legal-section__anchor";
            anchor.dataset.legalSectionAnchor = "";
            anchor.innerHTML = renderIcon("link");
            header.append(anchor);
        }

        anchor.href = `#${id}`;
        anchor.setAttribute(
            "aria-label",
            `Link to ${title}`
        );
    }

    function renderNavigationItem(
        section,
        mobile = false
    ) {
        if (mobile) {
            return `
        <li class="legal-page__mobile-entry">
          <a
            class="legal-page__mobile-link"
            href="#${escapeAttribute(section.id)}"
            data-legal-navigation-link
            data-legal-target="${escapeAttribute(section.id)}"
          >
            <span>${escapeHtml(section.title)}</span>
            ${renderIcon("arrow-right")}
          </a>
        </li>
      `;
        }

        return `
      <li class="legal-page__navigation-entry">
        <a
          class="legal-page__navigation-link"
          href="#${escapeAttribute(section.id)}"
          data-legal-navigation-link
          data-legal-target="${escapeAttribute(section.id)}"
        >
          <span>${escapeHtml(section.title)}</span>

          ${renderIcon(
            "arrow-right",
            "legal-page__navigation-arrow"
        )}
        </a>
      </li>
    `;
    }

    function renderLegalNavigation() {
        const desktopList = document.querySelector(
            SELECTORS.desktopNavigationList
        );

        const mobileList = document.querySelector(
            SELECTORS.mobileNavigationList
        );

        if (desktopList) {
            desktopList.innerHTML = state.sections
                .map((section) =>
                    renderNavigationItem(section, false)
                )
                .join("");
        }

        if (mobileList) {
            mobileList.innerHTML = state.sections
                .map((section) =>
                    renderNavigationItem(section, true)
                )
                .join("");
        }

        const initialId =
            window.location.hash.slice(1);

        const matchingSection = state.sections.find(
            (section) => section.id === initialId
        );

        setActiveNavigation(
            matchingSection?.id ||
            state.sections[0]?.id ||
            ""
        );
    }

    function setActiveNavigation(sectionId) {
        if (
            !sectionId ||
            state.activeSectionId === sectionId
        ) {
            return;
        }

        state.activeSectionId = sectionId;

        document
            .querySelectorAll(
                SELECTORS.navigationLink
            )
            .forEach((link) => {
                const active =
                    link.dataset.legalTarget ===
                    sectionId;

                link.classList.toggle(
                    "is-active",
                    active
                );

                if (active) {
                    link.setAttribute(
                        "aria-current",
                        "location"
                    );
                } else {
                    link.removeAttribute(
                        "aria-current"
                    );
                }
            });
    }

    function initializeMobileNavigation() {
        const toggle = document.querySelector(
            SELECTORS.mobileNavigationToggle
        );

        const panel = document.querySelector(
            SELECTORS.mobileNavigationPanel
        );

        if (!toggle || !panel) {
            return;
        }

        toggle.addEventListener("click", () => {
            const expanded =
                toggle.getAttribute("aria-expanded") ===
                "true";

            toggle.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            panel.classList.toggle(
                "is-open",
                !expanded
            );
        });

        panel.addEventListener("click", (event) => {
            const link = event.target.closest(
                SELECTORS.navigationLink
            );

            if (!link) {
                return;
            }

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            panel.classList.remove("is-open");
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 1024) {
                return;
            }

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            panel.classList.remove("is-open");
        });
    }

    function scrollToSection(sectionId, options = {}) {
        const section = document.getElementById(
            sectionId
        );

        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: state.reducedMotion
                ? "auto"
                : options.behavior || "smooth",
            block: "start"
        });

        setActiveNavigation(sectionId);

        if (options.focus !== false) {
            if (!section.hasAttribute("tabindex")) {
                section.setAttribute(
                    "tabindex",
                    "-1"
                );
            }

            window.setTimeout(() => {
                section.focus({
                    preventScroll: true
                });
            }, state.reducedMotion ? 0 : 450);
        }

        if (options.updateHistory !== false) {
            updateLocationHash(sectionId);
        }
    }

    function updateLocationHash(sectionId) {
        window.clearTimeout(
            state.historyUpdateTimer
        );

        state.historyUpdateTimer =
            window.setTimeout(() => {
                const nextHash = `#${sectionId}`;

                if (
                    window.location.hash === nextHash
                ) {
                    return;
                }

                window.history.pushState(
                    null,
                    "",
                    nextHash
                );
            }, 40);
    }

    function initializeNavigationLinks() {
        document.addEventListener(
            "click",
            (event) => {
                const link = event.target.closest(
                    SELECTORS.navigationLink
                );

                if (!link) {
                    return;
                }

                const targetId =
                    link.dataset.legalTarget ||
                    link.getAttribute("href")?.slice(1);

                if (!targetId) {
                    return;
                }

                event.preventDefault();

                scrollToSection(targetId);
            }
        );
    }

    function initializeScrollSpy() {
        if (
            !state.sections.length ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        state.sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    const visibleEntries = entries
                        .filter(
                            (entry) => entry.isIntersecting
                        )
                        .sort(
                            (first, second) =>
                                first.boundingClientRect.top -
                                second.boundingClientRect.top
                        );

                    if (visibleEntries.length) {
                        setActiveNavigation(
                            visibleEntries[0].target.id
                        );
                        return;
                    }

                    const passedSections =
                        state.sections.filter(
                            ({ section }) =>
                                section.getBoundingClientRect()
                                    .top <=
                                window.innerHeight * 0.34
                        );

                    const latestPassed =
                        passedSections[
                        passedSections.length - 1
                        ];

                    if (latestPassed) {
                        setActiveNavigation(
                            latestPassed.id
                        );
                    }
                },
                {
                    root: null,
                    rootMargin:
                        "-18% 0px -64% 0px",
                    threshold: [0, 0.1, 0.35]
                }
            );

        state.sections.forEach(({ section }) => {
            state.sectionObserver.observe(section);
        });
    }

    async function copyText(value) {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                value
            );

            return;
        }

        const textarea =
            document.createElement("textarea");

        textarea.value = value;
        textarea.setAttribute(
            "readonly",
            ""
        );

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";

        document.body.append(textarea);

        textarea.select();
        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        const copied =
            document.execCommand("copy");

        textarea.remove();

        if (!copied) {
            throw new Error(
                "Copying is unavailable."
            );
        }
    }

    function getSectionUrl(sectionId) {
        const url = new URL(
            window.location.href
        );

        url.hash = sectionId;

        return url.href;
    }

    function setCopyButtonState(
        button,
        success
    ) {
        const originalLabel =
            button.dataset.originalLabel ||
            button.getAttribute("aria-label") ||
            "Copy section link";

        if (!button.dataset.originalLabel) {
            button.dataset.originalLabel =
                originalLabel;
        }

        button.classList.toggle(
            "is-copied",
            success
        );

        button.setAttribute(
            "aria-label",
            success
                ? "Section link copied"
                : originalLabel
        );

        const originalHtml =
            button.dataset.originalHtml ||
            button.innerHTML;

        if (!button.dataset.originalHtml) {
            button.dataset.originalHtml =
                originalHtml;
        }

        button.innerHTML = success
            ? renderIcon("check")
            : button.dataset.originalHtml;

        refreshIcons(button);

        window.clearTimeout(
            state.copyResetTimers.get(button)
        );

        const timer = window.setTimeout(() => {
            button.classList.remove("is-copied");
            button.setAttribute(
                "aria-label",
                originalLabel
            );

            button.innerHTML =
                button.dataset.originalHtml;

            refreshIcons(button);

            state.copyResetTimers.delete(button);
        }, 1800);

        state.copyResetTimers.set(
            button,
            timer
        );
    }

    function initializeSectionCopyActions() {
        document.addEventListener(
            "click",
            async (event) => {
                const copyButton =
                    event.target.closest(
                        SELECTORS.copyAnchor
                    );

                const sectionAnchor =
                    event.target.closest(
                        SELECTORS.sectionAnchor
                    );

                const action =
                    copyButton || sectionAnchor;

                if (!action) {
                    return;
                }

                const targetId =
                    firstDefined(
                        action.dataset.legalTarget,
                        action.getAttribute("href")?.slice(1),
                        action.closest(
                            SELECTORS.legalSection
                        )?.id
                    );

                if (!targetId) {
                    return;
                }

                if (copyButton) {
                    event.preventDefault();
                }

                if (
                    sectionAnchor &&
                    !event.altKey &&
                    !event.metaKey &&
                    !event.ctrlKey
                ) {
                    return;
                }

                event.preventDefault();

                try {
                    await copyText(
                        getSectionUrl(targetId)
                    );

                    setCopyButtonState(
                        action,
                        true
                    );
                } catch (error) {
                    setCopyButtonState(
                        action,
                        false
                    );
                }
            }
        );
    }

    function initializePrintAction() {
        document
            .querySelectorAll(SELECTORS.printButton)
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        window.print();
                    }
                );
            });
    }

    function initializeBackToTop() {
        document
            .querySelectorAll(SELECTORS.backToTop)
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();

                        window.scrollTo({
                            top: 0,
                            behavior: state.reducedMotion
                                ? "auto"
                                : "smooth"
                        });

                        window.history.replaceState(
                            null,
                            "",
                            `${window.location.pathname}${window.location.search}`
                        );
                    }
                );
            });
    }

    function getStoredCookieConsent() {
        if (
            window.NimoMark &&
            typeof window.NimoMark.getCookieConsent ===
            "function"
        ) {
            return window.NimoMark.getCookieConsent();
        }

        try {
            const value = window.localStorage.getItem(
                "nimomark_cookie_consent_v1"
            );

            return value
                ? JSON.parse(value)
                : null;
        } catch (error) {
            return null;
        }
    }

    function setCookieConsent(status) {
        if (
            window.NimoMark &&
            typeof window.NimoMark.setCookieConsent ===
            "function"
        ) {
            return window.NimoMark.setCookieConsent(
                status
            );
        }

        const consent = {
            status,
            updatedAt: new Date().toISOString()
        };

        try {
            window.localStorage.setItem(
                "nimomark_cookie_consent_v1",
                JSON.stringify(consent)
            );
        } catch (error) {
            document.documentElement.dataset.cookieConsent =
                status;
        }

        document.documentElement.dataset.cookieConsent =
            status;

        return consent;
    }

    function getConsentStatusLabel(status) {
        if (status === "accepted") {
            return "All permitted preferences accepted";
        }

        if (status === "essential") {
            return "Essential storage only";
        }

        return "No preference saved";
    }

    function updateCookiePreferenceDisplay(
        consent = getStoredCookieConsent()
    ) {
        const status = consent?.status || "";

        document
            .querySelectorAll(
                SELECTORS.cookieCurrentStatus
            )
            .forEach((element) => {
                element.textContent =
                    getConsentStatusLabel(status);

                element.dataset.consentStatus =
                    status || "unset";
            });

        document
            .querySelectorAll(
                SELECTORS.cookieUpdatedAt
            )
            .forEach((element) => {
                element.textContent =
                    consent?.updatedAt
                        ? formatDateValue(
                            consent.updatedAt
                        )
                        : "Not yet saved";
            });

        document
            .querySelectorAll(
                SELECTORS.cookiePreferenceAction
            )
            .forEach((button) => {
                const desiredStatus =
                    button.dataset.cookiePreferenceAction;

                const active =
                    desiredStatus === status;

                button.classList.toggle(
                    "is-active",
                    active
                );

                button.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });
    }

    function announceCookiePreference(
        status
    ) {
        let announcement =
            document.getElementById(
                "cookie-preference-announcement"
            );

        if (!announcement) {
            announcement =
                document.createElement("div");

            announcement.id =
                "cookie-preference-announcement";

            announcement.className =
                "sr-only";

            announcement.setAttribute(
                "role",
                "status"
            );

            announcement.setAttribute(
                "aria-live",
                "polite"
            );

            document.body.append(announcement);
        }

        announcement.textContent =
            status === "accepted"
                ? "Cookie preference updated to accept all permitted preferences."
                : "Cookie preference updated to essential storage only.";
    }

    function saveCookiePreference(status) {
        const consent =
            setCookieConsent(status);

        updateCookiePreferenceDisplay(
            consent
        );

        announceCookiePreference(status);

        document.dispatchEvent(
            new CustomEvent(
                "nimomark:legal-cookie-preference",
                {
                    detail: consent
                }
            )
        );
    }

    function initializeCookiePreferences() {
        document
            .querySelectorAll(
                SELECTORS.cookieAcceptAll
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        saveCookiePreference(
                            "accepted"
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                SELECTORS.cookieEssentialOnly
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        saveCookiePreference(
                            "essential"
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                SELECTORS.cookiePreferenceAction
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const status =
                            button.dataset
                                .cookiePreferenceAction;

                        if (
                            ![
                                "accepted",
                                "essential"
                            ].includes(status)
                        ) {
                            return;
                        }

                        saveCookiePreference(status);
                    }
                );
            });

        updateCookiePreferenceDisplay();

        document.addEventListener(
            "nimomark:consent",
            (event) => {
                updateCookiePreferenceDisplay(
                    event.detail
                );
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

        if (
            state.reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            groups.forEach((group) => {
                group
                    .querySelectorAll(
                        SELECTORS.revealItem
                    )
                    .forEach((item) => {
                        item.classList.add(
                            "is-visible"
                        );
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
                                item.classList.add(
                                    "is-visible"
                                );
                            }, index * 70);
                        });

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );

        groups.forEach((group) => {
            state.revealObserver.observe(group);
        });
    }

    function initializeHashNavigation() {
        const hash =
            window.location.hash.slice(1);

        if (!hash) {
            return;
        }

        const matchingSection =
            state.sections.find(
                (section) =>
                    section.id === hash
            );

        if (!matchingSection) {
            return;
        }

        window.setTimeout(() => {
            scrollToSection(hash, {
                behavior: "auto",
                focus: false,
                updateHistory: false
            });
        }, 80);
    }

    function initializeNotFoundPage() {
        const page = document.querySelector(
            SELECTORS.notFoundPage
        );

        if (!page) {
            return;
        }

        const backButtons =
            document.querySelectorAll(
                SELECTORS.notFoundBack
            );

        backButtons.forEach((button) => {
            button.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();

                    if (
                        window.history.length > 1
                    ) {
                        window.history.back();
                        return;
                    }

                    window.location.href =
                        "index.html";
                }
            );
        });

        document
            .querySelectorAll(
                SELECTORS.notFoundHome
            )
            .forEach((link) => {
                if (!link.getAttribute("href")) {
                    link.setAttribute(
                        "href",
                        "index.html"
                    );
                }
            });
    }

    function injectLegalSchema() {
        const previousSchema =
            document.getElementById(
                "nimomark-legal-schema"
            );

        previousSchema?.remove();

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const baseUrl = firstDefined(
            getConfigValue("seo.baseUrl"),
            getConfigValue("company.website"),
            window.location.origin
        );

        const configBase = getPageConfigBase();

        const title = firstDefined(
            getConfigValue(`${configBase}.title`),
            state.pageDefinition.title
        );

        const description = firstDefined(
            getConfigValue(
                `${configBase}.description`
            ),
            state.pageDefinition.description
        );

        const pageUrl = new URL(
            state.currentFile,
            baseUrl
        ).href;

        const schema = {
            "@context": "https://schema.org",
            "@type":
                state.pageDefinition.schemaType,
            name: title,
            description,
            url: pageUrl,
            isPartOf: {
                "@type": "WebSite",
                name: brandName,
                url: baseUrl
            },
            publisher: {
                "@type": "Organization",
                name: brandName,
                url: baseUrl
            }
        };

        if (
            state.pageDefinition.key !==
            "notFound"
        ) {
            const effectiveDate =
                getLegalEffectiveDate();

            const parsedDate =
                new Date(effectiveDate);

            if (
                !Number.isNaN(
                    parsedDate.getTime()
                )
            ) {
                schema.dateModified =
                    parsedDate
                        .toISOString()
                        .split("T")[0];
            }

            schema.inLanguage = "en";
        }

        const script =
            document.createElement("script");

        script.id = "nimomark-legal-schema";
        script.type =
            "application/ld+json";

        script.textContent =
            JSON.stringify(schema);

        document.head.append(script);
    }

    function exposeLegalApi() {
        window.NimoMarkLegal = {
            get currentPage() {
                return state.pageDefinition;
            },
            get sections() {
                return state.sections.map(
                    ({ id, title, index }) => ({
                        id,
                        title,
                        index
                    })
                );
            },
            scrollToSection,
            copySectionLink(sectionId) {
                return copyText(
                    getSectionUrl(sectionId)
                );
            },
            print() {
                window.print();
            },
            getCookieConsent:
                getStoredCookieConsent,
            setCookieConsent:
                saveCookiePreference
        };
    }

    function initializeLegalPage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        state.reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        state.currentFile =
            getCurrentFileName();

        state.pageDefinition =
            getPageDefinition();

        applyLegalPageBindings();
        collectLegalSections();
        renderLegalNavigation();

        initializeMobileNavigation();
        initializeNavigationLinks();
        initializeScrollSpy();
        initializeSectionCopyActions();
        initializePrintAction();
        initializeBackToTop();
        initializeCookiePreferences();
        initializeRevealGroups();
        initializeHashNavigation();
        initializeNotFoundPage();

        injectLegalSchema();
        exposeLegalApi();
        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
        });

        document.dispatchEvent(
            new CustomEvent(
                "nimomark:legal-ready",
                {
                    detail: {
                        page: state.pageDefinition,
                        sections:
                            window.NimoMarkLegal.sections,
                        cookieConsent:
                            getStoredCookieConsent()
                    }
                }
            )
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(
            initializeLegalPage
        );
    });
})();