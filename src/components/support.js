import React from "react";

function Support() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Support</h2>
      <p>
        Welcome to the KBOG Support Center. We're here to help you get the most
        out of your digital logbook experience.
      </p>

      <h3>📩 Contact Us</h3>
      <p>
        If you need assistance or have any questions about using the KBOG app,
        feel free to reach out:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:obgyn.kims.kuwait@gmail.com">
            obgyn.kims.kuwait@gmail.com
          </a>
        </li>
        <li>
          <strong>Support Hours:</strong> Sunday – Thursday, 9:00 AM – 5:00 PM
          (GMT+3)
        </li>
      </ul>

      <h3>🔐 Data & Privacy</h3>
      <p>
        We take your data privacy seriously. You can view our full{" "}
        <a href="/privacy">Privacy Policy here</a>.
      </p>

      <h3>🛠️ Technical Issues</h3>
      <p>
        If the app crashes, won't load, or you're experiencing technical
        difficulties:
      </p>
      <ul>
        <li>Make sure you are using the latest version of the app.</li>
        <li>Try restarting your device.</li>
        <li>
          Contact us with a description of the issue and a screenshot if
          possible.
        </li>
      </ul>

      <h3>📤 Feature Requests</h3>
      <p>
        We’d love to hear your ideas! Email us with suggestions for new features
        you'd like to see in KBOG.
      </p>

      <p>Thank you for using KBOG to support your medical journey.</p>
    </div>
  );
}

export default Support;
