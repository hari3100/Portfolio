import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { AdminModal } from '@/components/AdminModal';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { GitHubRepo } from '@/types';
import type { SelectedProject } from '@shared/schema';

export function Projects() {
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(6);

  const { data: selectedProjects, isLoading, error } = useQuery({
    queryKey: ['/api/selected-projects']
  });

  // Sort projects: featured first, then by display order, then by name
  const sortedProjects = (selectedProjects as SelectedProject[])?.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.displayOrder !== null && b.displayOrder !== null) {
      return a.displayOrder - b.displayOrder;
    }
    return a.name.localeCompare(b.name);
  }) || [];

  const displayedProjects = sortedProjects.slice(0, visibleProjects);
  const hasMoreProjects = sortedProjects.length > visibleProjects;

  const handleShowMore = (project: SelectedProject) => {
    // Convert SelectedProject to GitHubRepo format for modal compatibility
    const repoData = {
      id: project.githubRepoId,
      name: project.name,
      description: project.description,
      html_url: project.htmlUrl,
      homepage: null,
      language: project.language,
      stargazers_count: project.stargazersCount || 0,
      forks_count: project.forksCount || 0,
      updated_at: project.createdAt?.toISOString() || new Date().toISOString(),
      topics: []
    };
    setSelectedRepo(repoData);
    setIsModalOpen(true);
  };

  const handleLoadMore = () => {
    setVisibleProjects(prev => prev + 6);
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
              A curated showcase of my latest work in data science, machine learning, and software development. 
              Selected projects from my GitHub repositories.
            </p>
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
                {displayedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard repo={{
                      id: project.githubRepoId,
                      name: project.name,
                      description: project.description,
                      html_url: project.htmlUrl,
                      homepage: null,
                      language: project.language,
                      stargazers_count: project.stargazersCount || 0,
                      forks_count: project.forksCount || 0,
                      updated_at: project.createdAt?.toISOString() || new Date().toISOString(),
                      topics: []
                    }} onShowMore={() => handleShowMore(project)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!isLoading && displayedProjects.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No projects have been selected yet. Check back soon for updates!
              </p>
            </motion.div>
          )}
          
          {/* Load More Button */}
          {!isLoading && hasMoreProjects && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg"
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Load More Projects ({sortedProjects.length - visibleProjects} remaining)
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
