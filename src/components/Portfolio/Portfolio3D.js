import { useRef, useState, useEffect, Suspense, useLayoutEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float } from '@react-three/drei';
import { EffectComposer, Glitch, Noise, Bloom, Scanline, Pixelation, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction, Effect } from 'postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';

import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import { pressStart2P } from '@/utils/fonts';

// Add this responsive helper hook
const useResponsiveView = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    device: 'desktop'
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      
      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return viewport;
};

// ResponsiveWrapper component for 3D elements
const ResponsiveWrapper = ({ children }) => {
  const { viewport } = useThree();
  const { isMobile, isTablet } = useResponsiveView();
  
  // Scale based on device type
  const scaleFactor = isMobile ? 0.6 : isTablet ? 0.8 : 1;
  
  return (
    <group scale={[scaleFactor, scaleFactor, scaleFactor]}>
      {children}
    </group>
  );
};

// Menu item component
const MenuItem = ({ position, isActive, onClick, label, color, hoverColor, emissiveColor, hoverEmissiveColor, sectionId, isMobile }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const textRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Scale animation for active/hover state
      if (isActive) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.1, 0.1);
        if (textRef.current) textRef.current.material.color.lerp(new THREE.Color("#ffffff"), 0.1);
        if (glowRef.current) glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, 0.6, 0.1);
      } else if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.08, 0.1);
        if (textRef.current) textRef.current.material.color.lerp(new THREE.Color("#ccffcc"), 0.1);
        if (glowRef.current) glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, 0.4, 0.1);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.0, 0.1);
        if (textRef.current) textRef.current.material.color.lerp(new THREE.Color("#ffffff"), 0.1);
        if (glowRef.current) glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, 0, 0.1);
      }
    }
  });

  // Handle click with scroll behavior
  const handleClick = () => {
    onClick();
    
    // Improved scroll to section with better positioning
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        // Add a small delay to ensure state updates first
        setTimeout(() => {
          const yOffset = -20; // Small offset to account for any padding
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 10);
      }
    }
  };

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh 
        ref={glowRef} 
        position={[0, 0, -0.03]} 
        scale={[1.8, 0.4, 0.1]}
      >
        <planeGeometry />
        <meshBasicMaterial 
          color={isActive ? hoverEmissiveColor : emissiveColor} 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[isMobile ? 1.4 : 1.6, 0.4, 0.05]} />
        <meshStandardMaterial 
          color={isActive ? hoverColor : color}
          emissive={isActive ? hoverEmissiveColor : emissiveColor}
          emissiveIntensity={isActive ? 1.0 : 0.5}
          roughness={0.3}
          metalness={0.7}
        />
        
        <Text
          ref={textRef}
          position={[0, 0, 0.03]}
          fontSize={isMobile ? 0.11 : 0.13}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </mesh>
    </group>
  );
};

