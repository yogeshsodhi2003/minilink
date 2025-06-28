import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



const CTASection = () => {
     const isAuth = useSelector((state) => state.user.isAuthenticated);
    console.log(isAuth)
  return (
    <section className="relative bg-gradient-to-br from-[#ff2969] via-pink-500 to-[#ff2969] py-24 px-6 overflow-hidden">
      {/* Glow/Blur Background Shape */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-2xl z-0"></div>

      <motion.div
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-3xl mx-auto p-10 text-center shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          Manage your links like a pro.
        </h2>
        <p className="text-white/80 text-lg sm:text-xl mb-8">
          It’s free & always will be — no catch, no cap.
        </p>
        <Link
        to={isAuth ? "/dashboard" : "/login"}
          className="inline-block px-6 py-3 rounded-xl bg-white text-[#ff2969] font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Manage Your Links
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;
