import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heropic from "../assets/hero.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

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
          <h1 className="logo">ZenHR</h1>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#jobs">Careers</a>
            <a href="#contact">Contact</a>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>People. Performance. Progress.</h1>
            <p className="subtitle">
              From recruitment to retirement, simplify every stage of the employee journey with one powerful HRMS solution.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-primary">Get Started</Link>
              <Link to="#features" className="btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-image slide-in-right">
            <div className="image-placeholder">
              <img src={heropic} alt="HR illustration" />
            </div>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2..." fill="currentColor" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92..." fill="currentColor" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59..." fill="currentColor"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title slide-in-left">Powerful Features</h2>
          <p className="section-subtitle fade-in">Everything you need to manage your workforce effectively</p>

          <div className="features-grid">
            {[
              { icon: "📅", title: "Leave Management", desc: "Streamline leave requests, approvals, and tracking." },
              { icon: "👥", title: "Employee Directory", desc: "Centralized employee info with advanced search." },
              { icon: "📊", title: "Performance Tracking", desc: "Monitor and evaluate employee performance." },
              { icon: "💼", title: "Recruitment Tools", desc: "Post jobs and manage the hiring process." },
              { icon: "📝", title: "Document Management", desc: "Secure storage and access to all employee docs." },
              { icon: "📱", title: "Mobile Friendly", desc: "Access HRMS on the go with responsive design." }
            ].map((feature, index) => (
              <div key={index} className="feature-card fade-in">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
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
              Founded in 2020, ZenHR was created to simplify HR for modern businesses.
              Our platform helps you focus on people, not paperwork.
            </p>
            <p>
              Used by startups and enterprises alike, we’re continuously innovating to support companies across industries.
            </p>
            <div className="stats">
              <div className="stat"><h3>100+</h3><p>Happy Companies</p></div>
              <div className="stat"><h3>50K+</h3><p>Employees Managed</p></div>
              <div className="stat"><h3>24/7</h3><p>Support Available</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title slide-in-right">What Our Clients Say</h2>
          <div className="testimonials-grid">
            {[
              {
                quote: "HRMS transformed how we manage our team. The leave management system alone saved us countless hours.",
                name: "Sarah Johnson",
                position: "HR Director, TechCorp"
              },
              {
                quote: "Implementation was smooth and our employees adapted quickly. The intuitive interface makes training a breeze.",
                name: "Michael Chen",
                position: "CEO, Startup Ventures"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card fade-in">
                <div className="quote">"</div>
                <p>{testimonial.quote}</p>
                <div className="author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="jobs" className="jobs">
        <div className="container">
          <h2 className="section-title slide-in-left">We're Hiring!</h2>
          <p className="section-subtitle fade-in">Join our growing team and help shape the future of HR tech.</p>
          <ul className="job-listings fade-in">
            <li>
              <h4>Frontend Developer</h4>
              <p>React.js, UI/UX, Responsive Design</p>
            </li>
            <li>
              <h4>Backend Developer</h4>
              <p>Node.js, Express, MySQL</p>
            </li>
            <li>
              <h4>Product Designer</h4>
              <p>Figma, Prototyping, UX Research</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer or Contact section placeholder */}
      <footer id="contact" className="footer">
        <div className="container">
          <p>© 2025 ZenHR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
