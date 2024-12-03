import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const CallToAction = () => {
  return (
    <section className="my-28 bg-black">
      <div className="px-5 py-5 rounded-xl md:px-0 md:max-w-[900px] lg:max-w-[1300px] container mx-auto bg-white relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 via-gray-100/20 to-gray-300/30 rounded-xl -z-10 blur-sm"></div>
        <div className="absolute inset-0.5 border-2 border-gray-100/50 rounded-xl -z-10"></div>

        <div className="max-w-[540px] mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center mt-5">
            Sign up to get started.
          </h2>
          <p className="text-lg tracking-tighter text-black/70 text-center mt-5">
            Ready to Secure Your Crypto Assets? Sign Up Now to Get Started with
            Our Easy-to-Use Wallet Generator.
          </p>
        </div>
        <div className="flex gap-4 mt-10 justify-center">
          <Button
            size={"lg"}
            className="
              flex items-center gap-3 
              px-8 py-3
              text-base 
              bg-gray-100/10 
              border-r-2
              backdrop-blur-sm 
              border border-gray-300/30 
              hover:bg-gray-100/20 
              transition-all duration-300 
              group
              text-black
              hover:text-black/80
            "
          >
            Get started
          </Button>
          <Button
            size={"lg"}
            className="
              flex items-center gap-3 
              px-8 py-3
              text-base 
              bg-black 
              text-white
              hover:bg-black/90 
              transition-all duration-300 
              group
            "
          >
            <span>Learn more</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
