import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const faqData = [
  {
    question: "How do I adopt a pet from PETZY?",
    answer: "Browse our available pets on the Pet Adoption page, select your favorite, and fill out the adoption form. Our team will contact you shortly to complete the process."
  },
  {
    question: "What are the requirements for adopting a pet?",
    answer: "You must be at least 18 years old, provide proof of residence, and demonstrate the ability to care for the pet. We'll conduct a brief interview to ensure a good match."
  },
  {
    question: "Is there an adoption fee?",
    answer: "Yes, there is a small adoption fee that covers vaccination, microchipping, and initial veterinary checkup. The fee varies depending on the pet type and age."
  },
  {
    question: "Can I post my pet for adoption?",
    answer: "Yes! Use our Post a Pet feature in the Services section to list your pet for adoption. Provide details about the pet's age, breed, health status, and reason for rehoming."
  },
  {
    question: "How can I donate to PETZY?",
    answer: "Visit our Donation page to make a one-time or monthly donation. Your contributions help us care for animals in need and support our adoption programs."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, bKash, and bank transfers. All donations are secure and tax-deductible."
  },
  {
    question: "Do you offer veterinary services?",
    answer: "Yes, we have a network of experienced veterinarians available for consultations, checkups, and treatments. Visit our Veterinary page to learn more."
  },
  {
    question: "How can I contact PETZY support?",
    answer: "You can reach us through the Contact page, email us at support@petzy.com, or use our live chat feature. We're available 24/7 to assist you."
  },
  {
    question: "What products are available in the pet store?",
    answer: "Our store offers a wide range of pet supplies including food, toys, grooming products, accessories, and habitat supplies for various pets."
  },
  {
    question: "How do I track my order?",
    answer: "Log into your account and visit the Order History section to track your deliveries. You can also contact our support team for assistance."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unopened products. For damaged or defective items, please contact us within 7 days for a replacement."
  },
  {
    question: "How do I become a PETZY volunteer?",
    answer: "Visit our Contact page and fill out the volunteer application form. We'll reach out to discuss opportunities based on your skills and availability."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "rgb(63, 136, 238)" }}>
          Frequently Asked Questions
        </h1>
        <p className="text-muted">
          Find answers to common questions about PETZY services and policies
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="accordion" id="faqAccordion">
            {faqData.map((item, index) => (
              <div className="accordion-item mb-3 border-0 shadow-sm rounded" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${openIndex === index ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    style={{
                      backgroundColor: openIndex === index ? "rgb(63, 136, 238)" : "white",
                      color: openIndex === index ? "white" : "inherit",
                      fontWeight: "600"
                    }}
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}
                >
                  <div className="accordion-body text-muted">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="text-muted">
          Can't find what you're looking for?{" "}
          <a href="/contact" className="text-decoration-none" style={{ color: "rgb(63, 136, 238)" }}>
            Contact Us
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQ;