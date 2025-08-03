import { promises as fs } from 'fs';
import path from 'path';
import type { IStorage } from './storage';
import type { 
  User, InsertUser, Project, InsertProject, ContactMessage, InsertContactMessage,
  Certification, InsertCertification, LinkedinPost, InsertLinkedinPost,
  Skill, InsertSkill, Blog, InsertBlog, ContactInfo, InsertContactInfo,
  Education, InsertEducation, SelectedProject, InsertSelectedProject
} from '@shared/schema';

const DATA_DIR = path.join(process.cwd(), 'data');

export class FileStorage implements IStorage {
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    this.ensureDataDirectory();
    this.initializeDefaultFiles();
  }

  private async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  private async readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, return default value
      return defaultValue;
    }
  }

  private async writeJsonFile<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing to ${filename}:`, error);
    }
  }

  private async initializeDefaultFiles() {
    // Initialize contact info if it doesn't exist
    const contactInfo = await this.readJsonFile<ContactInfo | null>('contactInfo.json', null);
    if (!contactInfo) {
      const defaultContactInfo: ContactInfo = {
        id: 1,
        email: "harrinair2000@gmail.com",
        linkedinUrl: "https://linkedin.com/in/harikrishnan-nair",
        githubUrl: "https://github.com/hari3100",
        phoneNumber: "+91-9876543210",
        location: "Kerala, India",
        createdAt: new Date()
      };
      await this.writeJsonFile('contactInfo.json', defaultContactInfo);
    }

    // Initialize blogs if they don't exist
    const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
    if (blogs.length === 0) {
      const defaultBlogs: Blog[] = [
        {
          id: 1,
          title: "Building Voice-Driven AI Assistants with Advanced NLP",
          url: "https://medium.com/@harikrishnan/building-voice-ai-assistants",
          description: "A comprehensive guide to creating intelligent voice assistants using modern NLP techniques and speech recognition.",
          imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*8K4bwQQEjk_1vfN2K8yKHA.jpeg",
          publishedAt: new Date('2024-01-15'),
          featured: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Machine Learning Pipeline Optimization in Production",
          url: "https://dev.to/harikrishnan/ml-pipeline-optimization",
          description: "Best practices for optimizing machine learning pipelines for production environments.",
          imageUrl: "https://res.cloudinary.com/practicaldev/image/fetch/s--8K4bwQQE--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ml-pipeline.png",
          publishedAt: new Date('2024-02-01'),
          featured: true,
          createdAt: new Date()
        }
      ];
      await this.writeJsonFile('blogs.json', defaultBlogs);
    }

    // Initialize certifications if they don't exist
    const certifications = await this.readJsonFile<Certification[]>('certifications.json', []);
    if (certifications.length === 0) {
      const defaultCertifications: Certification[] = [
        {
          id: 1,
          title: "AWS Certified AI Practitioner (AIF-C01)",
          issuer: "AWS",
          year: "2024",
          imageUrl: "https://images.credly.com/size/220x220/images/778bde6c-ad1c-4312-ac33-2fa40d50a147/image.png",
          description: "AWS AI Practitioner certification demonstrating foundational knowledge of AI/ML services",
          featured: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Data Analysis with Python",
          issuer: "IBM",
          year: "2023",
          imageUrl: "https://images.credly.com/size/220x220/images/28944969-813a-43b9-944f-7910111ce764/Professional_Certificate_-_Data_Science.png",
          description: "IBM certification in data analysis using Python",
          featured: true,
          createdAt: new Date()
        }
      ];
      await this.writeJsonFile('certifications.json', defaultCertifications);
    }

    // Initialize skills if they don't exist
    const skills = await this.readJsonFile<Skill[]>('skills.json', []);
    if (skills.length === 0) {
      const defaultSkills: Skill[] = [
        {
          id: 1,
          name: "Python",
          category: "Programming",
          logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
          featured: true,
          createdAt: new Date()
        },
        {
          id: 2,
          name: "TensorFlow",
          category: "Machine Learning",
          logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
          featured: true,
          createdAt: new Date()
        },
        {
          id: 3,
          name: "AWS",
          category: "Cloud",
          logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
          featured: true,
          createdAt: new Date()
        }
      ];
      await this.writeJsonFile('skills.json', defaultSkills);
    }

    // Initialize empty arrays for other data types
    await this.readJsonFile('users.json', []);
    await this.readJsonFile('projects.json', []);
    await this.readJsonFile('contactMessages.json', []);
    await this.readJsonFile('linkedinPosts.json', []);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.readJsonFile<User[]>('users.json', []);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readJsonFile<User[]>('users.json', []);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.readJsonFile<User[]>('users.json', []);
    const newId = Math.max(0, ...users.map(u => u.id)) + 1;
    const user: User = {
      ...insertUser,
      id: newId
    };
    users.push(user);
    await this.writeJsonFile('users.json', users);
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await this.readJsonFile<Project[]>('projects.json', []);
  }

  async getProjectByGithubId(githubId: number): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find(project => project.githubId === githubId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const projects = await this.getProjects();
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    const project: Project = {
      ...insertProject,
      description: insertProject.description ?? null,
      imageUrl: insertProject.imageUrl ?? null,
      videoUrl: insertProject.videoUrl ?? null,
      category: insertProject.category ?? null,
      customDescription: insertProject.customDescription ?? null,
      featured: insertProject.featured ?? false,
      id: newId,
      createdAt: new Date()
    };
    projects.push(project);
    await this.writeJsonFile('projects.json', projects);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    projects[index] = { ...projects[index], ...updates };
    await this.writeJsonFile('projects.json', projects);
    return projects[index];
  }

  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const messages = await this.readJsonFile<ContactMessage[]>('contactMessages.json', []);
    const newId = Math.max(0, ...messages.map(m => m.id)) + 1;
    const message: ContactMessage = {
      ...insertMessage,
      id: newId,
      createdAt: new Date()
    };
    messages.push(message);
    await this.writeJsonFile('contactMessages.json', messages);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await this.readJsonFile<ContactMessage[]>('contactMessages.json', []);
  }

  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return await this.readJsonFile<Certification[]>('certifications.json', []);
  }

  async getFeaturedCertifications(): Promise<Certification[]> {
    const certifications = await this.getCertifications();
    return certifications.filter(cert => cert.featured);
  }

  async createCertification(insertCert: InsertCertification): Promise<Certification> {
    const certifications = await this.getCertifications();
    const newId = Math.max(0, ...certifications.map(c => c.id)) + 1;
    const certification: Certification = {
      ...insertCert,
      imageUrl: insertCert.imageUrl ?? null,
      description: insertCert.description ?? null,
      featured: insertCert.featured ?? false,
      id: newId,
      createdAt: new Date()
    };
    certifications.push(certification);
    await this.writeJsonFile('certifications.json', certifications);
    return certification;
  }

  async updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification | undefined> {
    const certifications = await this.getCertifications();
    const index = certifications.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    certifications[index] = { ...certifications[index], ...updates };
    await this.writeJsonFile('certifications.json', certifications);
    return certifications[index];
  }

  async deleteCertification(id: number): Promise<boolean> {
    const certifications = await this.getCertifications();
    const initialLength = certifications.length;
    const filtered = certifications.filter(c => c.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('certifications.json', filtered);
      return true;
    }
    return false;
  }

  async reorderCertifications(reorderedIds: number[]): Promise<boolean> {
    try {
      const certifications = await this.getCertifications();
      const reorderedCertifications = certifications.map(cert => {
        const newIndex = reorderedIds.indexOf(cert.id);
        return {
          ...cert,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('certifications.json', reorderedCertifications);
      return true;
    } catch (error) {
      console.error('Error reordering certifications:', error);
      return false;
    }
  }

  // LinkedIn Post methods
  async getLinkedinPosts(): Promise<LinkedinPost[]> {
    const posts = await this.readJsonFile<LinkedinPost[]>('linkedinPosts.json', []);
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getFeaturedLinkedinPosts(): Promise<LinkedinPost[]> {
    const posts = await this.getLinkedinPosts();
    return posts.filter(post => post.featured);
  }

  async createLinkedinPost(insertPost: InsertLinkedinPost): Promise<LinkedinPost> {
    const posts = await this.readJsonFile<LinkedinPost[]>('linkedinPosts.json', []);
    const newId = Math.max(0, ...posts.map(p => p.id)) + 1;
    const post: LinkedinPost = {
      ...insertPost,
      imageUrl: insertPost.imageUrl ?? null,
      likes: insertPost.likes ?? 0,
      comments: insertPost.comments ?? 0,
      featured: insertPost.featured ?? false,
      id: newId,
      createdAt: new Date()
    };
    posts.push(post);
    await this.writeJsonFile('linkedinPosts.json', posts);
    return post;
  }

  async updateLinkedinPost(id: number, updates: Partial<InsertLinkedinPost>): Promise<LinkedinPost | undefined> {
    const posts = await this.readJsonFile<LinkedinPost[]>('linkedinPosts.json', []);
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    posts[index] = { ...posts[index], ...updates };
    await this.writeJsonFile('linkedinPosts.json', posts);
    return posts[index];
  }

  async deleteLinkedinPost(id: number): Promise<boolean> {
    const posts = await this.readJsonFile<LinkedinPost[]>('linkedinPosts.json', []);
    const initialLength = posts.length;
    const filtered = posts.filter(p => p.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('linkedinPosts.json', filtered);
      return true;
    }
    return false;
  }

  async reorderLinkedinPosts(reorderedIds: number[]): Promise<boolean> {
    try {
      const posts = await this.readJsonFile<LinkedinPost[]>('linkedinPosts.json', []);
      const reorderedPosts = posts.map(post => {
        const newIndex = reorderedIds.indexOf(post.id);
        return {
          ...post,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('linkedinPosts.json', reorderedPosts);
      return true;
    } catch (error) {
      console.error('Error reordering LinkedIn posts:', error);
      return false;
    }
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await this.readJsonFile<Skill[]>('skills.json', []);
  }

  async getFeaturedSkills(): Promise<Skill[]> {
    const skills = await this.getSkills();
    return skills.filter(skill => skill.featured);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const skills = await this.getSkills();
    const newId = Math.max(0, ...skills.map(s => s.id)) + 1;
    const skill: Skill = {
      ...insertSkill,
      logoUrl: insertSkill.logoUrl ?? null,
      featured: insertSkill.featured ?? false,
      id: newId,
      createdAt: new Date()
    };
    skills.push(skill);
    await this.writeJsonFile('skills.json', skills);
    return skill;
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const skills = await this.getSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    skills[index] = { ...skills[index], ...updates };
    await this.writeJsonFile('skills.json', skills);
    return skills[index];
  }

  async deleteSkill(id: number): Promise<boolean> {
    const skills = await this.getSkills();
    const initialLength = skills.length;
    const filtered = skills.filter(s => s.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('skills.json', filtered);
      return true;
    }
    return false;
  }

  async reorderSkills(reorderedIds: number[]): Promise<boolean> {
    try {
      const skills = await this.getSkills();
      const reorderedSkills = skills.map(skill => {
        const newIndex = reorderedIds.indexOf(skill.id);
        return {
          ...skill,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('skills.json', reorderedSkills);
      return true;
    } catch (error) {
      console.error('Error reordering skills:', error);
      return false;
    }
  }

  // Blog methods
  async getBlogs(): Promise<Blog[]> {
    const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
    return blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getFeaturedBlogs(): Promise<Blog[]> {
    const blogs = await this.getBlogs();
    return blogs.filter(blog => blog.featured);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
    const newId = Math.max(0, ...blogs.map(b => b.id)) + 1;
    const blog: Blog = {
      ...insertBlog,
      description: insertBlog.description ?? null,
      imageUrl: insertBlog.imageUrl ?? null,
      featured: insertBlog.featured ?? false,
      id: newId,
      createdAt: new Date()
    };
    blogs.push(blog);
    await this.writeJsonFile('blogs.json', blogs);
    return blog;
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
    const index = blogs.findIndex(b => b.id === id);
    if (index === -1) return undefined;

    blogs[index] = { ...blogs[index], ...updates };
    await this.writeJsonFile('blogs.json', blogs);
    return blogs[index];
  }

  async deleteBlog(id: number): Promise<boolean> {
    const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
    const initialLength = blogs.length;
    const filtered = blogs.filter(b => b.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('blogs.json', filtered);
      return true;
    }
    return false;
  }

  async reorderBlogs(reorderedIds: number[]): Promise<boolean> {
    try {
      const blogs = await this.readJsonFile<Blog[]>('blogs.json', []);
      const reorderedBlogs = blogs.map(blog => {
        const newIndex = reorderedIds.indexOf(blog.id);
        return {
          ...blog,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('blogs.json', reorderedBlogs);
      return true;
    } catch (error) {
      console.error('Error reordering blogs:', error);
      return false;
    }
  }

  // Contact Info methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return await this.readJsonFile<ContactInfo | null>('contactInfo.json', null) || undefined;
  }

  async createContactInfo(insertContactInfo: InsertContactInfo): Promise<ContactInfo> {
    const contactInfo: ContactInfo = {
      ...insertContactInfo,
      linkedinUrl: insertContactInfo.linkedinUrl ?? null,
      githubUrl: insertContactInfo.githubUrl ?? null,
      phoneNumber: insertContactInfo.phoneNumber ?? null,
      location: insertContactInfo.location ?? null,
      id: 1,
      createdAt: new Date()
    };
    await this.writeJsonFile('contactInfo.json', contactInfo);
    return contactInfo;
  }

  async updateContactInfo(id: number, updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const contactInfo = await this.getContactInfo();
    if (!contactInfo || contactInfo.id !== id) return undefined;

    const updated = { ...contactInfo, ...updates };
    await this.writeJsonFile('contactInfo.json', updated);
    return updated;
  }

  // Education methods
  async getEducation(): Promise<Education[]> {
    return await this.readJsonFile<Education[]>('education.json', []);
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const educationList = await this.readJsonFile<Education[]>('education.json', []);
    const newId = Math.max(0, ...educationList.map(e => e.id)) + 1;
    const education: Education = {
      ...insertEducation,
      id: newId,
      createdAt: new Date()
    };
    educationList.push(education);
    await this.writeJsonFile('education.json', educationList);
    return education;
  }

  async updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education | undefined> {
    const educationList = await this.readJsonFile<Education[]>('education.json', []);
    const index = educationList.findIndex(e => e.id === id);
    if (index === -1) return undefined;

    educationList[index] = { ...educationList[index], ...updates };
    await this.writeJsonFile('education.json', educationList);
    return educationList[index];
  }

  async deleteEducation(id: number): Promise<boolean> {
    const educationList = await this.readJsonFile<Education[]>('education.json', []);
    const initialLength = educationList.length;
    const filtered = educationList.filter(e => e.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('education.json', filtered);
      return true;
    }
    return false;
  }

  async reorderEducation(reorderedIds: number[]): Promise<boolean> {
    try {
      const educationList = await this.readJsonFile<Education[]>('education.json', []);
      const reorderedEducation = educationList.map(edu => {
        const newIndex = reorderedIds.indexOf(edu.id);
        return {
          ...edu,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('education.json', reorderedEducation);
      return true;
    } catch (error) {
      console.error('Error reordering education:', error);
      return false;
    }
  }

  // Selected Project methods
  async getSelectedProjects(): Promise<SelectedProject[]> {
    const projects = await this.readJsonFile<SelectedProject[]>('selectedProjects.json', []);
    return projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async createSelectedProject(insertProject: InsertSelectedProject): Promise<SelectedProject> {
    const projects = await this.getSelectedProjects();
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    const project: SelectedProject = {
      ...insertProject,
      description: insertProject.description ?? null,
      customDescription: insertProject.customDescription ?? null,
      imageUrl: insertProject.imageUrl ?? null,
      language: insertProject.language ?? null,
      stargazersCount: insertProject.stargazersCount ?? 0,
      forksCount: insertProject.forksCount ?? 0,
      isSelected: insertProject.isSelected ?? true,
      featured: insertProject.featured ?? false,
      displayOrder: insertProject.displayOrder ?? projects.length,
      id: newId,
      createdAt: new Date()
    };
    projects.push(project);
    await this.writeJsonFile('selectedProjects.json', projects);
    return project;
  }

  async updateSelectedProject(id: number, updates: Partial<InsertSelectedProject>): Promise<SelectedProject | undefined> {
    const projects = await this.getSelectedProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    projects[index] = { ...projects[index], ...updates };
    await this.writeJsonFile('selectedProjects.json', projects);
    return projects[index];
  }

  async deleteSelectedProject(id: number): Promise<boolean> {
    const projects = await this.getSelectedProjects();
    const initialLength = projects.length;
    const filtered = projects.filter(p => p.id !== id);
    
    if (filtered.length < initialLength) {
      await this.writeJsonFile('selectedProjects.json', filtered);
      return true;
    }
    return false;
  }

  async reorderSelectedProjects(reorderedIds: number[]): Promise<boolean> {
    try {
      const projects = await this.readJsonFile<SelectedProject[]>('selectedProjects.json', []);
      const reorderedProjects = projects.map(project => {
        const newIndex = reorderedIds.indexOf(project.id);
        return {
          ...project,
          sortOrder: newIndex >= 0 ? newIndex : 999
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      
      await this.writeJsonFile('selectedProjects.json', reorderedProjects);
      return true;
    } catch (error) {
      console.error('Error reordering selected projects:', error);
      return false;
    }
  }

  async initializeData() {
    // File storage initializes data in constructor
    return Promise.resolve();
  }
}