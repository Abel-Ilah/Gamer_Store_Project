import "./ContactUs.css";
import { useState } from "react";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO:
    // await axios.post("/api/contact", form);

    alert("Your message has been sent successfully!");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Whether you have a question about an
          order, a product, or anything else, our team is ready to help.
        </p>
      </div>

      <div className="contact-wrapper">
        {/* Left Side */}

        <div className="contact-info">
          <div className="info-card">
            <LocationOnOutlinedIcon />
            <div>
              <h3>Our Address</h3>
              <p>123 Business Street</p>
              <p>Agadir,Assalam</p>
            </div>
          </div>

          <div className="info-card">
            <PhoneOutlinedIcon />
            <div>
              <h3>Phone</h3>
              <p>+212696252365</p>
            </div>
          </div>

          <div className="info-card">
            <EmailOutlinedIcon />
            <div>
              <h3>Email</h3>
              <p>support@gamerstore.com</p>
            </div>
          </div>

          <div className="info-card">
            <AccessTimeOutlinedIcon />
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="contact-form-container">
          <h2>Send us a Message</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <label>Your Name</label>
            </div>

            <div className="input-group">
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <input
                required
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
              <label>Subject</label>
            </div>

            <div className="input-group">
              <textarea
                required
                rows="6"
                name="message"
                value={form.message}
                onChange={handleChange}
              />
              <label>Your Message</label>
            </div>

            <button className="send-btn">
              <SendRoundedIcon />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
