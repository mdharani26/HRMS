import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heropic from "../assets/hero.png";
import aboutImage from "../assets/about-image.jpg";
import profileimg from "../assets/proflie.jpg";
import { 
  FaCalendarAlt,
  FaUsers,
  FaTasks,
  FaChartLine,
  FaGraduationCap,
  FaFileAlt,
  FaUserCircle,
  FaUserTie,
  FaUserCog,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaStar,
  FaRegStar,
  FaMobileAlt
} from 'react-icons/fa';

import { HiOutlineLightningBolt } from 'react-icons/hi';
import { BsFillChatSquareQuoteFill, BsFillChatQuoteFill } from 'react-icons/bs';
const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple animation trigger
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on initial load
    setIsVisible(true); // For initial animations
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="logo-container">
            <h1 className="logo-text">ZenHR</h1>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#jobs">Careers</a>
            <a href="#contact">Contact</a>
            <button
  className="login-btn"
  onClick={() => navigate('/login')}
>
  <span className="login-text">Login</span>
  <span className="login-icon">→</span>
</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className={`hero-content animate-on-scroll ${isVisible ? 'visible' : ''}`}>
            <h1>Modern HR Solutions for <span className="highlight">Growing Businesses</span></h1>
            <p className="subtitle">
              From recruitment to retirement, simplify every stage of the employee journey with our powerful HRMS solution.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-primary">Get Started</Link>
              <a href="#features" className="btn-secondary">
  <span>Learn More</span>
  <svg width="15px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</a>

            </div>
          </div>
          <div className={`hero-image animate-on-scroll ${isVisible ? 'visible' : ''}`}>
            <div className="image-container">
              <img src={heropic} alt="Happy team at work" />
              <div className="glow-effect"></div>
            </div>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity="0.25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity="0.5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>

