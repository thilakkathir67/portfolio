const defaultContent = {
  hero: {
    intro: "Hi I am",
    name: "Thilak",
    title: "UI/UX Designer",
    summary: "I build practical, user-focused web experiences and keep improving through hands-on projects.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    socials: ["IG", "IN", "BE", "DR"],
    stats: [
      { value: "5+", label: "Experiences" },
      { value: "20+", label: "Project done" },
      { value: "80+", label: "Happy Clients" }
    ]
  },
  about: {
    title: "About me",
    text: "This is your separate About page. Share your real profile summary, skills, and experience timeline, and I will plug them in cleanly.",
    blocks: [
      {
        type: "text",
        value:
          "This is your separate About page. Share your real profile summary, skills, and experience timeline, and I will plug them in cleanly."
      }
    ],
    email: "",
    phone: "",
    githubUrl: "https://github.com/",
    linkedinUrl: "https://www.linkedin.com/",
    resumeUrl: "",
    resumeFileName: "resume.pdf"
  },
  portfolio: {
    title: "Portfolio",
    text: "This is your separate Portfolio page. Send project titles, stack, and links later; I will convert them into polished cards.",
    projects: [
      {
        name: "Project One",
        description: "Short project description goes here.",
        liveUrl: "",
        repoUrl: "",
        stack: "React, Bootstrap",
        role: "Full Stack Developer",
        period: "2025 - 2026",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        images: [
          {
            url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
            alt: "Project snapshot"
          }
        ]
      }
    ]
  },
  contact: {
    title: "Contact me",
    text: "This is your separate Contact page. Add your email, phone, social links, and preferred contact method and I will finalize it.",
    email: "",
    phone: "",
    githubUrl: "https://github.com/",
    linkedinUrl: "https://www.linkedin.com/"
  }
};

export default defaultContent;
