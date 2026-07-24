import Image from "next/image";
import { Container } from "@/components/Container";
import heroImg from "../../public/img/hero.png";
import { FaYoutube } from "react-icons/fa";

export const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Empowering Your Digital Future
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Shan Cyber is dedicated to empowering young people by providing essential digital knowledge and practical skills to help them grow, innovate, and succeed in the modern tech-driven world.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href="https://shancyber.com"
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md ">
                Expore
              </a>
              <a
                href="https://www.youtube.com/@kltechtips163"
                target="_blank"
                rel="noopener"
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <FaYoutube className="w-10 h-10 text-red-600 dark:text-white" />
                <span>View on YouTube</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      {/* <Container>
        <div className="flex flex-col justify-center">
          <div className="text-xl text-center text-gray-700 dark:text-white">
            Trusted by <span className="text-indigo-600"></span>{" "}
            customers
          </div>

          <div className="flex flex-row justify-center mt-10 gap-8">
  <div className="pt-2 text-gray-400 dark:text-gray-400">
    <AmazonLogo />
  </div>
  <div className="text-gray-400 dark:text-gray-400">
    <MicrosoftLogo />
  </div>
</div>
        </div>
      </Container> */}
    </>
  );
}

function AmazonLogo() {
  return (
    <img 
      src="/img/brands/kd.png" 
      alt="My Logo" 
      style={{ width: '150px', height: '100px', objectFit: 'contain' }} 
    />
  );
}

function MicrosoftLogo() {
  return (
    <img 
      src="/img/brands/ss.png" 
      alt="My Logo" 
      style={{ width: '150px', height: '100px', objectFit: 'contain' }} 
    />
  );
}
