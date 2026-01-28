import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#0D0D0D] to-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center py-16 lg:py-32 gap-12">
        
        {/* Left content */}
        <div className="flex-1 text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find Your Dream Home with Ease.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-6">
            Explore verified properties, connect with agents, and make smart investments in real estate.
          </p>
          <button className="bg-[#FF6600] hover:bg-orange-500 transition-all text-white font-semibold py-3 px-6 rounded-lg shadow-lg">
            Browse Listings
          </button>

          {/* Stats Panel */}
          <div className="flex mt-12 gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[#FF6600] text-2xl font-bold">1.2K+</span>
              <span className="text-gray-300">Properties Listed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF6600] text-2xl font-bold">800+</span>
              <span className="text-gray-300">Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF6600] text-2xl font-bold">5K+</span>
              <span className="text-gray-300">Transactions</span>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Replace with your 3D render or high-quality image */}
            <Image 
              src="/herosecionbackgroundremoved.png" 
              alt="Real Estate" 
              width={600} 
              height={400} 
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
