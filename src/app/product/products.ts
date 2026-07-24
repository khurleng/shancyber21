export const products = [
  {
    title: "Tug Game for Classroom",
    description: "A beautifully designed product for fast workflows and better results.",
    buttonText: "View",
    image: "/img/hero.png",
    link: "https://tug.shancyber.com/",
  },
  {
    title: "Shan Typing Mentor",
    description: "Improve your typing skills with our interactive mentorship program.",
    buttonText: "View",
    image: "https://typingmentor.com/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fbs3wcomf%2Fproduction%2F62b05cf2a38305d9d6923e78f324bd535c6081a0-1500x1000.jpg%3Frect%3D3%2C0%2C1494%2C1000%26w%3D808%26h%3D541%26fit%3Dcrop%26auto%3Dformat&w=1920&q=75",
    link: "https://typing.shancyber.com/",
  },
  {
    title: "Excel",
    description: "Downlaod Excel File for Practicing",
    buttonText: "Download",
    image: "/img/excel.png",
    link: "https://docs.google.com/spreadsheets/d/19kKBk8SN5t2jR-qXE83V9SNdnvDNJx14/edit?usp=sharing&ouid=115330026909134269785&rtpof=true&sd=true",
  },
  // Add more products here
];

export type Product = (typeof products)[number];
