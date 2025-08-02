import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, ExternalLink, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GitHubRepo } from '@/types';
import { getLanguageColor, formatLastUpdated } from '@/lib/github';

interface ProjectModalProps {
  repo: GitHubRepo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ repo, isOpen, onClose }: ProjectModalProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  if (!repo) return null;

  const defaultImage = `https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`;

  const handleAdminUpload = () => {
    // This would trigger the admin authentication modal
    // For now, just toggle admin state
    setIsAdmin(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{repo.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="relative">
            <img
              src={defaultImage}
              alt={`${repo.name} project detail`}
              className="w-full h-80 object-cover rounded-xl"
            />
            
            {isAdmin && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4"
              >
                <Button onClick={handleAdminUpload} size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-3">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {repo.description || 'No description available for this project.'}
                </p>
              </div>
              
              {repo.topics && repo.topics.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Project Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Stars</span>
                    <span className="font-semibold">{repo.stargazers_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Forks</span>
                    <span className="font-semibold">{repo.forks_count}</span>
                  </div>
                  {repo.language && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Language</span>
                      <div className="flex items-center space-x-2">
                        <span 
                          className="inline-block w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span className="font-semibold">{repo.language}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                    <span className="font-semibold">{formatLastUpdated(repo.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
                {repo.homepage && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
