import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Blog } from '@shared/schema';

// Category colors for different blog categories
const getCategoryColor = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('machine learning') || titleLower.includes('ml') || titleLower.includes('ai')) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
  }
  if (titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('devops')) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
  }
  if (titleLower.includes('data') || titleLower.includes('analysis')) {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
  }
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
};

export function Blog() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['/api/blogs'],
  });

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              Blog
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sharing insights about AI engineering, voice assistants, RAG systems, and cutting-edge AI solutions.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(blogs as Blog[] | undefined)?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleBlogClick(post.url)}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="relative">
                      <img
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-black/50 rounded-full p-2">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getCategoryColor(post.title)}>
                          Blog Post
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 flex-grow">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.description || 'Click to read more about this blog post.'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          External Link
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )) || []}
            </div>
          )}
          
          {blogs && (blogs as Blog[]).length > 6 && (
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
                View All Posts
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
