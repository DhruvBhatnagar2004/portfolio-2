import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = ({ isMobile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show typing effect
    setStatus('typing');
    
    // Simulate sending message
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-green-400 tracking-wider">CONTACT.sh</h2>
      
      <div className="mb-6">
        <p className="text-green-300 mb-4">$ Connect with me:</p>
        <ul className={`${isMobile ? "space-y-3 text-sm" : "space-y-2"} text-green-400`}>
          <li className="break-all">
            <span className="text-green-500">$</span> Email: <a href="mailto:hello@example.com" className="underline">hello@example.com</a>
          </li>
          <li className="break-all">
            <span className="text-green-500">$</span> GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="underline">github.com/yourusername</a>
          </li>
          <li className="break-all">
            <span className="text-green-500">$</span> LinkedIn: <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="underline">linkedin.com/in/yourusername</a>
          </li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="border border-green-600 p-4 bg-black/50">
        <p className="text-green-300 mb-4">$ Send a message:</p>
        
        <div className="mb-4">
          <label htmlFor="name" className={`block text-green-400 mb-1 ${isMobile ? "text-sm" : ""}`}>name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black border border-green-500 text-green-400 px-3 py-2 focus:outline-none focus:border-green-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className={`block text-green-400 mb-1 ${isMobile ? "text-sm" : ""}`}>email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black border border-green-500 text-green-400 px-3 py-2 focus:outline-none focus:border-green-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className={`block text-green-400 mb-1 ${isMobile ? "text-sm" : ""}`}>message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full bg-black border border-green-500 text-green-400 px-3 py-2 focus:outline-none focus:border-green-300"
            required
          ></textarea>
        </div>
        
        <button 
          type="submit"
          className={`${isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2"} bg-green-800 text-green-300 hover:bg-green-700 transition-colors`}
          disabled={status === 'typing'}
        >
          {status === 'typing' ? '> Sending...' : '> Send Message'}
        </button>
        
        {status === 'sent' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-green-400"
          >
            {'> Message sent successfully!'}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
};

export default ContactSection;