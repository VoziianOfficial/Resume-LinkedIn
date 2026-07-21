import fs from "node:fs";

const files = fs
    .readdirSync(".")
    .filter((file) => file.endsWith(".html"))
    .concat(["assets/js/config.js"]);

const replacements = new Map([
    ["This page has moved beyond the map.", "Page off the map."],
    ["Continue from a familiar starting point.", "Start somewhere familiar."],
    ["Career stories, made clearer.", "Clearer Career Stories"],
    ["Professional experience is not always easy to translate.", "Experience Needs Context"],
    ["Clear information before career-support decisions.", "Clear Before Decisions"],
    ["Different professional situations require different kinds of clarity.", "Different Careers, Different Clarity"],
    ["Connected support for connected career materials.", "Connected Career Support"],
    ["What NimoMark does not promise.", "No Outcome Promises"],
    ["From a general question to a more focused next step.", "From Question to Scope"],
    ["Better communication begins with accurate context.", "Context Comes First"],
    ["Start with the question you are trying to clarify.", "Clarify Your Question"],
    ["Tell us what kind of conversation you want to begin.", "Choose Your Conversation"],
    ["Advertise &amp; Collaborate", "Advertise and Collaborate"],
    ["Advertise & Collaborate", "Advertise and Collaborate"],
    ["Share enough context for an initial review.", "Share Initial Context"],
    ["What may happen after your inquiry is sent.", "After Your Inquiry"],
    ["Review the details before sharing your information.", "Review Before Sharing"],
    ["International online inquiries begin with a clear message.", "Clear Messages First"],
    ["Cookies at a glance", "Cookie Snapshot"],
    ["Cookie question?", "Cookie Questions"],
    ["How the website remembers essential preferences.", "Essential Preference Memory"],
    ["Overview", "Policy Overview"],
    ["What Cookies Are", "Cookie Basics"],
    ["Third-Party Technologies", "Third-Party Tools"],
    ["Retention", "Storage Retention"],
    ["Contact", "Contact Details"],
    ["Keep the setting that matches your choice.", "Keep Your Choice"],
    ["Unsure whether a cover letter is relevant?", "Letter Support Fit"],
    ["Add relevant context without repeating the resume.", "Relevant Letter Context"],
    ["What cover-letter support may include.", "Included Letter Support"],
    ["A focused letter may help when the application needs additional context.", "Useful Application Context"],
    ["A stronger letter should be focused, credible and specific to the opportunity.", "Focused Letter Principles"],
    ["Review every detail before submitting the application.", "Review Application Details"],
    ["Keep the letter aligned with the rest of the application.", "Aligned Application Materials"],
    ["Share the role and context you want the letter to address.", "Share Role Context"],
    ["Unsure how to present senior-level scope?", "Senior Scope Fit"],
    ["Present leadership scope with credible business context.", "Credible Leadership Context"],
    ["What executive resume support may include.", "Included Executive Support"],
    ["Executive resume support may suit several forms of senior leadership positioning.", "Senior Positioning Paths"],
    ["Senior-level positioning should remain specific, credible and appropriately contextualized.", "Credible Leadership Positioning"],
    ["Review the leadership narrative before treating the resume as ready.", "Leadership Narrative Review"],
    ["Keep executive positioning consistent across every professional material.", "Consistent Executive Positioning"],
    ["Share the senior-level scope you want the resume to communicate.", "Share Leadership Scope"],
    ["Build a clearer story around your professional direction.", "Clear Career Direction"],
    ["Make Your Experience Clear to Global Employers.", "Clear Career Direction"],
    ["Career questions look different at every professional stage.", "Career Stage Questions"],
    ["Explore focused support for the materials and moments that shape a career story.", "Focused Career Support"],
    ["Support shaped around your next move.", "Focused Career Support"],
    ["Stronger career documents begin with clearer priorities.", "Clearer Resume Priorities"],
    ["Turn complex experience into clear value.", "Clearer Resume Priorities"],
    ["Your LinkedIn profile should support the same professional direction.", "Aligned LinkedIn Profile"],
    ["Make your professional direction easier to see.", "Aligned LinkedIn Profile"],
    ["Begin with a focused package and adapt the inquiry to your context.", "Focused Support Packages"],
    ["Clearer wording adds context instead of decoration.", "Clearer Wording Context"],
    ["See how stronger wording changes the message.", "Clearer Wording Context"],
    ["Prepare examples, not artificial scripts.", "Prepare Real Examples"],
    ["Prepare to explain your value clearly.", "Prepare Real Examples"],
    ["Clear expectations before submitting an inquiry.", "Inquiry Expectations"],
    ["Clear answers before you inquire.", "Inquiry Expectations"],
    ["Unsure how to position experience internationally?", "International Positioning Fit"],
    ["Communicate your career story across employment markets.", "Cross-Market Career Story"],
    ["What international positioning support may include.", "Included Positioning Support"],
    ["International positioning may support several cross-border career situations.", "Cross-Border Career Situations"],
    ["Market awareness should improve clarity without changing the facts.", "Market-Aware Clarity"],
    ["Review the cross-market career story before using it.", "Cross-Market Story Review"],
    ["Keep your international career materials consistent.", "Consistent International Materials"],
    ["Share the international direction you want your career materials to support.", "Share International Direction"],
    ["Unsure how to prepare for the conversation?", "Conversation Preparation Fit"],
    ["Prepare relevant examples before the conversation.", "Prepare Relevant Examples"],
    ["What interview preparation may include.", "Included Interview Preparation"],
    ["Interview preparation may support several professional situations.", "Professional Interview Situations"],
    ["Strong preparation should improve clarity without replacing an authentic conversation.", "Authentic Interview Clarity"],
    ["Review the preparation before the interview begins.", "Final Preparation Review"],
    ["Keep interview examples aligned with your written career materials.", "Aligned Interview Examples"],
    ["Share the opportunity and examples you want to prepare.", "Share Opportunity Context"],
    ["Unsure how technical your resume should be?", "Technical Resume Fit"],
    ["Connect technical skills with practical contribution.", "Technical Contribution Context"],
    ["What IT resume support may include.", "Included IT Support"],
    ["Technical resume support may be relevant across several technology disciplines.", "Technology Discipline Support"],
    ["Strong technical positioning combines tools, context and credible contribution.", "Technical Positioning Principles"],
    ["Review the technical story before treating the resume as ready.", "Technical Story Review"],
    ["Keep technical positioning consistent across every career material.", "Consistent Technical Positioning"],
    ["Share the role, projects and experience you want the resume to communicate.", "Share Technical Scope"],
    ["LinkedIn Profile Optimization", "LinkedIn Profile Support"],
    ["Unsure whether profile support fits?", "Profile Support Fit"],
    ["Create a more consistent professional profile.", "Consistent Professional Profile"],
    ["What LinkedIn profile support may include.", "Included Profile Support"],
    ["Profile support may help professionals at different stages of positioning.", "Profile Positioning Stages"],
    ["A stronger profile should remain accurate, readable and professionally consistent.", "Accurate Readable Profile"],
    ["Review the profile before treating it as aligned.", "Final Profile Review"],
    ["Keep the profile connected with the rest of your career materials.", "Connected Career Materials"],
    ["Share the professional direction you want the profile to support.", "Share Profile Direction"],
    ["Privacy at a glance", "Privacy Snapshot"],
    ["Privacy question?", "Privacy Questions"],
    ["How information submitted through this website may be handled.", "Website Data Handling"],
    ["Information We May Collect", "Information Collected"],
    ["How Information May Be Used", "Information Use"],
    ["Legal Bases and Permissions", "Legal Permissions"],
    ["Your Privacy Choices", "Privacy Choices"],
    ["Review your information before submitting an inquiry.", "Review Before Submitting"],
    ["See how clearer wording can make professional experience easier to understand.", "Clearer Resume Examples"],
    ["Use examples to understand principles, not to copy someone else’s story.", "Principles Over Copying"],
    ["Move from general statements to useful professional context.", "Useful Professional Context"],
    ["Technical tools become more meaningful when connected with real work.", "Technical Work Context"],
    ["International experience should be translated, not erased.", "Translate International Experience"],
    ["Senior resumes need more than longer responsibility lists.", "Senior Resume Scope"],
    ["Replace vague confidence with specific professional information.", "Specific Professional Evidence"],
    ["Review the document before considering it complete.", "Final Document Review"],
    ["Your resume should describe your real professional story.", "Your Real Story"],
    ["Unsure how to present international experience?", "International Experience Fit"],
    ["Translate experience into a new market context.", "New Market Context"],
    ["What newcomer resume support may include.", "Included Newcomer Support"],
    ["New-market resume support may help professionals with different international backgrounds.", "New-Market Backgrounds"],
    ["Market adaptation should preserve the real professional history.", "Preserve Real History"],
    ["Review how international experience is presented.", "International Experience Review"],
    ["Keep international positioning consistent across every career material.", "Consistent International Positioning"],
    ["Share the market and professional direction you want the resume to support.", "Share Market Direction"],
    ["Unsure whether this service fits?", "Service Fit"],
    ["Build a resume around a clear professional direction.", "Clear Resume Direction"],
    ["What resume-writing support may include.", "Included Resume Support"],
    ["Resume support may be relevant at several career stages.", "Relevant Career Stages"],
    ["Clearer positioning should remain accurate, relevant and credible.", "Accurate Credible Positioning"],
    ["Review the document before treating it as ready.", "Final Resume Review"],
    ["Keep connected career materials aligned.", "Aligned Career Materials"],
    ["Understand the boundaries before submitting an inquiry.", "Inquiry Boundaries"],
    ["Share the direction you want the document to support.", "Share Your Direction"],
    ["Support built around a clearer professional direction.", "Clear Career Support"],
    ["Career support works best when it reflects the actual professional question.", "Real Career Questions"],
    ["Explore the career materials and preparation areas you want to strengthen.", "Strengthen Career Materials"],
    ["Group related support around the stage of your career journey.", "Career Journey Stages"],
    ["Compare possible starting points for connected career support.", "Compare Starting Points"],
    ["Every career material should support the same underlying direction.", "Shared Career Direction"],
    ["Professional value needs language the intended market can understand.", "Market-Ready Language"],
    ["Move from a general career question to a clearly reviewed scope.", "From Question to Scope"],
    ["Understand the options before choosing a direction.", "Options Before Direction"],
    ["Start with the professional question you are trying to solve.", "Start With Questions"],
    ["Terms at a glance", "Terms Snapshot"],
    ["Terms question?", "Terms Questions"],
    ["Please review these terms before using the platform or submitting an inquiry.", "Review Platform Terms"],
    ["Eligibility", "Service Eligibility"],
    ["No Guaranteed Outcomes", "No Outcome Guarantees"],
    ["Fees and Service Terms", "Fees and Terms"],
    ["Disclaimers", "General Disclaimers"],
    ["Limitation of Liability", "Liability Limits"],
    ["Indemnification", "User Indemnity"],
    ["Termination", "Account Termination"],
    ["Changes", "Terms Changes"],
    ["Using NimoMark does not guarantee a career outcome.", "No Career Guarantees"]
]);

for (const file of files) {
    let source = fs.readFileSync(file, "utf8");
    let next = source;

    for (const [from, to] of replacements) {
        next = next.split(from).join(to);
    }

    if (file.endsWith(".html")) {
        next = next.replace(
            /<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g,
            (match, level, attributes, content) => {
                const normalized = content
                    .replace(/<[^>]*>/g, " ")
                    .replace(/&amp;/g, "&")
                    .replace(/\s+/g, " ")
                    .trim();

                const replacement = replacements.get(normalized);

                if (!replacement) {
                    return match;
                }

                return `<h${level}${attributes}>\n                            ${replacement}\n                        </h${level}>`;
            }
        );
    }

    if (next !== source) {
        fs.writeFileSync(file, next);
    }
}
