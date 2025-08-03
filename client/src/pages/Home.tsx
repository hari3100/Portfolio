import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Mail, ChevronDown, Award, ExternalLink, Sparkles, Code, Brain, Database } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ParticleBackground } from '@/components/ParticleBackground';
import type { Certification, Skill, LinkedinPost } from '@shared/schema';

export function Home() {
  const { data: featuredSkills } = useQuery<Skill[]>({
    queryKey: ['/api/skills/featured'],
  });

  const { data: featuredCertifications } = useQuery<Certification[]>({
    queryKey: ['/api/certifications/featured'],
  });

  const { data: featuredLinkedinPosts } = useQuery<LinkedinPost[]>({
    queryKey: ['/api/linkedin-posts/featured'],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 dark:from-background dark:via-primary/10 dark:to-secondary/10" />
        
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Flowing Energy Elements - Inspired by the uploaded ethereal image */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96"
        >
          <div className="relative w-full h-full">
            {/* Flowing streams */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/30 to-primary/20 rounded-full blur-3xl"
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-4 bg-gradient-to-l from-secondary/15 via-primary/25 to-secondary/15 rounded-full blur-2xl"
              animate={{
                rotate: [360, 180, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ 
            rotate: [0, -360],
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80"
        >
          <div className="relative w-full h-full">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/30 to-secondary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-8 bg-gradient-to-tl from-primary/15 via-secondary/25 to-primary/15 rounded-full blur-2xl"
              animate={{
                scale: [1.3, 1, 1.3],
                rotate: [0, 90, 180]
              }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>
        </motion.div>
        
        {/* Flowing Accent Lines */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-px opacity-20"
          animate={{
            scaleX: [0, 1, 0],
            x: ['-100%', '0%', '100%']
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 right-0 w-px h-64 opacity-20"
          animate={{
            scaleY: [0, 1, 0],
            y: ['-100%', '0%', '100%']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="w-full h-full bg-gradient-to-b from-transparent via-secondary to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Redesigned Hero Title - More Elegant and Flowing */}
              <motion.div 
                className="relative mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Elegant greeting */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-4"
                >
                  <motion.span 
                    className="text-3xl md:text-4xl font-medium text-foreground/70 tracking-wide"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Hello, I'm
                  </motion.span>
                </motion.div>
                
                {/* Main name with flowing animation */}
                <motion.div className="relative">
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <motion.span
                      className="gradient-text inline-block"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      Harikrishnan
                    </motion.span>
                    <br />
                    <motion.span
                      className="gradient-text inline-block"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                      }}
                      transition={{ 
                        delay: 0.8, 
                        duration: 0.6,
                        backgroundPosition: {
                          duration: 8, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }
                      }}
                    >
                      Nair
                    </motion.span>
                  </motion.h1>
                  
                  {/* Intergalactic Time Loom - Branching Lines */}
                  <motion.div className="absolute -bottom-6 left-0 right-0 h-px">
                    {/* Main central line */}
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                    >
                      <motion.div
                        className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                        animate={{ 
                          opacity: [0.3, 1, 0.3],
                          scaleX: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                    
                    {/* Left branching lines - Made bigger and more visible */}
                    <motion.div
                      className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/80 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: -25 }}
                      transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-secondary/60 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: -45 }}
                      transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 w-0.5 h-5 bg-gradient-to-b from-primary/50 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: -15 }}
                      transition={{ delay: 2.2, duration: 0.4, ease: "easeOut" }}
                    />
                    
                    {/* Right branching lines - Made bigger and more visible */}
                    <motion.div
                      className="absolute top-0 right-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/80 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: 25 }}
                      transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 right-1/2 w-0.5 h-8 bg-gradient-to-b from-secondary/60 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: 45 }}
                      transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 right-1/2 w-0.5 h-5 bg-gradient-to-b from-primary/50 to-transparent origin-bottom"
                      initial={{ scaleY: 0, rotate: 0 }}
                      animate={{ scaleY: 1, rotate: 15 }}
                      transition={{ delay: 2.2, duration: 0.4, ease: "easeOut" }}
                    />
                    

                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Building next-generation intelligent systems with Python, Deep Learning, and Cloud Computing. 
                  Transforming complex data into actionable insights and scalable AI solutions.
                </p>
              </motion.div>
              
              {/* Enhanced Skill Tags */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {featuredSkills?.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="glass-card px-6 py-3 cursor-pointer group hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        {skill.logoUrl ? (
                          <img 
                            src={skill.logoUrl} 
                            alt={skill.name}
                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded bg-gradient-to-r from-primary to-secondary opacity-80" />
                        )}
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Enhanced CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Link href="/projects">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="btn-primary px-8 py-4 text-white shadow-2xl hover:shadow-primary/25 group relative"
                    >
                      <Rocket className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                      <span className="font-semibold">Explore Projects</span>
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </motion.div>
                </Link>
                
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass-card px-8 py-4 border-primary/30 hover:border-primary hover:bg-primary/5 group relative"
                    >
                      <Mail className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                      <span className="font-semibold">Get In Touch</span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </motion.div>
      </section>

      {/* Enhanced Certifications Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 border border-primary/10 rounded-full"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Achievements</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Certifications & Professional Recognition
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional certifications that validate expertise in artificial intelligence, 
              data science, and cloud technologies.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredCertifications?.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="card-hover glass-card border-0 overflow-hidden h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <motion.div 
                        className="flex-shrink-0 relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        {cert.imageUrl ? (
                          <div className="relative">
                            <img 
                              src={cert.imageUrl} 
                              alt={cert.title}
                              className="w-20 h-20 rounded-xl object-cover shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                            <Award className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {cert.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold text-primary">{cert.issuer}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{cert.year}</span>
                        </div>
                        {cert.description && (
                          <p className="text-muted-foreground leading-relaxed">
                            {cert.description}
                          </p>
                        )}
                        
                        {/* Achievement badge */}
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          <Sparkles className="w-4 h-4" />
                          <span>Certified</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced LinkedIn Posts Section */}
      <section className="py-24 bg-background relative">
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <SiLinkedin className="w-5 h-5 text-[#0077B5]" />
              <span className="text-sm font-medium text-primary">LinkedIn Activity</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Professional Insights & Updates
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay connected with my latest professional journey, insights, and project highlights 
              shared across my professional network.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredLinkedinPosts?.map((post, index) => {
              console.log('LinkedIn post data:', post);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="card-hover glass-card border-0 overflow-hidden h-full">
                    {post.imageUrl && (
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-56 object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-6 h-6 rounded bg-gradient-to-r from-[#0077B5] to-[#00A0DC] flex items-center justify-center">
                              <span className="text-xs font-bold">in</span>
                            </div>
                            <span className="text-sm font-medium">LinkedIn Post</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-8">
                      <h3 className="font-bold text-xl text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 group-hover:translate-x-1 transition-all duration-300"
                        >
                          <a href={post.postUrl} target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">View Post</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
