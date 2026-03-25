import { Shield, Lock, Eye, Cloud, Database, Activity } from "lucide-react";

const securityFeatures = [
  {
    title: "Encrypted Storage",
    desc: "All your clips and metadata are stored with enterprise-grade encryption.",
    icon: <Lock size={20} className="text-orange-500" />,
  },
  {
    title: "GDPR Compliant",
    desc: "We respect user privacy and adhere to global data protection standards.",
    icon: <Shield size={20} className="text-orange-500" />,
  },
  {
    title: "AI Safety Guardrails",
    desc: "Built-in filtering to ensure clips meet platform safety guidelines.",
    icon: <Eye size={20} className="text-orange-500" />,
  },
  {
    title: "Cloud Scalability",
    desc: "Processes 2-hour videos effortlessly using elastic cloud infrastructure.",
    icon: <Cloud size={20} className="text-orange-500" />,
  },
  {
    title: "Secure SQL Database",
    desc: "Your channel data is isolated and protected behind VPC firewalls.",
    icon: <Database size={20} className="text-orange-500" />,
  },
  {
    title: "Real-time Monitoring",
    desc: "Live processing logs available in your dashboard for every job.",
    icon: <Activity size={20} className="text-orange-500" />,
  },
];

export function SecuritySection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full mb-6 font-jetbrains-mono uppercase tracking-widest">
            Security & Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Safe, reliable, and fast
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-jetbrains-mono max-w-2xl mx-auto">
            Enterprise-level architecture for individual creators and media
            agencies alike.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 font-jetbrains-mono">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-jetbrains-mono">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
