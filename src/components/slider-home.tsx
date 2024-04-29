
"use client";

import type { CustomFlowbiteTheme } from "flowbite-react";
import { Carousel, Flowbite } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  carousel: {
    scrollContainer: {
      base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-none"
    },
  },
};

export function SliderHome(props:any) {
  return (
    <div className="relative h-72 overflow-hidden md:h-96 lg:h-[32rem]">
      <Flowbite theme={{ theme: customTheme }}>
      <Carousel slideInterval={3000} pauseOnHover className="">
        <div>
          <img src="/images/slider01.jpg" alt="image 1" className="h-full w-full object-cover" />
          <div className="absolute inset-0 grid h-full w-full sm:9/12 md:w-9/12 lg:w-6/12 place-items-center bg-gradient-to-r from-gray-900 via-50% to-transparent">
                <div className="w-3/4 text-left md:w-9/12">
                  <h1 className="text-xl font-bold text-white sm:text-3xl md:mb-6 md:text-4xl">{props.s1_title}</h1>
                      
                  <p className="mb-4 font-normal md:font-semibold xl:font-semibold text-white md:mb-6 md:text-lg xl:text-xl">{props.s1_description}</p>
                      
                  <div className="flex justify-start gap-2">
                      <a href="#" className="inline-block rounded-lg bg-pink-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-pink-600 focus-visible:ring active:bg-indigo-700 md:text-base">{props.s1_button}</a>
                  </div>
                </div>
            </div>
        </div>
        <div>
          <img src="/images/slider02.jpg" alt="image 1" className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid h-full w-full sm:9/12 md:w-9/12 lg:w-6/12 place-items-center bg-gradient-to-r from-gray-900 via-50% to-transparent">
                <div className="w-3/4 text-left md:w-9/12">
                  <h1 className="text-xl font-bold text-white sm:text-3xl md:mb-6 md:text-4xl">{props.s2_title}</h1>
                      
                  <p className="mb-4 font-normal md:font-semibold xl:font-semibold text-white md:mb-6 md:text-lg xl:text-xl">{props.s2_description}</p>
                      
                  <div className="flex justify-start gap-2">
                      <a href="#" className="inline-block rounded-lg bg-pink-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-pink-600 focus-visible:ring active:bg-indigo-700 md:text-base">{props.s2_button}</a>
                  </div>
                </div>
            </div>
        </div>
      </Carousel>
      </Flowbite>
    </div>
  );
}
