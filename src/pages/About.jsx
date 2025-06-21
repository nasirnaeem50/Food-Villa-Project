// src/pages/About.jsx (Advanced & Professional Redesign)

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaUserFriends, FaTrophy, FaLeaf, FaTwitter, FaLinkedin, FaQuoteLeft } from 'react-icons/fa';

// --- Data for the page (easy to update) ---
const story = {
  title: "The Heartbeat of Our Kitchen",
  paragraphs: [
    "Founded in the vibrant year of 2010, Food Villa was born from a simple yet profound family dream: to craft unforgettable meals that feel like home, yet taste like a discovery. We started with a handful of recipes passed down through generations and a single, unwavering mission.",
    "Our mission is to bridge the gap between traditional flavors and modern culinary artistry. We believe every dish tells a story, and our passion is to share these tales with you, one plate at a time. Through dedication to sourcing the finest local ingredients and a relentless pursuit of perfection, we've evolved from a neighborhood gem into a culinary landmark.",
  ],
  imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop",
  imageAlt: "The warm and inviting interior of the Food Villa restaurant"
};

const timeline = [
  { year: 2010, title: "Grand Opening", description: "Our doors open for the first time in downtown, with a menu of 12 classic dishes." },
  { year: 2014, title: "First Culinary Award", description: "Recognized as 'Best New Restaurant' by the City Food Guide." },
  { year: 2018, title: "Expansion & Renovation", description: "Expanded our dining space and introduced a new seasonal menu." },
  { year: 2022, title: "Community Farming Partnership", description: "Launched our 'Farm-to-Table' initiative, sourcing 90% of produce locally." },
];

const team = [
    { name: "Chef Nasir", role: "Executive Chef", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop", twitter: "#", linkedin: "#" },
    { name: "Ayesha Khan", role: "Pastry Chef", image: "https://images.unsplash.com/photo-1622395392348-16d7a2f5f3e0?q=80&w=1887&auto=format&fit=crop", twitter: "#", linkedin: "#" },
    { name: "Ahmed Raza", role: "Sous Chef", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1887&auto=format&fit=crop", twitter: "#", linkedin: "#" },
];

// --- Sub-components for a clean structure ---

const StatCard = ({ icon, end, label, suffix }) => (
  <motion.div 
    className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg text-center"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-4xl font-extrabold text-orange-500">
      <CountUp end={end} duration={3} enableScrollSpy />{suffix}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
  </motion.div>
);

const TimelineItem = ({ year, title, description, isLast }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-1 h-4 w-4 bg-orange-500 rounded-full border-4 border-white dark:border-slate-900"></div>
    {!isLast && <div className="absolute left-[7px] top-6 h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm font-semibold text-orange-500">{year}</p>
      <h4 className="font-bold text-slate-800 dark:text-white mt-1">{title}</h4>
      <p className="text-slate-600 dark:text-slate-300 mt-1">{description}</p>
    </motion.div>
  </div>
);

const TeamMemberCard = ({ name, role, image, twitter, linkedin }) => (
    <motion.div 
        className="text-center group"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
    >
        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-slate-800">
            <img src={image} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"/>
        </div>
        <h4 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">{name}</h4>
        <p className="text-orange-500 font-medium">{role}</p>
        <div className="flex justify-center space-x-4 mt-2 text-slate-400">
            <a href={twitter} className="hover:text-orange-500 transition-colors"><FaTwitter /></a>
            <a href={linkedin} className="hover:text-orange-500 transition-colors"><FaLinkedin /></a>
        </div>
    </motion.div>
);

// --- The Main About Component ---
const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative bg-slate-800 text-white text-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img src={story.imageUrl} alt="background" className="w-full h-full object-cover opacity-20"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">About Food Villa</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            From a family dream to a culinary landmark. Discover our story.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Our Story & Mission Section */}
        <section className="grid md:grid-cols-5 gap-12 items-center">
            <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                <img src={story.imageUrl} alt={story.imageAlt} className="rounded-xl shadow-2xl w-full h-auto"/>
            </motion.div>
            <div className="md:col-span-3">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{story.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">{story.paragraphs[0]}</p>
                <blockquote className="border-l-4 border-orange-500 pl-6 italic text-slate-700 dark:text-slate-200">
                  <FaQuoteLeft className="text-orange-500/50 mb-2" />
                  {story.paragraphs[1]}
                </blockquote>
            </div>
        </section>

        {/* Impact Section with Stats */}
        <section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <StatCard icon={<FaUserFriends className="w-10 h-10 text-orange-500"/>} end={50000} suffix="+" label="Happy Customers Served" />
                <StatCard icon={<FaTrophy className="w-10 h-10 text-orange-500"/>} end={12} label="Culinary Awards Won" />
                <StatCard icon={<FaLeaf className="w-10 h-10 text-orange-500"/>} end={90} suffix="%" label="Ingredients Sourced Locally" />
            </div>
        </section>

        {/* Our Journey Timeline Section */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Our Journey Through Time</h2>
                <div className="space-y-8">
                    {timeline.map((item, index) => (
                        <TimelineItem key={item.year} {...item} isLast={index === timeline.length - 1} />
                    ))}
                </div>
            </div>
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Meet the Minds in the Kitchen</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {team.map(member => <TeamMemberCard key={member.name} {...member} />)}
                </div>
            </motion.div>
        </section>
      </div>
    </div>
  );
};

export default About;