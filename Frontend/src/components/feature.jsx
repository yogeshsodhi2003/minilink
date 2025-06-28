import React from "react";
import { motion } from "motion/react"

const feature = () => {
const features = [
  {
    icon: "🔗",
    title: "Custom Short Links",
    description: "Create personalized URLs with custom slugs that are easy to remember and share."
  },
  {
    icon: "📊",
    title: "Click Analytics",
    description: "Track how many times your links are clicked and gain insight on performance."
  },
  {
    icon: "📅",
    title: "QR & Expiry",
    description: "Generate QR codes for your links and set them to expire when you want."
  }
];

  return (
     <section className="px-6 py-20 bg-white">
      <h2 className="text-4xl font-bold text-center text-[#ff2969] mb-12">
        Why MiniLink 
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
     {features.map((feature, index)=>(
        <motion.div
            key={index}
            className="bg-zinc-100 rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl">{feature.icon}</div>
            <h3 className="text-xl font-semibold mt-4 text-[#ff2969]">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </motion.div>
    )) }
    </div>
    </section>

  );
};

export default feature;
