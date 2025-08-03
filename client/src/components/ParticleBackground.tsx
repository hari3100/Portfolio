import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  originalSize: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const baseSize = Math.random() * 3 + 1.5;
      const maxLife = Math.random() * 300 + 200; // 200-500 frames lifespan
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: baseSize,
        originalSize: baseSize,
        opacity: Math.random() * 0.6 + 0.3,
        color: Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6',
        life: 0,
        maxLife: maxLife,
      };
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      // Cap particle count for performance, but ensure retina detection
      const devicePixelRatio = window.devicePixelRatio || 1;
      const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / (25000 / devicePixelRatio)));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
      
      particlesRef.current = particles;
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update lifespan
        particle.life += 1;
        
        // Remove and replace particles that have exceeded their lifespan
        if (particle.life >= particle.maxLife) {
          particles[i] = createParticle();
          continue;
        }
        
        // Add random movement for organic feel
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Cursor-based repulsion interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const repulseRadius = 120;
        if (distance < repulseRadius && distance > 0) {
          const force = (repulseRadius - distance) / repulseRadius;
          const repulseForce = force * force * 0.8; // Quadratic falloff for smooth repulsion
          
          // Repel particles away from cursor
          particle.vx -= (dx / distance) * repulseForce;
          particle.vy -= (dy / distance) * repulseForce;
          
          // Enhance visual feedback on hover
          const targetSize = particle.originalSize * (1 + force * 2);
          particle.size = particle.size + (targetSize - particle.size) * 0.1;
          
          const targetOpacity = Math.min(1, particle.opacity + force * 0.4);
          particle.opacity = particle.opacity + (targetOpacity - particle.opacity) * 0.1;
        } else {
          // Gradually return to original size and opacity
          particle.size = particle.size + (particle.originalSize - particle.size) * 0.05;
          const baseOpacity = 0.6 * (1 - particle.life / particle.maxLife) + 0.3;
          particle.opacity = particle.opacity + (baseOpacity - particle.opacity) * 0.02;
        }
        
        // Boundary handling with wrapping for continuous movement
        if (particle.x < -20) {
          particle.x = canvas.width + 20;
        } else if (particle.x > canvas.width + 20) {
          particle.x = -20;
        }
        
        if (particle.y < -20) {
          particle.y = canvas.height + 20;
        } else if (particle.y > canvas.height + 20) {
          particle.y = -20;
        }
        
        // Velocity damping to prevent excessive speeds
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Velocity limits
        const maxVelocity = 2;
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (vel > maxVelocity) {
          particle.vx = (particle.vx / vel) * maxVelocity;
          particle.vy = (particle.vy / vel) * maxVelocity;
        }
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      
      // Draw connections with brighter, more visible lines
      ctx.lineWidth = 1.2;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const maxConnectionDistance = 140;
          if (distance < maxConnectionDistance) {
            const opacity = (maxConnectionDistance - distance) / maxConnectionDistance * 0.25; // Increased from 0.1 to 0.25
            const avgOpacity = (particles[i].opacity + particles[j].opacity) / 2;
            const finalOpacity = opacity * avgOpacity;
            
            // Use gradient for more visual appeal
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${finalOpacity})`);
            gradient.addColorStop(0.5, `rgba(139, 92, 246, ${finalOpacity * 1.2})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${finalOpacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particles with enhanced glow and life-based fade
      particles.forEach((particle) => {
        const lifeProgress = particle.life / particle.maxLife;
        const lifeFade = 1 - Math.pow(lifeProgress, 2); // Quadratic fade for smoother transition
        
        ctx.globalAlpha = particle.opacity * lifeFade;
        
        // Enhanced glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 3;
        ctx.fillStyle = particle.color;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner bright core
        ctx.shadowBlur = particle.size;
        ctx.globalAlpha = particle.opacity * lifeFade * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow and alpha
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}