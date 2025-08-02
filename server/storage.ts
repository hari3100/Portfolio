import { users, projects, contactMessages, certifications, linkedinPosts, skills, blogs, contactInfo, type User, type InsertUser, type Project, type InsertProject, type ContactMessage, type InsertContactMessage, type Certification, type InsertCertification, type LinkedinPost, type InsertLinkedinPost, type Skill, type InsertSkill, type Blog, type InsertBlog, type ContactInfo, type InsertContactInfo } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(): Promise<Project[]>;
  getProjectByGithubId(githubId: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;

  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;

  getCertifications(): Promise<Certification[]>;
  getFeaturedCertifications(): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;

  getLinkedinPosts(): Promise<LinkedinPost[]>;
  getFeaturedLinkedinPosts(): Promise<LinkedinPost[]>;
  createLinkedinPost(post: InsertLinkedinPost): Promise<LinkedinPost>;
  updateLinkedinPost(id: number, updates: Partial<InsertLinkedinPost>): Promise<LinkedinPost | undefined>;
  deleteLinkedinPost(id: number): Promise<boolean>;

  getSkills(): Promise<Skill[]>;
  getFeaturedSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  getBlogs(): Promise<Blog[]>;
  getFeaturedBlogs(): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;

  getContactInfo(): Promise<ContactInfo | undefined>;
  createContactInfo(contactInfo: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: number, updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private contactMessages: Map<number, ContactMessage>;
  private certifications: Map<number, Certification>;
  private linkedinPosts: Map<number, LinkedinPost>;
  private skills: Map<number, Skill>;
  private blogs: Map<number, Blog>;
  private contactInfoData: ContactInfo | null;
  private currentUserId: number;
  private currentProjectId: number;
  private currentContactId: number;
  private currentCertificationId: number;
  private currentLinkedinPostId: number;
  private currentSkillId: number;
  private currentBlogId: number;
  private currentContactInfoId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.contactMessages = new Map();
    this.certifications = new Map();
    this.linkedinPosts = new Map();
    this.skills = new Map();
    this.blogs = new Map();
    this.contactInfoData = null;
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentContactId = 1;
    this.currentCertificationId = 1;
    this.currentLinkedinPostId = 1;
    this.currentSkillId = 1;
    this.currentBlogId = 1;
    this.currentContactInfoId = 1;

    // Initialize with some default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Initialize contact info based on resume
    this.contactInfoData = {
      id: 1,
      email: "harrinair2000@email.com",
      linkedinUrl: "https://linkedin.com/in/harikrishnan-nair",
      githubUrl: "https://github.com/harikrishnan-nair",
      phoneNumber: "+91 8652449890",
      location: "India",
      createdAt: new Date()
    };

    // Default certifications based on resume
    await this.createCertification({
      title: "AWS Certified AI Practitioner (AIF-C01)",
      issuer: "AWS",
      year: "2024",
      imageUrl: "https://images.credly.com/size/220x220/images/778bde6c-ad1c-4312-ac33-2fa40d50a147/image.png",
      description: "AWS AI Practitioner certification demonstrating foundational knowledge of AI/ML services",
      featured: true
    });

    await this.createCertification({
      title: "Data Analysis with Python",
      issuer: "IBM",
      year: "2023", 
      imageUrl: "https://images.credly.com/size/220x220/images/28944969-813a-43b9-944f-7910111ce764/Professional_Certificate_-_Data_Science.png",
      description: "IBM certification in data analysis using Python",
      featured: true
    });

    await this.createCertification({
      title: "Python Certification Training",
      issuer: "Udemy",
      year: "2021", 
      imageUrl: "https://img-c.udemycdn.com/course/240x135/405878_e5a0_3.jpg",
      description: "Comprehensive Python programming certification",
      featured: true
    });

    // Default skills based on resume
    const defaultSkills = [
      { name: "Python", category: "Programming", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", featured: true },
      { name: "PyTorch", category: "ML/AI", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", featured: true },
      { name: "LangChain", category: "ML/AI", logoUrl: "https://python.langchain.com/img/brand/wordmark.png", featured: true },
      { name: "AWS", category: "Cloud/DevOps", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", featured: true },
      { name: "FastAPI", category: "Cloud/DevOps", logoUrl: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png", featured: true },
      { name: "Docker", category: "Cloud/DevOps", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", featured: true },
      { name: "PostgreSQL", category: "Databases/Tools", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", featured: false },
      { name: "SQL", category: "Programming", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", featured: false }
    ];

    for (const skill of defaultSkills) {
      await this.createSkill(skill);
    }

    // Default blog posts
    await this.createBlog({
      title: "Building Voice-Driven AI Assistants with VAPI and AWS",
      url: "https://medium.com/@harrinair2000/voice-ai-assistant-vapi-aws",
      description: "A comprehensive guide on integrating VAPI with AWS Bedrock for intelligent voice assistants",
      imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&h=300&fit=crop",
      publishedAt: new Date("2024-01-20"),
      featured: true
    });

    await this.createBlog({
      title: "Implementing RAG Systems for Medical Coding",
      url: "https://medium.com/@harrinair2000/rag-medical-coding-icd10",
      description: "How to build retrieval-augmented generation systems for ICD-10 medical code identification",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
      publishedAt: new Date("2024-01-10"),
      featured: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectByGithubId(githubId: number): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(
      (project) => project.githubId === githubId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject,
      description: insertProject.description ?? null,
      imageUrl: insertProject.imageUrl ?? null,
      videoUrl: insertProject.videoUrl ?? null,
      category: insertProject.category ?? null,
      customDescription: insertProject.customDescription ?? null,
      featured: insertProject.featured ?? false,
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values());
  }

  async getFeaturedCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(cert => cert.featured);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const certification: Certification = {
      id: this.currentCertificationId++,
      title: insertCertification.title,
      issuer: insertCertification.issuer,
      year: insertCertification.year,
      imageUrl: insertCertification.imageUrl ?? null,
      description: insertCertification.description ?? null,
      featured: insertCertification.featured ?? false,
      createdAt: new Date(),
    };
    this.certifications.set(certification.id, certification);
    return certification;
  }

  async updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification | undefined> {
    const existing = this.certifications.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.certifications.set(id, updated);
    return updated;
  }

  async deleteCertification(id: number): Promise<boolean> {
    return this.certifications.delete(id);
  }

  // LinkedIn Posts
  async getLinkedinPosts(): Promise<LinkedinPost[]> {
    return Array.from(this.linkedinPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getFeaturedLinkedinPosts(): Promise<LinkedinPost[]> {
    return Array.from(this.linkedinPosts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createLinkedinPost(insertPost: InsertLinkedinPost): Promise<LinkedinPost> {
    const id = this.currentLinkedinPostId++;
    const post: LinkedinPost = {
      ...insertPost,
      imageUrl: insertPost.imageUrl ?? null,
      likes: insertPost.likes ?? 0,
      comments: insertPost.comments ?? 0,
      featured: insertPost.featured ?? false,
      id,
      createdAt: new Date(),
    };
    this.linkedinPosts.set(id, post);
    return post;
  }

  async updateLinkedinPost(id: number, updates: Partial<InsertLinkedinPost>): Promise<LinkedinPost | undefined> {
    const existing = this.linkedinPosts.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.linkedinPosts.set(id, updated);
    return updated;
  }

  async deleteLinkedinPost(id: number): Promise<boolean> {
    return this.linkedinPosts.delete(id);
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getFeaturedSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.featured);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const skill: Skill = {
      ...insertSkill,
      logoUrl: insertSkill.logoUrl ?? null,
      featured: insertSkill.featured ?? false,
      id,
      createdAt: new Date(),
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existing = this.skills.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Blog methods
  async getBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getFeaturedBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values())
      .filter(blog => blog.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentBlogId++;
    const blog: Blog = {
      ...insertBlog,
      description: insertBlog.description ?? null,
      imageUrl: insertBlog.imageUrl ?? null,
      featured: insertBlog.featured ?? false,
      id,
      createdAt: new Date(),
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    const existing = this.blogs.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.blogs.set(id, updated);
    return updated;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  // Contact Info methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfoData || undefined;
  }

  async createContactInfo(insertContactInfo: InsertContactInfo): Promise<ContactInfo> {
    const id = this.currentContactInfoId++;
    const contactInfo: ContactInfo = {
      ...insertContactInfo,
      linkedinUrl: insertContactInfo.linkedinUrl ?? null,
      githubUrl: insertContactInfo.githubUrl ?? null,
      phoneNumber: insertContactInfo.phoneNumber ?? null,
      location: insertContactInfo.location ?? null,
      id,
      createdAt: new Date(),
    };
    this.contactInfoData = contactInfo;
    return contactInfo;
  }

  async updateContactInfo(id: number, updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    if (!this.contactInfoData || this.contactInfoData.id !== id) return undefined;

    const updated = { ...this.contactInfoData, ...updates };
    this.contactInfoData = updated;
    return updated;
  }

  async initializeData() {
    // This method is called by routes but MemStorage already initializes data in constructor
    // No additional action needed since default data is already loaded
    return Promise.resolve();
  }
}



import { FileStorage } from './fileStorage';

export const storage = new FileStorage();