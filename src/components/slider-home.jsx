import { Carousel, Typography, Button } from "@material-tailwind/react";

 
export function SliderHome(props) {

  return (
    <Carousel
      className=""
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      autoplay="true"
      loop="true"
      transition={{ type:"tween",  duration:"0.5" }}
      autoplayDelay="4000"
    >
      <div className="relative h-96 overflow-hidden md:min-h-[500px]">
        <img
          src="/images/slider01.jpg"
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full md:w-1/2 place-items-center bg-gradient-to-r from-gray-900 via-50% to-transparent">
          <div className="w-3/4 text-left md:w-9/12">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-2xl md:text-4xl lg:text-5xl"
            >
              {props.title}
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              {props.description}
            </Typography>
            <div className="flex justify-start gap-2">
              <Button size="lg" color="white" variant="text">
              {props.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
