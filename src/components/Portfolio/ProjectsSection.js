import { motion } from 'framer-motion';

const projects = [
  {
    title: "3D Product Visualizer",
    tech: "Three.js, React, WebGL",
    description: "Interactive 3D product customizer with realistic materials",
    link: "#"
  },
  {
    title: "AI Music Generator",
    tech: "TensorFlow.js, Web Audio API",
    description: "Browser-based music composition tool using AI",
    link: "#"
  },
  {
    title: "Crypto Dashboard",
    tech: "Next.js, Chart.js, API Integration",
    description: "Real-time cryptocurrency tracking with advanced analytics",
    link: "#"
  }
];

const ProjectsSection = ({ isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-green-400 tracking-wider">PROJECTS.js</h2>
      
      <div className={`${isMobile ? "space-y-4" : "space-y-6"}`}>
        {projects.map((project, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="border border-green-600 p-4 hover:bg-green-900/20 transition-colors"
          >
            <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-green-300`}>{project.title}</h3>
            <p className="text-green-500 text-sm">{project.tech}</p>
            <p className={`mt-2 text-green-400 ${isMobile ? "text-sm" : ""}`}>{project.description}</p>
            <a href={project.link} className="inline-block mt-2 text-green-300 underline">View Project_</a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;