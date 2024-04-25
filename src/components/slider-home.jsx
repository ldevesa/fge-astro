import { Carousel } from "flowbite-react";

export function SliderHome({title, description, button, title2, description2, button2}) {
  return (
    <div className="relative h-72 overflow-hidden md:h-96 lg:h-[32rem]">
      <Carousel slideInterval={5000} pauseOnHover>
        <div>
          <img src="/images/slider01.jpg" alt="image 1" className="h-full w-full object-cover" />
          <div className="absolute inset-0 grid h-full w-full md:w-1/2 place-items-center bg-gradient-to-r from-gray-900 via-50% to-transparent">
                <div className="w-3/4 text-left md:w-9/12">
                <h1 className="text-4xl font-bold text-white sm:text-5xl md:mb-12 md:text-6xl">{title}</h1>
                    
                <p className="mb-4 font-semibold text-white md:mb-6 md:text-lg xl:text-xl">{description}</p>
                    
                <div className="flex justify-start gap-2">
                    <a href="#" className="inline-block rounded-lg bg-pink-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-pink-600 focus-visible:ring active:bg-indigo-700 md:text-base">{button}</a>
                </div>
                </div>
            </div>
        </div>
        <div>
          <img src="/images/slider02.jpg" alt="image 1" className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid h-full w-full md:w-1/2 place-items-center bg-gradient-to-r from-gray-900 via-50% to-transparent">
                <div className="w-3/4 text-left md:w-9/12">
                <h1 className="text-4xl font-bold text-white sm:text-5xl md:mb-12 md:text-6xl">{title2}</h1>
                    
                <p className="mb-4 font-semibold text-white md:mb-6 md:text-lg xl:text-xl">{description2}</p>
                    
                <div className="flex justify-start gap-2">
                    <a href="#" className="inline-block rounded-lg bg-pink-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-pink-600 focus-visible:ring active:bg-indigo-700 md:text-base">{button2}</a>
                </div>
                </div>
            </div>
        </div>
      </Carousel>
    </div>
  );
}
