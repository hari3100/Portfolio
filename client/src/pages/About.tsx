import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Award, Briefcase, Database, Cloud, Code, Brain } from 'lucide-react';
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
    <section className="py-20 bg-gray-50 dark:bg-gray-800 mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              About Me
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI Engineer with over 1.5 years of experience developing practical, production-ready AI solutions using large language models, retrieval systems, and conversational interfaces.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Personal Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Background</h3>
                    <ScrollArea className="h-64 pr-4">
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          AI Engineer with over 1.5 years of experience developing practical, production-ready AI solutions using large language models, retrieval systems, and conversational interfaces. Experienced in building secure, scalable systems for real-world use cases, including voice-driven applications and HIPAA-compliant data workflows.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Skilled in integrating cloud technologies and automation tools to deliver end-to-end solutions that are both efficient and adaptable. Strong background in developing AI-powered solutions that solve complex business problems.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Specializing in building intelligent systems that automate workflows, enhance decision-making processes, and provide innovative solutions for healthcare, automation, and enterprise applications.
                        </p>
                        <div className="pt-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Strengths:</h4>
                          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <li>• Effective Communication</li>
                            <li>• Problem Solving abilities</li>
                            <li>• Teamwork</li>
                            <li>• Critical Thinking</li>
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Skills Grid */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                    <ScrollArea className="h-64 pr-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(skillsByCategory).map(([category, categorySkills], index) => {
                          const IconComponent = getIconForCategory(category);
                          return (
                            <motion.div
                              key={category}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                            >
                              <div className="flex items-center mb-2">
                                <IconComponent className="w-5 h-5 text-primary mr-2" />
                                <h4 className="font-semibold text-primary">{category}</h4>
                              </div>
                              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                {(categorySkills as Skill[]).map((skill: Skill) => (
                                  <li key={skill.id}>{skill.name}</li>
                                ))}
                              </ul>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
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
    </section>
  );
}
