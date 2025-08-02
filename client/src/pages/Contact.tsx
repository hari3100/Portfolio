import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ContactInfo, InsertContactMessage } from "@shared/schema";

export function Contact() {
  const [formData, setFormData] = useState<InsertContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch contact info from backend
  const { data: contactInfo } = useQuery({
    queryKey: ["/api/contact-info"],
  });

  const getSocialLinks = () => {
    const info = contactInfo as ContactInfo | undefined;
    if (!info) {
      return [
        {
          name: "Email",
          icon: Mail,
          url: "mailto:harrinair2000@gmail.com",
          label: "harrinair2000@gmail.com",
        },
        {
          name: "LinkedIn",
          icon: Linkedin,
          url: "https://www.linkedin.com/in/hari-nair3",
          label: "https://www.linkedin.com/in/hari-nair3",
        },
        {
          name: "GitHub",
          icon: Github,
          url: "https://github.com/hari3100",
          label: "github.com/hari3100",
        },
      ];
    }

    const links = [];
    if (info.email) {
      links.push({
        name: "Email",
        icon: Mail,
        url: `mailto:${info.email}`,
        label: info.email,
      });
    }
    if (info.linkedinUrl) {
      links.push({
        name: "LinkedIn",
        icon: Linkedin,
        url: info.linkedinUrl,
        label: info.linkedinUrl.replace("https://", "").replace("http://", ""),
      });
    }
    if (info.githubUrl) {
      links.push({
        name: "GitHub",
        icon: Github,
        url: info.githubUrl,
        label: info.githubUrl.replace("https://", "").replace("http://", ""),
      });
    }
    if (info.phoneNumber) {
      links.push({
        name: "Phone",
        icon: ExternalLink,
        url: `tel:${info.phoneNumber}`,
        label: info.phoneNumber,
      });
    }
    return links;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact-messages", formData);

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Let's discuss opportunities, collaborate on AI projects, or just
              have a conversation about technology and innovation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Send a Message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="Tell me about your project or inquiry..."
                        required
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info & Social Links */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Connect With Me
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  I'm always open to discussing new opportunities, AI projects,
                  or just chatting about the latest developments in artificial
                  intelligence and machine learning. Feel free to reach out
                  through any of the channels below.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                {getSocialLinks().map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {link.label}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Location */}
              <motion.div
                className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Location
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Mumbai, India • Open to remote/In Office opportunities
                  worldwide
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
