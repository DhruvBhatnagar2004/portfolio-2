import { motion } from 'framer-motion';
import { useState } from 'react';

const skills = [
  { 
    category: "Frontend", 
    items: ["JavaScript", "React", "Next.js", "Three.js", "HTML/CSS", "Framer Motion"] 
  },
  { 
    category: "Backend", 
    items: ["Node.js", "Express", "MongoDB", "Firebase"] 
  },
  { 
    category: "Design", 
    items: ["Figma", "Photoshop", "Pixel Art", "3D Modeling"] 
  },
  { 
    category: "Other", 
    items: ["Git", "WebGL", "Shader Programming", "Game Development"] 
  }
];

const skillMetrics = [
  { name: "Problem Solving", percentage: 85, color: "green" },
  { name: "Creative Coding", percentage: 90, color: "blue" },
  { name: "Team Collaboration", percentage: 80, color: "purple" },
  { name: "Learning Speed", percentage: 95, color: "orange" },
  { name: "Debugging", percentage: 88, color: "red" }
];

const SkillsSection = ({ isMobile }) => {
  const [animateMetrics, setAnimateMetrics] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      onAnimationComplete={() => {
        setTimeout(() => setAnimateMetrics(true), 500);
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-green-400 tracking-wider">SKILLS.exe</h2>
      
      <div className={`${isMobile ? "space-y-4" : "space-y-6"}`}>
        {skills.map((category, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3 className="text-xl font-bold text-green-300 mb-2">_{category.category}</h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill, skillIndex) => (
                <span 
                  key={skillIndex} 
                  className={`${isMobile ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"} border border-green-500 text-green-400`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-8 border border-green-600 p-4 bg-black/50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Terminal header with simplified display on mobile */}
        <div className="absolute top-0 left-0 right-0 bg-green-900/50 text-green-300 text-xs px-2 py-1 flex justify-between">
          <span>skill-analyzer.exe</span>
          <span className={isMobile ? "hidden" : "opacity-60"}>scanning...</span>
        </div>
        
        <div className={`${isMobile ? "pt-4 space-y-2" : "pt-6 space-y-4"} font-mono`}>
          {/* Simplified metrics display for mobile */}
          <div className="flex items-center space-x-2 text-xs text-green-400">
            <motion.div 
              className="inline-block w-3 h-3 bg-green-500"
              animate={{ opacity: [1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
            ></motion.div>
            <span>{isMobile ? "[SYS] Analyzing..." : "[SYSTEM] Analyzing developer proficiency..."}</span>
          </div>
          
          {skillMetrics.map((skill, index) => (
            <div key={index} className={`${isMobile ? "space-y-0.5" : "space-y-1"}`}>
              <div className="flex justify-between text-xs">
                <span className="text-green-300">{skill.name}:</span>
                <motion.span 
                  className="text-yellow-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animateMetrics ? 1 : 0 }}
                  transition={{ delay: 0.5 + index * 0.3 }}
                >
                  {skill.percentage}%
                </motion.span>
              </div>
              
              <div className="h-2 bg-green-900/30 w-full rounded-sm overflow-hidden">
                <motion.div 
                  className={`h-full ${getBarColor(skill.color)}`}
                  initial={{ width: "0%" }}
                  animate={{ width: animateMetrics ? `${skill.percentage}%` : "0%" }}
                  transition={{ delay: 0.5 + index * 0.3, duration: 1.2, ease: "easeOut" }}
                ></motion.div>
              </div>
              
              {/* Only show ASCII bars on desktop */}
              {!isMobile && (
                <motion.div 
                  className="text-xs font-mono text-green-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animateMetrics ? 1 : 0 }}
                  transition={{ delay: 0.5 + index * 0.3, duration: 0.3 }}
                >
                  [{renderProgressBar(skill.percentage)}]
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

function getBarColor(color) {
  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500"
  };
  return colors[color] || colors.green;
}

function renderProgressBar(percentage) {
  const barLength = 20;
  const filledSegments = Math.floor((percentage / 100) * barLength);
  const emptySegments = barLength - filledSegments;
  
  return (
    '█'.repeat(filledSegments) + '░'.repeat(emptySegments)
  );
}

export default SkillsSection;