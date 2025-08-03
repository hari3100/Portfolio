import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Award, Briefcase, Database, Cloud, Code, Brain, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Skill, Certification, Education } from '@shared/schema';

const getIconForCategory = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('programming')) return Code;
  if (categoryLower.includes('ml') || categoryLower.includes('ai')) return Brain;
  if (categoryLower.includes('cloud') || categoryLower.includes('devops')) return Cloud;
  if (categoryLower.includes('database') || categoryLower.includes('tools')) return Database;
  return Code;
};

const careerSteps = [
  {
    title: 'Data Engineer',
    company: 'CrossAsyst Infotech',
    period: 'MAY 2024 – Present',
    description: 'Designed 15+ AI solutions (voice assistants, chatbots, automated workflows) for enterprise clients, ensuring alignment with business goals through regular stakeholder collaboration. Built HIPAA-compliant FHIR data processing pipeline for clinical data achieving 93%+ patient eligibility accuracy on 500+ records in ~15s. Implemented multi-level Retrieval-Augmented Generation (RAG) for ICD-10 medical coding.',
    achievements: [
      'Developed voice-based AI assistant handling 20 to 30 calls/day',
      'Mentored a team of 5 developers',
      'Guided architectural decisions for scalable AI systems'
    ]
  },
  {
    title: 'AI R&D Intern',
    company: 'Incrify ai',
    period: 'Dec 2023 – Jan 2024',
    description: 'Worked in the R&D department specializing in AI solutions. Contributed to the development of impactful projects including Audio and Video Analysis for emotional cue extraction and AI course Builder system.',
    achievements: [
      'Audio and Video Analysis: Spearheaded emotional analysis using advanced algorithms',
      'AI course Builder: Developed system for generating comprehensive courses',
      'Collaborated with cross-functional teams to integrate AI features'
    ]
  }
];



export function About() {
  const { data: skills } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: certifications } = useQuery({
    queryKey: ['/api/certifications'],
  });

  const { data: education } = useQuery({
    queryKey: ['/api/education'],
  });

  // Group skills by category
  const skillsByCategory = (skills as Skill[] | undefined)?.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 border border-primary/10 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                <span className="text-sm font-medium text-primary">About Me</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
                Passionate About AI Innovation
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Transforming complex challenges into intelligent solutions through cutting-edge 
                machine learning, deep learning, and cloud technologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20 py-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Journey</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
              Experience & Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              With over 1.5 years of specialized experience, I focus on developing production-ready AI solutions 
              using large language models, retrieval systems, and conversational interfaces that solve real-world challenges.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Enhanced Personal Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <Card className="card-hover glass-card border-0 overflow-hidden h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        Professional Background
                      </h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          AI Engineer with over 1.5 years of experience developing practical, production-ready AI solutions 
                          using large language models, retrieval systems, and conversational interfaces.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Experienced in building secure, scalable systems for real-world use cases, including voice-driven 
                          applications and HIPAA-compliant data workflows that serve thousands of users.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Skilled in integrating cloud technologies and automation tools to deliver end-to-end solutions 
                          that are both efficient and adaptable for enterprise applications.
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t border-border/50">
                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Core Strengths
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {['Effective Communication', 'Problem Solving', 'Team Leadership', 'Critical Thinking'].map((strength, index) => (
                            <motion.div
                              key={strength}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="text-sm font-medium text-foreground">{strength}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Enhanced Skills Grid */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <Card className="card-hover glass-card border-0 overflow-hidden h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        Technical Expertise
                      </h3>
                    </div>
                    
                    <div className="space-y-6">
                      {Object.entries(skillsByCategory).map(([category, categorySkills], index) => {
                        const IconComponent = getIconForCategory(category);
                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="p-4 rounded-lg glass-card border border-primary/10 hover:border-primary/20 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <IconComponent className="w-4 h-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-foreground">{category}</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(categorySkills as Skill[]).map((skill: Skill) => (
                                <motion.span
                                  key={skill.id}
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 py-1 text-xs font-medium bg-primary/5 text-primary rounded-full border border-primary/10 hover:border-primary/20 transition-all duration-300"
                                >
                                  {skill.name}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Timeline */}
            <div className="space-y-8">
              {/* Certifications */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Education & Certifications</h3>
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-6">
                        {/* Education Section */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2" />
                            Education
                          </h4>
                          {(education as Education[] | undefined)?.map((edu, index) => (
                            <motion.div
                              key={edu.id}
                              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {edu.courseName}
                                </h5>
                                <p className="text-primary text-sm">{edu.collegeName}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  {edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear} • {edu.status}
                                </p>
                              </div>
                            </motion.div>
                          )) || (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                              No education entries available
                            </p>
                          )}
                        </div>

                        {/* Certifications Section */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Certifications
                          </h4>
                          {(certifications as Certification[] | undefined)?.slice(0, 3).map((cert: Certification, index: number) => (
                            <motion.div
                              key={cert.id}
                              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {cert.title}
                                </h5>
                                <p className="text-primary text-sm">{cert.issuer}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{cert.year}</p>
                                {cert.description && (
                                  <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                    {cert.description}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                          {(certifications as Certification[] | undefined) && (certifications as Certification[]).length > 3 && (
                            <div className="text-center mt-4">
                              <Badge variant="outline" className="text-primary">
                                +{(certifications as Certification[]).length - 3} more certifications
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Career Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Career Journey</h3>
                    <ScrollArea className="h-96 pr-4">
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary" />
                        
                        <div className="space-y-8">
                          {careerSteps.map((step, index) => (
                            <motion.div
                              key={step.title}
                              className="relative flex items-start space-x-4"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.2 }}
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center relative z-10">
                                <Briefcase className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {step.title}
                                </h4>
                                <p className="text-primary text-sm mb-1">{step.company}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                  {step.period}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                  {step.description}
                                </p>
                                {step.achievements && (
                                  <div className="mt-2">
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                      Key Achievements:
                                    </h5>
                                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                                      {step.achievements.map((achievement, i) => (
                                        <li key={i}>• {achievement}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
