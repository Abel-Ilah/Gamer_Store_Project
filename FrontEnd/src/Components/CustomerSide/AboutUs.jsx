import "./AboutUs.css";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}

      <section className="about-hero">
        <div className="about-overlay">
          <h1>About Our Store</h1>

          <p>
            We believe shopping should be simple, secure, and enjoyable. Every
            product we offer is carefully selected to provide quality, value,
            and satisfaction.
          </p>
        </div>
      </section>

      {/* Story */}

      <section className="about-story">
        <div className="story-text">
          <h2>Our Story</h2>

          <p>
            Founded with a passion for delivering high-quality products, our
            store has grown into a trusted online shopping destination. We
            continuously expand our collection while maintaining our commitment
            to quality, affordability, and excellent customer service.
          </p>

          <p>
            Our goal is to create a shopping experience that is fast, secure,
            and enjoyable from browsing to delivery.
          </p>
        </div>

        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900"
            alt="Our Team"
          />
        </div>
      </section>

      {/* Statistics */}

      <section className="stats-section">
        <div className="stat-card">
          <h2>15K+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Premium Products</p>
        </div>

        <div className="stat-card">
          <h2>98%</h2>
          <p>Customer Satisfaction</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>
      </section>

      {/* Features */}

      <section className="why-us">
        <h2>Why Choose Us?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <ShoppingBagOutlinedIcon />
            <h3>Quality Products</h3>
            <p>Only carefully selected products from trusted suppliers.</p>
          </div>

          <div className="feature-card">
            <LocalShippingOutlinedIcon />
            <h3>Fast Delivery</h3>
            <p>Reliable and fast shipping to get your order quickly.</p>
          </div>

          <div className="feature-card">
            <VerifiedOutlinedIcon />
            <h3>Secure Payments</h3>
            <p>Your payments are protected using secure technologies.</p>
          </div>

          <div className="feature-card">
            <SupportAgentOutlinedIcon />
            <h3>24/7 Support</h3>
            <p>Our team is always ready to help whenever you need us.</p>
          </div>
        </div>
      </section>

      {/* Mission */}

      <section className="mission-section">
        <div className="mission-card">
          <EmojiEventsOutlinedIcon />

          <h3>Our Mission</h3>

          <p>
            To provide customers with premium products at fair prices while
            delivering an exceptional online shopping experience.
          </p>
        </div>

        <div className="mission-card">
          <VisibilityOutlinedIcon />

          <h3>Our Vision</h3>

          <p>
            To become one of the most trusted online stores by focusing on
            innovation, quality, and customer satisfaction.
          </p>
        </div>
      </section>

      {/* CTA */}

      <section className="about-cta">
        <h2>Ready to Discover Amazing Products?</h2>

        <p>
          Explore our latest collections and experience shopping designed around
          your needs.
        </p>

        <button>
          Shop Now
          <ArrowForwardRoundedIcon />
        </button>
      </section>
    </div>
  );
}