{/* Features Section */}
<section id="features" className="features">
  <div className="container">
    <div className={`section-header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <h2 className="section-title">
        <HiOutlineLightningBolt className="icon" />
        Powerful Features
      </h2>
      <p className="section-subtitle">
        Everything you need to manage your workforce effectively
      </p>
    </div>
    

    <div className="features-grid">
      {[
       { 
      icon: <FaCalendarAlt size={32} />, 
      title: "Leave Management", 
      desc: "Automated leave requests, approvals, and tracking with real-time updates.",
      details: "Our leave management system integrates with all major calendar apps and provides automated notifications."
    },
    { 
      icon: <FaUsers size={32} />, 
      title: "Employee Directory", 
      desc: "Centralized employee info with advanced search and organizational charts.",
      details: "Find any employee instantly with our powerful search and filter capabilities."
    },
    { 
      icon: <FaTasks size={32} />, 
      title: "Task Management", 
      desc: "Assign, track, and manage employee tasks efficiently.",
      details: "Stay on top of team performance with task prioritization, status updates, and progress tracking."
    },
    { 
      icon: <FaChartLine size={32} />, 
      title: "Performance Analytics", 
      desc: "Insightful reports and KPIs for employee productivity.",
      details: "Access performance trends and visualize key metrics with customizable dashboards and exportable reports."
    },
    { 
      icon: <FaGraduationCap size={32} />, 
      title: "Training & Development", 
      desc: "Track training programs and employee skill growth.",
      details: "Manage learning paths, certifications, and feedback to upskill your workforce efficiently."
    },
    { 
      icon: <FaFileAlt size={32} />, 
      title: "Document Management", 
      desc: "Securely store and share employee-related documents.",
      details: "Upload, categorize, and control access to HR policies, contracts, and personal documents in one place."
    }
        // ... keep other feature objects with added 'details' property
      ].map((feature, index) => (
        <div key={index} className="feature-card">
          <div className="feature-card-main">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
          <div className="feature-popup">
            <div className="popup-content">
              <h4>{feature.title}</h4>
              <p>{feature.details}</p>
              <button className="popup-close">×</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className={`about-image animate-on-scroll ${isVisible ? 'visible' : ''}`}>
            <div className="image-container">
              <img src={aboutImage} alt="Our team working together" />
              <div className="floating-badge">
                <span>5+ Years</span>
                <small>HR Expertise</small>
              </div>
            </div>
          </div>
          <div className={`about-content animate-on-scroll ${isVisible ? 'visible' : ''}`}>
            <h2 className="section-title">About ZenHR</h2>
            <p>
              Founded in 2020, ZenHR was created to simplify HR for modern businesses. Our mission is to help companies focus on their people, not paperwork.
            </p>
            <p>
              Used by startups and enterprises alike, we're continuously innovating to support companies across industries with our cutting-edge HR technology.
            </p>
            <div className="stats">
              <div className="stat">
                <h3>100+</h3>
                <p>Happy Companies</p>
              </div>
              <div className="stat">
                <h3>50K+</h3>
                <p>Employees Managed</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
            <button className="btn-outline">
              Read Our Story
            </button>
          </div>
        </div>
      </section>

    {/* Testimonials Section */}
<section className="testimonials">
  <div className="container">
    <div className={`section-header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <h2 className="section-title">
       
        Trusted by HR Professionals
      </h2>
    </div>
    
    <div className="testimonials-carousel">
      <div className="testimonials-track">
        {[
          {
            quote: "ZenHR transformed how we manage our team. The leave management system alone saved us countless hours each month. The analytics dashboard provides insights we never had before.",
            name: "Sarah Johnson",
            position: "HR Director, TechCorp",
            rating: 5,
            image: <FaUserCircle size={40} />
          },
          {
            quote: "Implementation was smooth and our employees adapted quickly. The intuitive interface makes training a breeze. We've reduced our HR administration time by 60% since switching.",
            name: "Michael Chen",
            position: "CEO, Startup Ventures",
            rating: 5,
            image: <FaUserTie size={40} />
          },
          {
            quote: "The mobile app is a game-changer for our field employees. Real-time updates and approvals from anywhere have significantly improved our operational efficiency.",
            name: "David Wilson",
            position: "Operations Manager, RetailChain",
            rating: 4,
            image: <FaUserCog size={40} />
          },
          {
            quote: "ZenHR transformed how we manage our team. The leave management system alone saved us countless hours each month. The analytics dashboard provides insights we never had before.",
            name: "Sarah Johnson",
            position: "HR Director, TechCorp",
            rating: 5,
            image: <FaUserCircle size={40} />
          },
          {
            quote: "Implementation was smooth and our employees adapted quickly. The intuitive interface makes training a breeze. We've reduced our HR administration time by 60% since switching.",
            name: "Michael Chen",
            position: "CEO, Startup Ventures",
            rating: 5,
            image: <FaUserTie size={40} />
          },
          {
            quote: "The mobile app is a game-changer for our field employees. Real-time updates and approvals from anywhere have significantly improved our operational efficiency.",
            name: "David Wilson",
            position: "Operations Manager, RetailChain",
            rating: 4,
            image: <FaUserCog size={40} />
          }
        ].map((testimonial, index) => (
          <div 
            key={index} 
            className={`testimonial-card animate-on-scroll delay-${index % 2}`}
          >
            
            <div className="stars">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} color="#FFD700" />
              ))}
              {testimonial.rating < 5 && 
                [...Array(5 - testimonial.rating)].map((_, i) => (
                  <FaRegStar key={i + testimonial.rating} color="#DDD" />
                ))
              }
            </div>
            <p className="testimonial-text">"{testimonial.quote}"</p>
            <div className="author">
              <div className="author-image">{testimonial.image}</div>
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p className="position">{testimonial.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
{/* Job Openings Section */}
<section id="jobs" className="jobs">
  <div className="container">
    <div className={`section-header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <h2 className="section-title">Join Our Team</h2>
      <p className="section-subtitle">
        We're looking for talented individuals to help shape the future of HR tech.
      </p>
    </div>
    
    <div className="job-carousel-container">
      <div className="job-cards-container animate-on-scroll">
        {[
          {
            title: "Frontend Developer",
            description: "React.js, TypeScript, UI/UX, Responsive Design",
            type: "Full-time",
            location: "Remote",
            tags: ["React", "TypeScript", "UI/UX"]
          },
          {
            title: "Backend Developer",
            description: "Node.js, Express, PostgreSQL, AWS",
            type: "Full-time",
            location: "Remote",
            tags: ["Node.js", "PostgreSQL", "AWS"]
          },
          {
            title: "Product Designer",
            description: "Figma, Prototyping, UX Research, Design Systems",
            type: "Full-time",
            location: "Hybrid",
            tags: ["Figma", "UX", "Prototyping"]
          },
          {
            title: "HR Solutions Specialist",
            description: "HR Processes, Customer Support, Training",
            type: "Full-time",
            location: "Remote",
            tags: ["HR", "Training", "Support"]
          },
          {
            title: "Frontend Developer",
            description: "React.js, TypeScript, UI/UX, Responsive Design",
            type: "Full-time",
            location: "Remote",
            tags: ["React", "TypeScript", "UI/UX"]
          },
          {
            title: "Backend Developer",
            description: "Node.js, Express, PostgreSQL, AWS",
            type: "Full-time",
            location: "Remote",
            tags: ["Node.js", "PostgreSQL", "AWS"]
          },
          {
            title: "Product Designer",
            description: "Figma, Prototyping, UX Research, Design Systems",
            type: "Full-time",
            location: "Hybrid",
            tags: ["Figma", "UX", "Prototyping"]
          },
          {
            title: "HR Solutions Specialist",
            description: "HR Processes, Customer Support, Training",
            type: "Full-time",
            location: "Remote",
            tags: ["HR", "Training", "Support"]
          }
        ].map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-card-inner">
              <div className="job-card-front">
                <h4>{job.title}</h4>
                <p>{job.description}</p>
                <div className="job-meta">
                  <span>{job.type}</span>
                  <span>{job.location}</span>
                </div>
                <div className="job-tags">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="job-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="job-card-back">
                <button className="apply-btn">
                  Apply Now
                  <span className="apply-arrow">→</span>
                </button>
                <div className="job-benefits">
                  <p>✔ Competitive salary</p>
                  <p>✔ Flexible hours</p>
                  <p>✔ Health benefits</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-prev">‹</button>
      <button className="carousel-next">›</button>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="cta-section">
  <div className="container">
    <div className={`cta-content animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <h2>Ready to Transform Your HR Operations?</h2>
      <p>Join thousands of companies who trust ZenHR for their human resource management.</p>
      <div className="cta-buttons">
        <a href="/login" className="btn-primary">Get Started</a>
        <a href="#contact" className="btn-secondary">Contact</a>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer id="contact" className="footer">
  <div className="container">
    <div className="footer-grid">
      <div className="footer-col">
        <h1 className="footer-logo-text">ZenHR</h1>
        <p>Modern HR solutions for the digital age.</p>
        <div className="social-links">
          <a href="#" className="social-link twitter"><FaTwitter /></a>
          <a href="#" className="social-link linkedin"><FaLinkedin /></a>
          <a href="#" className="social-link facebook"><FaFacebook /></a>
          <a href="#" className="social-link instagram"><FaInstagram /></a>
        </div>
      </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Integrations</a></li>
                <li><a href="#" className="footer-link">Updates</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#about" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#jobs" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Press</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#" className="footer-link">Help Center - ZenHR</a></li>
                <li><a href="#" className="footer-link">Contact Us +91 91000 91000</a></li>
                <li><a href="#" className="footer-link">API Docs</a></li>
                <li><a href="#" className="footer-link">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 ZenHR. All rights reserved.</p>
            <div className="legal-links">
              <a href="#" className="legal-link">Privacy Policy</a>
              <a href="#" className="legal-link">Terms of Service</a>
              <a href="#" className="legal-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;