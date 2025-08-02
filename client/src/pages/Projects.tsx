import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { AdminModal } from '@/components/AdminModal';
import { useGitHubRepos } from '@/hooks/useGitHub';
import { categorizeRepo } from '@/lib/github';
import { Loader2 } from 'lucide-react';
import type { GitHubRepo } from '@/types';

const filters = [
  { id: 'all', label: 'All Projects', category: 'all' },
  { id: 'ml', label: 'Machine Learning', category: 'ml' },
  { id: 'web', label: 'Web Development', category: 'web' },
  { id: 'data', label: 'Data Analysis', category: 'data' },
];

export function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: repos, isLoading, error } = useGitHubRepos('hari3100');

  const filteredRepos = repos?.filter(repo => {
    if (selectedFilter === 'all') return true;
    return categorizeRepo(repo) === selectedFilter;
  }) || [];

  const handleShowMore = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepo(null);
  };

  const handleAdminAuthenticated = () => {
    setIsAdmin(true);
  };

  if (error) {
    return (
      <div className="py-20 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to fetch GitHub repositories. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900 mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A showcase of my latest work in data science, machine learning, and software development. 
              All projects are automatically synced from my GitHub repository.
            </p>
          </motion.div>
          
          {/* Project Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                className="transform hover:scale-105 transition-all duration-300"
              >
                {filter.label}
              </Button>
            ))}
          </motion.div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading projects...</span>
            </div>
          )}
          
          {/* Projects Grid */}
          {!isLoading && (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              <AnimatePresence>
                {filteredRepos.map((repo) => (
                  <motion.div
                    key={repo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard repo={repo} onShowMore={handleShowMore} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!isLoading && filteredRepos.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No projects found for the selected filter.
              </p>
            </motion.div>
          )}
          
          {/* Load More Button */}
          {!isLoading && filteredRepos.length > 0 && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Load More Projects
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Project Modal */}
      <ProjectModal
        repo={selectedRepo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />
    </section>
  );
}
