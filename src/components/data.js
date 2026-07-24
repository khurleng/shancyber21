import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Highlight Service",
  desc: "You can use this space to highlight your first benefit or a feature of your product. It can also contain an image or Illustration like in the example along with some bullet points.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Software Service",
      desc: "Shan Cyber provides software services to solve technical and digital problems efficiently and professionally.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Web Desing and Develompent",
      desc: "Shan Cyber provides professional web design and development services to create modern, responsive, and user-friendly websites.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Desing & Inforgraphics",
      desc: "Shan Cyber offers creative graphic design and infographic services for effective branding and marketing.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Learn and Empowering Your Digital Skill",
  desc: "Learn and empower your digital skills with practical technology training and creative solutions for the modern world.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "MS Office Skill",
      desc: "Improve your MS Office skills with practical training in Word, Excel, PowerPoint, and other essential office tools.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Hardware and Software Skills",
      desc: "We offer practical knowledge and training in both hardware and software skills to help learners build strong technical abilities.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Basic Web Development Skill",
      desc: "Learn the fundamentals of web development, including website design, coding, and responsive web technologies.",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
