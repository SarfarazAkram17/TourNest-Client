import "./carousel.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.jpg";
import banner3 from "../../../assets/banner3.jpg";

const slides = [
  {
    img: banner1,
    title: "Discover the Heart of Bangladesh",
    desc: "Journey through iconic landscapes and hidden gems with trusted local guides via TourNest.",
  },
  {
    img: banner2,
    title: "Plan Your Perfect Adventure",
    desc: "Easily explore, book, and enjoy unique trips tailored for every traveler across the country.",
  },
  {
    img: banner3,
    title: "Travel with Trusted Locals",
    desc: "Connect with verified Bangladeshi tour guides and explore authentic local experiences.",
  },
];

const Banner = () => {
  return (
    <Carousel
      className="max-w-5xl mx-auto px-4 my-8"
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      transitionTime={800}
    >
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl overflow-hidden max-h-[400px] h-[60vh] flex items-center justify-center"
        >
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.img})` }}
          ></div>

          {/* Gradient Overlay Layer for soft darkness */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20"></div>

          {/* Text Layer */}
          <div className="relative z-10 text-center px-4 text-white max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3 drop-shadow-md">
              {slide.title}
            </h2>
            <p className="text-sm md:text-lg font-medium drop-shadow-sm">
              {slide.desc}
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
