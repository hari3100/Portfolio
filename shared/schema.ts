import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  githubId: integer("github_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  category: text("category"),
  customDescription: text("custom_description"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  year: text("year").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const linkedinPosts = pgTable("linkedin_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postUrl: text("post_url").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  logoUrl: text("logo_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  phoneNumber: text("phone_number"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  courseName: text("course_name").notNull(),
  collegeName: text("college_name").notNull(),
  startMonth: text("start_month").notNull(),
  startYear: integer("start_year").notNull(),
  endMonth: text("end_month").notNull(),
  endYear: integer("end_year").notNull(),
  status: text("status").notNull(), // "completed", "in progress", "to begin", "dropped off"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  createdAt: true,
});

export const insertLinkedinPostSchema = createInsertSchema(linkedinPosts).omit({
  id: true,
  createdAt: true,
}).extend({
  publishedAt: z.union([z.date(), z.string()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true,
}).extend({
  publishedAt: z.union([z.date(), z.string()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  createdAt: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
  createdAt: true,
});

// Selected Projects table for file-based storage
export const selectedProjects = pgTable("selected_projects", {
  id: serial("id").primaryKey(),
  githubRepoId: integer("github_repo_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  htmlUrl: text("html_url").notNull(),
  language: text("language"),
  stargazersCount: integer("stargazers_count").default(0),
  forksCount: integer("forks_count").default(0),
  isSelected: boolean("is_selected").default(true),
  customDescription: text("custom_description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSelectedProjectSchema = createInsertSchema(selectedProjects).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type LinkedinPost = typeof linkedinPosts.$inferSelect;
export type InsertLinkedinPost = z.infer<typeof insertLinkedinPostSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type SelectedProject = typeof selectedProjects.$inferSelect;
export type InsertSelectedProject = z.infer<typeof insertSelectedProjectSchema>;
