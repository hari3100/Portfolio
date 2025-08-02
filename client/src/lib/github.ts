import type { GitHubRepo } from '@/types';

export function categorizeRepo(repo: GitHubRepo): string {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics || [];
  
  // Check for ML/AI keywords
  const mlKeywords = ['machine-learning', 'ml', 'ai', 'neural', 'tensorflow', 'pytorch', 'sklearn', 'deep-learning'];
  if (mlKeywords.some(keyword => 
    name.includes(keyword) || 
    description.includes(keyword) || 
    topics.includes(keyword)
  )) {
    return 'ml';
  }
  
  // Check for data analysis keywords
  const dataKeywords = ['data', 'analysis', 'analytics', 'pandas', 'numpy', 'visualization', 'sql'];
  if (dataKeywords.some(keyword => 
    name.includes(keyword) || 
    description.includes(keyword) || 
    topics.includes(keyword)
  )) {
    return 'data';
  }
  
  // Check for web development keywords
  const webKeywords = ['web', 'react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'frontend', 'backend'];
  if (webKeywords.some(keyword => 
    name.includes(keyword) || 
    description.includes(keyword) || 
    topics.includes(keyword) ||
    repo.language?.toLowerCase().includes(keyword)
  )) {
    return 'web';
  }
  
  return 'other';
}

export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Shell': '#89e051',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
  };
  
  return colors[language || ''] || '#6b7280';
}

export function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}
