(function () {
    "use strict";

    const SELECTORS = {
        introductionPrinciples:
            "[data-services-introduction-principles]",
        directory: "[data-services-directory]",
        pathways: "[data-services-pathways]",
        packagesComparison:
            "[data-services-packages-comparison]",
        packagesMobile: "[data-services-packages-mobile]",
        alignmentPoints: "[data-services-alignment-points]",
        marketTopics: "[data-services-market-topics]",
        processTrack: "[data-services-process-track]",
        faq: "[data-services-faq]",
        focusSlider:
            "[data-services-focus-slider]",
        focusSliderWrapper:
            "[data-services-focus-wrapper]",
        focusSliderPrevious:
            "[data-services-focus-previous]",
        focusSliderNext:
            "[data-services-focus-next]",
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
                "Professional reviewing a resume document"
        },
        {
            title: "LinkedIn Profile Optimization",
            slug: "linkedin-profile-optimization",
            href: "linkedin-profile-optimization.html",
            icon: "linkedin",
            shortDescription:
                "Profile support for clearer messaging across your headline, summary, experience and skills.",
            image: "assets/images/service-linkedin-profile.webp",
            imageAlt:
                "Professional reviewing a LinkedIn profile"
        },
        {
            title: "Cover Letter Writing",
            slug: "cover-letter-writing",
            href: "cover-letter-writing.html",
            icon: "mail-open",
            shortDescription:
                "Focused cover-letter support connecting your experience with the needs of a specific opportunity.",
            image: "assets/images/service-cover-letter.webp",
            imageAlt:
                "Professional preparing a cover letter"
        },
        {
            title: "IT Resume Services",
            slug: "it-resume-services",
            href: "it-resume-services.html",
            icon: "code-2",
            shortDescription:
                "Career-document support for technical professionals communicating tools, scope and contribution.",
            image: "assets/images/service-it-resume.webp",
            imageAlt:
                "Technology professional preparing career documents"
        },
        {
            title: "Resume for Newcomers",
            slug: "resume-for-newcomers",
            href: "resume-for-newcomers.html",
            icon: "plane",
            shortDescription:
                "Resume-positioning support for professionals adapting prior experience to a new employment market.",
            image: "assets/images/service-newcomer-resume.webp",
            imageAlt:
                "International professional reviewing a resume"
        },
        {
            title: "Executive Resume Services",
            slug: "executive-resume-services",
            href: "executive-resume-services.html",
            icon: "briefcase-business",
            shortDescription:
                "Senior-level positioning focused on leadership scope, strategic context and business contribution.",
            image: "assets/images/service-executive-resume.webp",
            imageAlt:
                "Executive reviewing professional career materials"
        },
        {
            title: "Interview Preparation",
            slug: "interview-preparation",
            href: "interview-preparation.html",
            icon: "messages-square",
            shortDescription:
                "Structured preparation for clearer examples, focused answers and stronger interview readiness.",
            image: "assets/images/service-interview-preparation.webp",
            imageAlt:
                "Professional preparing for an interview"
        },
        {
            title: "International Job Positioning",
            slug: "international-job-positioning",
            href: "international-job-positioning.html",
            icon: "globe-2",
            shortDescription:
                "Career-positioning support for communicating experience across countries and employment markets.",
            image:
                "assets/images/service-international-positioning.webp",
            imageAlt:
                "Professional planning an international career transition"
        }
    ];

    const FALLBACK_INTRODUCTION_PRINCIPLES = [
        {
            title: "Start with your actual direction",
            text:
                "Career materials should reflect the roles, markets and professional context you are genuinely targeting.",
            icon: "target"
        },
        {
            title: "Use evidence, not inflated claims",
            text:
                "Strong positioning explains relevant responsibilities and contribution without inventing experience or outcomes.",
            icon: "file-check-2"
        },
        {
            title: "Keep the professional story consistent",
            text:
                "Your resume, profile, cover letter and interview examples should support a coherent direction.",
            icon: "git-merge"
        },
        {
            title: "Treat every inquiry individually",
            text:
                "Available scope, timing and potential specialist matching depend on the information submitted.",
            icon: "user-round-search"
        }
    ];

    const FALLBACK_PATHWAYS = [
        {
            title: "Core Career Documents",
            description:
                "Support for the documents and profiles most frequently used to communicate professional direction.",
            icon: "files",
            serviceSlugs: [
                "resume-writing",
                "linkedin-profile-optimization",
                "cover-letter-writing"
            ]
        },
        {
            title: "Specialized Positioning",
            description:
                "Support shaped around technical careers, international transitions and senior leadership contexts.",
            icon: "waypoints",
            serviceSlugs: [
                "it-resume-services",
                "resume-for-newcomers",
                "executive-resume-services"
            ]
        },
        {
            title: "Preparation and Market Direction",
            description:
                "Support for communicating experience during interviews and across different employment markets.",
            icon: "compass",
            serviceSlugs: [
                "interview-preparation",
                "international-job-positioning"
            ]
        }
    ];

    const FALLBACK_PACKAGES = [
        {
            title: "Resume Essentials",
            bestFor:
                "Professionals updating or rebuilding a core resume.",
            features: {
                resumeSupport: true,
                linkedInSupport: false,
                coverLetterSupport: false,
                interviewPreparation: false,
                internationalPositioning: false
            },
            href: "contact.html?package=resume-essentials"
        },
        {
            title: "Career Profile",
            bestFor:
                "Professionals aligning their resume and LinkedIn profile.",
            features: {
                resumeSupport: true,
                linkedInSupport: true,
                coverLetterSupport: false,
                interviewPreparation: false,
                internationalPositioning: false
            },
            href: "contact.html?package=career-profile"
        },
        {
            title: "Application Direction",
            bestFor:
                "Professionals preparing several connected application materials.",
            features: {
                resumeSupport: true,
                linkedInSupport: true,
                coverLetterSupport: true,
                interviewPreparation: true,
                internationalPositioning: false
            },
            href: "contact.html?package=application-direction"
        },
        {
            title: "International Positioning",
            bestFor:
                "Newcomers and professionals targeting international opportunities.",
            features: {
                resumeSupport: true,
                linkedInSupport: true,
                coverLetterSupport: true,
                interviewPreparation: true,
                internationalPositioning: true
            },
            href:
                "contact.html?package=international-positioning"
        }
    ];

    const PACKAGE_FEATURES = [
        {
            key: "resumeSupport",
            label: "Resume support"
        },
        {
            key: "linkedInSupport",
            label: "LinkedIn profile support"
        },
        {
            key: "coverLetterSupport",
            label: "Cover-letter support"
        },
        {
            key: "interviewPreparation",
            label: "Interview preparation"
        },
        {
            key: "internationalPositioning",
            label: "International positioning"
        }
    ];

    const FALLBACK_ALIGNMENT_POINTS = [
        {
            text:
                "A resume should emphasize experience relevant to the intended role.",
            icon: "scan-text"
        },
        {
            text:
                "A LinkedIn profile should support the same professional direction.",
            icon: "linkedin"
        },
        {
            text:
                "A cover letter should add context instead of repeating the resume.",
            icon: "mail-open"
        },
        {
            text:
                "Interview examples should be consistent with the written materials.",
            icon: "messages-square"
        },
        {
            text:
                "International positioning should account for market conventions without misrepresenting experience.",
            icon: "globe-2"
        }
    ];

    const FALLBACK_MARKET_TOPICS = [
        {
            title: "Target-role language",
            icon: "text-search"
        },
        {
            title: "Transferable experience",
            icon: "arrow-left-right"
        },
        {
            title: "Local hiring conventions",
            icon: "map"
        },
        {
            title: "Professional-level expectations",
            icon: "layers-3"
        },
        {
            title: "Industry-specific terminology",
            icon: "tags"
        },
        {
            title: "Clear application priorities",
            icon: "list-checks"
        }
    ];

    const FALLBACK_PROCESS = [
        {
            title: "Choose a direction",
            text:
                "Explore the service categories most relevant to your current professional question.",
            icon: "compass"
        },
        {
            title: "Share context",
            text:
                "Describe your background, target direction and the materials you want to review.",
            icon: "message-square-text"
        },
        {
            title: "Review possible support",
            text:
                "Your inquiry may be reviewed to identify potentially relevant support options.",
            icon: "clipboard-check"
        },
        {
            title: "Confirm the scope",
            text:
                "Review any proposed timing, deliverables and terms before deciding whether to proceed.",
            icon: "check-check"
        }
    ];

    const FALLBACK_FAQ = [
        {
            question:
                "Can I ask about more than one service in a single inquiry?",
            answer:
                "Yes. You can describe the connected materials or career questions you are considering. The inquiry can then be reviewed as a whole."
        },
        {
            question:
                "Does NimoMark guarantee a job interview or employment?",
            answer:
                "No. NimoMark does not guarantee interviews, employment, salary outcomes or placement. Hiring decisions depend on employers, market conditions and individual circumstances."
        },
        {
            question:
                "Are the packages fixed for every professional?",
            answer:
                "No. Package descriptions are informational starting points. Actual availability, scope, timing and terms may vary depending on the inquiry and any independent specialist involved."
        },
        {
            question:
                "Can support include international career positioning?",
            answer:
                "The platform includes categories for newcomers and international job positioning. Relevance depends on the professional’s background, target market and submitted information."
        },
        {
            question:
                "Does NimoMark provide visa or immigration advice?",
            answer:
                "No. NimoMark does not provide legal, immigration or visa advice. Those questions should be directed to appropriately qualified professionals."
        },
        {
            question:
                "Do I need to know exactly which service I need?",
            answer:
                "No. You can submit a focused description of your situation even when you are uncertain which category is most relevant."
        }
    ];

    const state = {
        initialized: false,
        revealObserver: null,
        parallaxElements: [],
        parallaxFrame: null,
        reducedMotion: false,
        focusSlider: null,
        focusSliderMode: "",
        focusSliderResizeTimer: null,
        focusSliderResizeBound: false
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

    function getServices() {
        const possibleServices = [
            getConfigValue("pages.services.items"),
            getConfigValue("pages.services.services"),
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

    function getServiceDescription(service) {
        return firstDefined(
            service.servicesPageDescription,
            service.shortDescription,
            service.summary,
            service.description,
            ""
        );
    }

    function getServiceImage(service) {
        return firstDefined(
            service.servicesPageImage,
            service.cardImage,
            service.image,
            service.heroImage,
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

    function getServiceBySlug(slug) {
        return getServices().find(
            (service) => getServiceSlug(service) === slug
        );
    }

    function getFocusServiceCategory(service) {
        return firstDefined(
            service.category,
            service.tag,
            service.audience,
            "Career support"
        );
    }

    function getFocusServiceContent(service) {
        const slug = getServiceSlug(service);

        const fallbackService = FALLBACK_SERVICES.find(
            (entry) => entry.slug === slug
        );

        return {
            title: firstDefined(
                service.title,
                service.name,
                service.label,
                fallbackService?.title,
                "Career Support"
            ),

            description: firstDefined(
                service.servicesPageDescription,
                service.shortDescription,
                service.summary,
                service.description,
                fallbackService?.shortDescription,
                "Explore focused support for clearer professional communication."
            ),

            href: firstDefined(
                service.href,
                service.url,
                fallbackService?.href,
                slug ? `${slug}.html` : "services.html"
            ),

            icon: firstDefined(
                service.icon,
                service.iconName,
                service.lucideIcon,
                fallbackService?.icon,
                "briefcase-business"
            )
        };
    }

    function renderFocusSlider() {
        const wrapper = document.querySelector(
            SELECTORS.focusSliderWrapper
        );

        if (!wrapper) {
            return;
        }

        wrapper.innerHTML = getServices()
            .map((service) => {
                const content =
                    getFocusServiceContent(service);

                return `
                <article
                    class="services-focus-slider__slide swiper-slide"
                >
                    <a
                        class="services-focus-slider__card"
                        href="${escapeAttribute(content.href)}"
                        aria-label="Explore ${escapeAttribute(
                    content.title
                )}"
                    >
                        <span
                            class="services-focus-slider__icon"
                            aria-hidden="true"
                        >
                            ${renderIcon(content.icon)}
                        </span>

                        <div class="services-focus-slider__card-content">
                            <h3 class="services-focus-slider__card-title">
                                ${escapeHtml(content.title)}
                            </h3>

                            <p class="services-focus-slider__card-text">
                                ${escapeHtml(content.description)}
                            </p>

                            <span class="services-focus-slider__card-link">
                                Explore service

                                ${renderIcon("arrow-up-right")}
                            </span>
                        </div>
                    </a>
                </article>
            `;
            })
            .join("");
    }

    function getFocusSliderMode() {
        return window.innerWidth >= 900
            ? "vertical"
            : "horizontal";
    }

    function createFocusSlider() {
        const sliderElement = document.querySelector(
            SELECTORS.focusSlider
        );

        if (
            !sliderElement ||
            typeof window.Swiper !== "function"
        ) {
            return;
        }

        if (state.focusSlider) {
            state.focusSlider.destroy(true, true);
            state.focusSlider = null;
        }

        const section = sliderElement.closest(
            ".services-focus-slider"
        );

        if (!section) {
            return;
        }

        const desktop = window.matchMedia(
            "(min-width: 900px)"
        ).matches;

        const previousButton = section.querySelector(
            SELECTORS.focusSliderPrevious
        );

        const nextButton = section.querySelector(
            SELECTORS.focusSliderNext
        );

        state.focusSliderMode = desktop
            ? "vertical"
            : "horizontal";

        state.focusSlider = new window.Swiper(
            sliderElement,
            {
                direction: desktop
                    ? "vertical"
                    : "horizontal",

                slidesPerView: desktop
                    ? 2.18
                    : "auto",

                centeredSlides: desktop,
                initialSlide: desktop ? 1 : 0,
                spaceBetween: desktop ? 24 : 16,

                speed: 760,
                loop: false,
                rewind: true,
                grabCursor: true,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                resizeObserver: true,
                updateOnWindowResize: true,

                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },

                navigation:
                    previousButton && nextButton
                        ? {
                            prevEl: previousButton,
                            nextEl: nextButton
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
                        "This is the last career support service"
                },

                on: {
                    init(swiper) {
                        swiper.update();
                        refreshIcons(section);
                    },

                    slideChange() {
                        refreshIcons(section);
                    },

                    resize(swiper) {
                        swiper.update();
                    }
                }
            }
        );

        window.requestAnimationFrame(() => {
            state.focusSlider?.update();
            refreshIcons(section);
        });
    }

    function handleFocusSliderResize() {
        window.clearTimeout(
            state.focusSliderResizeTimer
        );

        state.focusSliderResizeTimer =
            window.setTimeout(() => {
                const nextMode = getFocusSliderMode();

                if (
                    state.focusSliderMode !== nextMode
                ) {
                    createFocusSlider();
                    return;
                }

                if (state.focusSlider) {
                    state.focusSlider.update();
                }
            }, 160);
    }

    function initializeFocusSlider() {
        const sliderElement = document.querySelector(
            SELECTORS.focusSlider
        );

        if (!sliderElement) {
            return;
        }

        if (typeof window.Swiper !== "function") {
            window.setTimeout(
                initializeFocusSlider,
                120
            );

            return;
        }

        createFocusSlider();

        if (!state.focusSliderResizeBound) {
            state.focusSliderResizeBound = true;

            window.addEventListener(
                "resize",
                handleFocusSliderResize,
                {
                    passive: true
                }
            );
        }
    }

    function renderIntroductionPrinciples() {
        const mount = document.querySelector(
            SELECTORS.introductionPrinciples
        );

        if (!mount) {
            return;
        }

        const principles = getConfiguredArray(
            [
                "pages.services.introduction.principles",
                "pages.services.principles",
                "servicesPage.principles"
            ],
            FALLBACK_INTRODUCTION_PRINCIPLES
        );

        mount.innerHTML = principles
            .map((principle, index) => {
                const title = getEntryTitle(
                    principle,
                    `Principle ${index + 1}`
                );

                const text = getEntryText(principle);
                const icon = getEntryIcon(
                    principle,
                    "circle-check"
                );

                return `
          <article
            class="services-introduction__principle"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 65, 195)}"
          >
            <span class="services-introduction__principle-icon">
              ${renderIcon(icon)}
            </span>

            <div class="services-introduction__principle-content">
              <h3 class="services-introduction__principle-title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="services-introduction__principle-text">
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

    function renderDirectory() {
        const mount = document.querySelector(
            SELECTORS.directory
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getServices()
            .map((service, index) => {
                const title = getServiceTitle(service);
                const description =
                    getServiceDescription(service);
                const href = getServiceHref(service);
                const icon = getEntryIcon(
                    service,
                    "briefcase-business"
                );

                const tag = firstDefined(
                    service.category,
                    service.tag,
                    service.audience,
                    "Career positioning"
                );

                return `
          <article
            class="services-directory__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min((index % 2) * 80, 80)}"
          >
            <div class="services-directory__media">
              <img
                src="${escapeAttribute(
                    getServiceImage(service)
                )}"
                alt="${escapeAttribute(
                    getServiceImageAlt(service)
                )}"
                width="960"
                height="1080"
                loading="${index < 2 ? "eager" : "lazy"}"
                decoding="async"
              >
            </div>

            <div
              class="services-directory__overlay"
              aria-hidden="true"
            ></div>

            <div class="services-directory__content">
              <div class="services-directory__top">
                <span class="services-directory__icon">
                  ${renderIcon(icon)}
                </span>

                <span class="services-directory__arrow">
                  ${renderIcon("arrow-up-right")}
                </span>
              </div>

              <div class="services-directory__body">
                <span class="services-directory__tag">
                  ${escapeHtml(tag)}
                </span>

                <h3 class="services-directory__title">
                  ${escapeHtml(title)}
                </h3>

                ${description
                        ? `
                      <p class="services-directory__summary">
                        ${escapeHtml(description)}
                      </p>
                    `
                        : ""
                    }
              </div>
            </div>

            <a
              class="services-directory__link"
              href="${escapeAttribute(href)}"
              aria-label="Explore ${escapeAttribute(title)}"
            ></a>
          </article>
        `;
            })
            .join("");
    }

    function getPathways() {
        return getConfiguredArray(
            [
                "pages.services.pathways.items",
                "pages.services.pathways",
                "servicesPage.pathways"
            ],
            FALLBACK_PATHWAYS
        ).slice(0, 3);
    }

    function resolvePathwayServices(pathway, index) {
        const configuredServices = toArray(
            firstDefined(
                pathway.services,
                pathway.items,
                []
            )
        );

        if (configuredServices.length) {
            return configuredServices
                .map((entry) => {
                    if (typeof entry === "string") {
                        return (
                            getServiceBySlug(entry) || {
                                title: entry,
                                href: "services.html"
                            }
                        );
                    }

                    return entry;
                })
                .filter(Boolean);
        }

        const slugs = toArray(pathway.serviceSlugs);

        if (slugs.length) {
            return slugs
                .map(getServiceBySlug)
                .filter(Boolean);
        }

        const services = getServices();
        const groupSize = Math.ceil(services.length / 3);
        const start = index * groupSize;

        return services.slice(start, start + groupSize);
    }

    function renderPathways() {
        const mount = document.querySelector(
            SELECTORS.pathways
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getPathways()
            .map((pathway, index) => {
                const title = getEntryTitle(
                    pathway,
                    `Career pathway ${index + 1}`
                );

                const description = getEntryText(pathway);
                const icon = getEntryIcon(
                    pathway,
                    "waypoints"
                );

                const services =
                    resolvePathwayServices(pathway, index);

                return `
          <article
            class="services-pathways__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 90, 180)}"
          >
            <div class="services-pathways__entry-top">
              <span class="services-pathways__icon">
                ${renderIcon(icon)}
              </span>

              <h3 class="services-pathways__title">
                ${escapeHtml(title)}
              </h3>

              ${description
                        ? `
                    <p class="services-pathways__text">
                      ${escapeHtml(description)}
                    </p>
                  `
                        : ""
                    }
            </div>

            <div class="services-pathways__entry-bottom">
              <div class="services-pathways__links">
                ${services
                        .map((service) => {
                            const serviceTitle =
                                getServiceTitle(service);

                            return `
                      <a
                        class="services-pathways__service-link"
                        href="${escapeAttribute(
                                getServiceHref(service)
                            )}"
                      >
                        <span>
                          ${escapeHtml(serviceTitle)}
                        </span>

                        ${renderIcon("arrow-right")}
                      </a>
                    `;
                        })
                        .join("")}
              </div>
            </div>
          </article>
        `;
            })
            .join("");
    }

    function normalizeFeatures(features) {
        if (Array.isArray(features)) {
            const normalized = {};

            features.forEach((feature) => {
                if (typeof feature === "string") {
                    normalized[feature] = true;
                    return;
                }

                if (isPlainObject(feature)) {
                    const key = firstDefined(
                        feature.key,
                        feature.id,
                        feature.name,
                        ""
                    );

                    if (key) {
                        normalized[key] =
                            feature.included !== false;
                    }
                }
            });

            return normalized;
        }

        if (isPlainObject(features)) {
            return features;
        }

        return {};
    }

    function getPackages() {
        return getConfiguredArray(
            [
                "pages.services.packages",
                "packages",
                "servicesPage.packages"
            ],
            FALLBACK_PACKAGES
        ).slice(0, 4);
    }

    function getPackageTitle(packageEntry, index) {
        return getEntryTitle(
            packageEntry,
            `Package ${index + 1}`
        );
    }

    function getPackageBestFor(packageEntry) {
        return firstDefined(
            packageEntry.bestFor,
            packageEntry.audience,
            packageEntry.description,
            packageEntry.summary,
            ""
        );
    }

    function getPackageHref(packageEntry, index) {
        const fallbackSlug = getPackageTitle(
            packageEntry,
            index
        )
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        return firstDefined(
            packageEntry.href,
            packageEntry.url,
            `contact.html?package=${encodeURIComponent(
                fallbackSlug
            )}`
        );
    }

    function isPackageFeatureIncluded(
        packageEntry,
        featureKey
    ) {
        const features = normalizeFeatures(
            firstDefined(
                packageEntry.features,
                packageEntry.includes,
                {}
            )
        );

        if (
            Object.prototype.hasOwnProperty.call(
                features,
                featureKey
            )
        ) {
            const value = features[featureKey];

            if (typeof value === "boolean") {
                return value;
            }

            if (isPlainObject(value)) {
                return value.included !== false;
            }

            return Boolean(value);
        }

        return false;
    }

    function renderIncludedIcon(included) {
        if (included) {
            return `
        <span
          class="services-packages__check"
          aria-label="Included"
        >
          ${renderIcon("check")}
        </span>
      `;
        }

        return `
      <span
        class="services-packages__dash"
        aria-label="Not included"
      ></span>
    `;
    }

    function renderPackagesComparison() {
        const mount = document.querySelector(
            SELECTORS.packagesComparison
        );

        if (!mount) {
            return;
        }

        const packages = getPackages();

        mount.innerHTML = `
      <div class="services-packages__comparison-inner">
        <div class="services-packages__header">
          <div
            class="services-packages__header-cell services-packages__header-cell--label"
          >
            <span class="site-eyebrow">
              Compare
            </span>

            <h3 class="services-packages__package-name">
              Support areas
            </h3>
          </div>

          ${packages
                .map(
                    (packageEntry, index) => `
                <div class="services-packages__header-cell">
                  <h3 class="services-packages__package-name">
                    ${escapeHtml(
                        getPackageTitle(packageEntry, index)
                    )}
                  </h3>

                  <p class="services-packages__package-best">
                    ${escapeHtml(
                        getPackageBestFor(packageEntry)
                    )}
                  </p>
                </div>
              `
                )
                .join("")}
        </div>

        ${PACKAGE_FEATURES.map(
                    (feature) => `
            <div class="services-packages__row">
              <div
                class="services-packages__cell services-packages__cell--label"
              >
                ${escapeHtml(feature.label)}
              </div>

              ${packages
                            .map(
                                (packageEntry) => `
                    <div
                      class="services-packages__cell services-packages__cell--included"
                    >
                      ${renderIncludedIcon(
                                    isPackageFeatureIncluded(
                                        packageEntry,
                                        feature.key
                                    )
                                )}
                    </div>
                  `
                            )
                            .join("")}
            </div>
          `
                ).join("")}

        <div class="services-packages__footer">
          <div
            class="services-packages__footer-cell services-packages__footer-cell--label"
          >
            Package descriptions are informational.
            Final scope and availability may vary.
          </div>

          ${packages
                .map(
                    (packageEntry, index) => `
                <div class="services-packages__footer-cell">
                  <a
                    class="site-button ${index === 1
                            ? "site-button--dark"
                            : "site-button--outline"
                        }"
                    href="${escapeAttribute(
                            getPackageHref(packageEntry, index)
                        )}"
                  >
                    <span>Ask about it</span>

                    <span class="site-button__icon">
                      ${renderIcon("arrow-up-right")}
                    </span>
                  </a>
                </div>
              `
                )
                .join("")}
        </div>
      </div>
    `;
    }

    function renderPackagesMobile() {
        const mount = document.querySelector(
            SELECTORS.packagesMobile
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getPackages()
            .map((packageEntry, index) => {
                return `
          <article
            class="services-packages__mobile-entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 70, 210)}"
          >
            <div class="services-packages__mobile-top">
              <h3 class="services-packages__mobile-name">
                ${escapeHtml(
                    getPackageTitle(packageEntry, index)
                )}
              </h3>

              <p class="services-packages__mobile-description">
                ${escapeHtml(
                    getPackageBestFor(packageEntry)
                )}
              </p>
            </div>

            <ul class="services-packages__mobile-list">
              ${PACKAGE_FEATURES.filter((feature) =>
                    isPackageFeatureIncluded(
                        packageEntry,
                        feature.key
                    )
                )
                        .map(
                            (feature) => `
                    <li class="services-packages__mobile-item">
                      <span class="services-packages__mobile-icon">
                        ${renderIcon("check")}
                      </span>

                      <span>${escapeHtml(feature.label)}</span>
                    </li>
                  `
                        )
                        .join("")}
            </ul>

            <a
              class="site-button ${index === 1
                        ? "site-button--light"
                        : "site-button--outline"
                    }"
              href="${escapeAttribute(
                        getPackageHref(packageEntry, index)
                    )}"
            >
              <span>Ask about this package</span>

              <span class="site-button__icon">
                ${renderIcon("arrow-up-right")}
              </span>
            </a>
          </article>
        `;
            })
            .join("");
    }

    function renderAlignmentPoints() {
        const mount = document.querySelector(
            SELECTORS.alignmentPoints
        );

        if (!mount) {
            return;
        }

        const points = getConfiguredArray(
            [
                "pages.services.alignment.points",
                "pages.services.alignment.items",
                "servicesPage.alignment"
            ],
            FALLBACK_ALIGNMENT_POINTS
        );

        mount.innerHTML = points
            .map((point, index) => {
                const text =
                    typeof point === "string"
                        ? point
                        : firstDefined(
                            point.text,
                            point.title,
                            point.label,
                            ""
                        );

                return `
          <div
            class="services-alignment__point"
            data-aos="fade-left"
            data-aos-delay="${Math.min(index * 55, 220)}"
          >
            <span class="services-alignment__point-icon">
              ${renderIcon(
                    getEntryIcon(point, "circle-check")
                )}
            </span>

            <p class="services-alignment__point-text">
              ${escapeHtml(text)}
            </p>
          </div>
        `;
            })
            .join("");
    }

    function renderMarketTopics() {
        const mount = document.querySelector(
            SELECTORS.marketTopics
        );

        if (!mount) {
            return;
        }

        const topics = getConfiguredArray(
            [
                "pages.services.market.topics",
                "pages.services.market.items",
                "servicesPage.marketTopics"
            ],
            FALLBACK_MARKET_TOPICS
        );

        mount.innerHTML = topics
            .map((topic, index) => {
                return `
          <div
            class="services-market__topic"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 45, 225)}"
          >
            <span class="services-market__topic-icon">
              ${renderIcon(
                    getEntryIcon(topic, "circle-dot")
                )}
            </span>

            <span>
              ${escapeHtml(
                    getEntryTitle(
                        topic,
                        `Market topic ${index + 1}`
                    )
                )}
            </span>
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

        const steps = getConfiguredArray(
            [
                "pages.services.process.steps",
                "pages.services.process",
                "servicesPage.process"
            ],
            FALLBACK_PROCESS
        ).slice(0, 4);

        mount.innerHTML = steps
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
            class="services-process__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(index * 80, 240)}"
          >
            <span class="services-process__icon">
              ${renderIcon(icon)}
            </span>

            <div class="services-process__content">
              <span class="site-eyebrow">
                Step ${String(index + 1).padStart(2, "0")}
              </span>

              <h3 class="services-process__title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="services-process__text">
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

    function getFaqItems() {
        return getConfiguredArray(
            [
                "pages.services.faq.items",
                "pages.services.faq",
                "servicesPage.faq"
            ],
            FALLBACK_FAQ
        ).filter((item) => {
            return firstDefined(
                item.question,
                item.title,
                item.label,
                ""
            );
        });
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
            .map((item, index) => {
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
            "services-faq-schema"
        );

        previousSchema?.remove();

        const mainEntity = items
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

        script.id = "services-faq-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity
        });

        document.head.append(script);
    }

    function injectServicesSchema() {
        const previousSchema = document.getElementById(
            "nimomark-services-schema"
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

        const services = getServices();

        const itemListElement = services.map(
            (service, index) => {
                return {
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Service",
                        name: getServiceTitle(service),
                        description: getServiceDescription(service),
                        url: new URL(
                            getServiceHref(service),
                            baseUrl
                        ).href,
                        provider: {
                            "@type": "Organization",
                            name: brandName
                        }
                    }
                };
            }
        );

        const script = document.createElement("script");

        script.id = "nimomark-services-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${brandName} career support services`,
            itemListElement
        });

        document.head.append(script);
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
                    "--services-parallax-offset"
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

            const center = rect.top + rect.height / 2;
            const distance =
                center - viewportHeight / 2;

            const speed = Number(
                element.dataset.servicesParallaxSpeed ||
                0.032
            );

            const maximumOffset = Number(
                element.dataset.servicesParallaxMax || 18
            );

            const rawOffset = distance * speed;

            const offset = Math.max(
                maximumOffset * -1,
                Math.min(maximumOffset, rawOffset)
            );

            element.style.setProperty(
                "--services-parallax-offset",
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
                "translate3d(0, var(--services-parallax-offset, 0px), 0) scale(1.04)";
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

    function initializeServicesPage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        state.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        renderIntroductionPrinciples();
        renderDirectory();
        renderPathways();
        renderPackagesComparison();
        renderPackagesMobile();
        renderAlignmentPoints();
        renderMarketTopics();
        renderProcess();
        renderFaq();

        renderFocusSlider();

        initializeRevealGroups();
        initializeParallax();

        initializeFocusSlider();

        injectServicesSchema();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
            requestParallaxUpdate();
        });

        document.dispatchEvent(
            new CustomEvent("nimomark:services-ready", {
                detail: {
                    services: getServices(),
                    pathways: getPathways(),
                    packages: getPackages()
                }
            })
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(initializeServicesPage);
    });
})();