(function () {
    "use strict";

    const documentElement = document.documentElement;

    documentElement.classList.remove("no-js");
    documentElement.classList.add("js");

    const SELECTORS = {
        headerMount: "[data-site-header]",
        footerMount: "[data-site-footer]",
        mobileNavigationMount: "[data-mobile-navigation]",
        cookieMount: "[data-cookie-banner]",
        header: "[data-header]",
        mobileNavigation: "[data-mobile-menu]",
        mobileMenuOpen: "[data-mobile-menu-open]",
        mobileMenuClose: "[data-mobile-menu-close]",
        mobileServicesToggle: "[data-mobile-services-toggle]",
        mobileServicesPanel: "[data-mobile-services-panel]",
        desktopDropdownToggle: "[data-services-dropdown-toggle]",
        desktopDropdown: "[data-services-dropdown]",
        accordion: "[data-accordion]",
        accordionTrigger: ".shared-accordion__trigger",
        accordionPanel: ".shared-accordion__panel",
        cookieAccept: "[data-cookie-accept]",
        cookieReject: "[data-cookie-reject]",
        cookieSettings: "[data-cookie-settings]",
        currentYear: "[data-current-year]"
    };

    const STORAGE_KEYS = {
        cookieConsent: "nimomark_cookie_consent_v1"
    };

    const FALLBACK_CONFIG = {
        brand: {
            name: "NimoMark",
            tagline: "Career direction made clearer.",
            logo: "assets/images/logo.svg",
            favicon: "assets/images/favicon.svg"
        },
        contact: {
            email: "hello@nimomark.example"
        },
        navigation: {
            primary: [
                {
                    key: "home",
                    label: "Home",
                    href: "index.html"
                },
                {
                    key: "about",
                    label: "About",
                    href: "about.html"
                },
                {
                    key: "services",
                    label: "Services",
                    href: "services.html",
                    children: "services"
                },
                {
                    key: "examples",
                    label: "Resume Examples",
                    href: "resume-examples.html"
                },
                {
                    key: "contact",
                    label: "Contact",
                    href: "contact.html"
                }
            ],
            cta: {
                label: "Start an inquiry",
                href: "contact.html"
            }
        },
        services: [],
        footer: {
            statement: "Build a clearer career story.",
            description:
                "An independent career-support and inquiry platform for professionals navigating resumes, profiles, interviews and international positioning.",
            disclaimer:
                "NimoMark is an independent career-support and inquiry platform. We do not act as an employer, recruitment agency, immigration adviser or legal adviser, and we do not guarantee interviews, employment, salary outcomes, visa outcomes or placement."
        },
        cookie: {
            title: "Cookie preferences",
            text:
                "We use essential browser storage to remember your cookie preference and support core website functionality.",
            acceptLabel: "Accept",
            rejectLabel: "Essential only",
            policyLabel: "Cookie policy",
            policyHref: "cookie-policy.html"
        },
        legal: {
            pages: [
                {
                    label: "Privacy Policy",
                    href: "privacy-policy.html"
                },
                {
                    label: "Terms of Service",
                    href: "terms-of-service.html"
                },
                {
                    label: "Cookie Policy",
                    href: "cookie-policy.html"
                }
            ]
        }
    };

    const state = {
        initialized: false,
        config: null,
        header: null,
        mobileNavigation: null,
        desktopDropdown: null,
        desktopDropdownToggle: null,
        mobileMenuTrigger: null,
        lastFocusedElement: null,
        scrollTicking: false,
        dropdownCloseTimer: null,
        accordionCounter: 0
    };

    function onDocumentReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, {
                once: true
            });

            return;
        }

        callback();
    }

    function isPlainObject(value) {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        );
    }

    function mergeObjects(base, override) {
        const result = {
            ...base
        };

        if (!isPlainObject(override)) {
            return result;
        }

        Object.keys(override).forEach((key) => {
            const baseValue = result[key];
            const overrideValue = override[key];

            if (
                isPlainObject(baseValue) &&
                isPlainObject(overrideValue)
            ) {
                result[key] = mergeObjects(baseValue, overrideValue);
                return;
            }

            result[key] = overrideValue;
        });

        return result;
    }

    function getSiteConfig() {
        const suppliedConfig =
            window.NIMOMARK_CONFIG ||
            window.NimoMarkConfig ||
            window.nimoMarkConfig ||
            {};

        return mergeObjects(FALLBACK_CONFIG, suppliedConfig);
    }

    function getValue(source, path, fallbackValue = "") {
        if (!path || !source) {
            return fallbackValue;
        }

        const segments = String(path)
            .split(".")
            .map((segment) => segment.trim())
            .filter(Boolean);

        let currentValue = source;

        for (const segment of segments) {
            if (
                currentValue === null ||
                currentValue === undefined ||
                !Object.prototype.hasOwnProperty.call(
                    Object(currentValue),
                    segment
                )
            ) {
                return fallbackValue;
            }

            currentValue = currentValue[segment];
        }

        return currentValue ?? fallbackValue;
    }

    function firstDefined(...values) {
        return values.find(
            (value) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        );
    }

    function normalizeLucideIconName(value) {
        const iconName = String(value || "").trim();

        if (!iconName) {
            return "circle";
        }

        const aliases = {
            CodeXml: "code-2",
            "code-xml": "code-2",
            MapPinned: "map-pin",
            "map-pinned": "map-pin",
            BadgeUserRound: "user-round-check",
            "badge-user-round": "user-round-check"
        };

        if (aliases[iconName]) {
            return aliases[iconName];
        }

        return iconName
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
            .replace(/_/g, "-")
            .toLowerCase();
    }

    function normalizeLucideIcons(scope = document) {
        const root =
            scope && typeof scope.querySelectorAll === "function"
                ? scope
                : document;

        root.querySelectorAll("[data-lucide]").forEach((icon) => {
            const normalizedName = normalizeLucideIconName(
                icon.getAttribute("data-lucide")
            );

            icon.setAttribute("data-lucide", normalizedName);
        });
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

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function normalizeInternalHref(value, fallbackValue = "#") {
        const href = String(value || "").trim();

        if (!href) {
            return fallbackValue;
        }

        if (
            href.startsWith("#") ||
            href.startsWith("/") ||
            href.startsWith("./") ||
            href.startsWith("../") ||
            href.startsWith("mailto:") ||
            href.startsWith("https://") ||
            href.startsWith("http://")
        ) {
            return href;
        }

        return href;
    }

    function getCurrentFileName() {
        const pathname = window.location.pathname;
        const fileName = pathname.split("/").filter(Boolean).pop();

        return fileName || "index.html";
    }

    function normalizeComparableHref(href) {
        if (!href) {
            return "";
        }

        try {
            const url = new URL(href, window.location.href);
            const fileName =
                url.pathname.split("/").filter(Boolean).pop() ||
                "index.html";

            return fileName.toLowerCase();
        } catch (error) {
            return String(href)
                .split("#")[0]
                .split("?")[0]
                .split("/")
                .filter(Boolean)
                .pop()
                ?.toLowerCase();
        }
    }

    function isCurrentPage(href) {
        const currentFileName = getCurrentFileName().toLowerCase();
        const comparableHref = normalizeComparableHref(href);

        return comparableHref === currentFileName;
    }

    function getBrandName() {
        return firstDefined(
            getValue(state.config, "brand.name"),
            "NimoMark"
        );
    }

    function getContactEmail() {
        return firstDefined(
            getValue(state.config, "contact.email"),
            getValue(state.config, "company.email"),
            FALLBACK_CONFIG.contact.email
        );
    }

    function getPrimaryNavigation() {
        const navigation = firstDefined(
            getValue(state.config, "navigation.primary"),
            getValue(state.config, "navigation.main")
        );

        const entries = toArray(navigation);

        if (entries.length) {
            return entries;
        }

        return FALLBACK_CONFIG.navigation.primary;
    }

    function getServices() {
        return toArray(getValue(state.config, "services"));
    }

    function getLegalPages() {
        const legalPages = firstDefined(
            getValue(state.config, "legal.pages"),
            getValue(state.config, "navigation.legal"),
            getValue(state.config, "footer.legal")
        );

        const entries = toArray(legalPages);

        if (entries.length) {
            return entries;
        }

        return FALLBACK_CONFIG.legal.pages;
    }

    function getNavigationLabel(entry) {
        return firstDefined(
            entry.label,
            entry.title,
            entry.name,
            "Page"
        );
    }

    function getNavigationHref(entry) {
        return normalizeInternalHref(
            firstDefined(entry.href, entry.url, "#")
        );
    }

    function getServiceName(service) {
        return firstDefined(
            service.title,
            service.name,
            service.label,
            "Career support service"
        );
    }

    function getFooterServiceName(service) {
        const footerServiceNames = {
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

        const slug = getServiceSlug(service);

        return firstDefined(
            footerServiceNames[slug],
            service.footerTitle,
            service.fullTitle,
            service.shortTitle,
            getServiceName(service)
        );
    }

    function getServiceSlug(service) {
        return firstDefined(
            service.slug,
            service.id,
            ""
        );
    }

    function getServiceHref(service) {
        const slug = getServiceSlug(service);

        return normalizeInternalHref(
            firstDefined(
                service.href,
                service.url,
                slug ? `${slug}.html` : "services.html"
            )
        );
    }

    function getServiceIcon(service) {
        return normalizeLucideIconName(
            firstDefined(
                service.icon,
                service.iconName,
                service.lucideIcon,
                "briefcase-business"
            )
        );
    }

    function getServiceSummary(service) {
        return firstDefined(
            service.shortDescription,
            service.summary,
            service.description,
            ""
        );
    }

    function getCtaConfig() {
        const suppliedCta = firstDefined(
            getValue(state.config, "navigation.cta"),
            getValue(state.config, "header.cta"),
            getValue(state.config, "form.cta")
        );

        if (isPlainObject(suppliedCta)) {
            return suppliedCta;
        }

        return FALLBACK_CONFIG.navigation.cta;
    }

    function createMount(selector, position) {
        let mount = document.querySelector(selector);

        if (mount) {
            return mount;
        }

        mount = document.createElement("div");

        const attributeMatch = selector.match(
            /^\[([a-zA-Z0-9_-]+)\]$/
        );

        if (attributeMatch) {
            mount.setAttribute(attributeMatch[1], "");
        }

        if (position === "start") {
            document.body.prepend(mount);
        } else {
            document.body.append(mount);
        }

        return mount;
    }

    function renderBrandLogo(theme = "light", instanceId = "default") {
        const brandName = getBrandName();
        const textColor =
            theme === "dark" ? "#101012" : "#FFFFFF";

        const safeId = String(instanceId).replace(
            /[^a-zA-Z0-9_-]/g,
            ""
        );

        const gradientId = `nimomark-brand-gradient-${safeId}`;
        const highlightId = `nimomark-brand-highlight-${safeId}`;

        return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="232"
        height="54"
        viewBox="0 0 320 72"
        fill="none"
        role="img"
        aria-label="${escapeAttribute(brandName)}"
        style="width:clamp(190px,14vw,232px);height:auto;max-width:100%;"
      >
        <defs>
          <linearGradient
            id="${gradientId}"
            x1="10"
            y1="8"
            x2="63"
            y2="66"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#FFB15C"></stop>
            <stop offset="0.42" stop-color="#FF5A36"></stop>
            <stop offset="0.72" stop-color="#D64FD8"></stop>
            <stop offset="1" stop-color="#8D63FF"></stop>
          </linearGradient>

          <linearGradient
            id="${highlightId}"
            x1="18"
            y1="14"
            x2="50"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0"
              stop-color="#FFFFFF"
              stop-opacity="0.42"
            ></stop>
            <stop
              offset="1"
              stop-color="#FFFFFF"
              stop-opacity="0"
            ></stop>
          </linearGradient>
        </defs>

        <circle
          cx="36"
          cy="36"
          r="28"
          fill="url(#${gradientId})"
        ></circle>

        <circle
          cx="36"
          cy="36"
          r="27.25"
          stroke="#FFFFFF"
          stroke-opacity="0.22"
          stroke-width="1.5"
        ></circle>

        <path
          d="M15.5 17.5C24.5 9.6 39.6 7.1 51.7 14.2C36.6 13.8 24.3 20.5 17.2 31.4C14.3 26.9 13.6 22.2 15.5 17.5Z"
          fill="url(#${highlightId})"
        ></path>

        <path
          d="M21 51V21H28.2L43.8 41.4V21H51V51H43.8L28.2 30.6V51H21Z"
          fill="#FFFFFF"
        ></path>

        <path
          d="M27.8 21L51 51H43.7L20.7 21H27.8Z"
          fill="#101012"
          fill-opacity="0.16"
        ></path>

        <text
          x="79"
          y="47"
          fill="${textColor}"
          font-family="'Space Grotesk', 'Manrope', Arial, sans-serif"
          font-size="31"
          font-weight="700"
          letter-spacing="-1.2"
        >
          Nimo
        </text>

        <text
          x="153"
          y="47"
          fill="${textColor}"
          font-family="'Space Grotesk', 'Manrope', Arial, sans-serif"
          font-size="31"
          font-weight="500"
          letter-spacing="-1.2"
        >
          Mark
        </text>

        <circle
          cx="247"
          cy="21"
          r="3"
          fill="#55C7FF"
        ></circle>
      </svg>
    `;
    }

    function renderLucideIcon(iconName, className = "") {
        return `
      <i
        class="${escapeAttribute(className)}"
        data-lucide="${escapeAttribute(iconName)}"
        aria-hidden="true"
      ></i>
    `;
    }

    function renderDesktopServiceLinks() {
        const services = getServices();

        const serviceLinks = services
            .map((service) => {
                const href = getServiceHref(service);
                const name = getServiceName(service);
                const icon = getServiceIcon(service);
                const currentAttribute = isCurrentPage(href)
                    ? ' aria-current="page"'
                    : "";

                return `
          <a
            class="site-navigation__service-link"
            href="${escapeAttribute(href)}"
            ${currentAttribute}
          >
            <span class="site-navigation__service-icon">
              ${renderLucideIcon(icon)}
            </span>

            <span class="site-navigation__service-name">
              ${escapeHtml(name)}
            </span>

            ${renderLucideIcon(
                    "arrow-right",
                    "site-navigation__service-arrow"
                )}
          </a>
        `;
            })
            .join("");

        const allServicesCurrent = isCurrentPage("services.html")
            ? ' aria-current="page"'
            : "";

        return `
      <div class="site-navigation__dropdown-grid">
        <a
          class="site-navigation__service-link"
          href="services.html"
          ${allServicesCurrent}
        >
          <span class="site-navigation__service-icon">
            ${renderLucideIcon("layout-grid")}
          </span>

          <span class="site-navigation__service-name">
            All Services
          </span>

          ${renderLucideIcon(
            "arrow-right",
            "site-navigation__service-arrow"
        )}
        </a>

        ${serviceLinks}
      </div>
    `;
    }

    function isServicesNavigationEntry(entry) {
        const key = String(
            firstDefined(
                entry.key,
                entry.id,
                entry.label,
                entry.title,
                ""
            )
        ).toLowerCase();

        return (
            entry.children === "services" ||
            entry.type === "services" ||
            key === "services"
        );
    }

    function renderDesktopNavigationEntry(entry) {
        const label = getNavigationLabel(entry);
        const href = getNavigationHref(entry);

        if (isServicesNavigationEntry(entry)) {
            const servicesCurrent =
                isCurrentPage(href) ||
                getServices().some((service) =>
                    isCurrentPage(getServiceHref(service))
                );

            return `
        <li class="site-navigation__entry" data-services-menu-entry>
          <button
            class="site-navigation__dropdown-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="services-desktop-dropdown"
            data-services-dropdown-toggle
            ${servicesCurrent ? 'data-current-section="true"' : ""}
          >
            <span>${escapeHtml(label)}</span>
            ${renderLucideIcon("chevron-down")}
          </button>

          <div
            class="site-navigation__dropdown"
            id="services-desktop-dropdown"
            data-services-dropdown
          >
            ${renderDesktopServiceLinks()}
          </div>
        </li>
      `;
        }

        const currentAttribute = isCurrentPage(href)
            ? ' aria-current="page"'
            : "";

        return `
      <li class="site-navigation__entry">
        <a
          class="site-navigation__link"
          href="${escapeAttribute(href)}"
          ${currentAttribute}
        >
          ${escapeHtml(label)}
        </a>
      </li>
    `;
    }

    function renderHeader() {
        const mount = createMount(
            SELECTORS.headerMount,
            "start"
        );

        const navigation = getPrimaryNavigation();
        const cta = getCtaConfig();
        const ctaLabel = firstDefined(
            cta.label,
            cta.title,
            "Start an inquiry"
        );
        const ctaHref = normalizeInternalHref(
            firstDefined(cta.href, cta.url, "contact.html")
        );
        const brandName = getBrandName();

        mount.innerHTML = `
      <a class="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header class="site-header" data-header>
        <div class="site-header__inner">
          <a
            class="site-header__brand"
            href="index.html"
            aria-label="${escapeAttribute(brandName)} home"
          >
            ${renderBrandLogo("light", "header")}
          </a>

          <nav
            class="site-header__navigation"
            aria-label="Primary navigation"
          >
            <ul class="site-navigation__list">
              ${navigation
                .map(renderDesktopNavigationEntry)
                .join("")}
            </ul>
          </nav>

          <div class="site-header__actions">
            <a
              class="site-button site-button--primary site-header__cta"
              href="${escapeAttribute(ctaHref)}"
            >
              <span>${escapeHtml(ctaLabel)}</span>

              <span class="site-button__icon">
                ${renderLucideIcon("arrow-up-right")}
              </span>
            </a>

            <button
              class="site-header__menu-button"
              type="button"
              aria-label="Open navigation menu"
              aria-controls="mobile-navigation"
              aria-expanded="false"
              data-mobile-menu-open
            >
              ${renderLucideIcon("menu")}
            </button>
          </div>
        </div>
      </header>
    `;

        state.header = mount.querySelector(SELECTORS.header);
    }

    function renderMobileServiceLinks() {
        const services = getServices();

        return services
            .map((service) => {
                const href = getServiceHref(service);
                const currentAttribute = isCurrentPage(href)
                    ? ' aria-current="page"'
                    : "";

                return `
          <li>
            <a
              class="mobile-navigation__service-link"
              href="${escapeAttribute(href)}"
              ${currentAttribute}
            >
              ${escapeHtml(getServiceName(service))}
            </a>
          </li>
        `;
            })
            .join("");
    }

    function renderMobileNavigationEntry(entry) {
        const label = getNavigationLabel(entry);
        const href = getNavigationHref(entry);

        if (isServicesNavigationEntry(entry)) {
            const servicesCurrent =
                isCurrentPage(href) ||
                getServices().some((service) =>
                    isCurrentPage(getServiceHref(service))
                );

            return `
        <li class="mobile-navigation__entry">
          <button
            class="mobile-navigation__services-toggle"
            type="button"
            aria-expanded="${servicesCurrent ? "true" : "false"}"
            aria-controls="mobile-services-panel"
            data-mobile-services-toggle
          >
            <span>${escapeHtml(label)}</span>
            ${renderLucideIcon("chevron-down")}
          </button>

          <div
            class="mobile-navigation__services ${servicesCurrent ? "is-open" : ""
                }"
            id="mobile-services-panel"
            data-mobile-services-panel
          >
            <div class="mobile-navigation__services-inner">
              <ul class="mobile-navigation__services-list">
                <li>
                  <a
                    class="mobile-navigation__service-link"
                    href="${escapeAttribute(href)}"
                    ${isCurrentPage(href)
                    ? 'aria-current="page"'
                    : ""
                }
                  >
                    All Services
                  </a>
                </li>

                ${renderMobileServiceLinks()}
              </ul>
            </div>
          </div>
        </li>
      `;
        }

        const currentAttribute = isCurrentPage(href)
            ? ' aria-current="page"'
            : "";

        return `
      <li class="mobile-navigation__entry">
        <a
          class="mobile-navigation__link"
          href="${escapeAttribute(href)}"
          ${currentAttribute}
        >
          <span>${escapeHtml(label)}</span>
          ${renderLucideIcon("arrow-up-right")}
        </a>
      </li>
    `;
    }

    function renderMobileNavigation() {
        const mount = createMount(
            SELECTORS.mobileNavigationMount,
            "end"
        );

        const navigation = getPrimaryNavigation();
        const cta = getCtaConfig();
        const ctaLabel = firstDefined(
            cta.label,
            cta.title,
            "Start an inquiry"
        );
        const ctaHref = normalizeInternalHref(
            firstDefined(cta.href, cta.url, "contact.html")
        );
        const email = getContactEmail();
        const legalPages = getLegalPages();
        const brandName = getBrandName();

        mount.innerHTML = `
      <div
        class="mobile-navigation"
        id="mobile-navigation"
        aria-hidden="true"
        data-mobile-menu
      >
        <div class="mobile-navigation__top">
          <a
            class="mobile-navigation__brand"
            href="index.html"
            aria-label="${escapeAttribute(brandName)} home"
          >
            ${renderBrandLogo("light", "mobile")}
          </a>

          <button
            class="mobile-navigation__close"
            type="button"
            aria-label="Close navigation menu"
            data-mobile-menu-close
          >
            ${renderLucideIcon("x")}
          </button>
        </div>

        <div class="mobile-navigation__body">
          <nav aria-label="Mobile navigation">
            <ul class="mobile-navigation__list">
              ${navigation
                .map(renderMobileNavigationEntry)
                .join("")}
            </ul>
          </nav>
        </div>

        <div class="mobile-navigation__bottom">
          <div class="mobile-navigation__contact">
            <div>
              <span class="mobile-navigation__email-label">
                Email
              </span>

              <a
                class="mobile-navigation__email"
                href="mailto:${escapeAttribute(email)}"
              >
                ${escapeHtml(email)}
              </a>
            </div>

            <a
              class="site-button site-button--primary"
              href="${escapeAttribute(ctaHref)}"
            >
              <span>${escapeHtml(ctaLabel)}</span>

              <span class="site-button__icon">
                ${renderLucideIcon("arrow-up-right")}
              </span>
            </a>
          </div>

          <div class="mobile-navigation__legal">
            ${legalPages
                .map((page) => {
                    const href = getNavigationHref(page);

                    return `
                  <a href="${escapeAttribute(href)}">
                    ${escapeHtml(getNavigationLabel(page))}
                  </a>
                `;
                })
                .join("")}
          </div>
        </div>
      </div>
    `;

        state.mobileNavigation = mount.querySelector(
            SELECTORS.mobileNavigation
        );
    }

    function renderFooterColumn(title, links) {
        if (!links.length) {
            return "";
        }

        return `
      <div>
        <h3 class="site-footer__column-title">
          ${escapeHtml(title)}
        </h3>

        <ul class="site-footer__links">
          ${links
                .map((entry) => {
                    const href = getNavigationHref(entry);
                    const currentAttribute = isCurrentPage(href)
                        ? ' aria-current="page"'
                        : "";

                    return `
                <li>
                  <a
                    href="${escapeAttribute(href)}"
                    ${currentAttribute}
                  >
                    ${escapeHtml(getNavigationLabel(entry))}
                  </a>
                </li>
              `;
                })
                .join("")}
        </ul>
      </div>
    `;
    }

    function renderFooter() {
        const mount = createMount(
            SELECTORS.footerMount,
            "end"
        );

        const navigation = getPrimaryNavigation();
        const services = getServices();
        const legalPages = getLegalPages();
        const footerDescription = firstDefined(
            getValue(state.config, "footer.description"),
            getValue(state.config, "brand.shortDescription"),
            FALLBACK_CONFIG.footer.description
        );

        const footerDisclaimer = firstDefined(
            getValue(state.config, "footer.disclaimer"),
            getValue(state.config, "company.disclaimer"),
            FALLBACK_CONFIG.footer.disclaimer
        );

        const companyName = firstDefined(
            getValue(state.config, "company.legalName"),
            getValue(state.config, "company.name"),
            getBrandName()
        );

        const companyId = firstDefined(
            getValue(state.config, "company.registrationId"),
            getValue(state.config, "company.companyId"),
            ""
        );

        const footerNavigation = navigation.filter(
            (entry) => !isServicesNavigationEntry(entry)
        );

        const serviceLinks = services.map((service) => ({
            label: getFooterServiceName(service),
            href: getServiceHref(service)
        }));

        const year = new Date().getFullYear();

        mount.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__middle">
          <div class="site-footer__columns">
            <div class="site-footer__brand">
              <a
                class="site-footer__logo"
                href="index.html"
                aria-label="${escapeAttribute(
                getBrandName()
            )} home"
              >
                ${renderBrandLogo("light", "footer")}
              </a>

              <p class="site-footer__description">
                ${escapeHtml(footerDescription)}
              </p>
            </div>

            ${renderFooterColumn(
                "Company",
                footerNavigation
            )}

            ${renderFooterColumn(
                "Services",
                serviceLinks
            )}

            ${renderFooterColumn(
                "Legal",
                legalPages
            )}
          </div>
        </div>

        <div class="site-footer__bottom">
          <p class="site-footer__disclaimer">
            ${escapeHtml(footerDisclaimer)}
          </p>

          <div class="site-footer__meta">
            <p>
              © <span data-current-year>${year}</span>
              ${escapeHtml(companyName)}.
              All rights reserved.
              ${companyId
                ? `Company ID: ${escapeHtml(companyId)}.`
                : ""
            }
            </p>

            <div class="site-footer__legal-links">
              ${legalPages
                .map((page) => {
                    const href = getNavigationHref(page);

                    return `
                    <a href="${escapeAttribute(href)}">
                      ${escapeHtml(getNavigationLabel(page))}
                    </a>
                  `;
                })
                .join("")}

              <button
                type="button"
                data-cookie-settings
                style="
                  padding:0;
                  border:0;
                  color:inherit;
                  background:transparent;
                  font:inherit;
                "
              >
                Cookie settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    `;
    }

    function renderCookieBanner() {
        const mount = createMount(
            SELECTORS.cookieMount,
            "end"
        );

        const title = firstDefined(
            getValue(state.config, "cookie.title"),
            FALLBACK_CONFIG.cookie.title
        );

        const text = firstDefined(
            getValue(state.config, "cookie.text"),
            FALLBACK_CONFIG.cookie.text
        );

        const acceptLabel = firstDefined(
            getValue(state.config, "cookie.acceptLabel"),
            FALLBACK_CONFIG.cookie.acceptLabel
        );

        const rejectLabel = firstDefined(
            getValue(state.config, "cookie.rejectLabel"),
            FALLBACK_CONFIG.cookie.rejectLabel
        );

        const policyLabel = firstDefined(
            getValue(state.config, "cookie.policyLabel"),
            FALLBACK_CONFIG.cookie.policyLabel
        );

        const policyHref = normalizeInternalHref(
            firstDefined(
                getValue(state.config, "cookie.policyHref"),
                FALLBACK_CONFIG.cookie.policyHref
            )
        );

        mount.innerHTML = `
      <aside
        class="cookie-banner"
        aria-labelledby="cookie-banner-heading"
        aria-describedby="cookie-banner-description"
        data-cookie-dialog
      >
        <h2
          class="cookie-banner__heading"
          id="cookie-banner-heading"
        >
          ${escapeHtml(title)}
        </h2>

        <p
          class="cookie-banner__text"
          id="cookie-banner-description"
        >
          ${escapeHtml(text)}
          <a href="${escapeAttribute(policyHref)}">
            ${escapeHtml(policyLabel)}
          </a>.
        </p>

        <div class="cookie-banner__actions">
          <button
            class="cookie-banner__button cookie-banner__button--accept"
            type="button"
            data-cookie-accept
          >
            ${escapeHtml(acceptLabel)}
          </button>

          <button
            class="cookie-banner__button"
            type="button"
            data-cookie-reject
          >
            ${escapeHtml(rejectLabel)}
          </button>

          <a
            class="cookie-banner__button"
            href="${escapeAttribute(policyHref)}"
          >
            ${escapeHtml(policyLabel)}
          </a>
        </div>
      </aside>
    `;
    }

    function applyConfigBindings() {
        const config = state.config;

        document
            .querySelectorAll("[data-config]")
            .forEach((element) => {
                const path = element.dataset.config;
                const fallback = element.textContent.trim();
                const value = getValue(config, path, fallback);

                if (
                    typeof value === "string" ||
                    typeof value === "number"
                ) {
                    element.textContent = String(value);
                }
            });

        document
            .querySelectorAll("[data-config-html]")
            .forEach((element) => {
                const path = element.dataset.configHtml;
                const value = getValue(config, path, "");

                if (typeof value === "string") {
                    element.innerHTML = value;
                }
            });

        document
            .querySelectorAll("[data-config-href]")
            .forEach((element) => {
                const path = element.dataset.configHref;
                const value = getValue(config, path, "");

                if (!value) {
                    return;
                }

                const stringValue = String(value);
                const href =
                    stringValue.includes("@") &&
                        !stringValue.startsWith("mailto:")
                        ? `mailto:${stringValue}`
                        : normalizeInternalHref(stringValue);

                element.setAttribute("href", href);
            });

        document
            .querySelectorAll("[data-config-src]")
            .forEach((element) => {
                const path = element.dataset.configSrc;
                const value = getValue(config, path, "");

                if (value) {
                    element.setAttribute("src", String(value));
                }
            });

        document
            .querySelectorAll("[data-config-alt]")
            .forEach((element) => {
                const path = element.dataset.configAlt;
                const value = getValue(config, path, "");

                if (value) {
                    element.setAttribute("alt", String(value));
                }
            });

        document
            .querySelectorAll("[data-email-link]")
            .forEach((element) => {
                const email = getContactEmail();

                element.textContent = email;
                element.setAttribute("href", `mailto:${email}`);
            });

        document
            .querySelectorAll("[data-brand-name]")
            .forEach((element) => {
                element.textContent = getBrandName();
            });

        document
            .querySelectorAll(SELECTORS.currentYear)
            .forEach((element) => {
                element.textContent = String(
                    new Date().getFullYear()
                );
            });

        document
            .querySelectorAll('input[name="sourcePage"]')
            .forEach((input) => {
                input.value = window.location.pathname;
            });
    }

    function updateHeaderState() {
        state.scrollTicking = false;

        if (!state.header) {
            return;
        }

        state.header.classList.toggle(
            "is-scrolled",
            window.scrollY > 16
        );
    }

    function requestHeaderUpdate() {
        if (state.scrollTicking) {
            return;
        }

        state.scrollTicking = true;
        window.requestAnimationFrame(updateHeaderState);
    }

    function initializeStickyHeader() {
        updateHeaderState();

        window.addEventListener("scroll", requestHeaderUpdate, {
            passive: true
        });
    }

    function openDesktopDropdown() {
        if (
            !state.desktopDropdown ||
            !state.desktopDropdownToggle
        ) {
            return;
        }

        window.clearTimeout(state.dropdownCloseTimer);

        state.desktopDropdown.classList.add("is-open");
        state.desktopDropdownToggle.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    function closeDesktopDropdown(options = {}) {
        if (
            !state.desktopDropdown ||
            !state.desktopDropdownToggle
        ) {
            return;
        }

        const executeClose = () => {
            state.desktopDropdown.classList.remove("is-open");
            state.desktopDropdownToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            if (options.restoreFocus) {
                state.desktopDropdownToggle.focus();
            }
        };

        if (options.delay) {
            state.dropdownCloseTimer = window.setTimeout(
                executeClose,
                options.delay
            );
            return;
        }

        executeClose();
    }

    function toggleDesktopDropdown() {
        if (!state.desktopDropdown) {
            return;
        }

        if (state.desktopDropdown.classList.contains("is-open")) {
            closeDesktopDropdown();
        } else {
            openDesktopDropdown();
        }
    }

    function initializeDesktopDropdown() {
        state.desktopDropdownToggle = document.querySelector(
            SELECTORS.desktopDropdownToggle
        );

        state.desktopDropdown = document.querySelector(
            SELECTORS.desktopDropdown
        );

        if (
            !state.desktopDropdownToggle ||
            !state.desktopDropdown
        ) {
            return;
        }

        const menuEntry =
            state.desktopDropdownToggle.closest(
                "[data-services-menu-entry]"
            );

        state.desktopDropdownToggle.addEventListener(
            "click",
            toggleDesktopDropdown
        );

        state.desktopDropdownToggle.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "ArrowDown" ||
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openDesktopDropdown();

                    const firstLink =
                        state.desktopDropdown.querySelector("a");

                    if (firstLink) {
                        firstLink.focus();
                    }
                }
            }
        );

        state.desktopDropdown.addEventListener(
            "keydown",
            (event) => {
                const links = Array.from(
                    state.desktopDropdown.querySelectorAll("a")
                );

                if (!links.length) {
                    return;
                }

                const activeIndex = links.indexOf(
                    document.activeElement
                );

                if (event.key === "Escape") {
                    event.preventDefault();
                    closeDesktopDropdown({
                        restoreFocus: true
                    });
                    return;
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();

                    const nextIndex =
                        activeIndex < links.length - 1
                            ? activeIndex + 1
                            : 0;

                    links[nextIndex].focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();

                    const previousIndex =
                        activeIndex > 0
                            ? activeIndex - 1
                            : links.length - 1;

                    links[previousIndex].focus();
                }
            }
        );

        if (menuEntry) {
            menuEntry.addEventListener(
                "mouseenter",
                openDesktopDropdown
            );

            menuEntry.addEventListener("mouseleave", () => {
                closeDesktopDropdown({
                    delay: 180
                });
            });

            menuEntry.addEventListener("focusout", (event) => {
                if (
                    !menuEntry.contains(event.relatedTarget)
                ) {
                    closeDesktopDropdown();
                }
            });
        }

        document.addEventListener("click", (event) => {
            if (
                !state.desktopDropdown.contains(event.target) &&
                !state.desktopDropdownToggle.contains(event.target)
            ) {
                closeDesktopDropdown();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                state.desktopDropdown.classList.contains(
                    "is-open"
                )
            ) {
                closeDesktopDropdown({
                    restoreFocus: true
                });
            }
        });
    }

    function getFocusableElements(container) {
        if (!container) {
            return [];
        }

        const selector = [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])'
        ].join(",");

        return Array.from(
            container.querySelectorAll(selector)
        ).filter((element) => {
            return (
                !element.hasAttribute("hidden") &&
                element.getAttribute("aria-hidden") !== "true" &&
                element.offsetParent !== null
            );
        });
    }

    function trapMobileMenuFocus(event) {
        if (
            event.key !== "Tab" ||
            !state.mobileNavigation?.classList.contains("is-open")
        ) {
            return;
        }

        const focusableElements = getFocusableElements(
            state.mobileNavigation
        );

        if (!focusableElements.length) {
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement =
            focusableElements[focusableElements.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {
            event.preventDefault();
            lastElement.focus();
            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function openMobileMenu(trigger) {
        if (!state.mobileNavigation) {
            return;
        }

        state.lastFocusedElement =
            trigger || document.activeElement;

        state.mobileMenuTrigger = trigger || null;

        state.mobileNavigation.classList.add("is-open");
        state.mobileNavigation.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("is-scroll-locked");
        state.header?.classList.add("is-menu-open");

        if (trigger) {
            trigger.setAttribute("aria-expanded", "true");
        }

        window.requestAnimationFrame(() => {
            const closeButton =
                state.mobileNavigation.querySelector(
                    SELECTORS.mobileMenuClose
                );

            closeButton?.focus();
        });
    }

    function closeMobileMenu(options = {}) {
        if (!state.mobileNavigation) {
            return;
        }

        state.mobileNavigation.classList.remove("is-open");
        state.mobileNavigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("is-scroll-locked");
        state.header?.classList.remove("is-menu-open");

        document
            .querySelectorAll(SELECTORS.mobileMenuOpen)
            .forEach((trigger) => {
                trigger.setAttribute("aria-expanded", "false");
            });

        if (
            options.restoreFocus !== false &&
            state.lastFocusedElement instanceof HTMLElement
        ) {
            state.lastFocusedElement.focus();
        }
    }

    function initializeMobileNavigation() {
        const openButtons = document.querySelectorAll(
            SELECTORS.mobileMenuOpen
        );

        const closeButton = document.querySelector(
            SELECTORS.mobileMenuClose
        );

        const servicesToggle = document.querySelector(
            SELECTORS.mobileServicesToggle
        );

        const servicesPanel = document.querySelector(
            SELECTORS.mobileServicesPanel
        );

        openButtons.forEach((button) => {
            button.addEventListener("click", () => {
                openMobileMenu(button);
            });
        });

        closeButton?.addEventListener("click", () => {
            closeMobileMenu();
        });

        servicesToggle?.addEventListener("click", () => {
            const expanded =
                servicesToggle.getAttribute("aria-expanded") ===
                "true";

            servicesToggle.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            servicesPanel?.classList.toggle(
                "is-open",
                !expanded
            );
        });

        state.mobileNavigation?.addEventListener(
            "keydown",
            trapMobileMenuFocus
        );

        state.mobileNavigation?.addEventListener(
            "click",
            (event) => {
                const link = event.target.closest("a[href]");

                if (!link) {
                    return;
                }

                closeMobileMenu({
                    restoreFocus: false
                });
            }
        );

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                state.mobileNavigation?.classList.contains(
                    "is-open"
                )
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (
                window.innerWidth > 1024 &&
                state.mobileNavigation?.classList.contains(
                    "is-open"
                )
            ) {
                closeMobileMenu({
                    restoreFocus: false
                });
            }
        });
    }

    function getAccordionItems(accordion) {
        return Array.from(
            accordion.querySelectorAll(
                ":scope > .shared-accordion__item"
            )
        );
    }

    function setAccordionState(
        trigger,
        panel,
        expanded
    ) {
        trigger.setAttribute(
            "aria-expanded",
            String(expanded)
        );

        panel.classList.toggle("is-open", expanded);
        panel.setAttribute(
            "aria-hidden",
            String(!expanded)
        );
    }

    function initializeAccordion(accordion) {
        if (accordion.dataset.accordionInitialized === "true") {
            return;
        }

        accordion.dataset.accordionInitialized = "true";

        const allowMultiple =
            accordion.dataset.accordionMultiple === "true";

        const items = getAccordionItems(accordion);

        items.forEach((item) => {
            const trigger = item.querySelector(
                SELECTORS.accordionTrigger
            );

            const panel = item.querySelector(
                SELECTORS.accordionPanel
            );

            if (!trigger || !panel) {
                return;
            }

            state.accordionCounter += 1;

            const triggerId =
                trigger.id ||
                `shared-accordion-trigger-${state.accordionCounter}`;

            const panelId =
                panel.id ||
                `shared-accordion-panel-${state.accordionCounter}`;

            trigger.id = triggerId;
            panel.id = panelId;

            trigger.setAttribute("aria-controls", panelId);
            panel.setAttribute("aria-labelledby", triggerId);

            const initiallyExpanded =
                trigger.getAttribute("aria-expanded") === "true";

            setAccordionState(
                trigger,
                panel,
                initiallyExpanded
            );

            trigger.addEventListener("click", () => {
                const currentlyExpanded =
                    trigger.getAttribute("aria-expanded") ===
                    "true";

                if (!allowMultiple && !currentlyExpanded) {
                    items.forEach((otherItem) => {
                        if (otherItem === item) {
                            return;
                        }

                        const otherTrigger =
                            otherItem.querySelector(
                                SELECTORS.accordionTrigger
                            );

                        const otherPanel =
                            otherItem.querySelector(
                                SELECTORS.accordionPanel
                            );

                        if (otherTrigger && otherPanel) {
                            setAccordionState(
                                otherTrigger,
                                otherPanel,
                                false
                            );
                        }
                    });
                }

                setAccordionState(
                    trigger,
                    panel,
                    !currentlyExpanded
                );
            });

            trigger.addEventListener("keydown", (event) => {
                const triggers = items
                    .map((accordionItem) =>
                        accordionItem.querySelector(
                            SELECTORS.accordionTrigger
                        )
                    )
                    .filter(Boolean);

                const currentIndex = triggers.indexOf(trigger);

                if (event.key === "ArrowDown") {
                    event.preventDefault();

                    triggers[
                        currentIndex < triggers.length - 1
                            ? currentIndex + 1
                            : 0
                    ].focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();

                    triggers[
                        currentIndex > 0
                            ? currentIndex - 1
                            : triggers.length - 1
                    ].focus();
                }

                if (event.key === "Home") {
                    event.preventDefault();
                    triggers[0]?.focus();
                }

                if (event.key === "End") {
                    event.preventDefault();
                    triggers[triggers.length - 1]?.focus();
                }
            });
        });
    }

    function initializeAccordions(scope = document) {
        scope
            .querySelectorAll(SELECTORS.accordion)
            .forEach(initializeAccordion);
    }

    function getStoredConsent() {
        try {
            const storedValue = window.localStorage.getItem(
                STORAGE_KEYS.cookieConsent
            );

            if (!storedValue) {
                return null;
            }

            const parsedValue = JSON.parse(storedValue);

            if (
                !parsedValue ||
                !["accepted", "essential"].includes(
                    parsedValue.status
                )
            ) {
                return null;
            }

            return parsedValue;
        } catch (error) {
            return null;
        }
    }

    function storeConsent(status) {
        const consent = {
            status,
            updatedAt: new Date().toISOString()
        };

        try {
            window.localStorage.setItem(
                STORAGE_KEYS.cookieConsent,
                JSON.stringify(consent)
            );
        } catch (error) {
            documentElement.dataset.cookieConsent = status;
        }

        documentElement.dataset.cookieConsent = status;

        document.dispatchEvent(
            new CustomEvent("nimomark:consent", {
                detail: consent
            })
        );

        return consent;
    }

    function showCookieBanner() {
        const banner = document.querySelector(
            "[data-cookie-dialog]"
        );

        if (!banner) {
            return;
        }

        banner.classList.add("is-visible");
    }

    function hideCookieBanner() {
        const banner = document.querySelector(
            "[data-cookie-dialog]"
        );

        if (!banner) {
            return;
        }

        banner.classList.remove("is-visible");
    }

    function initializeCookieConsent() {
        const consent = getStoredConsent();

        if (consent) {
            documentElement.dataset.cookieConsent =
                consent.status;
        } else {
            window.setTimeout(showCookieBanner, 500);
        }

        document
            .querySelectorAll(SELECTORS.cookieAccept)
            .forEach((button) => {
                button.addEventListener("click", () => {
                    storeConsent("accepted");
                    hideCookieBanner();
                });
            });

        document
            .querySelectorAll(SELECTORS.cookieReject)
            .forEach((button) => {
                button.addEventListener("click", () => {
                    storeConsent("essential");
                    hideCookieBanner();
                });
            });

        document.addEventListener("click", (event) => {
            const settingsButton = event.target.closest(
                SELECTORS.cookieSettings
            );

            if (!settingsButton) {
                return;
            }

            event.preventDefault();
            showCookieBanner();

            window.requestAnimationFrame(() => {
                document
                    .querySelector(SELECTORS.cookieAccept)
                    ?.focus();
            });
        });
    }

    function initializeAnchorLinks() {
        document.addEventListener("click", (event) => {
            const anchor = event.target.closest(
                'a[href^="#"]:not([href="#"])'
            );

            if (!anchor) {
                return;
            }

            const targetId = anchor
                .getAttribute("href")
                .slice(1);

            const target = document.getElementById(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            if (!target.hasAttribute("tabindex")) {
                target.setAttribute("tabindex", "-1");
            }

            target.focus({
                preventScroll: true
            });

            window.history.pushState(
                null,
                "",
                `#${targetId}`
            );
        });
    }

    function initializeExternalLinks() {
        document
            .querySelectorAll('a[href^="http"]')
            .forEach((link) => {
                try {
                    const url = new URL(link.href);

                    if (url.origin === window.location.origin) {
                        return;
                    }

                    if (!link.hasAttribute("target")) {
                        link.setAttribute("target", "_blank");
                    }

                    const relValues = new Set(
                        String(link.getAttribute("rel") || "")
                            .split(/\s+/)
                            .filter(Boolean)
                    );

                    relValues.add("noopener");
                    relValues.add("noreferrer");

                    link.setAttribute(
                        "rel",
                        Array.from(relValues).join(" ")
                    );
                } catch (error) {
                    return;
                }
            });
    }

    function initializeImageFallbacks() {
        document
            .querySelectorAll("img[data-fallback-src]")
            .forEach((image) => {
                image.addEventListener(
                    "error",
                    () => {
                        const fallbackSource =
                            image.dataset.fallbackSrc;

                        if (
                            fallbackSource &&
                            image.src !== fallbackSource
                        ) {
                            image.src = fallbackSource;
                        }
                    },
                    {
                        once: true
                    }
                );
            });
    }

    function refreshLucideIcons(scope = document) {
        if (
            !window.lucide ||
            typeof window.lucide.createIcons !== "function"
        ) {
            return;
        }

        normalizeLucideIcons(scope);

        try {
            window.lucide.createIcons({
                root: scope,
                attrs: {
                    "aria-hidden": "true",
                    focusable: "false"
                }
            });
        } catch (error) {
            window.lucide.createIcons();
        }
    }

    function initializeAos() {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
            documentElement.classList.add("aos-disabled");
            return;
        }

        if (
            !window.AOS ||
            typeof window.AOS.init !== "function"
        ) {
            documentElement.classList.add("aos-disabled");
            return;
        }

        window.AOS.init({
            duration: 720,
            easing: "ease-out-cubic",
            once: true,
            mirror: false,
            offset: 90,
            delay: 0,
            anchorPlacement: "top-bottom"
        });
    }

    function refreshAos() {
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

    function initializeFormDefaults() {
        document
            .querySelectorAll("form")
            .forEach((form) => {
                form.setAttribute("novalidate", "");

                const sourcePageField = form.querySelector(
                    'input[name="sourcePage"]'
                );

                if (sourcePageField) {
                    sourcePageField.value =
                        window.location.pathname;
                }
            });
    }

    function exposePublicApi() {
        const api = {
            config: state.config,
            getValue(path, fallbackValue = "") {
                return getValue(
                    state.config,
                    path,
                    fallbackValue
                );
            },
            getServices,
            getCurrentFileName,
            isCurrentPage,
            initializeAccordions,
            refreshIcons: refreshLucideIcons,
            normalizeIconName: normalizeLucideIconName,
            refreshAos,
            showCookiePreferences: showCookieBanner,
            getCookieConsent: getStoredConsent,
            setCookieConsent: storeConsent,
            closeMobileMenu,
            escapeHtml,
            escapeAttribute
        };

        window.NimoMark = api;

        document.dispatchEvent(
            new CustomEvent("nimomark:ready", {
                detail: api
            })
        );
    }

    function initializeGlobal() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;
        state.config = getSiteConfig();

        documentElement.classList.add("is-config-loading");

        renderHeader();
        renderMobileNavigation();
        renderFooter();
        renderCookieBanner();

        applyConfigBindings();
        initializeStickyHeader();
        initializeDesktopDropdown();
        initializeMobileNavigation();
        initializeAccordions();
        initializeCookieConsent();
        initializeAnchorLinks();
        initializeExternalLinks();
        initializeImageFallbacks();
        initializeFormDefaults();

        refreshLucideIcons();
        initializeAos();

        window.requestAnimationFrame(() => {
            documentElement.classList.remove(
                "is-config-loading"
            );

            refreshLucideIcons();
            refreshAos();
        });

        exposePublicApi();
    }

    onDocumentReady(initializeGlobal);
})();
