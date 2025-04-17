import { useRef } from "react";
import emailjs from "@emailjs/browser";

const ContactSection = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_s0azyqm",
        "template_r0hwgdb",
        form.current,
        "jnSDzhOlaYWF5rlDA"
      )
      .then(
        () => {
          alert("Message successfully sent!");
          form.current.reset();
        },
        () => {
          alert("Failed to send message,please try again");
        }
      );
  };
  return (
    <section id="contact">
      <h2 className="portfolio-section-headings">Contact</h2>
      <div className="reveal" id="contact-content">
        <form ref={form} id="contact-form" method="post" onSubmit={sendEmail}>
          <p id="contact-message">Have a question or want to work together? </p>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="NAME"
            name="from_name"
            required
          />
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="EMAIL"
            name="user_email"
            required
          />
          <textarea
            className="form-control"
            rows="10"
            id="message"
            placeholder="MESSAGE"
            name="message"
            required
          ></textarea>
          <input id="submit-button" type="submit" value="Submit" />
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
