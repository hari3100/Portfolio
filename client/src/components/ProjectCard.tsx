import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GitHubRepo } from '@/types';
import { getLanguageColor, formatLastUpdated } from '@/lib/github';

interface ProjectCardProps {
  repo: GitHubRepo;
  onShowMore: (repo: GitHubRepo) => void;
}

export function ProjectCard({ repo, onShowMore }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showcaseImageError, setShowcaseImageError] = useState(false);

  // Check if repo has a stored imageUrl (from database/storage)
  const storedImageUrl = repo.imageUrl;
  const showcaseImage = `https://raw.githubusercontent.com/${repo.owner?.login || 'hari3100'}/${repo.name}/main/showcase.png`;
  const defaultImage = `https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400`;

  // Priority: stored imageUrl > showcase.png > default image
  const getImageSrc = () => {
    if (storedImageUrl && !imageError) {
      return storedImageUrl;
    }
    if (!showcaseImageError) {
      return showcaseImage;
    }
    return defaultImage;
  };

  const hasCustomImage = () => {
    return (storedImageUrl && !imageError) || (!showcaseImageError && !storedImageUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <img
            src={getImageSrc()}
            alt={`${repo.name} project`}
            className="w-full h-48 object-cover"
            onError={() => {
              if (storedImageUrl && !imageError) {
                setImageError(true);
              } else if (!showcaseImageError) {
                setShowcaseImageError(true);
              }
            }}
          />
          {hasCustomImage() && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {storedImageUrl ? 'Showcase Image' : 'Custom Image'}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {repo.name}
            </h3>
            {repo.language && (
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-block w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {repo.language}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {repo.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center">
                <GitFork className="w-4 h-4 mr-1" />
                {repo.forks_count}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Updated {formatLastUpdated(repo.updated_at)}
            </span>
          </div>
          
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {repo.topics.slice(0, 3).map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{repo.topics.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => onShowMore(repo)}
              className="flex-1"
            >
              Show More
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
            >
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