// Background elements for 3D scene
const BackgroundElements = ({ count = 20, positionOffset = [0, 0, 0], scale = 1 }) => {
  const boxesRef = useRef([]);
  
  useEffect(() => {
    boxesRef.current = Array(count).fill().map(() => ({
      position: [
        (Math.random() * 40 - 20) * scale + positionOffset[0],
        (Math.random() * 20 - 10) * scale + positionOffset[1],
        (Math.random() * -30 - 5) * scale + positionOffset[2]
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      speed: Math.random() * 0.2 + 0.1,
      size: Math.random() * 0.2 + 0.1
    }));
  }, [count, scale, positionOffset]);
  
  useFrame(() => {
    for (let i = 0; i < boxesRef.current.length; i++) {
      const box = boxesRef.current[i];
      box.position[2] += box.speed * 0.1;
      box.rotation[0] += 0.01;
      box.rotation[1] += 0.01;
      
      if (box.position[2] > 10) {
        box.position[0] = (Math.random() * 40 - 20) * scale + positionOffset[0];
        box.position[1] = (Math.random() * 20 - 10) * scale + positionOffset[1];
        box.position[2] = -30 * scale + positionOffset[2];
      }
    }
  });
  
  return (
    <>
      {boxesRef.current.map((box, i) => (
        <mesh 
          key={i}
          position={box.position || [0, 0, -10]}
          rotation={box.rotation || [0, 0, 0]}
          scale={[box.size, box.size, box.size]}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
};

// Intro scene
const IntroScene = ({ onStart }) => {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const instructionRef = useRef();
  const planeRef = useRef();
  const { viewport } = useThree();
  const responsiveView = useResponsiveView();
  const isMobile = responsiveView.isMobile;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (titleRef.current) {
      titleRef.current.material.opacity = Math.min(1, time * 0.5);
      titleRef.current.position.y = (isMobile ? 1.5 : 1) + Math.sin(time * 0.5) * 0.1;
    }
    
    if (subtitleRef.current) {
      subtitleRef.current.material.opacity = Math.min(1, Math.max(0, (time - 1) * 0.5));
      subtitleRef.current.position.y = (isMobile ? 0.5 : 0.3) + Math.sin(time * 0.5 + 0.5) * 0.05;
    }
    
    if (instructionRef.current) {
      const blinkRate = ((Math.sin(time * 2) + 1) / 2) * 0.5 + 0.5;
      instructionRef.current.material.opacity = Math.min(1, Math.max(0, (time - 2) * 0.5)) * blinkRate;
    }
    
    if (planeRef.current) {
      planeRef.current.rotation.z = Math.sin(time * 0.2) * 0.02;
    }
  });

  const handleClick = () => {
    onStart();
  };
  
  useEffect(() => {
    const handleKeyDown = () => {
      onStart();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, isMobile ? 14 : 10]} 
        fov={isMobile ? 70 : 50}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      <BackgroundElements count={isMobile ? 10 : 20} />
      
      <ResponsiveWrapper>
        <mesh 
          ref={planeRef} 
          position={[0, 0, -1]} 
          onClick={handleClick}
          scale={[25, 15, 1]} // Larger to ensure full coverage
        >
          <planeGeometry />
          <meshBasicMaterial color="#001100" />
        </mesh>
        
        <Text
          ref={titleRef}
          fontSize={isMobile ? 0.9 : 1}
          position={[0, isMobile ? 1.5 : 1, 0]}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          material-opacity={0}
          onClick={handleClick}
          maxWidth={isMobile ? 3.5 : 8}
        >
          THE PORTFOLIO
        </Text>
        
        <Text
          ref={subtitleRef}
          fontSize={isMobile ? 0.25 : 0.3}
          position={[0, isMobile ? 0.5 : 0.3, 0]}
          color="#00cc00"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          material-opacity={0}
          onClick={handleClick}
        >
          by Dhruv Bhatnagar
        </Text>
        
        <group position={[0, isMobile ? -0.8 : -1, 0]}>
          <Text
            ref={instructionRef}
            fontSize={isMobile ? 0.15 : 0.2}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-opacity={0}
            onClick={handleClick}
          >
            {isMobile ? "TAP ANYWHERE TO START" : "PRESS ANY BUTTON TO START"}
          </Text>
        </group>
      </ResponsiveWrapper>
      
      {/* Full-screen click target */}
      <mesh 
        position={[0, 0, 0.5]} 
        onClick={handleClick}
        scale={[40, 40, 1]}
      >
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
};

// Sidebar menu component
const SidebarMenu = ({ activeSection, setActiveSection, isOpen }) => {
  const menuGroupRef = useRef();
  const responsiveView = useResponsiveView();
  const isMobile = responsiveView.isMobile;
  
  // Menu items positioned vertically for sidebar
  const menuItems = [
    { id: 'about', label: 'ABOUT', position: [0, 1.5, 0], color: "#8833ff", hoverColor: "#00ff00", emissiveColor: "#221133", hoverEmissiveColor: "#005500" },
    { id: 'projects', label: 'PROJECTS', position: [0, 0.5, 0], color: "#ff3388", hoverColor: "#00ff00", emissiveColor: "#331122", hoverEmissiveColor: "#005500" },
    { id: 'skills', label: 'SKILLS', position: [0, -0.5, 0], color: "#33aaff", hoverColor: "#00ff00", emissiveColor: "#112233", hoverEmissiveColor: "#005500" },
    { id: 'contact', label: 'CONTACT', position: [0, -1.5, 0], color: "#33ff88", hoverColor: "#00ff00", emissiveColor: "#113322", hoverEmissiveColor: "#005500" }
  ];

  // Sidebar positioning animation - slide in/out with responsive values
  useFrame(() => {
    if (menuGroupRef.current) {
      // Target X position - account for different screen sizes
      const targetX = isOpen ? 0 : (isMobile ? -2.2 : -1.8);
      menuGroupRef.current.position.x = THREE.MathUtils.lerp(
        menuGroupRef.current.position.x,
        targetX,
        0.1
      );
    }
  });

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, isMobile ? 7 : 5]}
        fov={isMobile ? 70 : 50}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <BackgroundElements count={isMobile ? 10 : 20} />
      
      <ResponsiveWrapper>
        <group ref={menuGroupRef} position={[isMobile ? -2.2 : -1.8, 0, 0]}>
          {/* Sidebar background */}
          <mesh position={[0, 0, -0.1]} scale={[2, 5, 0.1]}>
            <planeGeometry />
            <meshBasicMaterial 
              color="#000900" 
              transparent 
              opacity={0.7} 
            />
          </mesh>
          
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              position={item.position}
              label={item.label}
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              color={item.color}
              hoverColor={item.hoverColor}
              emissiveColor={item.emissiveColor}
              hoverEmissiveColor={item.hoverEmissiveColor}
              sectionId={item.id}
              isMobile={isMobile}
            />
          ))}
        </group>
      </ResponsiveWrapper>
    </>
  );
};

