import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AboutSection = ({ isMobile }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const codeLines = [
    "class Developer {",
    "  constructor() {",
    "    this.name = \"Dhruv Bhatnagar\";",
    "    this.role = \"Full Stack Developer\";",
    "    this.languages = [\"JavaScript\", \"TypeScript\", \"Python\", \"C#\"];",
    "    this.interests = [\"WebGL\", \"Game Dev\", \"UI Design\"];",
    "    this.experience = 5; // years",
    "  }",
    "",
    "  sayHello() {",
    "    console.log(\"Welcome to my portfolio!\");",
    "    return true;",
    "  }",
    "}"
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleLines < codeLines.length) {
        setVisibleLines(prevLines => prevLines + 1);
      }
    }, 150);
    
    return () => clearTimeout(timer);
  }, [visibleLines, codeLines.length]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="h-full"
    >
      <h2 className="text-3xl font-bold mb-6 text-green-400 tracking-wider">ABOUT.ME</h2>
      <div className="space-y-4 text-green-300 leading-relaxed">
        <p>{'>'} Frontend developer with 5 years of experience</p>
        <p>{'>'} Passionate about creative coding and interactive experiences</p>
        <p>{'>'} Background in game development and UI design</p>
        <p>{'>'} Currently focused on building immersive web experiences</p>
      </div>
      
      <div className="mt-8 border border-green-600 p-4 bg-black/50 relative overflow-hidden">
        {/* Terminal header */}
        <div className="absolute top-0 left-0 right-0 bg-green-900/50 text-green-300 text-xs px-2 py-1 flex justify-between">
          <span>developer.js</span>
          <span className={isMobile ? "hidden" : "opacity-60"}>/* initializing profile */</span>
        </div>
        
        <pre className={`text-xs text-green-400 pt-6 font-mono ${isMobile ? "text-[0.65rem] overflow-x-auto" : ""}`}>
          {/* Code lines with conditional rendering for mobile */}
          {codeLines.slice(0, visibleLines).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Hide line numbers on mobile */}
              {!isMobile && <span className="text-green-600 opacity-50 mr-2">{index + 1}</span>}
              {/* Truncate long lines on mobile */}
              {isMobile && line.length > 30 ? line.substring(0, 28) + "..." : line}
              {index === visibleLines - 1 && (
                <motion.span 
                  className="inline-block w-2 h-4 bg-green-400 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                ></motion.span>
              )}
            </motion.div>
          ))}
        </pre>
      </div>
    </motion.div>
  );
};

export default AboutSection;