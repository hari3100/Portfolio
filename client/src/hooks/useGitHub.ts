import { useQuery } from '@tanstack/react-query';
import type { GitHubRepo } from '@/types';

export function useGitHubRepos(username: string) {
  return useQuery<GitHubRepo[]>({
    queryKey: ['/api/github/repos', username],
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
