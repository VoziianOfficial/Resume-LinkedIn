(function () {
    "use strict";

    const SELECTORS = {
        serviceNavigation: "[data-home-service-navigation]",
        serviceVisual: "[data-home-service-visual]",
        serviceMobileWrapper: "[data-home-service-mobile-wrapper]",
        serviceSlider: "[data-home-service-slider]",
        servicePagination: "[data-home-service-pagination]",
        serviceTrigger: "[data-home-service-trigger]",
        serviceImage: "[data-home-service-image]",
        serviceDetail: "[data-home-service-detail]",
        marqueeTrack: "[data-home-marquee-track]",
        marqueeGroup: "[data-home-marquee-group]",
        packagesGrid: "[data-home-packages-grid]",
        internationalPath: "[data-home-international-path]",
        faqMount: "[data-home-faq]",
        revealSequence: "[data-home-reveal-sequence]",
        revealEntry: "[data-home-reveal-entry]"
    };

    const state = {
        initialized: false,
        activeServiceIndex: 0,
        serviceSlider: null,
        revealObserver: null,
        resizeTimer: null
    };

    const FALLBACK_SERVICES = [
        {
            title: "Resume Writing",
            slug: "resume-writing",
            href: "resume-writing.html",
            icon: "file-text",
            shortDescription:
                "Structured resume support focused on clearer positioning, relevant evidence and readable presentation.",
            image: "assets/images/service-resume-writing.webp",
            imageAlt:
                "Professional reviewing a resume document at a desk"
        },
        {
            title: "LinkedIn Profile Optimization",
            slug: "linkedin-profile-optimization",
            href: "linkedin-profile-optimization.html",
            icon: "linkedin",
            shortDescription:
                "Profile positioning support designed to improve clarity across your headline, summary, experience and skills.",
            image: "assets/images/service-linkedin-profile.webp",
            imageAlt:
                "Professional reviewing a career profile on a laptop"
        },
        {
            title: "Cover Letter Writing",
            slug: "cover-letter-writing",
            href: "cover-letter-writing.html",
            icon: "mail-open",
            shortDescription:
                "Focused cover-letter support that connects your experience with the needs of a specific opportunity.",
            image: "assets/images/service-cover-letter.webp",
            imageAlt:
                "Professional preparing a focused cover letter"
        },
        {
            title: "IT Resume Services",
            slug: "it-resume-services",
            href: "it-resume-services.html",
            icon: "code-2",
            shortDescription:
                "Career-document support for technical professionals who need to communicate tools, scope and contribution clearly.",
            image: "assets/images/service-it-resume.webp",
            imageAlt:
                "Technology professional working with career documents"
        },
        {
            title: "Resume for Newcomers",
            slug: "resume-for-newcomers",
            href: "resume-for-newcomers.html",
            icon: "plane",
            shortDescription:
                "Resume-positioning support for professionals adapting experience to a new employment market.",
            image: "assets/images/service-newcomer-resume.webp",
            imageAlt:
                "International professional preparing career materials"
        },
        {
            title: "Executive Resume Services",
            slug: "executive-resume-services",
            href: "executive-resume-services.html",
            icon: "briefcase-business",
            shortDescription:
                "Senior-level positioning support focused on leadership scope, business context and decision-making impact.",
            image: "assets/images/service-executive-resume.webp",
            imageAlt:
                "Senior professional reviewing executive career documents"
        },
        {
            title: "Interview Preparation",
            slug: "interview-preparation",
            href: "interview-preparation.html",
            icon: "messages-square",
            shortDescription:
                "Structured preparation support for clearer examples, more focused answers and stronger interview readiness.",
            image: "assets/images/service-interview-preparation.webp",
            imageAlt:
                "Professional preparing for a structured interview"
        },
        {
            title: "International Job Positioning",
            slug: "international-job-positioning",
            href: "international-job-positioning.html",
            icon: "globe-2",
            shortDescription:
                "Career-positioning support for professionals communicating experience across countries and employment markets.",
            image: "assets/images/service-international-positioning.webp",
            imageAlt:
                "Professional planning an international career transition"
        }
    ];

    const FALLBACK_PACKAGES = [
        {
            title: "Resume Essentials",
            icon: "file-check-2",
            description:
                "Focused support for professionals who need a clearer, more structured resume foundation.",
            bestFor:
                "Professionals updating an existing resume for a defined direction.",
            includes: [
                "Resume structure review",
                "Positioning and wording support",
                "Achievement-focused editing",
                "Final presentation guidance"
            ],
            href: "contact.html?package=resume-essentials"
        },
        {
            title: "Career Profile",
            icon: "user-round-search",
            description:
                "Combined resume and LinkedIn positioning support for a more consistent professional narrative.",
            bestFor:
                "Professionals who want aligned messaging across core career materials.",
            includes: [
                "Resume support",
                "LinkedIn headline and summary",
                "Experience-section alignment",
                "Profile consistency review"
            ],
            href: "contact.html?package=career-profile"
        },
        {
            title: "International Positioning",
            icon: "globe-2",
            description:
                "Career-material support for professionals navigating a new country, market or international opportunity.",
            bestFor:
                "Newcomers and internationally mobile professionals.",
            includes: [
                "Market-aware resume positioning",
                "Transferable experience framing",
                "LinkedIn profile guidance",
                "International application context"
            ],
            href: "contact.html?package=international-positioning"
        },
        {
            title: "Executive Direction",
            icon: "briefcase-business",
            description:
                "Senior-level support focused on leadership scope, strategic contribution and executive communication.",
            bestFor:
                "Managers, directors and senior professionals refining executive positioning.",
            includes: [
                "Executive resume support",
                "Leadership narrative",
                "Business-impact framing",
                "Senior LinkedIn positioning"
            ],
            href: "contact.html?package=executive-direction"
        }
    ];

    const FALLBACK_INTERNATIONAL_STEPS = [
        {
            label: "Understand the target market"
        },
        {
            label: "Identify transferable experience"
        },
        {
            label: "Adapt career-language conventions"
        },
        {
            label: "Align resume and profile messaging"
        },
        {
            label: "Prepare a focused inquiry"
        }
    ];

    const FALLBACK_FAQ = [
        {
            question:
                "Does NimoMark guarantee interviews or employment?",
            answer:
                "No. NimoMark provides independent career-support information and inquiry coordination. Interviews, employment decisions, salary outcomes and placement results depend on employers, markets, individual circumstances and other factors outside the platform’s control."
        },
        {
            question:
                "Can I submit an inquiry before choosing a specific service?",
            answer:
                "Yes. You can describe your current situation, career direction and the materials you are considering. Your inquiry can then be reviewed to identify potentially relevant support options."
        },
        {
            question:
                "Does the platform provide immigration or legal advice?",
            answer:
                "No. NimoMark does not provide legal, immigration, visa or regulated professional advice. Questions in those areas should be directed to appropriately qualified professionals."
        },
        {
            question:
                "Can support be relevant for international professionals?",
            answer:
                "The platform includes service categories focused on newcomers and international job positioning. The exact relevance and available scope depend on the professional’s background, target market and inquiry details."
        },
        {
            question:
                "Are the resume examples copied from real clients?",
            answer:
                "No. Educational examples use fictionalized or generalized wording to illustrate structure and communication principles without exposing private client information."
        }
    ];

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

    function renderIcon(name, className = "") {
        return `
      <i
        class="${escapeAttribute(className)}"
        data-lucide="${escapeAttribute(name)}"
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

    function getServiceTitle(service) {
        return firstDefined(
            service.title,
            service.name,
            service.label,
            "Career support service"
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

        return firstDefined(
            service.href,
            service.url,
            slug ? `${slug}.html` : "services.html"
        );
    }

    function getServiceIcon(service) {
        return firstDefined(
            service.icon,
            service.lucideIcon,
            service.iconName,
            "briefcase-business"
        );
    }

    function getServiceDescription(service) {
        return firstDefined(
            service.homeDescription,
            service.shortDescription,
            service.summary,
            service.description,
            ""
        );
    }

    function getServiceImage(service) {
        return firstDefined(
            service.homeImage,
            service.cardImage,
            service.image,
            service.heroImage,
            service.images?.home,
            service.images?.card,
            service.images?.hero,
            "assets/images/service-career-support.webp"
        );
    }

    function getServiceImageAlt(service) {
        return firstDefined(
            service.imageAlt,
            service.alt,
            service.images?.alt,
            `${getServiceTitle(service)} career support`
        );
    }

    function getServices() {
        const possibleServices = [
            getConfigValue("pages.home.services"),
            getConfigValue("home.services"),
            getConfigValue("services")
        ];

        for (const candidate of possibleServices) {
            const entries = toArray(candidate);

            if (entries.length) {
                return entries.slice(0, 8);
            }
        }

        return FALLBACK_SERVICES;
    }

    function getPackages() {
        const possiblePackages = [
            getConfigValue("pages.home.packages"),
            getConfigValue("home.packages"),
            getConfigValue("packages")
        ];

        for (const candidate of possiblePackages) {
            const entries = toArray(candidate);

            if (entries.length) {
                return entries.slice(0, 4);
            }
        }

        return FALLBACK_PACKAGES;
    }

    function getInternationalSteps() {
        const possibleSteps = [
            getConfigValue(
                "pages.home.internationalPositioning.steps"
            ),
            getConfigValue("pages.home.international.steps"),
            getConfigValue("home.international.steps")
        ];

        for (const candidate of possibleSteps) {
            const entries = toArray(candidate);

            if (entries.length) {
                return entries;
            }
        }

        return FALLBACK_INTERNATIONAL_STEPS;
    }

    function getFaqItems() {
        const possibleFaq = [
            getConfigValue("pages.home.faq.items"),
            getConfigValue("pages.home.faq"),
            getConfigValue("home.faq")
        ];

        for (const candidate of possibleFaq) {
            const entries = toArray(candidate).filter(
                (item) =>
                    isPlainObject(item) &&
                    firstDefined(
                        item.question,
                        item.title,
                        item.label
                    )
            );

            if (entries.length) {
                return entries;
            }
        }

        return FALLBACK_FAQ;
    }

    function createServiceTrigger(service, index) {
        const title = getServiceTitle(service);
        const icon = getServiceIcon(service);

        return `
      <button
        class="home-service-showcase__trigger ${index === 0 ? "is-active" : ""
            }"
        type="button"
        role="tab"
        id="home-service-tab-${index}"
        aria-selected="${index === 0 ? "true" : "false"}"
        aria-controls="home-service-panel-${index}"
        tabindex="${index === 0 ? "0" : "-1"}"
        data-home-service-trigger
        data-service-index="${index}"
      >
        <span class="home-service-showcase__trigger-icon">
          ${renderIcon(icon)}
        </span>

        <span class="home-service-showcase__trigger-label">
          ${escapeHtml(title)}
        </span>

        ${renderIcon(
                "arrow-right",
                "home-service-showcase__trigger-arrow"
            )}
      </button>
    `;
    }

    function createServiceImage(service, index) {
        return `
      <div
        class="home-service-showcase__image ${index === 0 ? "is-active" : ""
            }"
        aria-hidden="${index === 0 ? "false" : "true"}"
        data-home-service-image
        data-service-index="${index}"
      >
        <img
          src="${escapeAttribute(getServiceImage(service))}"
          alt="${escapeAttribute(
                getServiceImageAlt(service)
            )}"
          width="960"
          height="1120"
          loading="${index === 0 ? "eager" : "lazy"}"
          decoding="async"
        >
      </div>
    `;
    }

    function createServiceDetail(service, index) {
        const title = getServiceTitle(service);
        const description = getServiceDescription(service);
        const href = getServiceHref(service);

        return `
      <div
        class="home-service-showcase__detail ${index === 0 ? "is-active" : ""
            }"
        role="tabpanel"
        id="home-service-panel-${index}"
        aria-labelledby="home-service-tab-${index}"
        aria-hidden="${index === 0 ? "false" : "true"}"
        tabindex="0"
        data-home-service-detail
        data-service-index="${index}"
      >
        <h3 class="home-service-showcase__detail-title">
          ${escapeHtml(title)}
        </h3>

        <p class="home-service-showcase__detail-text">
          ${escapeHtml(description)}
        </p>

        <a
          class="site-link site-link--light home-service-showcase__detail-link"
          href="${escapeAttribute(href)}"
        >
          <span>Explore this service</span>
          ${renderIcon("arrow-right")}
        </a>
      </div>
    `;
    }

    function createMobileServiceSlide(service, index) {
        const title = getServiceTitle(service);
        const description = getServiceDescription(service);
        const href = getServiceHref(service);
        const icon = getServiceIcon(service);

        return `
      <div
        class="swiper-slide home-service-showcase__slide"
        data-service-index="${index}"
      >
        <article class="home-service-showcase__mobile-entry">
          <div class="home-service-showcase__mobile-image">
            <img
              src="${escapeAttribute(
            getServiceImage(service)
        )}"
              alt="${escapeAttribute(
            getServiceImageAlt(service)
        )}"
              width="900"
              height="1080"
              loading="lazy"
              decoding="async"
            >
          </div>

          <div class="home-service-showcase__mobile-content">
            <span class="home-service-showcase__mobile-icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="home-service-showcase__mobile-title">
              ${escapeHtml(title)}
            </h3>

            <p class="home-service-showcase__mobile-text">
              ${escapeHtml(description)}
            </p>

            <a
              class="site-link site-link--light"
              href="${escapeAttribute(href)}"
            >
              <span>Explore this service</span>
              ${renderIcon("arrow-right")}
            </a>
          </div>
        </article>
      </div>
    `;
    }

    function renderServiceShowcase() {
        const navigation = document.querySelector(
            SELECTORS.serviceNavigation
        );

        const visual = document.querySelector(
            SELECTORS.serviceVisual
        );

        const mobileWrapper = document.querySelector(
            SELECTORS.serviceMobileWrapper
        );

        if (!navigation && !visual && !mobileWrapper) {
            return;
        }

        const services = getServices();

        if (!services.length) {
            return;
        }

        if (navigation) {
            navigation.setAttribute(
                "role",
                "tablist"
            );

            navigation.setAttribute(
                "aria-label",
                "Career support services"
            );

            navigation.innerHTML = services
                .map(createServiceTrigger)
                .join("");
        }

        if (visual) {
            visual.innerHTML = `
        ${services.map(createServiceImage).join("")}
        ${services.map(createServiceDetail).join("")}
      `;
        }

        if (mobileWrapper) {
            mobileWrapper.innerHTML = services
                .map(createMobileServiceSlide)
                .join("");
        }

        refreshIcons(
            navigation ||
            visual ||
            mobileWrapper ||
            document
        );

        initializeServiceShowcaseInteraction();
    }

    function getServiceShowcaseElements() {
        return {
            triggers: Array.from(
                document.querySelectorAll(
                    SELECTORS.serviceTrigger
                )
            ),
            images: Array.from(
                document.querySelectorAll(
                    SELECTORS.serviceImage
                )
            ),
            details: Array.from(
                document.querySelectorAll(
                    SELECTORS.serviceDetail
                )
            )
        };
    }

    function setActiveService(index, options = {}) {
        const elements = getServiceShowcaseElements();

        if (!elements.triggers.length) {
            return;
        }

        const safeIndex = Math.max(
            0,
            Math.min(index, elements.triggers.length - 1)
        );

        state.activeServiceIndex = safeIndex;

        elements.triggers.forEach((trigger, triggerIndex) => {
            const active = triggerIndex === safeIndex;

            trigger.classList.toggle("is-active", active);
            trigger.setAttribute(
                "aria-selected",
                String(active)
            );
            trigger.setAttribute(
                "tabindex",
                active ? "0" : "-1"
            );
        });

        elements.images.forEach((image) => {
            const imageIndex = Number(
                image.dataset.serviceIndex
            );

            const active = imageIndex === safeIndex;

            image.classList.toggle("is-active", active);
            image.setAttribute(
                "aria-hidden",
                String(!active)
            );
        });

        elements.details.forEach((detail) => {
            const detailIndex = Number(
                detail.dataset.serviceIndex
            );

            const active = detailIndex === safeIndex;

            detail.classList.toggle("is-active", active);
            detail.setAttribute(
                "aria-hidden",
                String(!active)
            );
        });

        if (
            options.focusTrigger &&
            elements.triggers[safeIndex]
        ) {
            elements.triggers[safeIndex].focus();
        }

        if (
            options.syncSlider !== false &&
            state.serviceSlider &&
            typeof state.serviceSlider.slideTo === "function"
        ) {
            state.serviceSlider.slideTo(safeIndex);
        }
    }

    function initializeServiceShowcaseInteraction() {
        const { triggers } =
            getServiceShowcaseElements();

        if (!triggers.length) {
            return;
        }

        triggers.forEach((trigger, index) => {
            if (
                trigger.dataset.serviceInitialized === "true"
            ) {
                return;
            }

            trigger.dataset.serviceInitialized = "true";

            trigger.addEventListener("click", () => {
                setActiveService(index);
            });

            trigger.addEventListener("mouseenter", () => {
                if (
                    window.matchMedia(
                        "(hover: hover) and (pointer: fine)"
                    ).matches
                ) {
                    setActiveService(index, {
                        syncSlider: false
                    });
                }
            });

            trigger.addEventListener("focus", () => {
                setActiveService(index, {
                    syncSlider: false
                });
            });

            trigger.addEventListener(
                "keydown",
                (event) => {
                    let nextIndex = index;

                    if (
                        event.key === "ArrowDown" ||
                        event.key === "ArrowRight"
                    ) {
                        nextIndex =
                            index < triggers.length - 1
                                ? index + 1
                                : 0;
                    } else if (
                        event.key === "ArrowUp" ||
                        event.key === "ArrowLeft"
                    ) {
                        nextIndex =
                            index > 0
                                ? index - 1
                                : triggers.length - 1;
                    } else if (event.key === "Home") {
                        nextIndex = 0;
                    } else if (event.key === "End") {
                        nextIndex = triggers.length - 1;
                    } else {
                        return;
                    }

                    event.preventDefault();

                    setActiveService(nextIndex, {
                        focusTrigger: true,
                        syncSlider: false
                    });
                }
            );
        });

        setActiveService(0, {
            syncSlider: false
        });
    }

    function initializeServiceSlider() {
        const sliderElement = document.querySelector(
            SELECTORS.serviceSlider
        );

        if (!sliderElement) {
            return;
        }

        if (
            !window.Swiper ||
            typeof window.Swiper !== "function"
        ) {
            sliderElement.classList.add(
                "swiper-unavailable"
            );
            return;
        }

        if (state.serviceSlider) {
            return;
        }

        const paginationElement =
            document.querySelector(
                SELECTORS.servicePagination
            );

        state.serviceSlider = new window.Swiper(
            sliderElement,
            {
                slidesPerView: 1.04,
                spaceBetween: 16,
                speed: 680,
                grabCursor: true,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                pagination: paginationElement
                    ? {
                        el: paginationElement,
                        clickable: true
                    }
                    : undefined,
                a11y: {
                    enabled: true,
                    prevSlideMessage:
                        "Previous career support service",
                    nextSlideMessage:
                        "Next career support service",
                    firstSlideMessage:
                        "This is the first career support service",
                    lastSlideMessage:
                        "This is the last career support service",
                    paginationBulletMessage:
                        "Go to career support service {{index}}"
                },
                breakpoints: {
                    560: {
                        slidesPerView: 1.08,
                        spaceBetween: 18
                    },
                    768: {
                        slidesPerView: 1.14,
                        spaceBetween: 22
                    }
                },
                on: {
                    slideChange(swiper) {
                        setActiveService(
                            swiper.activeIndex,
                            {
                                syncSlider: false
                            }
                        );
                    }
                }
            }
        );
    }

    function createMarqueeItem(service) {
        return `
      <span class="home-marquee__item">
        <span class="home-marquee__icon">
          ${renderIcon(getServiceIcon(service))}
        </span>

        <span>
          ${escapeHtml(getServiceTitle(service))}
        </span>

        <span
          class="home-marquee__separator"
          aria-hidden="true"
        ></span>
      </span>
    `;
    }

    function renderMarquee() {
        const track = document.querySelector(
            SELECTORS.marqueeTrack
        );

        if (!track) {
            return;
        }

        const services = getServices();

        if (!services.length) {
            return;
        }

        const existingGroups = track.querySelectorAll(
            SELECTORS.marqueeGroup
        );

        if (!existingGroups.length) {
            const groupMarkup = services
                .map(createMarqueeItem)
                .join("");

            track.innerHTML = `
        <div
          class="home-marquee__group"
          data-home-marquee-group
        >
          ${groupMarkup}
        </div>

        <div
          class="home-marquee__group"
          data-home-marquee-group
          aria-hidden="true"
        >
          ${groupMarkup}
        </div>
      `;
        } else if (existingGroups.length === 1) {
            const clonedGroup =
                existingGroups[0].cloneNode(true);

            clonedGroup.setAttribute(
                "aria-hidden",
                "true"
            );

            track.append(clonedGroup);
        }

        refreshIcons(track);
    }

    function getPackageTitle(packageEntry) {
        return firstDefined(
            packageEntry.title,
            packageEntry.name,
            packageEntry.label,
            "Career support package"
        );
    }

    function getPackageDescription(packageEntry) {
        return firstDefined(
            packageEntry.shortDescription,
            packageEntry.description,
            packageEntry.summary,
            ""
        );
    }

    function getPackageBestFor(packageEntry) {
        return firstDefined(
            packageEntry.bestFor,
            packageEntry.audience,
            packageEntry.suitableFor,
            ""
        );
    }

    function getPackageIncludes(packageEntry) {
        return toArray(
            firstDefined(
                packageEntry.includes,
                packageEntry.features,
                packageEntry.items,
                []
            )
        )
            .map((entry) => {
                if (typeof entry === "string") {
                    return entry;
                }

                return firstDefined(
                    entry.label,
                    entry.title,
                    entry.name,
                    ""
                );
            })
            .filter(Boolean);
    }

    function getPackageHref(packageEntry, index) {
        return firstDefined(
            packageEntry.href,
            packageEntry.url,
            `contact.html?package=${encodeURIComponent(
                getPackageTitle(packageEntry)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") ||
                `package-${index + 1}`
            )}`
        );
    }

    function createPackageEntry(packageEntry, index) {
        const title = getPackageTitle(packageEntry);
        const description =
            getPackageDescription(packageEntry);

        const bestFor =
            getPackageBestFor(packageEntry);

        const includes =
            getPackageIncludes(packageEntry);

        const icon = firstDefined(
            packageEntry.icon,
            packageEntry.iconName,
            "layers-3"
        );

        const href = getPackageHref(
            packageEntry,
            index
        );

        return `
      <article
        class="home-packages__entry"
        data-aos="fade-up"
        data-aos-delay="${Math.min(index * 70, 210)}"
      >
        <div class="home-packages__entry-top">
          <span class="home-packages__icon">
            ${renderIcon(icon)}
          </span>

          <h3 class="home-packages__name">
            ${escapeHtml(title)}
          </h3>

          <p class="home-packages__description">
            ${escapeHtml(description)}
          </p>

          ${bestFor
                ? `
                <div class="home-packages__best-for">
                  <span class="home-packages__best-for-label">
                    Best suited for
                  </span>

                  <p class="home-packages__best-for-text">
                    ${escapeHtml(bestFor)}
                  </p>
                </div>
              `
                : ""
            }
        </div>

        <div class="home-packages__entry-bottom">
          ${includes.length
                ? `
                <ul class="home-packages__includes">
                  ${includes
                    .map(
                        (item) => `
                        <li class="home-packages__include">
                          <span class="home-packages__include-icon">
                            ${renderIcon("check")}
                          </span>

                          <span>${escapeHtml(item)}</span>
                        </li>
                      `
                    )
                    .join("")}
                </ul>
              `
                : ""
            }

          <a
            class="site-link home-packages__link ${index === 1 ? "site-link--light" : ""
            }"
            href="${escapeAttribute(href)}"
          >
            <span>Ask about this package</span>
            ${renderIcon("arrow-right")}
          </a>
        </div>
      </article>
    `;
    }

    function renderPackages() {
        const grid = document.querySelector(
            SELECTORS.packagesGrid
        );

        if (!grid) {
            return;
        }

        const packages = getPackages().slice(0, 4);

        if (!packages.length) {
            return;
        }

        grid.innerHTML = packages
            .map(createPackageEntry)
            .join("");

        refreshIcons(grid);
    }

    function renderInternationalPath() {
        const path = document.querySelector(
            SELECTORS.internationalPath
        );

        if (!path) {
            return;
        }

        const steps = getInternationalSteps();

        if (!steps.length) {
            return;
        }

        path.innerHTML = steps
            .map((step, index) => {
                const label =
                    typeof step === "string"
                        ? step
                        : firstDefined(
                            step.label,
                            step.title,
                            step.name,
                            `Step ${index + 1}`
                        );

                return `
          <div
            class="home-international__point"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 60, 240)}"
          >
            <span
              class="home-international__point-dot"
              aria-hidden="true"
            ></span>

            <span class="home-international__point-label">
              ${escapeHtml(label)}
            </span>
          </div>
        `;
            })
            .join("");
    }

    function createFaqItem(item, index) {
        const question = firstDefined(
            item.question,
            item.title,
            item.label,
            `Question ${index + 1}`
        );

        const answer = firstDefined(
            item.answer,
            item.text,
            item.description,
            ""
        );

        const expanded =
            item.expanded === true || index === 0;

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
    }

    function renderFaq() {
        const faqMount = document.querySelector(
            SELECTORS.faqMount
        );

        if (!faqMount) {
            return;
        }

        const faqItems = getFaqItems();

        if (!faqItems.length) {
            return;
        }

        faqMount.innerHTML = faqItems
            .map(createFaqItem)
            .join("");

        refreshIcons(faqMount);

        if (
            window.NimoMark &&
            typeof window.NimoMark.initializeAccordions ===
            "function"
        ) {
            const accordion =
                faqMount.matches("[data-accordion]")
                    ? faqMount
                    : faqMount.closest("[data-accordion]");

            if (accordion) {
                window.NimoMark.initializeAccordions(
                    accordion.parentElement || document
                );
            }
        }

        injectFaqSchema(faqItems);
    }

    function injectFaqSchema(faqItems) {
        const existingSchema = document.getElementById(
            "home-faq-schema"
        );

        existingSchema?.remove();

        const mainEntity = faqItems
            .map((item) => {
                const question = firstDefined(
                    item.question,
                    item.title,
                    item.label,
                    ""
                );

                const answer = firstDefined(
                    item.answer,
                    item.text,
                    item.description,
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

        script.id = "home-faq-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity
        });

        document.head.append(script);
    }

    function initializeRevealSequences() {
        const sequences = document.querySelectorAll(
            SELECTORS.revealSequence
        );

        if (!sequences.length) {
            return;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            sequences.forEach((sequence) => {
                sequence
                    .querySelectorAll(SELECTORS.revealEntry)
                    .forEach((entry) => {
                        entry.classList.add("is-visible");
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

                        const revealEntries =
                            entry.target.querySelectorAll(
                                SELECTORS.revealEntry
                            );

                        revealEntries.forEach(
                            (revealEntry, index) => {
                                window.setTimeout(() => {
                                    revealEntry.classList.add(
                                        "is-visible"
                                    );
                                }, index * 90);
                            }
                        );

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.14,
                    rootMargin: "0px 0px -8% 0px"
                }
            );

        sequences.forEach((sequence) => {
            state.revealObserver.observe(sequence);
        });
    }

    function initializeHoverImageLoading() {
        document
            .querySelectorAll(
                `${SELECTORS.serviceTrigger}[data-image-src]`
            )
            .forEach((trigger) => {
                const source = trigger.dataset.imageSrc;

                if (!source) {
                    return;
                }

                const preload = () => {
                    const image = new Image();
                    image.src = source;

                    trigger.removeEventListener(
                        "mouseenter",
                        preload
                    );

                    trigger.removeEventListener(
                        "focus",
                        preload
                    );
                };

                trigger.addEventListener(
                    "mouseenter",
                    preload,
                    {
                        once: true
                    }
                );

                trigger.addEventListener("focus", preload, {
                    once: true
                });
            });
    }

    function initializeResponsiveUpdates() {
        window.addEventListener(
            "resize",
            () => {
                window.clearTimeout(state.resizeTimer);

                state.resizeTimer = window.setTimeout(() => {
                    state.serviceSlider?.update?.();
                    refreshAos();
                }, 180);
            },
            {
                passive: true
            }
        );
    }

    function initializeHomePage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        renderMarquee();
        renderServiceShowcase();
        renderPackages();
        renderInternationalPath();
        renderFaq();

        initializeServiceSlider();
        initializeRevealSequences();
        initializeHoverImageLoading();
        initializeResponsiveUpdates();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
        });

        document.dispatchEvent(
            new CustomEvent("nimomark:home-ready", {
                detail: {
                    services: getServices(),
                    packages: getPackages()
                }
            })
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(initializeHomePage);
    });
})();