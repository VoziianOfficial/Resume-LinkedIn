(function () {
    "use strict";

    const SELECTORS = {
        desktopNavigationList:
            "[data-service-navigation-list]",
        mobileNavigationList:
            "[data-service-mobile-navigation-list]",
        mobileNavigationToggle:
            "[data-service-mobile-navigation-toggle]",
        mobileNavigationPanel:
            "[data-service-mobile-navigation-panel]",
        supportGrid: "[data-service-support-grid]",
        audienceRows: "[data-service-audience-rows]",
        principlesList: "[data-service-principles-list]",
        checklist: "[data-service-checklist]",
        relatedGrid: "[data-service-related-grid]",
        relatedSlider: "[data-service-related-slider]",
        relatedPrevious: "[data-service-related-previous]",
        relatedNext: "[data-service-related-next]",
        faq: "[data-service-faq]",
        parallaxMedia: "[data-service-parallax]",
        revealGroup: "[data-service-reveal-group]",
        revealItem: "[data-service-reveal-item]",
        inquiryLink: "[data-service-inquiry-link]",
        serviceTitle: "[data-service-title]",
        serviceShortTitle: "[data-service-short-title]",
        serviceDescription: "[data-service-description]",
        serviceIntroductionTitle:
            "[data-service-introduction-title]",
        serviceIntroductionText:
            "[data-service-introduction-text]",
        serviceEyebrow: "[data-service-eyebrow]",
        serviceImage: "[data-service-image]",
        serviceImageAlt: "[data-service-image-alt]",
        serviceIcon: "[data-service-icon]",
        serviceBind: "[data-service-bind]"
    };

    const FALLBACK_SERVICES = [
        {
            title: "Resume Writing",
            shortTitle: "Resume Writing",
            slug: "resume-writing",
            href: "resume-writing.html",
            icon: "file-text",
            eyebrow: "Career document support",
            shortDescription:
                "Structured resume support focused on clearer positioning, relevant evidence and readable presentation.",
            introductionTitle:
                "Build a resume around a clear professional direction.",
            introductionText:
                "Resume support can help organize experience, clarify responsibilities and present relevant contribution without inventing qualifications or guaranteeing outcomes.",
            image: "assets/images/service-resume-writing.avif",
            supportingImage: "assets/images/home-resume-examples.avif",
            imageAlt:
                "Professional reviewing a structured resume document"
        },
        {
            title: "LinkedIn Profile Optimization",
            shortTitle: "LinkedIn Optimization",
            slug: "linkedin-profile-optimization",
            href: "linkedin-profile-optimization.html",
            icon: "linkedin",
            eyebrow: "Professional profile support",
            shortDescription:
                "Profile-positioning support designed to improve clarity across your headline, summary, experience and skills.",
            introductionTitle:
                "Create a more consistent professional profile.",
            introductionText:
                "LinkedIn profile support can help align your headline, summary, experience and skills with an intended professional direction while preserving accurate career information.",
            image: "assets/images/service-linkedin-profile.avif",
            supportingImage: "assets/images/about-career-conversation.avif",
            imageAlt:
                "Professional reviewing a career profile on a laptop"
        },
        {
            title: "Cover Letter Writing",
            shortTitle: "Cover Letter Writing",
            slug: "cover-letter-writing",
            href: "cover-letter-writing.html",
            icon: "mail-open",
            eyebrow: "Application communication",
            shortDescription:
                "Focused cover-letter support connecting your experience with the needs of a specific opportunity.",
            introductionTitle:
                "Add relevant context without repeating the resume.",
            introductionText:
                "Cover-letter support can help connect selected experience with a specific opportunity, explain professional motivation and keep the message focused.",
            image: "assets/images/service-cover-letter.avif",
            supportingImage: "assets/images/services-material-alignment.avif",
            imageAlt:
                "Professional preparing a focused cover letter"
        },
        {
            title: "IT Resume Services",
            shortTitle: "IT Resume Services",
            slug: "it-resume-services",
            href: "it-resume-services.html",
            icon: "code-2",
            eyebrow: "Technical career positioning",
            shortDescription:
                "Career-document support for technical professionals communicating tools, scope and contribution.",
            introductionTitle:
                "Connect technical skills with practical contribution.",
            introductionText:
                "Technical resume support can help explain how tools were used, what systems or workflows were involved and where individual contribution fits within collaborative work.",
            image: "assets/images/service-it-resume.avif",
            supportingImage: "assets/images/services-career-benefits.avif",
            imageAlt:
                "Technology professional reviewing technical career documents"
        },
        {
            title: "Resume for Newcomers",
            shortTitle: "Resume for Newcomers",
            slug: "resume-for-newcomers",
            href: "resume-for-newcomers.html",
            icon: "plane",
            eyebrow: "New-market positioning",
            shortDescription:
                "Resume-positioning support for professionals adapting prior experience to a new employment market.",
            introductionTitle:
                "Translate experience into a new market context.",
            introductionText:
                "Newcomer resume support can help preserve valuable international experience, explain transferable skills and adapt presentation conventions without inventing local credentials.",
            image: "assets/images/service-newcomer-resume.avif",
            supportingImage: "assets/images/contact-collaboration.avif",
            imageAlt:
                "International professional preparing career materials"
        },
        {
            title: "Executive Resume Services",
            shortTitle: "Executive Resume Services",
            slug: "executive-resume-services",
            href: "executive-resume-services.html",
            icon: "briefcase-business",
            eyebrow: "Senior-level positioning",
            shortDescription:
                "Senior-level positioning support focused on leadership scope, strategic context and business contribution.",
            introductionTitle:
                "Present leadership scope with credible business context.",
            introductionText:
                "Executive resume support can help organize leadership experience around strategic priorities, decision ownership, stakeholder environments and supported business contribution.",
            image: "assets/images/service-executive-resume.avif",
            supportingImage: "assets/images/about-career-team.avif",
            imageAlt:
                "Senior professional reviewing executive career documents"
        },
        {
            title: "Interview Preparation",
            shortTitle: "Interview Preparation",
            slug: "interview-preparation",
            href: "interview-preparation.html",
            icon: "messages-square",
            eyebrow: "Interview readiness",
            shortDescription:
                "Structured preparation support for clearer examples, focused answers and stronger interview readiness.",
            introductionTitle:
                "Prepare relevant examples before the conversation.",
            introductionText:
                "Interview preparation can help organize professional examples, clarify likely discussion areas and improve readiness without scripting false experiences or promising a successful outcome.",
            image:
                "assets/images/service-interview-preparation.avif",
            supportingImage: "assets/images/about-career-detail.avif",
            imageAlt:
                "Professional preparing for a structured interview"
        },
        {
            title: "International Job Positioning",
            shortTitle: "International Positioning",
            slug: "international-job-positioning",
            href: "international-job-positioning.html",
            icon: "globe-2",
            eyebrow: "International career direction",
            shortDescription:
                "Career-positioning support for professionals communicating experience across countries and employment markets.",
            introductionTitle:
                "Communicate your career story across employment markets.",
            introductionText:
                "International positioning support can help review transferable experience, local conventions and connected career materials without providing immigration or legal advice.",
            image:
                "assets/images/service-international-positioning.avif",
            supportingImage: "assets/images/examples-resume-clarity.avif",
            imageAlt:
                "Professional planning an international career transition"
        }
    ];

    const SERVICE_CONTENT = {
        "resume-writing": {
            support: [
                {
                    title: "Professional direction",
                    text:
                        "Clarify the roles, level and employment context the resume is intended to support.",
                    icon: "compass"
                },
                {
                    title: "Experience structure",
                    text:
                        "Organize relevant experience so responsibilities and progression are easier to understand.",
                    icon: "layout-list"
                },
                {
                    title: "Achievement wording",
                    text:
                        "Present credible contribution with appropriate evidence and without unsupported claims.",
                    icon: "file-check-2"
                },
                {
                    title: "Readable presentation",
                    text:
                        "Improve hierarchy, spacing and consistency for clear digital and document viewing.",
                    icon: "scan-text"
                }
            ],
            audiences: [
                {
                    title: "Professionals changing roles",
                    text:
                        "People repositioning existing experience toward a different function, industry or level.",
                    icon: "route"
                },
                {
                    title: "Professionals returning to the market",
                    text:
                        "People updating older career materials after a period away or a significant change.",
                    icon: "refresh-cw"
                },
                {
                    title: "Early-career professionals",
                    text:
                        "People organizing education, projects and initial experience into a focused direction.",
                    icon: "graduation-cap"
                },
                {
                    title: "Experienced specialists",
                    text:
                        "Professionals who need to prioritize relevant contribution across a longer work history.",
                    icon: "briefcase-business"
                }
            ],
            principles: [
                {
                    title: "Relevant information first",
                    text:
                        "The strongest material should support the intended professional direction.",
                    icon: "list-filter"
                },
                {
                    title: "Context before adjectives",
                    text:
                        "Responsibilities and contribution are more useful than unsupported self-description.",
                    icon: "text-search"
                },
                {
                    title: "Consistent chronology",
                    text:
                        "Dates, titles and progression should remain understandable throughout the document.",
                    icon: "calendar-range"
                },
                {
                    title: "Credible achievement language",
                    text:
                        "Metrics and outcomes should only be used when they can be supported accurately.",
                    icon: "shield-check"
                },
                {
                    title: "No guaranteed results",
                    text:
                        "A clearer resume may support communication but cannot guarantee interviews or employment.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "The intended role or professional direction is clear.",
                "Recent and relevant experience receives appropriate emphasis.",
                "Responsibilities include useful context.",
                "Achievements use credible and supportable information.",
                "Formatting, dates and titles are consistent.",
                "The resume aligns with the LinkedIn profile and other application materials."
            ]
        },

        "linkedin-profile-optimization": {
            support: [
                {
                    title: "Headline direction",
                    text:
                        "Develop a headline that communicates professional focus without inflated claims.",
                    icon: "heading"
                },
                {
                    title: "About-section structure",
                    text:
                        "Organize a concise summary around experience, direction and relevant professional context.",
                    icon: "align-left"
                },
                {
                    title: "Experience alignment",
                    text:
                        "Keep role descriptions consistent with the resume while adapting them for profile reading.",
                    icon: "git-merge"
                },
                {
                    title: "Skills presentation",
                    text:
                        "Prioritize skills connected with the professional direction rather than listing everything.",
                    icon: "list-checks"
                }
            ],
            audiences: [
                {
                    title: "Professionals with an incomplete profile",
                    text:
                        "People whose profile does not yet communicate a clear professional direction.",
                    icon: "user-round"
                },
                {
                    title: "Career changers",
                    text:
                        "Professionals aligning prior experience with a new target role or industry.",
                    icon: "route"
                },
                {
                    title: "International professionals",
                    text:
                        "People communicating experience to contacts and employers across different markets.",
                    icon: "globe-2"
                },
                {
                    title: "Senior professionals",
                    text:
                        "Leaders who need a concise profile reflecting scope, context and contribution.",
                    icon: "briefcase-business"
                }
            ],
            principles: [
                {
                    title: "Consistency with the resume",
                    text:
                        "Job titles, dates and core experience should remain aligned across career materials.",
                    icon: "git-compare"
                },
                {
                    title: "Readable profile sections",
                    text:
                        "Important information should be understandable without relying on dense paragraphs.",
                    icon: "scan-text"
                },
                {
                    title: "Relevant keyword context",
                    text:
                        "Professional terminology should appear naturally and accurately.",
                    icon: "tags"
                },
                {
                    title: "Authentic professional voice",
                    text:
                        "Profile language should remain credible and appropriate to the individual.",
                    icon: "message-square-text"
                },
                {
                    title: "No visibility guarantees",
                    text:
                        "Profile changes cannot guarantee searches, messages, interviews or employment.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "The headline communicates a recognizable professional direction.",
                "The About section is concise and specific.",
                "Experience details align with the resume.",
                "Skills support the intended role or market.",
                "Dates, titles and education information are accurate.",
                "Contact and privacy settings have been reviewed by the profile owner."
            ]
        },

        "cover-letter-writing": {
            support: [
                {
                    title: "Opportunity context",
                    text:
                        "Identify the role, organization and specific reason the application is relevant.",
                    icon: "target"
                },
                {
                    title: "Selected experience",
                    text:
                        "Choose evidence that supports the opportunity instead of repeating the full resume.",
                    icon: "list-filter"
                },
                {
                    title: "Motivation wording",
                    text:
                        "Explain professional interest without generic enthusiasm or unsupported claims.",
                    icon: "message-square-text"
                },
                {
                    title: "Focused closing",
                    text:
                        "End with a concise, professional next-step statement.",
                    icon: "move-right"
                }
            ],
            audiences: [
                {
                    title: "Applicants targeting a specific role",
                    text:
                        "Professionals who need a focused message connected with one opportunity.",
                    icon: "crosshair"
                },
                {
                    title: "Career changers",
                    text:
                        "People explaining why transferable experience is relevant to a new direction.",
                    icon: "route"
                },
                {
                    title: "Newcomers",
                    text:
                        "International professionals providing useful context for experience gained elsewhere.",
                    icon: "plane"
                },
                {
                    title: "Senior candidates",
                    text:
                        "Professionals communicating leadership relevance without duplicating an executive resume.",
                    icon: "briefcase-business"
                }
            ],
            principles: [
                {
                    title: "One opportunity, one focus",
                    text:
                        "The letter should reflect the specific application rather than remain completely generic.",
                    icon: "focus"
                },
                {
                    title: "Add context",
                    text:
                        "The message should explain relevance that may not be obvious from the resume alone.",
                    icon: "message-circle-more"
                },
                {
                    title: "Keep claims supportable",
                    text:
                        "Experience, motivation and outcomes should remain accurate.",
                    icon: "shield-check"
                },
                {
                    title: "Use concise structure",
                    text:
                        "A clear opening, relevant middle and focused closing are usually easier to review.",
                    icon: "layout-list"
                },
                {
                    title: "No application guarantees",
                    text:
                        "A cover letter cannot guarantee a response, interview or employment decision.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "The role and organization are identified correctly.",
                "The opening explains the purpose of the application.",
                "Selected examples support the opportunity.",
                "The message adds context rather than copying the resume.",
                "Names, titles and organization details are accurate.",
                "The tone remains professional, concise and credible."
            ]
        },

        "it-resume-services": {
            support: [
                {
                    title: "Technical focus",
                    text:
                        "Clarify the engineering, development, data, infrastructure or product direction.",
                    icon: "code-2"
                },
                {
                    title: "Project context",
                    text:
                        "Explain where technologies were used and what problem or workflow was involved.",
                    icon: "folder-kanban"
                },
                {
                    title: "Individual contribution",
                    text:
                        "Separate personal responsibilities from the wider work of a team.",
                    icon: "user-round-cog"
                },
                {
                    title: "Technical outcomes",
                    text:
                        "Present supported improvements involving quality, delivery, reliability or user experience.",
                    icon: "chart-no-axes-combined"
                }
            ],
            audiences: [
                {
                    title: "Software developers",
                    text:
                        "Professionals communicating feature delivery, architecture and collaborative engineering work.",
                    icon: "braces"
                },
                {
                    title: "Data professionals",
                    text:
                        "Analysts and engineers explaining datasets, reporting, pipelines and business context.",
                    icon: "database"
                },
                {
                    title: "Infrastructure specialists",
                    text:
                        "Professionals presenting systems, cloud, security, reliability or operational responsibilities.",
                    icon: "server-cog"
                },
                {
                    title: "Technical career changers",
                    text:
                        "People combining earlier professional experience with new technical education and projects.",
                    icon: "route"
                }
            ],
            principles: [
                {
                    title: "Tools need context",
                    text:
                        "Technology lists are more useful when connected with actual work.",
                    icon: "blocks"
                },
                {
                    title: "Contribution needs boundaries",
                    text:
                        "Team projects should still make individual responsibilities understandable.",
                    icon: "split"
                },
                {
                    title: "Projects need relevance",
                    text:
                        "Selected projects should support the intended technical direction.",
                    icon: "folder-check"
                },
                {
                    title: "Quality work belongs in the story",
                    text:
                        "Testing, accessibility, performance and maintainability may be relevant evidence.",
                    icon: "shield-check"
                },
                {
                    title: "No invented technical experience",
                    text:
                        "Technologies, responsibilities and performance outcomes must remain accurate.",
                    icon: "shield-alert"
                }
            ],
            checklist: [
                "The intended technical role or specialization is recognizable.",
                "Technologies are connected with practical use.",
                "Project descriptions explain context and contribution.",
                "Team and individual responsibilities are distinguishable.",
                "Education, certifications and projects are represented accurately.",
                "Links to portfolios or repositories are current and appropriate."
            ]
        },

        "resume-for-newcomers": {
            support: [
                {
                    title: "International experience",
                    text:
                        "Preserve relevant experience gained in another country or employment system.",
                    icon: "globe-2"
                },
                {
                    title: "Transferable skills",
                    text:
                        "Connect previous responsibilities with the needs of the new professional direction.",
                    icon: "arrow-left-right"
                },
                {
                    title: "Market conventions",
                    text:
                        "Review formatting, terminology and document expectations that may differ locally.",
                    icon: "map"
                },
                {
                    title: "Credential context",
                    text:
                        "Explain education and qualifications without overstating local recognition or equivalency.",
                    icon: "graduation-cap"
                }
            ],
            audiences: [
                {
                    title: "Recently arrived professionals",
                    text:
                        "People beginning to understand a new employment market and its application conventions.",
                    icon: "plane-landing"
                },
                {
                    title: "International career changers",
                    text:
                        "Professionals combining relocation with a change in function or industry.",
                    icon: "route"
                },
                {
                    title: "Professionals with overseas credentials",
                    text:
                        "People who need to present education and qualifications in understandable context.",
                    icon: "badge-check"
                },
                {
                    title: "Multilingual professionals",
                    text:
                        "People translating professional experience into the language used by the target market.",
                    icon: "languages"
                }
            ],
            principles: [
                {
                    title: "Do not erase prior experience",
                    text:
                        "Relevant international work remains part of the professional history.",
                    icon: "history"
                },
                {
                    title: "Translate context, not facts",
                    text:
                        "Responsibilities can be explained differently while the underlying information remains accurate.",
                    icon: "languages"
                },
                {
                    title: "Use understandable terminology",
                    text:
                        "Local readers should be able to understand roles, organizations and responsibilities.",
                    icon: "text-search"
                },
                {
                    title: "Avoid false localization",
                    text:
                        "Local experience, credentials, references or employment status must not be invented.",
                    icon: "shield-alert"
                },
                {
                    title: "Career support is not immigration advice",
                    text:
                        "Questions about visas, work authorization or legal status require qualified advisers.",
                    icon: "scale"
                }
            ],
            checklist: [
                "International experience remains visible and understandable.",
                "Transferable responsibilities support the intended role.",
                "Dates, job titles and organization names are accurate.",
                "Education and credentials include appropriate context.",
                "Formatting follows suitable market conventions.",
                "The document does not imply unsupported work authorization or credential recognition."
            ]
        },

        "executive-resume-services": {
            support: [
                {
                    title: "Leadership scale",
                    text:
                        "Clarify teams, functions, regions, budgets or business areas connected with the role.",
                    icon: "users-round"
                },
                {
                    title: "Strategic priorities",
                    text:
                        "Explain the business challenge or organizational direction behind executive decisions.",
                    icon: "milestone"
                },
                {
                    title: "Decision ownership",
                    text:
                        "Show where the leader influenced resources, governance, priorities or transformation.",
                    icon: "git-branch"
                },
                {
                    title: "Business contribution",
                    text:
                        "Connect leadership actions with supported operational, commercial or organizational outcomes.",
                    icon: "chart-no-axes-combined"
                }
            ],
            audiences: [
                {
                    title: "Senior managers",
                    text:
                        "Leaders preparing for broader functional or organizational responsibility.",
                    icon: "users-round"
                },
                {
                    title: "Directors",
                    text:
                        "Professionals communicating cross-functional influence, transformation and strategic delivery.",
                    icon: "network"
                },
                {
                    title: "Executives",
                    text:
                        "Senior leaders presenting enterprise context, governance and decision ownership.",
                    icon: "landmark"
                },
                {
                    title: "Advisers and board candidates",
                    text:
                        "Experienced professionals organizing leadership value for advisory or governance contexts.",
                    icon: "presentation"
                }
            ],
            principles: [
                {
                    title: "Scope should be visible",
                    text:
                        "Leadership statements need enough context to explain the scale of responsibility.",
                    icon: "maximize-2"
                },
                {
                    title: "Strategy should connect with action",
                    text:
                        "High-level priorities are stronger when linked to decisions and implementation.",
                    icon: "waypoints"
                },
                {
                    title: "Results must be supportable",
                    text:
                        "Commercial and organizational outcomes should remain credible and accurate.",
                    icon: "shield-check"
                },
                {
                    title: "Executive language should remain specific",
                    text:
                        "Broad leadership adjectives should not replace meaningful evidence.",
                    icon: "text-search"
                },
                {
                    title: "No appointment guarantees",
                    text:
                        "Executive positioning cannot guarantee interviews, offers, compensation or appointments.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "Leadership scale and organizational context are understandable.",
                "Strategic priorities are connected with executive decisions.",
                "Business outcomes use credible information.",
                "Stakeholder and governance responsibilities are represented appropriately.",
                "Earlier experience is summarized without hiding relevant progression.",
                "The resume aligns with the executive LinkedIn profile and biography."
            ]
        },

        "interview-preparation": {
            support: [
                {
                    title: "Role-context review",
                    text:
                        "Identify likely discussion areas based on the role and available opportunity information.",
                    icon: "search-check"
                },
                {
                    title: "Professional examples",
                    text:
                        "Organize credible examples involving responsibilities, challenges, actions and outcomes.",
                    icon: "messages-square"
                },
                {
                    title: "Answer structure",
                    text:
                        "Practice concise responses that provide enough context without becoming unfocused.",
                    icon: "list-ordered"
                },
                {
                    title: "Question preparation",
                    text:
                        "Prepare relevant questions about the role, team, priorities and working environment.",
                    icon: "circle-help"
                }
            ],
            audiences: [
                {
                    title: "Professionals with an upcoming interview",
                    text:
                        "Candidates preparing for a known role, organization or interview format.",
                    icon: "calendar-check"
                },
                {
                    title: "Career changers",
                    text:
                        "People explaining transferable experience and motivation for a new direction.",
                    icon: "route"
                },
                {
                    title: "Technical candidates",
                    text:
                        "Professionals preparing to discuss projects, decisions and collaborative technical work.",
                    icon: "code-2"
                },
                {
                    title: "Managers and executives",
                    text:
                        "Leaders preparing examples involving strategy, stakeholders and organizational impact.",
                    icon: "briefcase-business"
                }
            ],
            principles: [
                {
                    title: "Prepare examples, not scripts",
                    text:
                        "Structured preparation should still allow natural and truthful conversation.",
                    icon: "message-circle-more"
                },
                {
                    title: "Use relevant context",
                    text:
                        "Examples should help the listener understand the situation and personal contribution.",
                    icon: "scan-text"
                },
                {
                    title: "Keep experience consistent",
                    text:
                        "Interview answers should align with the resume and profile.",
                    icon: "git-compare"
                },
                {
                    title: "Acknowledge uncertainty honestly",
                    text:
                        "Candidates should not invent information when they do not know an answer.",
                    icon: "shield-check"
                },
                {
                    title: "Preparation cannot guarantee success",
                    text:
                        "Interview decisions depend on employers, candidates and circumstances outside the platform.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "The role and organization have been reviewed.",
                "Relevant professional examples are prepared.",
                "Personal contribution is clear within team examples.",
                "Answers remain consistent with submitted career materials.",
                "Questions for the interviewer are relevant and professional.",
                "Technical setup and interview logistics have been checked."
            ]
        },

        "international-job-positioning": {
            support: [
                {
                    title: "Target-market context",
                    text:
                        "Review employment conventions, terminology and role expectations relevant to the intended market.",
                    icon: "map"
                },
                {
                    title: "Transferable experience",
                    text:
                        "Connect prior responsibilities with professional needs in another country or region.",
                    icon: "arrow-left-right"
                },
                {
                    title: "Material alignment",
                    text:
                        "Keep the resume, profile, cover letter and interview examples consistent.",
                    icon: "git-merge"
                },
                {
                    title: "Professional communication",
                    text:
                        "Clarify how experience, education and career direction are described across markets.",
                    icon: "languages"
                }
            ],
            audiences: [
                {
                    title: "Professionals targeting another country",
                    text:
                        "People exploring roles in a market different from their current or previous location.",
                    icon: "globe-2"
                },
                {
                    title: "Internationally mobile specialists",
                    text:
                        "Professionals whose experience spans several countries, employers or working environments.",
                    icon: "plane"
                },
                {
                    title: "Remote-work candidates",
                    text:
                        "People communicating suitability for distributed and cross-border professional environments.",
                    icon: "laptop"
                },
                {
                    title: "Global leadership candidates",
                    text:
                        "Senior professionals presenting regional, multinational or cross-cultural leadership experience.",
                    icon: "network"
                }
            ],
            principles: [
                {
                    title: "Market awareness without stereotypes",
                    text:
                        "Positioning should use relevant conventions while respecting individual circumstances.",
                    icon: "map-pinned"
                },
                {
                    title: "Experience should remain accurate",
                    text:
                        "International adaptation must not change the underlying facts.",
                    icon: "shield-check"
                },
                {
                    title: "Transferable value needs explanation",
                    text:
                        "Readers may need context to understand how prior experience relates to a new market.",
                    icon: "waypoints"
                },
                {
                    title: "Work authorization claims need care",
                    text:
                        "Career materials should not imply legal status or eligibility that has not been confirmed.",
                    icon: "scale"
                },
                {
                    title: "No visa or employment guarantees",
                    text:
                        "International positioning is not legal advice and cannot guarantee immigration or career outcomes.",
                    icon: "badge-alert"
                }
            ],
            checklist: [
                "The target country, region or employment market is defined.",
                "Transferable experience is explained in understandable language.",
                "Resume and LinkedIn terminology are aligned.",
                "Education and credentials include appropriate context.",
                "No unsupported work-authorization or visa claims are included.",
                "Questions requiring legal advice are directed to qualified professionals."
            ]
        }
    };

    const COMMON_FAQ = [
        {
            question:
                "Does this service guarantee interviews or employment?",
            answer:
                "No. Career-support services cannot guarantee interviews, employment, salary outcomes, placement or employer decisions. Results depend on many factors outside NimoMark’s control."
        },
        {
            question:
                "Does submitting an inquiry create a service agreement?",
            answer:
                "No. A submission is an inquiry only. Any scope, availability, timing, pricing and delivery terms would need to be communicated and accepted separately."
        },
        {
            question:
                "Can I ask about several career materials together?",
            answer:
                "Yes. You can describe connected materials or professional questions in one inquiry. Relevant options can then be considered together."
        },
        {
            question:
                "Should I include sensitive personal information?",
            answer:
                "Only submit information that is reasonably necessary for the inquiry. Do not include passwords, payment details, government identification numbers or unrelated sensitive information."
        }
    ];

    const state = {
        initialized: false,
        currentService: null,
        services: [],
        relatedServices: [],
        relatedSlider: null,
        relatedMediaQuery: null,
        revealObserver: null,
        parallaxElements: [],
        parallaxFrame: null,
        reducedMotion: false,
        resizeTimer: null
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

    function getServiceTitle(service) {
        return firstDefined(
            service.title,
            service.name,
            service.label,
            "Career support service"
        );
    }

    function getServiceShortTitle(service) {
        return firstDefined(
            service.shortTitle,
            service.navigationTitle,
            getServiceTitle(service)
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
            service.iconName,
            service.lucideIcon,
            "briefcase-business"
        );
    }

    function getServiceDescription(service) {
        return firstDefined(
            service.servicePageDescription,
            service.shortDescription,
            service.summary,
            service.description,
            ""
        );
    }

    function getServiceImage(service) {
        return firstDefined(
            service.servicePageImage,
            service.heroImage,
            service.mainImage,
            service.image,
            service.cardImage,
            service.images?.hero,
            service.images?.main,
            service.images?.service,
            service.images?.card,
            "assets/images/services-career-benefits.avif"
        );
    }

    function getServiceSupportingImage(service) {
        return firstDefined(
            service.supportingImage,
            service.secondaryImage,
            service.principlesImage,
            service.images?.supporting,
            service.images?.secondary,
            service.images?.principles,
            getServiceImage(service)
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

    function getServiceSupportingImageAlt(service) {
        return firstDefined(
            service.supportingImageAlt,
            service.secondaryImageAlt,
            service.images?.supportingAlt,
            service.images?.secondaryAlt,
            getServiceImageAlt(service)
        );
    }

    function getConfiguredServices() {
        const candidates = [
            getConfigValue("pages.servicePages.services"),
            getConfigValue("pages.services.items"),
            getConfigValue("services")
        ];

        for (const candidate of candidates) {
            const entries = toArray(candidate);

            if (entries.length) {
                return entries;
            }
        }

        return [];
    }

    function mergeServiceData(fallbackService, configuredService) {
        if (!configuredService) {
            return {
                ...fallbackService
            };
        }

        const merged = {
            ...fallbackService,
            ...configuredService
        };

        if (
            isPlainObject(fallbackService.images) ||
            isPlainObject(configuredService.images)
        ) {
            merged.images = {
                ...(fallbackService.images || {}),
                ...(configuredService.images || {})
            };
        }

        if (
            isPlainObject(fallbackService.page) ||
            isPlainObject(configuredService.page)
        ) {
            merged.page = {
                ...(fallbackService.page || {}),
                ...(configuredService.page || {})
            };
        }

        return merged;
    }

    function getServices() {
        const configuredServices = getConfiguredServices();

        if (!configuredServices.length) {
            return FALLBACK_SERVICES.map((service) => ({
                ...service
            }));
        }

        const configuredBySlug = new Map();

        configuredServices.forEach((service) => {
            const slug = getServiceSlug(service);

            if (slug) {
                configuredBySlug.set(slug, service);
            }
        });

        const mergedFallbackServices =
            FALLBACK_SERVICES.map((fallbackService) => {
                return mergeServiceData(
                    fallbackService,
                    configuredBySlug.get(
                        fallbackService.slug
                    )
                );
            });

        configuredServices.forEach((service) => {
            const slug = getServiceSlug(service);

            if (
                !slug ||
                mergedFallbackServices.some(
                    (entry) =>
                        getServiceSlug(entry) === slug
                )
            ) {
                return;
            }

            mergedFallbackServices.push(service);
        });

        return mergedFallbackServices;
    }

    function getCurrentFileSlug() {
        const fileName =
            window.location.pathname
                .split("/")
                .filter(Boolean)
                .pop() || "";

        return fileName
            .replace(/\.html?$/i, "")
            .toLowerCase();
    }

    function getCurrentServiceSlug() {
        return firstDefined(
            document.body.dataset.serviceSlug,
            document.body.dataset.service,
            document.documentElement.dataset.serviceSlug,
            getCurrentFileSlug()
        );
    }

    function getCurrentService() {
        const slug = getCurrentServiceSlug();

        const matchedService = state.services.find(
            (service) =>
                getServiceSlug(service).toLowerCase() ===
                String(slug).toLowerCase()
        );

        if (matchedService) {
            return matchedService;
        }

        const configuredPageSlug = getConfigValue(
            "pages.current.serviceSlug",
            ""
        );

        if (configuredPageSlug) {
            const configuredMatch = state.services.find(
                (service) =>
                    getServiceSlug(service) ===
                    configuredPageSlug
            );

            if (configuredMatch) {
                return configuredMatch;
            }
        }

        return state.services[0] || FALLBACK_SERVICES[0];
    }

    function getFallbackContent(service) {
        const slug = getServiceSlug(service);

        return (
            SERVICE_CONTENT[slug] || {
                support:
                    SERVICE_CONTENT["resume-writing"].support,
                audiences:
                    SERVICE_CONTENT["resume-writing"].audiences,
                principles:
                    SERVICE_CONTENT["resume-writing"].principles,
                checklist:
                    SERVICE_CONTENT["resume-writing"].checklist
            }
        );
    }

    function getServicePageObject(service) {
        return firstDefined(
            service.page,
            service.servicePage,
            service.detail,
            {}
        );
    }

    function getServiceArray(
        service,
        propertyNames,
        fallbackValue
    ) {
        const pageObject = getServicePageObject(service);

        for (const propertyName of propertyNames) {
            const directValue = service[propertyName];
            const pageValue = pageObject[propertyName];

            const directEntries = toArray(directValue);

            if (directEntries.length) {
                return directEntries;
            }

            const pageEntries = toArray(pageValue);

            if (pageEntries.length) {
                return pageEntries;
            }
        }

        return fallbackValue;
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

    function getSupportItems() {
        const fallbackContent = getFallbackContent(
            state.currentService
        );

        return getServiceArray(
            state.currentService,
            [
                "support",
                "supportItems",
                "whatIsIncluded",
                "scope"
            ],
            fallbackContent.support
        );
    }

    function getAudienceItems() {
        const fallbackContent = getFallbackContent(
            state.currentService
        );

        return getServiceArray(
            state.currentService,
            [
                "audiences",
                "audienceItems",
                "suitableFor",
                "whoItMaySuit"
            ],
            fallbackContent.audiences
        );
    }

    function getPrincipleItems() {
        const fallbackContent = getFallbackContent(
            state.currentService
        );

        return getServiceArray(
            state.currentService,
            [
                "principles",
                "qualityPrinciples",
                "approach",
                "considerations"
            ],
            fallbackContent.principles
        );
    }

    function getChecklistItems() {
        const fallbackContent = getFallbackContent(
            state.currentService
        );

        return getServiceArray(
            state.currentService,
            [
                "checklist",
                "checklistItems",
                "reviewChecklist"
            ],
            fallbackContent.checklist
        );
    }

    function getFaqItems() {
        const serviceFaq = getServiceArray(
            state.currentService,
            ["faq", "faqItems", "questions"],
            []
        );

        if (serviceFaq.length) {
            return serviceFaq;
        }

        const serviceTitle = getServiceTitle(
            state.currentService
        );

        return [
            {
                question: `What can ${serviceTitle.toLowerCase()} support include?`,
                answer:
                    "The potential scope depends on the submitted information, current materials and professional direction. Any available deliverables, timing, pricing and terms would need to be confirmed separately."
            },
            ...COMMON_FAQ
        ];
    }

    function getServiceField(service, fieldNames, fallbackValue) {
        const pageObject = getServicePageObject(service);

        for (const fieldName of fieldNames) {
            const value = firstDefined(
                service[fieldName],
                pageObject[fieldName]
            );

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                return value;
            }
        }

        return fallbackValue;
    }

    function applyServiceBindings() {
        const service = state.currentService;

        if (!service) {
            return;
        }

        const title = getServiceTitle(service);
        const shortTitle = getServiceShortTitle(service);
        const description = getServiceDescription(service);

        const introductionTitle = getServiceField(
            service,
            [
                "introductionTitle",
                "introTitle",
                "pageIntroductionTitle"
            ],
            title
        );

        const introductionText = getServiceField(
            service,
            [
                "introductionText",
                "introText",
                "pageIntroductionText"
            ],
            description
        );

        const eyebrow = getServiceField(
            service,
            ["eyebrow", "category", "pageEyebrow"],
            "Career support service"
        );

        document
            .querySelectorAll(SELECTORS.serviceTitle)
            .forEach((element) => {
                element.textContent = title;
            });

        document
            .querySelectorAll(SELECTORS.serviceShortTitle)
            .forEach((element) => {
                element.textContent = shortTitle;
            });

        document
            .querySelectorAll(SELECTORS.serviceDescription)
            .forEach((element) => {
                element.textContent = description;
            });

        document
            .querySelectorAll(
                SELECTORS.serviceIntroductionTitle
            )
            .forEach((element) => {
                element.textContent = introductionTitle;
            });

        document
            .querySelectorAll(
                SELECTORS.serviceIntroductionText
            )
            .forEach((element) => {
                element.textContent = introductionText;
            });

        document
            .querySelectorAll(SELECTORS.serviceEyebrow)
            .forEach((element) => {
                element.textContent = eyebrow;
            });

        document
            .querySelectorAll(SELECTORS.serviceImage)
            .forEach((image, index) => {
                const imageSource =
                    index === 0
                        ? getServiceImage(service)
                        : getServiceSupportingImage(service);

                image.setAttribute(
                    "src",
                    imageSource
                );

                if (!image.hasAttribute("width")) {
                    image.setAttribute("width", "1200");
                }

                if (!image.hasAttribute("height")) {
                    image.setAttribute("height", "1400");
                }

                image.setAttribute("decoding", "async");
            });

        document
            .querySelectorAll(SELECTORS.serviceImageAlt)
            .forEach((image, index) => {
                const altText =
                    index === 0
                        ? getServiceImageAlt(service)
                        : getServiceSupportingImageAlt(service);

                image.setAttribute(
                    "alt",
                    altText
                );
            });

        document
            .querySelectorAll(SELECTORS.serviceIcon)
            .forEach((element) => {
                element.innerHTML = renderIcon(
                    getServiceIcon(service)
                );
            });

        document
            .querySelectorAll(SELECTORS.serviceBind)
            .forEach((element) => {
                const propertyPath =
                    element.dataset.serviceBind;

                if (!propertyPath) {
                    return;
                }

                const segments = propertyPath
                    .split(".")
                    .filter(Boolean);

                let currentValue = service;

                for (const segment of segments) {
                    if (
                        currentValue === null ||
                        currentValue === undefined ||
                        !Object.prototype.hasOwnProperty.call(
                            Object(currentValue),
                            segment
                        )
                    ) {
                        currentValue = "";
                        break;
                    }

                    currentValue = currentValue[segment];
                }

                if (
                    typeof currentValue === "string" ||
                    typeof currentValue === "number"
                ) {
                    element.textContent = String(currentValue);
                }
            });

        document.body.dataset.activeService =
            getServiceSlug(service);

        updateInquiryLinks();
    }

    function updateDocumentMetadata() {
        const service = state.currentService;

        if (!service) {
            return;
        }

        const title = getServiceTitle(service);
        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const configuredTitle = getServiceField(
            service,
            ["seoTitle", "metaTitle"],
            ""
        );

        const configuredDescription = getServiceField(
            service,
            ["seoDescription", "metaDescription"],
            getServiceDescription(service)
        );

        if (configuredTitle) {
            document.title = configuredTitle;
        } else if (
            !document.title ||
            document.title.includes("Service Page")
        ) {
            document.title = `${title} | ${brandName}`;
        }

        let descriptionMeta = document.querySelector(
            'meta[name="description"]'
        );

        if (!descriptionMeta) {
            descriptionMeta =
                document.createElement("meta");

            descriptionMeta.name = "description";
            document.head.append(descriptionMeta);
        }

        if (configuredDescription) {
            descriptionMeta.content =
                configuredDescription;
        }

        document
            .querySelectorAll(
                'meta[property="og:title"], meta[name="twitter:title"]'
            )
            .forEach((meta) => {
                meta.content = configuredTitle
                    ? configuredTitle
                    : `${title} | ${brandName}`;
            });

        document
            .querySelectorAll(
                'meta[property="og:description"], meta[name="twitter:description"]'
            )
            .forEach((meta) => {
                meta.content = configuredDescription;
            });

        document
            .querySelectorAll(
                'meta[property="og:image"], meta[name="twitter:image"]'
            )
            .forEach((meta) => {
                meta.content = new URL(
                    getServiceImage(service),
                    window.location.href
                ).href;
            });
    }

    function updateInquiryLinks() {
        const slug = getServiceSlug(
            state.currentService
        );

        document
            .querySelectorAll(SELECTORS.inquiryLink)
            .forEach((link) => {
                const baseHref =
                    link.dataset.baseHref ||
                    link.getAttribute("href") ||
                    "contact.html";

                link.dataset.baseHref =
                    baseHref.split("?")[0];

                try {
                    const url = new URL(
                        link.dataset.baseHref,
                        window.location.href
                    );

                    url.searchParams.set(
                        "inquiryType",
                        "career-support"
                    );

                    url.searchParams.set("service", slug);

                    const relativeHref =
                        url.origin === window.location.origin
                            ? `${url.pathname
                                .split("/")
                                .pop()}${url.search}${url.hash}`
                            : url.href;

                    link.setAttribute("href", relativeHref);
                } catch (error) {
                    link.setAttribute(
                        "href",
                        `contact.html?inquiryType=career-support&service=${encodeURIComponent(
                            slug
                        )}`
                    );
                }
            });
    }

    function renderNavigationLink(service, mobile = false) {
        const current =
            getServiceSlug(service) ===
            getServiceSlug(state.currentService);

        const title = getServiceShortTitle(service);
        const href = getServiceHref(service);

        if (mobile) {
            return `
        <li class="service-detail__mobile-entry">
          <a
            class="service-detail__mobile-link"
            href="${escapeAttribute(href)}"
            ${current ? 'aria-current="page"' : ""}
          >
            <span>${escapeHtml(title)}</span>
            ${renderIcon("arrow-right")}
          </a>
        </li>
      `;
        }

        return `
      <li class="service-detail__navigation-entry">
        <a
          class="service-detail__navigation-link"
          href="${escapeAttribute(href)}"
          ${current ? 'aria-current="page"' : ""}
        >
          <span>${escapeHtml(title)}</span>

          ${renderIcon(
            "arrow-right",
            "service-detail__navigation-arrow"
        )}
        </a>
      </li>
    `;
    }

    function renderServiceNavigation() {
        const desktopList = document.querySelector(
            SELECTORS.desktopNavigationList
        );

        const mobileList = document.querySelector(
            SELECTORS.mobileNavigationList
        );

        if (desktopList) {
            desktopList.innerHTML = state.services
                .map((service) =>
                    renderNavigationLink(service, false)
                )
                .join("");
        }

        if (mobileList) {
            mobileList.innerHTML = state.services
                .map((service) =>
                    renderNavigationLink(service, true)
                )
                .join("");
        }
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
            if (!event.target.closest("a")) {
                return;
            }

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            panel.classList.remove("is-open");
        });
    }

    function renderSupportGrid() {
        const mount = document.querySelector(
            SELECTORS.supportGrid
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getSupportItems()
            .slice(0, 8)
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Support area ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "circle-check"
                );

                return `
          <article
            class="service-support__entry"
            data-aos="fade-up"
            data-aos-delay="${Math.min(
                    (index % 2) * 70,
                    70
                )}"
          >
            <span class="service-support__icon">
              ${renderIcon(icon)}
            </span>

            <h3 class="service-support__entry-title">
              ${escapeHtml(title)}
            </h3>

            ${text
                        ? `
                  <p class="service-support__entry-text">
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

    function renderAudienceRows() {
        const mount = document.querySelector(
            SELECTORS.audienceRows
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getAudienceItems()
            .slice(0, 6)
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Audience ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "user-round"
                );

                return `
          <article
            class="service-audience__row"
            data-aos="fade-left"
            data-aos-delay="${Math.min(
                    index * 60,
                    240
                )}"
          >
            <span class="service-audience__row-icon">
              ${renderIcon(icon)}
            </span>

            <div class="service-audience__row-content">
              <h3 class="service-audience__row-title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="service-audience__row-text">
                      ${escapeHtml(text)}
                    </p>
                  `
                        : ""
                    }
            </div>

            <span
              class="service-audience__row-mark"
              aria-hidden="true"
            ></span>
          </article>
        `;
            })
            .join("");
    }

    function renderPrinciples() {
        const mount = document.querySelector(
            SELECTORS.principlesList
        );

        if (!mount) {
            return;
        }

        mount.innerHTML = getPrincipleItems()
            .slice(0, 7)
            .map((entry, index) => {
                const title = getEntryTitle(
                    entry,
                    `Principle ${index + 1}`
                );

                const text = getEntryText(entry);
                const icon = getEntryIcon(
                    entry,
                    "badge-check"
                );

                return `
          <article
            class="service-principles__entry"
            data-aos="fade-left"
            data-aos-delay="${Math.min(
                    index * 55,
                    220
                )}"
          >
            <span class="service-principles__entry-icon">
              ${renderIcon(icon)}
            </span>

            <div class="service-principles__entry-content">
              <h3 class="service-principles__entry-title">
                ${escapeHtml(title)}
              </h3>

              ${text
                        ? `
                    <p class="service-principles__entry-text">
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
            class="service-checklist__entry"
            data-aos="fade-left"
            data-aos-delay="${Math.min(
                    index * 45,
                    225
                )}"
          >
            <span class="service-checklist__entry-icon">
              ${renderIcon(icon)}
            </span>

            <p class="service-checklist__entry-text">
              ${escapeHtml(text)}
            </p>
          </div>
        `;
            })
            .join("");
    }

    function getRelatedServices() {
        const pageObject = getServicePageObject(
            state.currentService
        );

        const configuredRelated = toArray(
            firstDefined(
                state.currentService.relatedServices,
                state.currentService.related,
                pageObject.relatedServices,
                pageObject.related,
                []
            )
        );

        if (configuredRelated.length) {
            const resolved = configuredRelated
                .map((entry) => {
                    if (typeof entry !== "string") {
                        return entry;
                    }

                    return state.services.find(
                        (service) =>
                            getServiceSlug(service) === entry
                    );
                })
                .filter(Boolean)
                .filter(
                    (service) =>
                        getServiceSlug(service) !==
                        getServiceSlug(state.currentService)
                );

            if (resolved.length) {
                return resolved.slice(0, 3);
            }
        }

        const currentIndex = state.services.findIndex(
            (service) =>
                getServiceSlug(service) ===
                getServiceSlug(state.currentService)
        );

        const related = [];
        let offset = 1;

        while (
            related.length < 3 &&
            offset < state.services.length
        ) {
            const candidate =
                state.services[
                (currentIndex + offset) %
                state.services.length
                ];

            if (
                candidate &&
                getServiceSlug(candidate) !==
                getServiceSlug(state.currentService) &&
                !related.some(
                    (entry) =>
                        getServiceSlug(entry) ===
                        getServiceSlug(candidate)
                )
            ) {
                related.push(candidate);
            }

            offset += 1;
        }

        return related;
    }

    function createRelatedServiceSlide(service, index) {
        const title = getServiceTitle(service);
        const description = getServiceDescription(service);
        const href = getServiceHref(service);

        return `
      <div
        class="service-related__slide swiper-slide"
        data-aos="fade-up"
        data-aos-delay="${Math.min(index * 80, 160)}"
      >
        <article class="service-related__entry">
          <div class="service-related__media">
            <img
              src="${escapeAttribute(
            getServiceImage(service)
        )}"
              alt="${escapeAttribute(
            getServiceImageAlt(service)
        )}"
              width="840"
              height="1040"
              loading="lazy"
              decoding="async"
            >
          </div>

          <div
            class="service-related__overlay"
            aria-hidden="true"
          ></div>

          <div class="service-related__content">
            <div class="service-related__top">
              <span class="service-related__icon">
                ${renderIcon(
            getServiceIcon(service)
        )}
              </span>

              <span class="service-related__arrow">
                ${renderIcon("arrow-up-right")}
              </span>
            </div>

            <div class="service-related__body">
              <h3 class="service-related__entry-title">
                ${escapeHtml(title)}
              </h3>

              <p class="service-related__entry-text">
                ${escapeHtml(description)}
              </p>
            </div>
          </div>

          <a
            class="service-related__link"
            href="${escapeAttribute(href)}"
            aria-label="Explore ${escapeAttribute(title)}"
          ></a>
        </article>
      </div>
    `;
    }

    function renderRelatedServices() {
        const mount = document.querySelector(
            SELECTORS.relatedGrid
        );

        if (!mount) {
            return;
        }

        state.relatedServices = getRelatedServices();

        mount.innerHTML = state.relatedServices
            .map(createRelatedServiceSlide)
            .join("");
    }

    function initializeRelatedSlider() {
        const sliderElement = document.querySelector(
            SELECTORS.relatedSlider
        );

        if (!sliderElement) {
            return;
        }

        state.relatedMediaQuery =
            window.matchMedia("(max-width: 640px)");

        const synchronizeSlider = () => {
            if (state.relatedMediaQuery.matches) {
                createRelatedSlider(sliderElement);
            } else {
                destroyRelatedSlider();
            }
        };

        synchronizeSlider();

        if (
            typeof state.relatedMediaQuery.addEventListener ===
            "function"
        ) {
            state.relatedMediaQuery.addEventListener(
                "change",
                synchronizeSlider
            );
        } else {
            state.relatedMediaQuery.addListener(
                synchronizeSlider
            );
        }
    }

    function createRelatedSlider(sliderElement) {
        if (
            state.relatedSlider ||
            !window.Swiper ||
            typeof window.Swiper !== "function"
        ) {
            if (
                !window.Swiper ||
                typeof window.Swiper !== "function"
            ) {
                sliderElement.classList.add(
                    "swiper-unavailable"
                );
            }

            return;
        }

        const previousButton = document.querySelector(
            SELECTORS.relatedPrevious
        );

        const nextButton = document.querySelector(
            SELECTORS.relatedNext
        );

        state.relatedSlider = new window.Swiper(
            sliderElement,
            {
                slidesPerView: 1.08,
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
                        "Previous related service",
                    nextSlideMessage:
                        "Next related service",
                    firstSlideMessage:
                        "This is the first related service",
                    lastSlideMessage:
                        "This is the last related service"
                }
            }
        );
    }

    function destroyRelatedSlider() {
        if (!state.relatedSlider) {
            return;
        }

        state.relatedSlider.destroy(true, true);
        state.relatedSlider = null;
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
            "service-page-faq-schema"
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

        script.id = "service-page-faq-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity
        });

        document.head.append(script);
    }

    function injectServiceSchema() {
        const previousSchema = document.getElementById(
            "nimomark-service-schema"
        );

        previousSchema?.remove();

        const service = state.currentService;
        const title = getServiceTitle(service);

        const brandName = firstDefined(
            getConfigValue("brand.name"),
            "NimoMark"
        );

        const baseUrl = firstDefined(
            getConfigValue("seo.baseUrl"),
            getConfigValue("company.website"),
            window.location.origin
        );

        const serviceUrl = new URL(
            getServiceHref(service),
            baseUrl
        ).href;

        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            name: title,
            description: getServiceDescription(service),
            url: serviceUrl,
            serviceType: title,
            provider: {
                "@type": "Organization",
                name: brandName,
                url: baseUrl
            },
            areaServed: {
                "@type": "Place",
                name: "International"
            },
            termsOfService: new URL(
                "terms-of-service.html",
                baseUrl
            ).href
        };

        const script = document.createElement("script");

        script.id = "nimomark-service-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);

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
                    "--service-parallax-offset"
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
                element.dataset.serviceParallaxSpeed ||
                0.032
            );

            const maximumOffset = Number(
                element.dataset.serviceParallaxMax ||
                18
            );

            const rawOffset = distance * speed;

            const offset = Math.max(
                maximumOffset * -1,
                Math.min(maximumOffset, rawOffset)
            );

            element.style.setProperty(
                "--service-parallax-offset",
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
                "translate3d(0, var(--service-parallax-offset, 0px), 0) scale(1.04)";
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

    function initializeResponsiveUpdates() {
        window.addEventListener(
            "resize",
            () => {
                window.clearTimeout(state.resizeTimer);

                state.resizeTimer = window.setTimeout(() => {
                    state.relatedSlider?.update?.();
                    requestParallaxUpdate();
                    refreshAos();
                }, 180);
            },
            {
                passive: true
            }
        );
    }

    function initializeServicePage() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        state.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        state.services = getServices();
        state.currentService = getCurrentService();

        applyServiceBindings();
        updateDocumentMetadata();

        renderServiceNavigation();
        renderSupportGrid();
        renderAudienceRows();
        renderPrinciples();
        renderChecklist();
        renderRelatedServices();
        renderFaq();

        initializeMobileNavigation();
        initializeRelatedSlider();
        initializeRevealGroups();
        initializeParallax();
        initializeResponsiveUpdates();

        injectServiceSchema();

        refreshIcons();

        window.requestAnimationFrame(() => {
            refreshIcons();
            refreshAos();
            requestParallaxUpdate();
        });

        document.dispatchEvent(
            new CustomEvent(
                "nimomark:service-page-ready",
                {
                    detail: {
                        service: state.currentService,
                        services: state.services,
                        relatedServices:
                            state.relatedServices
                    }
                }
            )
        );
    }

    onDocumentReady(() => {
        waitForGlobalApi(initializeServicePage);
    });
})();
