import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Simple animation trigger
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger on initial load
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">HRMS</h1>
          <div className="nav-links">
            <Link to="#features">Features</Link>
            <Link to="#about">About</Link>
            <Link to="#jobs">Careers</Link>
            <Link to="#contact">Contact</Link>
            <Link to="/login" className="btn-outline">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>Modern HR Management Simplified</h1>
            <p className="subtitle">
              Streamline your HR processes with our all-in-one solution designed for 
              the modern workplace. Efficient, intuitive, and powerful.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-primary">Get Started</Link>
              <Link to="#features" className="btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-image slide-in-right">
            <div className="image-placeholder"></div>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title slide-in-left">Powerful Features</h2>
          <p className="section-subtitle fade-in">Everything you need to manage your workforce effectively</p>
          
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">📅</div>
              <h3>Leave Management</h3>
              <p>Streamline leave requests, approvals, and tracking with our intuitive system.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">👥</div>
              <h3>Employee Directory</h3>
              <p>Centralized employee information with advanced search and filtering.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">📊</div>
              <h3>Performance Tracking</h3>
              <p>Monitor and evaluate employee performance with customizable metrics.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">💼</div>
              <h3>Recruitment Tools</h3>
              <p>Post jobs, track applicants, and manage the hiring process seamlessly.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">📝</div>
              <h3>Document Management</h3>
              <p>Secure storage and easy access to all employee documents.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access HRMS on the go with our fully responsive design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-image slide-in-left">
            <div className="image-placeholder"></div>
          </div>
          <div className="about-content fade-in">
            <h2 className="section-title">About Our HRMS</h2>
            <p>
              Founded in 2020, our HR Management System was created to address the growing 
              complexity of human resource management in modern businesses. We believe in 
              simplifying HR processes so you can focus on what matters most - your people.
            </p>
            <p>
              Our platform is used by companies of all sizes, from startups to enterprises, 
              across various industries. We're constantly innovating to bring you the best 
              tools for managing your workforce.
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
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title slide-in-right">What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card fade-in">
              <div className="quote">"</div>
              <p>HRMS transformed how we manage our team. The leave management system alone saved us countless hours.</p>
              <div className="author">
                <div className="author-image"></div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>HR Director, TechCorp</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card fade-in">
              <div className="quote">"</div>
              <p>Implementation was smooth and our employees adapted quickly. The intuitive interface makes training a breeze.</p>
              <div className="author">
                <div className="author-image"></div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>CEO, Startup Ventures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="jobs" className="jobs">
        <div className="container">
          <h2 className="section-title slide-in-left">Join Our Team</h2>
          <p className="section-subtitle fade-in">We're always looking for talented individuals to join our growing company</p>
          
          <div className="job-listings">
            <div className="job-card fade-in">
              <h3>Frontend Developer</h3>
              <div className="job-details">
                <span>📍 Chennai</span>
                <span>💻 Full-time</span>
                <span>💰 Competitive</span>
              </div>
              <p>We're looking for an experienced React developer to help build the next generation of our HRMS platform.</p>
              <button className="btn-outline">Apply Now</button>
            </div>
            
            <div className="job-card fade-in">
              <h3>Backend Developer</h3>
              <div className="job-details">
                <span>📍 Remote</span>
                <span>💻 Full-time</span>
                <span>💰 Competitive</span>
              </div>
              <p>Join our backend team working with Node.js, MongoDB, and microservices architecture.</p>
              <button className="btn-outline">Apply Now</button>
            </div>
            
            <div className="job-card fade-in">
              <h3>HR Executive</h3>
              <div className="job-details">
                <span>📍 Chennai</span>
                <span>💻 Full-time</span>
                <span>💰 Competitive</span>
              </div>
              <p>Help us provide exceptional support to our growing customer base with your HR expertise.</p>
              <button className="btn-outline">Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content fade-in">
            <h2 className="section-title">Get In Touch</h2>
            <p>Have questions or want to learn more about our HRMS solution? Reach out to our team.</p>
            
            <div className="contact-info">
              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <h4>Email Us</h4>
                <p>hr@hrmscompany.com</p>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <h4>Call Us</h4>
                <p>+91-9876543210</p>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">🏢</div>
                <h4>Visit Us</h4>
                <p>123 Tech Park, Chennai, India</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form slide-in-right">
            <form>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="fade-in">Ready to Transform Your HR Management?</h2>
          <p className="fade-in">Join hundreds of companies who trust our HRMS solution</p>
          <div className="cta-buttons fade-in">
            <Link to="/login" className="btn-primary">Get Started Now</Link>
            <Link to="#contact" className="btn-secondary">Request Demo</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <h3>HRMS</h3>
              <p>Modern HR solutions for modern businesses. Streamline your workforce management with our powerful platform.</p>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="#features">Features</Link></li>
                <li><Link to="#about">About</Link></li>
                <li><Link to="#jobs">Careers</Link></li>
                <li><Link to="#contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4>Contact Info</h4>
              <p>123 Tech Park, Chennai</p>
              <p>India - 600001</p>
              <p>hr@hrmscompany.com</p>
              <p>+91-9876543210</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} HRMS. All rights reserved.</p>
            <div className="social-links">
              <a href="#"><span>📱</span></a>
              <a href="#"><span>💻</span></a>
              <a href="#"><span>📘</span></a>
              <a href="#"><span>🐦</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;