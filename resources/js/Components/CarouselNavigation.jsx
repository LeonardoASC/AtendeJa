import { useEffect } from "react";

function CarouselNavigation({ carouselActiveIndex, length, setCarouselActiveIndex, onSlideChange }) {
  useEffect(() => {onSlideChange(carouselActiveIndex)}, [carouselActiveIndex, onSlideChange]);
  return (
    <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
      {new Array(length).fill("").map((_, i) => (
        <span key={i} className={`block h-1 cursor-pointer rounded-2xl transition-all ${carouselActiveIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}`}
          onClick={() => setCarouselActiveIndex(i)}
        />
      ))}
    </div>
  );
}

export default CarouselNavigation;
