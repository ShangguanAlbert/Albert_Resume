export interface NavigationItem {
  title: string;
  url: string;
}

export const siteConfig = {
  title: "Fuze Shangguan Homepage",
  description: "",

  author: {
    name: "上官福泽\nFuze Shangguan",
    avatar: "/images/cute_profile.jpeg",
    bio: "Hangzhou Normal University",
    location: "Hangzhou, China",
    email: "sgfzalbert@163.com",
    googlescholar: "https://scholar.google.com/citations?user=1_RIr1YAAAAJ",
    researchgate: "https://www.researchgate.net/profile/Fuze-Shangguan",
    orcid: "https://orcid.org/0009-0009-6063-0091",
    instagram: "shangguanfz",
  },

  googleScholarStatsUseCdn: true,
  repository: "ShangguanAlbert/ShangguanAlbert.github.io",

  navigation: [
    { title: "About Me", url: "/#about-me" },
    { title: "Educations", url: "/#educations" },
    { title: "Publications", url: "/#selected-publications" },
    { title: "Academic Services", url: "/#academic-services" },
    { title: "Honors in Academic", url: "/#honors-in-academic" },
    { title: "Awards in Robotics", url: "/#awards-in-robotics" },
  ] as NavigationItem[],
};
