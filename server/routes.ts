import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProjectSchema, insertCertificationSchema, insertLinkedinPostSchema, insertSkillSchema, insertBlogSchema, insertContactInfoSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // GitHub repos proxy to avoid CORS issues
  app.get("/api/github/repos/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch GitHub repos" });
      }
      
      const repos = await response.json();
      res.json(repos);
    } catch (error) {
      console.error("GitHub API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Create or update project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Check if project with this GitHub ID already exists
      const existing = await storage.getProjectByGithubId(validatedData.githubId);
      
      if (existing) {
        const updated = await storage.updateProject(existing.id, validatedData);
        res.json(updated);
      } else {
        const project = await storage.createProject(validatedData);
        res.json(project);
      }
    } catch (error) {
      console.error("Create/update project error:", error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  // Upload project media (admin only)
  app.post("/api/projects/:id/upload", upload.single('file'), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Simple admin authentication - in production, use proper JWT
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // In a real app, you'd upload to cloud storage and get a URL
      const fileUrl = `/uploads/${file.filename}`;
      
      const updateData = file.mimetype.startsWith('image/') 
        ? { imageUrl: fileUrl }
        : { videoUrl: fileUrl };

      const updated = await storage.updateProject(projectId, updateData);
      
      if (!updated) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // In a real app, you'd send an email notification here
      console.log("New contact message:", message);
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  // Admin authentication
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      res.json({ success: true, token: "admin123" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // Certifications API
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      console.error("Get certifications error:", error);
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  app.get("/api/certifications/featured", async (req, res) => {
    try {
      const certifications = await storage.getFeaturedCertifications();
      res.json(certifications);
    } catch (error) {
      console.error("Get featured certifications error:", error);
      res.status(500).json({ error: "Failed to fetch featured certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validatedData);
      res.json(certification);
    } catch (error) {
      console.error("Create certification error:", error);
      res.status(400).json({ error: "Invalid certification data" });
    }
  });

  app.put("/api/certifications/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const certification = await storage.updateCertification(id, updates);
      
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      console.error("Update certification error:", error);
      res.status(400).json({ error: "Invalid certification data" });
    }
  });

  app.delete("/api/certifications/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCertification(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Certification not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete certification error:", error);
      res.status(500).json({ error: "Failed to delete certification" });
    }
  });

  // LinkedIn Posts API
  app.get("/api/linkedin-posts", async (req, res) => {
    try {
      const posts = await storage.getLinkedinPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get LinkedIn posts error:", error);
      res.status(500).json({ error: "Failed to fetch LinkedIn posts" });
    }
  });

  app.get("/api/linkedin-posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedLinkedinPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get featured LinkedIn posts error:", error);
      res.status(500).json({ error: "Failed to fetch featured LinkedIn posts" });
    }
  });

  app.post("/api/linkedin-posts", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (!adminPassword || !adminPassword.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertLinkedinPostSchema.parse(req.body);
      const post = await storage.createLinkedinPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Create LinkedIn post error:", error);
      res.status(400).json({ error: "Invalid LinkedIn post data" });
    }
  });

  app.put("/api/linkedin-posts/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (!adminPassword || !adminPassword.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const post = await storage.updateLinkedinPost(id, updates);
      
      if (!post) {
        return res.status(404).json({ error: "LinkedIn post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Update LinkedIn post error:", error);
      res.status(400).json({ error: "Invalid LinkedIn post data" });
    }
  });

  app.put("/api/linkedin-posts/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const post = await storage.updateLinkedinPost(id, updates);
      
      if (!post) {
        return res.status(404).json({ error: "LinkedIn post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Update LinkedIn post error:", error);
      res.status(400).json({ error: "Invalid LinkedIn post data" });
    }
  });

  app.delete("/api/linkedin-posts/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLinkedinPost(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "LinkedIn post not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete LinkedIn post error:", error);
      res.status(500).json({ error: "Failed to delete LinkedIn post" });
    }
  });

  // Skills API
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Get skills error:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/skills/featured", async (req, res) => {
    try {
      const skills = await storage.getFeaturedSkills();
      res.json(skills);
    } catch (error) {
      console.error("Get featured skills error:", error);
      res.status(500).json({ error: "Failed to fetch featured skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      console.error("Create skill error:", error);
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const skill = await storage.updateSkill(id, updates);
      
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      console.error("Update skill error:", error);
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete skill error:", error);
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Blog API
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Get blogs error:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/featured", async (req, res) => {
    try {
      const blogs = await storage.getFeaturedBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Get featured blogs error:", error);
      res.status(500).json({ error: "Failed to fetch featured blogs" });
    }
  });

  app.post("/api/blogs", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(validatedData);
      res.json(blog);
    } catch (error) {
      console.error("Create blog error:", error);
      res.status(400).json({ error: "Invalid blog data" });
    }
  });

  app.put("/api/blogs/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const blog = await storage.updateBlog(id, updates);
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error) {
      console.error("Update blog error:", error);
      res.status(400).json({ error: "Invalid blog data" });
    }
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlog(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete blog error:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  // Contact Info API
  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo);
    } catch (error) {
      console.error("Get contact info error:", error);
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.post("/api/contact-info", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (!adminPassword || !adminPassword.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertContactInfoSchema.parse(req.body);
      const contactInfo = await storage.createContactInfo(validatedData);
      res.json(contactInfo);
    } catch (error) {
      console.error("Create contact info error:", error);
      res.status(400).json({ error: "Invalid contact info data" });
    }
  });

  app.put("/api/contact-info/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (!adminPassword || !adminPassword.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const contactInfo = await storage.updateContactInfo(id, updates);
      
      if (!contactInfo) {
        return res.status(404).json({ error: "Contact info not found" });
      }
      
      res.json(contactInfo);
    } catch (error) {
      console.error("Update contact info error:", error);
      res.status(400).json({ error: "Invalid contact info data" });
    }
  });

  app.put("/api/contact-info/:id", async (req, res) => {
    try {
      const adminPassword = req.headers.authorization;
      if (adminPassword !== "Bearer admin123") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      const contactInfo = await storage.updateContactInfo(id, updates);
      
      if (!contactInfo) {
        return res.status(404).json({ error: "Contact info not found" });
      }
      
      res.json(contactInfo);
    } catch (error) {
      console.error("Update contact info error:", error);
      res.status(400).json({ error: "Invalid contact info data" });
    }
  });

  // Initialize database data
  (async () => {
    try {
      await storage.initializeData();
      console.log('Database initialized with sample data');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  })();

  const httpServer = createServer(app);
  return httpServer;
}