// Scene switcher
const Scene = ({ activeSection, setActiveSection, introMode, onStartPortfolio, isSidebarOpen }) => {
  return introMode ? (
    <IntroScene onStart={onStartPortfolio} />
  ) : (
    <SidebarMenu 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      isOpen={isSidebarOpen}
    />
  );
};

// Main component with sidebar toggle
const Portfolio3D = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [pixelSize, setPixelSize] = useState(6);
  const [introMode, setIntroMode] = useState(true);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 10]);
  const [showEffects, setShowEffects] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [crackProgress, setCrackProgress] = useState(0);
  const responsiveView = useResponsiveView();
  const isMobile = responsiveView.isMobile;
  const isTablet = responsiveView.isTablet;

  // Improved section tracking with Intersection Observer
  useEffect(() => {
    // Configure the intersection observer
    const observerOptions = {
      root: null, // Use the viewport
      rootMargin: '0px',
      threshold: 0.2 // 20% of the element must be visible
    };
    
    // Create observer that updates active section based on visibility
    const observerCallback = (entries) => {
      // Track the most visible section
      let maxVisibility = 0;
      let mostVisibleSection = null;
      
      entries.forEach(entry => {
        // Calculate how much of the element is visible
        const visibleHeight = Math.min(
          entry.boundingClientRect.bottom, 
          window.innerHeight
        ) - Math.max(
          entry.boundingClientRect.top, 
          0
        );
        
        const visibilityRatio = visibleHeight / entry.boundingClientRect.height;
        
        if (entry.isIntersecting && visibilityRatio > maxVisibility) {
          maxVisibility = visibilityRatio;
          mostVisibleSection = entry.target.id;
        }
      });
      
      // Update the active section if we found a visible one
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
    };
    
    // Create and setup the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all section elements
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    // Cleanup
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Add this useEffect to ensure proper scroll behavior
  useEffect(() => {
    // Add CSS for better scroll behavior without changing the style
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 20px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Adjust camera position based on device size
  useEffect(() => {
    if (introMode) {
      setCameraPosition([0, 0, isMobile ? 14 : isTablet ? 12 : 10]);
    } else {
      setCameraPosition([0, 0, isMobile ? 7 : isTablet ? 6 : 5]);
    }
  }, [introMode, isMobile, isTablet]);

  // Handle start portfolio
  const handleStartPortfolio = () => {
    // Begin transition sequence
    setIsTransitioning(true);
    
    // Phase 1: Initial subtle glitches (suspense building)
    gsap.to({}, {
      duration: 1.2,
      onUpdate: () => {
        setGlitchIntensity(gsap.utils.random(0.1, 0.3) * (Math.random() > 0.8 ? 3 : 1));
      },
      onComplete: () => {
        // Phase 2: First serious glitch spike
        gsap.to({}, {
          duration: 0.2,
          onUpdate: () => {
            setGlitchIntensity(1.0);
          },
          onComplete: () => {
            // Phase 3: Brief calm before the storm
            gsap.to({}, {
              duration: 0.3,
              onUpdate: () => {
                setGlitchIntensity(0.2);
              },
              onComplete: () => {
                // Phase 4: Crack begins with intense glitching
                gsap.to({}, {
                  duration: 0.8,
                  onUpdate: function() {
                    setCrackProgress(this.progress());
                    setGlitchIntensity(0.8 + Math.random() * 0.5);
                  },
                  onComplete: () => {
                    // Phase 5: Peak horror moment - maximum glitch
                    gsap.to({}, {
                      duration: 0.4,
                      onUpdate: () => {
                        setGlitchIntensity(Math.random() > 0.5 ? 2.0 : 1.0);
                        // Flash effect
                        if (Math.random() > 0.7) {
                          document.documentElement.style.filter = 'invert(1)';
                          setTimeout(() => {
                            document.documentElement.style.filter = '';
                          }, 50);
                        }
                      },
                      onComplete: () => {
                        // Phase 6: System breach complete - fade out
                        gsap.to({}, {
                          duration: 0.8,
                          onUpdate: function() {
                            setGlitchIntensity(2.0 * (1 - this.progress()));
                            setCrackProgress(1.0 * (1 - this.progress()));
                          },
                          onComplete: () => {
                            // Complete transition
                            document.documentElement.style.filter = '';
                            setIntroMode(false);
                            setCameraPosition([0, 0, isMobile ? 7 : isTablet ? 6 : 5]);
                            setIsTransitioning(false);
                            setGlitchIntensity(0);
                            setCrackProgress(0);
                            setSidebarOpen(!isMobile); // Only auto-open on larger screens
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  // Gradually reduce pixelation for a smooth effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pixelSize > 2) {
        setPixelSize(prev => Math.max(2, prev - 0.5));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [pixelSize]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={`w-full min-h-screen relative ${pressStart2P.variable}`}>
      {/* Apply Press Start 2P font globally */}
      <style jsx global>{`
        body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, a {
          font-family: var(--font-press-start), monospace !important;
        }
        
        @media (max-width: 768px) {
          h2.text-3xl { font-size: 1.5rem; }
          h2.text-2xl { font-size: 1.25rem; }
          h3.text-xl { font-size: 1.1rem; }
          p, span, div { font-size: 0.9rem; }
          pre.text-xs { font-size: 0.65rem; line-height: 1.2; }
          .px-8 { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
      
      {/* 3D Scene - now positioned as sidebar */}
      <div className={`${introMode ? 'h-screen' : `h-screen fixed top-0 left-0 ${isMobile ? 'w-20' : 'w-36'} z-10`} transition-all ease-in-out duration-300`}>
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <Scene 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
              introMode={introMode}
              onStartPortfolio={handleStartPortfolio}
              isSidebarOpen={isSidebarOpen}
            />
            {!introMode && (
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                maxAzimuthAngle={Math.PI / 8}
                minAzimuthAngle={-Math.PI / 8}
              />
            )}
            
            {/* Post-processing effects */}
            <EffectComposer>
              {isTransitioning && (
                <TransitionEffects 
                  glitchIntensity={glitchIntensity}
                  crackProgress={crackProgress}
                />
              )}
              <Pixelation granularity={isTransitioning ? 8 : (isMobile ? 4 : pixelSize)} />
              <Scanline density={1.5} opacity={isMobile ? 0.1 : 0.15} />
              <Noise opacity={isTransitioning ? 0.3 : (isMobile ? 0.05 : 0.1)} />
              <Bloom luminanceThreshold={0.3} intensity={isTransitioning ? 1.2 : (isMobile ? 0.3 : 0.5)} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      
      {/* Sidebar toggle button */}
      {!introMode && (
        <button 
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-20 bg-black/80 border border-green-500 text-green-400 ${isMobile ? 'p-3' : 'p-2'} rounded hover:bg-black hover:text-green-300 transition-colors`}
          aria-label="Toggle sidebar menu"
        >
          {isSidebarOpen ? '<<' : '>>'}
        </button>
      )}
      
      {/* Content sections */}
      {!introMode && (
        <div className={`bg-black text-green-400 ${isSidebarOpen ? (isMobile ? 'ml-20' : 'ml-36') : 'ml-0'} transition-all ease-in-out duration-300`}>
          {/* About Section */}
          <section id="about" className="relative pt-16 pb-16 px-8 min-h-screen border-b border-green-800">
            <Canvas className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <SectionBackgroundElements section="about" />
            </Canvas>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-green-400">&gt; about.exe</h2>
              <div className="press-start-content">
                <AboutSection isMobile={isMobile} />
              </div>
            </div>
          </section>
          
          {/* Projects Section */}
          <section id="projects" className="relative pt-16 pb-16 px-8 min-h-screen border-b border-green-800">
            <Canvas className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <SectionBackgroundElements section="projects" />
            </Canvas>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-green-400">&gt; projects.exe</h2>
              <div className="press-start-content">
                <ProjectsSection isMobile={isMobile} />
              </div>
            </div>
          </section>
          
          {/* Skills Section */}
          <section id="skills" className="relative pt-16 pb-16 px-8 min-h-screen border-b border-green-800">
            <Canvas className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <SectionBackgroundElements section="skills" />
            </Canvas>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-green-400">&gt; skills.exe</h2>
              <div className="press-start-content">
                <SkillsSection isMobile={isMobile} />
              </div>
            </div>
          </section>
          
          {/* Contact Section */}
          <section id="contact" className="relative pt-16 pb-16 px-8 min-h-screen border-b border-green-800">
            <Canvas className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <SectionBackgroundElements section="contact" />
            </Canvas>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-2xl font-bold mb-6 text-green-400">&gt; contact.exe</h2>
              <div className="press-start-content">
                <ContactSection isMobile={isMobile} />
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="py-8 px-4 text-center text-green-400 border-t border-green-800">
            <div className="flex justify-center items-center gap-4 mb-4">
              <button 
                className="text-green-400 hover:text-green-200 transition-colors"
                onClick={() => setShowEffects(!showEffects)}
              >
                [fx: {showEffects ? 'on' : 'off'}]
              </button>
            </div>
            <p>© {new Date().getFullYear()} Dhruv Bhatnagar. All rights reserved.</p>
          </footer>
        </div>
      )}
      
      {/* Add the transitioning UI overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="glitch-overlay" style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,16,0,0.15) 0px, rgba(0,16,0,0.15) 1px, transparent 1px, transparent 2px)',
            mixBlendMode: 'overlay',
            opacity: glitchIntensity * 0.5
          }}></div>
          
          {crackProgress > 0.5 && (
            <div className="text-center">
              <h2 
                className="text-3xl text-green-500 mb-4 glitch-text"
                style={{
                  textShadow: `0 0 ${5 + crackProgress * 10}px #00ff00`,
                  opacity: crackProgress
                }}
              >
                SYSTEM BREACH DETECTED
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Create a more dramatic transition effect
const TransitionEffects = ({ glitchIntensity, crackProgress }) => {
  const [randomSeed, setRandomSeed] = useState(Math.random());
  
  // Update random seed periodically for more chaotic effects
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomSeed(Math.random());
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      {/* Multiple layers of glitch for more intensity */}
      <Glitch
        strength={glitchIntensity * 1.5} 
        mode={1}
        active={true}
        ratio={0.85}
        delay={[0.2, 0.4]}
      />
      {/* Second glitch layer with different timing */}
      <Glitch
        strength={glitchIntensity * (randomSeed > 0.5 ? 2.5 : 0.8)}
        mode={2}
        active={true}
        ratio={0.5}
        delay={[0.1, 0.2]}
      />
      {/* Heavy chromatic aberration for the "crack" effect */}
      <ChromaticAberration
        offset={new THREE.Vector2(
          crackProgress * 0.03 + (randomSeed * 0.01), 
          crackProgress * 0.02 - (randomSeed * 0.01)
        )} 
        blendFunction={BlendFunction.NORMAL}
        opacity={crackProgress * 1.5}
      />
      {/* Additional effects for more horror */}
      {crackProgress > 0.6 && (
        <Noise
          opacity={crackProgress * randomSeed}
          premultiply={true}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}
      {/* Intense bloom during peak moments */}
      {crackProgress > 0.7 && (
        <Bloom
          intensity={2 + (randomSeed * 3)}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      )}
    </>
  );
};

export default Portfolio3D;