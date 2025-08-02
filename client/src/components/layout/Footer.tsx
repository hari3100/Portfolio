import { Link } from 'wouter';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Harikrishnan Nair
            </motion.div>
            <p className="text-gray-400 max-w-md mx-auto">
              AI Engineer building next-generation intelligent systems and solutions.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/">
                <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Home</span>
              </Link>
              <Link href="/about">
                <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">About</span>
              </Link>
              <Link href="/projects">
                <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Projects</span>
              </Link>
              <Link href="/blog">
                <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Blog</span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Contact</span>
              </Link>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © {currentYear} Aniket Dattaram Desai. All rights reserved. Built with ❤️ using React and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
