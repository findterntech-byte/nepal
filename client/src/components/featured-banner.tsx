export default function FeaturedBanner() {
  return (
    <section className="container mx-auto px-4 py-8" data-testid="featured-banner">
      <div 
        className="relative nepal-gradient rounded-2xl overflow-hidden shadow-xl mountain-shadow"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 64, 175, 0.85), rgba(5, 150, 105, 0.85)), url('https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="relative z-10 px-12 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-2 himalayan-text text-white" data-testid="text-event-title">नेपाल रियल एस्टेट एक्सपो</h2>
                <p className="text-xl opacity-90" data-testid="text-event-location">काठमाडौं प्रदर्शनी केन्द्र | Kathmandu Exhibition Center</p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-5xl font-bold mb-4 prayer-flag-animation" data-testid="text-main-title-1">नेपालको भविष्य</h3>
              <h3 className="text-5xl font-bold mb-2" data-testid="text-main-title-2">SHAPING NEPAL'S</h3>
              <h3 className="text-4xl font-bold mb-6" data-testid="text-main-title-3">REAL ESTATE FUTURE</h3>
              <p className="text-lg opacity-90 max-w-2xl">From Himalayas to Terai, fulfilling every Nepali's dream of home and property</p>
            </div>
          </div>
          <div className="absolute bottom-6 right-12">
            <div className="flex space-x-2" data-testid="banner-indicators">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
