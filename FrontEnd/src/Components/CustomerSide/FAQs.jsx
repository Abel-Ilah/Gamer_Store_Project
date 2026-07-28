import { useState } from "react";
import "./FAQs.css";
import "./Shared.css";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

const faqData = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders are typically delivered within 3–7 business days depending on your location.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes. You can return any unused product within 30 days of receiving your order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to your account, open 'My Orders', and click 'Track Order' to see the latest shipping updates.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, MasterCard, PayPal, and Cash on Delivery (where available).",
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! Orders above $50 qualify for free standard shipping.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Our support team is available 24/7 through email, phone, and live chat.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders can be cancelled before they are shipped. Contact support as soon as possible.",
  },
  {
    question: "Are your products covered by warranty?",
    answer:
      "Yes. Most products include a manufacturer's warranty. Check the product page for details.",
  },
];

export default function FAQs() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="faq-page shared">
      <div className="head">
        <PsychologyAltIcon className="icon" />
        <h2 className="s-title">Frequently Asked Questions</h2>
      </div>
      <p className="text-start mb-5">
        Find quick answers to the questions our customers ask most often.
      </p>
      <div className="faq-search">
        <SearchIcon />

        <input
          type="text"
          placeholder="Search a question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="faq-container">
        {filtered.length > 0 ? (
          filtered.map((faq, index) => (
            <div
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>

                <ExpandMoreIcon
                  className={`icon ${openIndex === index ? "rotate" : ""}`}
                />
              </button>

              <div
                className={`faq-answer ${openIndex === index ? "show" : ""}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No questions found.</div>
        )}
      </div>
    </div>
  );
}
