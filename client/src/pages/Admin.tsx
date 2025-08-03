import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { AdminModal } from '@/components/AdminModal';
import { Plus, Edit, Trash2, Save, Eye, Settings, Link, Calendar, BookOpen, Mail, Github, Linkedin } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Certification, Skill, LinkedinPost, Project, Blog, ContactInfo, Education, SelectedProject } from '@shared/schema';

export function Admin() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingLinkedinPost, setEditingLinkedinPost] = useState<LinkedinPost | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [githubUsername, setGithubUsername] = useState('hari3100');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const { toast } = useToast();

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    url: '',
    description: '',
    imageUrl: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });

  // Contact info form state
  const [contactForm, setContactForm] = useState({
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    phoneNumber: '',
    location: ''
  });

  // LinkedIn post form state
  const [linkedinForm, setLinkedinForm] = useState({
    url: '',
    content: '',
    imageUrl: '',
    featured: false
  });
  


  // Education form state
  const [educationForm, setEducationForm] = useState({
    courseName: '',
    collegeName: '',
    startMonth: '',
    startYear: new Date().getFullYear(),
    endMonth: '',
    endYear: new Date().getFullYear(),
    status: 'completed'
  });

  // Queries
  const { data: blogs } = useQuery({
    queryKey: ['/api/blogs'],
    enabled: isAdminAuthenticated
  });

  const { data: contactInfo } = useQuery({
    queryKey: ['/api/contact-info'],
    enabled: isAdminAuthenticated
  });

  const { data: linkedinPosts } = useQuery({
    queryKey: ['/api/linkedin-posts'],
    enabled: isAdminAuthenticated
  });

  const { data: education } = useQuery({
    queryKey: ['/api/education'],
    enabled: isAdminAuthenticated
  });

  const { data: selectedProjects } = useQuery({
    queryKey: ['/api/selected-projects'],
    enabled: isAdminAuthenticated
  });

  // Mutations
  const createBlogMutation = useMutation({
    mutationFn: (blog: typeof blogForm) => apiRequest('POST', '/api/blogs', blog, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setBlogForm({
        title: '',
        url: '',
        description: '',
        imageUrl: '',
        publishedAt: new Date().toISOString().split('T')[0]
      });
      toast({ title: "Success", description: "Blog added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add blog", variant: "destructive" });
    }
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Blog> }) => {
      const token = localStorage.getItem('adminToken');
      return apiRequest('PUT', `/api/blogs/${id}`, data, { 'Authorization': `Bearer ${token}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setEditingBlog(null);
      toast({ title: "Success", description: "Blog updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update blog", variant: "destructive" });
    }
  });

  const updateLinkedinPostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LinkedinPost> }) => {
      const token = localStorage.getItem('adminToken');
      return apiRequest('PUT', `/api/linkedin-posts/${id}`, data, { 'Authorization': `Bearer ${token}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/linkedin-posts'] });
      setEditingLinkedinPost(null);
      toast({ title: "Success", description: "LinkedIn post updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update LinkedIn post", variant: "destructive" });
    }
  });

  const updateContactInfoMutation = useMutation({
    mutationFn: (info: typeof contactForm) => {
      const token = localStorage.getItem('adminToken');
      // Get the contact info ID if it exists, otherwise use endpoint without ID  
      const existingInfo = contactInfo as ContactInfo | undefined;
      const endpoint = existingInfo ? `/api/contact-info/${existingInfo.id}` : '/api/contact-info';
      const method = existingInfo ? 'PUT' : 'POST';
      return apiRequest(method, endpoint, info, { 'Authorization': `Bearer ${token}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact-info'] });
      toast({ title: "Success", description: "Contact info updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update contact info", variant: "destructive" });
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/blogs/${id}`, undefined, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({ title: "Success", description: "Blog deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
    }
  });

  const createLinkedinPostMutation = useMutation({
    mutationFn: (post: typeof linkedinForm) => {
      const apiData = {
        title: post.content.substring(0, 100), // Use first part of content as title
        content: post.content,
        postUrl: post.url,
        imageUrl: post.imageUrl || null,
        featured: post.featured,
        publishedAt: new Date().toISOString()
      };
      return apiRequest('POST', '/api/linkedin-posts', apiData, { 'Authorization': 'Bearer admin123' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/linkedin-posts'] });
      setLinkedinForm({
        url: '',
        content: '',
        imageUrl: '',
        featured: false
      });
      toast({ title: "Success", description: "LinkedIn post added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add LinkedIn post", variant: "destructive" });
    }
  });

  const deleteLinkedinPostMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/linkedin-posts/${id}`, undefined, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/linkedin-posts'] });
      toast({ title: "Success", description: "LinkedIn post deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete LinkedIn post", variant: "destructive" });
    }
  });

  // Education mutations
  const createEducationMutation = useMutation({
    mutationFn: (education: typeof educationForm) => apiRequest('POST', '/api/education', education, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
      setEducationForm({
        courseName: '',
        collegeName: '',
        startMonth: '',
        startYear: new Date().getFullYear(),
        endMonth: '',
        endYear: new Date().getFullYear(),
        status: 'completed'
      });
      toast({ title: "Success", description: "Education added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add education", variant: "destructive" });
    }
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Education> }) => 
      apiRequest('PUT', `/api/education/${id}`, data, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
      setEditingEducation(null);
      toast({ title: "Success", description: "Education updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update education", variant: "destructive" });
    }
  });

  const deleteEducationMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/education/${id}`, undefined, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
      toast({ title: "Success", description: "Education deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete education", variant: "destructive" });
    }
  });

  // Selected Project mutations
  const createSelectedProjectMutation = useMutation({
    mutationFn: (project: any) => apiRequest('POST', '/api/selected-projects', project, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selected-projects'] });
      toast({ title: "Success", description: "Project added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add project", variant: "destructive" });
    }
  });

  const updateSelectedProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/selected-projects/${id}`, data, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selected-projects'] });
      toast({ title: "Success", description: "Project updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project", variant: "destructive" });
    }
  });

  const deleteSelectedProjectMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/selected-projects/${id}`, undefined, { 'Authorization': 'Bearer admin123' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selected-projects'] });
      toast({ title: "Success", description: "Project deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'admin123') {
      setIsAdminAuthenticated(true);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Load contact info when authenticated
  useEffect(() => {
    if (contactInfo) {
      const info = contactInfo as ContactInfo;
      setContactForm({
        email: info.email || '',
        linkedinUrl: info.linkedinUrl || '',
        githubUrl: info.githubUrl || '',
        phoneNumber: info.phoneNumber || '',
        location: info.location || ''
      });
    }
  }, [contactInfo]);

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBlogMutation.mutate(blogForm);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfoMutation.mutate(contactForm);
  };

  const handleDeleteBlog = (id: number) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlogMutation.mutate(id);
    }
  };

  const handleLinkedinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLinkedinPostMutation.mutate(linkedinForm);
    
    // Reset form after successful submission
    setLinkedinForm({ url: '', content: '', imageUrl: '', featured: false });
  };

  const handleDeleteLinkedinPost = (id: number) => {
    if (confirm('Are you sure you want to delete this LinkedIn post?')) {
      deleteLinkedinPostMutation.mutate(id);
    }
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEducation) {
      updateEducationMutation.mutate({ id: editingEducation.id, data: educationForm });
    } else {
      createEducationMutation.mutate(educationForm);
    }
  };

  const handleDeleteEducation = (id: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      deleteEducationMutation.mutate(id);
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setEducationForm({
      courseName: edu.courseName,
      collegeName: edu.collegeName,
      startMonth: edu.startMonth,
      startYear: edu.startYear,
      endMonth: edu.endMonth,
      endYear: edu.endYear,
      status: edu.status
    });
  };

  const fetchGithubRepos = async () => {
    if (!githubUsername.trim()) {
      toast({ title: "Error", description: "Please enter a GitHub username", variant: "destructive" });
      return;
    }

    setLoadingRepos(true);
    try {
      const response = await fetch(`/api/github/repos/${githubUsername}`);
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const repos = await response.json();
      setGithubRepos(repos);
      toast({ title: "Success", description: `Found ${repos.length} repositories` });
    } catch (error) {
      console.error('Error fetching repos:', error);
      toast({ title: "Error", description: "Failed to fetch repositories", variant: "destructive" });
    } finally {
      setLoadingRepos(false);
    }
  };

  const addProjectToSelected = (repo: any) => {
    const projectData = {
      githubRepoId: repo.id,
      name: repo.name,
      description: repo.description || '',
      htmlUrl: repo.html_url,
      language: repo.language || '',
      stargazersCount: repo.stargazers_count || 0,
      forksCount: repo.forks_count || 0,
      isSelected: true,
      featured: false
    };
    createSelectedProjectMutation.mutate(projectData);
  };

  const handleDeleteSelectedProject = (id: number) => {
    if (confirm('Are you sure you want to remove this project from selection?')) {
      deleteSelectedProjectMutation.mutate(id);
    }
  };

  const toggleProjectFeatured = (project: SelectedProject) => {
    updateSelectedProjectMutation.mutate({
      id: project.id,
      data: { featured: !project.featured }
    });
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please authenticate to access the admin panel
            </p>
            <Button onClick={() => setShowAuthModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Login as Admin
            </Button>
          </CardContent>
        </Card>
        
        <AdminModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Portfolio Admin Panel
            </h1>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAdminAuthenticated(false);
                setShowAuthModal(true);
              }}
            >
              Logout
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your portfolio content, blogs, and contact information
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Posts</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Blog Management Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Blog */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Blog Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Blog Title</Label>
                      <Input
                        id="title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        placeholder="Enter blog title"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">Blog URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={blogForm.url}
                        onChange={(e) => setBlogForm({...blogForm, url: e.target.value})}
                        placeholder="https://example.com/blog-post"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={blogForm.description}
                        onChange={(e) => setBlogForm({...blogForm, description: e.target.value})}
                        placeholder="Brief description of the blog post"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={blogForm.imageUrl}
                        onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="publishedAt">Publication Date</Label>
                      <Input
                        id="publishedAt"
                        type="date"
                        value={blogForm.publishedAt}
                        onChange={(e) => setBlogForm({...blogForm, publishedAt: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={createBlogMutation.isPending} className="w-full">
                      {createBlogMutation.isPending ? 'Adding...' : 'Add Blog Post'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Existing Blog Posts ({(blogs as Blog[] | undefined)?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(blogs as Blog[] | undefined)?.map((blog) => (
                      <div key={blog.id} className="border rounded-lg p-4 space-y-2">
                        {editingBlog?.id === blog.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingBlog.title}
                              onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                              placeholder="Blog title"
                            />
                            <Input
                              value={editingBlog.url}
                              onChange={(e) => setEditingBlog({...editingBlog, url: e.target.value})}
                              placeholder="Blog URL"
                            />
                            <Textarea
                              value={editingBlog.description || ''}
                              onChange={(e) => setEditingBlog({...editingBlog, description: e.target.value})}
                              placeholder="Description"
                              rows={2}
                            />
                            <Input
                              value={editingBlog.imageUrl || ''}
                              onChange={(e) => setEditingBlog({...editingBlog, imageUrl: e.target.value})}
                              placeholder="Image URL"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateBlogMutation.mutate({ id: blog.id, data: editingBlog })}
                                disabled={updateBlogMutation.isPending}
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingBlog(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-sm">{blog.title}</h4>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingBlog(blog)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  disabled={deleteBlogMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {blog.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(blog.publishedAt).toLocaleDateString()}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(blog.url, '_blank')}
                              >
                                <Link className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )) || (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No blog posts yet. Add your first blog post!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    {editingEducation ? 'Edit Education' : 'Add New Education'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEducationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={educationForm.courseName}
                        onChange={(e) => setEducationForm({...educationForm, courseName: e.target.value})}
                        placeholder="Master of Computer Applications (AI)"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="collegeName">College/Institution Name</Label>
                      <Input
                        id="collegeName"
                        value={educationForm.collegeName}
                        onChange={(e) => setEducationForm({...educationForm, collegeName: e.target.value})}
                        placeholder="JAIN UNIVERSITY – ONLINE"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startMonth">Start Month</Label>
                        <Input
                          id="startMonth"
                          value={educationForm.startMonth}
                          onChange={(e) => setEducationForm({...educationForm, startMonth: e.target.value})}
                          placeholder="Jul"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="startYear">Start Year</Label>
                        <Input
                          id="startYear"
                          type="number"
                          value={educationForm.startYear}
                          onChange={(e) => setEducationForm({...educationForm, startYear: parseInt(e.target.value)})}
                          placeholder="2024"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="endMonth">End Month</Label>
                        <Input
                          id="endMonth"
                          value={educationForm.endMonth}
                          onChange={(e) => setEducationForm({...educationForm, endMonth: e.target.value})}
                          placeholder="Jul"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endYear">End Year</Label>
                        <Input
                          id="endYear"
                          type="number"
                          value={educationForm.endYear}
                          onChange={(e) => setEducationForm({...educationForm, endYear: parseInt(e.target.value)})}
                          placeholder="2026"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={educationForm.status}
                        onChange={(e) => setEducationForm({...educationForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="completed">Completed</option>
                        <option value="in progress">In Progress</option>
                        <option value="to begin">To Begin</option>
                        <option value="dropped off">Dropped Off</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={createEducationMutation.isPending || updateEducationMutation.isPending}>
                        {editingEducation ? 'Update Education' : 'Add Education'}
                      </Button>
                      {editingEducation && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingEducation(null);
                            setEducationForm({
                              courseName: '',
                              collegeName: '',
                              startMonth: '',
                              startYear: new Date().getFullYear(),
                              endMonth: '',
                              endYear: new Date().getFullYear(),
                              status: 'completed'
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Education List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Current Education Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(education as Education[])?.map((edu) => (
                      <div key={edu.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {edu.courseName}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {edu.collegeName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}
                            </p>
                            <Badge 
                              variant={edu.status === 'completed' ? 'default' : 
                                      edu.status === 'in progress' ? 'secondary' : 
                                      edu.status === 'to begin' ? 'outline' : 'destructive'}
                            >
                              {edu.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEducation(edu)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEducation(edu.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No education entries yet. Add your first education!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* GitHub Repository Fetcher */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Github className="w-5 h-5 mr-2" />
                    Fetch GitHub Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="githubUsername">GitHub Username</Label>
                      <Input
                        id="githubUsername"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="Enter GitHub username"
                        onKeyDown={(e) => e.key === 'Enter' && fetchGithubRepos()}
                      />
                    </div>
                    <Button onClick={fetchGithubRepos} disabled={loadingRepos}>
                      {loadingRepos ? 'Fetching...' : 'Fetch Repositories'}
                    </Button>
                    
                    {githubRepos.length > 0 && (
                      <div className="mt-4 max-h-80 overflow-y-auto space-y-2 w-full">
                        <h4 className="font-semibold">Available Repositories ({githubRepos.length})</h4>
                        <div className="space-y-2">
                          {githubRepos.map((repo) => {
                            const isAlreadySelected = (selectedProjects as SelectedProject[])?.some(
                              p => p.githubRepoId === repo.id
                            );
                            return (
                              <div key={repo.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <p className="font-medium text-sm text-gray-900 dark:text-white break-words">
                                    {repo.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {repo.language && `${repo.language} • `}⭐ {repo.stargazers_count} • 🍴 {repo.forks_count}
                                  </p>
                                  {repo.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 break-words">
                                      {repo.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant={isAlreadySelected ? "secondary" : "default"}
                                    onClick={() => addProjectToSelected(repo)}
                                    disabled={isAlreadySelected || createSelectedProjectMutation.isPending}
                                  >
                                    {isAlreadySelected ? 'Added' : 'Add'}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Projects Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Selected Projects ({(selectedProjects as SelectedProject[])?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(selectedProjects as SelectedProject[])?.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {project.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {project.description || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {project.language} • ⭐ {project.stargazersCount} • 🍴 {project.forksCount}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={project.featured ? 'default' : 'outline'}>
                                {project.featured ? 'Featured' : 'Standard'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(project.htmlUrl, '_blank')}
                              >
                                <Link className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleProjectFeatured(project)}
                              disabled={updateSelectedProjectMutation.isPending}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSelectedProject(project.id)}
                              disabled={deleteSelectedProjectMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No projects selected yet. Fetch repositories from GitHub to add projects.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Email for Contact Form:</strong> Messages will be sent to: {contactForm.email || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address (Contact Form Destination)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="linkedin" className="flex items-center">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={contactForm.linkedinUrl}
                        onChange={(e) => setContactForm({...contactForm, linkedinUrl: e.target.value})}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="github" className="flex items-center">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        value={contactForm.githubUrl}
                        onChange={(e) => setContactForm({...contactForm, githubUrl: e.target.value})}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={contactForm.phoneNumber}
                        onChange={(e) => setContactForm({...contactForm, phoneNumber: e.target.value})}
                        placeholder="+1-234-567-8900"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        value={contactForm.location}
                        onChange={(e) => setContactForm({...contactForm, location: e.target.value})}
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={updateContactInfoMutation.isPending} className="w-full">
                    {updateContactInfoMutation.isPending ? 'Updating...' : 'Update Contact Information'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LinkedIn Posts Tab */}
          <TabsContent value="linkedin" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New LinkedIn Post */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add LinkedIn Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLinkedinSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Post URL</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        value={linkedinForm.url}
                        onChange={(e) => setLinkedinForm({...linkedinForm, url: e.target.value})}
                        placeholder="https://linkedin.com/posts/..."
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="linkedinContent">Post Content</Label>
                      <Textarea
                        id="linkedinContent"
                        value={linkedinForm.content}
                        onChange={(e) => setLinkedinForm({...linkedinForm, content: e.target.value})}
                        placeholder="Brief description or excerpt of the post"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="linkedinImageUrl">Image URL (Optional)</Label>
                      <Input
                        id="linkedinImageUrl"
                        type="url"
                        value={linkedinForm.imageUrl}
                        onChange={(e) => setLinkedinForm({...linkedinForm, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="linkedinFeatured"
                        checked={linkedinForm.featured}
                        onCheckedChange={(checked) => setLinkedinForm({...linkedinForm, featured: checked})}
                      />
                      <Label htmlFor="linkedinFeatured">Feature on Home Page</Label>
                    </div>
                    
                    <Button type="submit" disabled={createLinkedinPostMutation.isPending} className="w-full">
                      {createLinkedinPostMutation.isPending ? 'Adding...' : 'Add LinkedIn Post'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing LinkedIn Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn Posts ({(linkedinPosts as LinkedinPost[] | undefined)?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(linkedinPosts as LinkedinPost[] | undefined)?.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4 space-y-2">
                        {editingLinkedinPost?.id === post.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editingLinkedinPost.content}
                              onChange={(e) => setEditingLinkedinPost({...editingLinkedinPost, content: e.target.value})}
                              placeholder="Post content"
                              rows={3}
                            />
                            <Input
                              value={editingLinkedinPost.postUrl}
                              onChange={(e) => setEditingLinkedinPost({...editingLinkedinPost, postUrl: e.target.value})}
                              placeholder="LinkedIn post URL"
                            />
                            <Input
                              value={editingLinkedinPost.imageUrl || ''}
                              onChange={(e) => setEditingLinkedinPost({...editingLinkedinPost, imageUrl: e.target.value})}
                              placeholder="Image URL (optional)"
                            />
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editingLinkedinPost.featured || false}
                                onCheckedChange={(checked) => setEditingLinkedinPost({...editingLinkedinPost, featured: checked})}
                              />
                              <Label>Feature on Home Page</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateLinkedinPostMutation.mutate({ id: post.id, data: editingLinkedinPost })}
                                disabled={updateLinkedinPostMutation.isPending}
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingLinkedinPost(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              {post.imageUrl && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                                  {post.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {post.featured && (
                                  <Badge variant="secondary" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                                {post.imageUrl && (
                                  <Badge variant="outline" className="text-xs">
                                    Has Image
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(post.postUrl, '_blank')}
                                >
                                  <Link className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingLinkedinPost(post)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteLinkedinPost(post.id)}
                                  disabled={deleteLinkedinPostMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )) || (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No LinkedIn posts yet. Add your first post!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SkillsManager() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    logoUrl: '',
    featured: false
  });
  const { toast } = useToast();

  const { data: skills, refetch } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  const handleCreateSkill = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest('POST', '/api/skills', newSkill, {
        'Authorization': `Bearer ${token}`
      });
      
      setNewSkill({ name: '', category: '', logoUrl: '', featured: false });
      refetch();
      toast({ title: "Success", description: "Skill created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create skill", variant: "destructive" });
    }
  };

  const handleUpdateSkill = async (skill: Skill) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required", variant: "destructive" });
        return;
      }
      
      await apiRequest('PUT', `/api/skills/${skill.id}`, skill, {
        'Authorization': `Bearer ${token}`
      });
      
      setEditingSkill(null);
      refetch();
      toast({ title: "Success", description: "Skill updated successfully" });
    } catch (error) {
      console.error('Update skill error:', error);
      toast({ title: "Error", description: "Failed to update skill", variant: "destructive" });
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required", variant: "destructive" });
        return;
      }
      
      await apiRequest('DELETE', `/api/skills/${skillId}`, null, {
        'Authorization': `Bearer ${token}`
      });
      
      refetch();
      toast({ title: "Success", description: "Skill deleted successfully" });
    } catch (error) {
      console.error('Delete skill error:', error);
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Skill
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., Python, React, AWS"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                placeholder="e.g., programming, ml, cloud"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={newSkill.logoUrl}
              onChange={(e) => setNewSkill({ ...newSkill, logoUrl: e.target.value })}
              placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={newSkill.featured}
              onCheckedChange={(featured) => setNewSkill({ ...newSkill, featured })}
            />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
          <Button onClick={handleCreateSkill} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills?.map((skill) => (
          <Card key={skill.id} className="relative">
            <CardContent className="p-4">
              {editingSkill?.id === skill.id ? (
                <div className="space-y-3">
                  <Input
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    placeholder="Skill name"
                  />
                  <Input
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    placeholder="Category"
                  />
                  <Input
                    value={editingSkill.logoUrl || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, logoUrl: e.target.value })}
                    placeholder="Logo URL"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingSkill.featured || false}
                      onCheckedChange={(featured) => setEditingSkill({ ...editingSkill, featured })}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateSkill(editingSkill)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {skill.logoUrl && (
                      <img src={skill.logoUrl} alt={skill.name} className="w-6 h-6" />
                    )}
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    </div>
                  </div>
                  {skill.featured && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary text-white rounded">
                      Featured
                    </span>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingSkill(skill)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CertificationsManager() {
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    year: '',
    imageUrl: '',
    description: '',
    featured: false
  });
  const { toast } = useToast();

  const { data: certifications, refetch } = useQuery<Certification[]>({
    queryKey: ['/api/certifications'],
  });

  const handleCreateCertification = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required", variant: "destructive" });
        return;
      }
      
      await apiRequest('POST', '/api/certifications', newCert, {
        'Authorization': `Bearer ${token}`
      });
      
      setNewCert({ title: '', issuer: '', year: '', imageUrl: '', description: '', featured: false });
      refetch();
      toast({ title: "Success", description: "Certification created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create certification", variant: "destructive" });
    }
  };

  const handleUpdateCertification = async (cert: Certification) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required", variant: "destructive" });
        return;
      }
      
      await apiRequest('PUT', `/api/certifications/${cert.id}`, cert, {
        'Authorization': `Bearer ${token}`
      });
      
      setEditingCert(null);
      refetch();
      toast({ title: "Success", description: "Certification updated successfully" });
    } catch (error) {
      console.error('Update certification error:', error);
      toast({ title: "Error", description: "Failed to update certification", variant: "destructive" });
    }
  };

  const handleDeleteCertification = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required", variant: "destructive" });
        return;
      }
      
      await apiRequest('DELETE', `/api/certifications/${id}`, undefined, {
        'Authorization': `Bearer ${token}`
      });
      
      refetch();
      toast({ title: "Success", description: "Certification deleted successfully" });
    } catch (error) {
      console.error('Delete certification error:', error);
      toast({ title: "Error", description: "Failed to delete certification", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Certification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                placeholder="AWS Certified Machine Learning - Specialty"
              />
            </div>
            <div>
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                placeholder="2024"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newCert.imageUrl}
                onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                placeholder="https://images.credly.com/..."
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCert.description}
              onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
              placeholder="Brief description of the certification"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={newCert.featured}
              onCheckedChange={(featured) => setNewCert({ ...newCert, featured })}
            />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
          <Button onClick={handleCreateCertification} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {certifications?.map((cert) => (
          <Card key={cert.id} className="relative">
            <CardContent className="p-6">
              {editingCert?.id === cert.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    placeholder="Certification title"
                  />
                  <Input
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="Issuer"
                  />
                  <Input
                    value={editingCert.year}
                    onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                    placeholder="Year"
                  />
                  <Input
                    value={editingCert.imageUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                    placeholder="Image URL"
                  />
                  <Textarea
                    value={editingCert.description || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingCert.featured || false}
                      onCheckedChange={(featured) => setEditingCert({ ...editingCert, featured })}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateCertification(editingCert)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCert(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {cert.imageUrl && (
                      <img 
                        src={cert.imageUrl} 
                        alt={cert.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{cert.title}</h3>
                      <p className="text-primary font-medium">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">{cert.year}</p>
                      {cert.description && (
                        <p className="text-sm text-gray-600 mt-2">{cert.description}</p>
                      )}
                      {cert.featured && (
                        <span className="inline-block px-2 py-1 text-xs bg-primary text-white rounded mt-2">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingCert(cert)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteCertification(cert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LinkedinPostsManager() {
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postUrl: '',
    imageUrl: '',
    likes: 0,
    comments: 0,
    featured: false,
    publishedAt: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const { data: posts, refetch } = useQuery<LinkedinPost[]>({
    queryKey: ['/api/linkedin-posts'],
  });

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const postData = {
        ...newPost,
        publishedAt: new Date(newPost.publishedAt)
      };
      
      await apiRequest('POST', '/api/linkedin-posts', postData, {
        'Authorization': `Bearer ${token}`
      });
      
      setNewPost({ 
        title: '', 
        content: '', 
        postUrl: '', 
        imageUrl: '', 
        likes: 0, 
        comments: 0, 
        featured: false,
        publishedAt: new Date().toISOString().split('T')[0]
      });
      refetch();
      toast({ title: "Success", description: "LinkedIn post created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create LinkedIn post", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New LinkedIn Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Exciting ML Project Completion"
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share your professional update..."
              rows={4}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postUrl">LinkedIn Post URL</Label>
              <Input
                id="postUrl"
                value={newPost.postUrl}
                onChange={(e) => setNewPost({ ...newPost, postUrl: e.target.value })}
                placeholder="https://linkedin.com/posts/..."
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                value={newPost.likes}
                onChange={(e) => setNewPost({ ...newPost, likes: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                type="number"
                value={newPost.comments}
                onChange={(e) => setNewPost({ ...newPost, comments: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="date"
                value={newPost.publishedAt}
                onChange={(e) => setNewPost({ ...newPost, publishedAt: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={newPost.featured}
              onCheckedChange={(featured) => setNewPost({ ...newPost, featured })}
            />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
          <Button onClick={handleCreatePost} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add LinkedIn Post
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
                {post.featured && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Featured
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectsManager() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            GitHub Projects (Auto-synced)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your projects are automatically synced from GitHub. You can enhance them with custom descriptions and media through the project detail modals.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.map((project) => (
              <Card key={project.id} className="p-4">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                {project.featured && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary text-white rounded">
                    Featured
                  </span>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}