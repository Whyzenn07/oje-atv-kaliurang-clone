"use client";

const cards = [
  {
    icon: "/images/Web-designing-service-icon.png",
    title: "Keselamatan",
    desc: "Pemandu kami terlatih dalam pertolongan pertama dan keselamatan serta profesional yang berpengalaman.",
  },
  {
    icon: "/images/Web-developement-services-icon.png",
    title: "Layanan 24",
    desc: "Kami adalah satu-satunya layanan 24 jam yang tersedia 7 hari seminggu, sehingga Anda dapat memesan kapan saja.",
  },
  {
    icon: "/images/UI-UX-design-services-icon.png",
    title: "Fasilitas",
    desc: "Kami memiliki fasilitas, peralatan, dan layanan terbaik sebelum, selama, dan setelah petualangan Anda.",
  },
];

export default function KenapaKamiSection() {
  return (
    <section className="relative py-0 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 shadow-xl">
          {/* Left red panel - "Kenapa Kami" */}
          <div className="bg-[#b51b41] text-white flex flex-col justify-center px-8 py-12 md:py-16">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
              Kenapa
              <br />
              Kami
            </h2>
            <div className="w-12 h-1 bg-amber-400 mb-5 rounded" />
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              Kami memiliki pengalaman bertahun-tahun, kami profesional dan
              bersemangat dengan apa yang kami lakukan.
            </p>
          </div>

          {/* 3 feature cards */}
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center px-6 py-10 sm:py-12 hover:bg-gray-50/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-default"
            >
              {/* Icon box using exact Elementor original icons with professional bounce/scale */}
              <div className="w-20 h-20 mb-5 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-red-50/50 rounded-2xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 -z-10" />
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-16 h-16 object-contain group-hover:scale-115 group-hover:-rotate-3 group-hover:drop-shadow-md transition-all duration-300"
                />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight group-hover:text-[#b51b41] transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
