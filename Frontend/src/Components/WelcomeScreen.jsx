const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center w-full px-4 mt-16">
      {/* Premium glowing logo container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 rounded-full"></div>
        <div className="relative w-24 h-24 bg-gradient-to-tr from-gray-800 to-gray-900 border border-gray-700 rounded-3xl flex items-center justify-center shadow-2xl">
          <svg
            className="w-12 h-12 text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        </div>
      </div>

      {/* Metallic Gradient Title */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight mb-4">
        Cortex AI Workspace
      </h1>

      <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
        Experience the next generation of intelligent assistance. Code
        generation, data analysis, and creative ideation, all in one place.
      </p>

      {/* Grid of professional starter prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {[
          {
            icon: "💻",
            title: "Review Code",
            desc: "Analyze my current codebase for bugs",
          },
          {
            icon: "📊",
            title: "Analyze Data",
            desc: "Extract key insights from my metrics",
          },
          {
            icon: "📝",
            title: "Draft Email",
            desc: "Write a professional team memo",
          },
          {
            icon: "🧠",
            title: "Brainstorm",
            desc: "Generate software architecture ideas",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 cursor-pointer text-left group shadow-sm hover:shadow-md"
          >
            <div className="text-2xl bg-gray-900 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              {item.icon}
            </div>
            <div className="mt-1">
              <h3 className="text-gray-200 font-semibold mb-1 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
