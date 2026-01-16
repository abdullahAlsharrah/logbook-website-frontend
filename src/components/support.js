import React from "react";

function Support() {
  return (
    <div style={{ padding: 20 }}>
      <h2>KIMS Surgilog Support Center</h2>
      <p>
        Welcome to the KIMS Surgilog Support Center. We're here to help you get
        the most out of your digital logbook management experience. Whether
        you're a resident, tutor, administrator, or institution manager, we're
        committed to providing you with the assistance you need.
      </p>

      <h3>📩 Contact Us</h3>
      <p>
        If you need assistance or have any questions about using KIMS Surgilog,
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
        <li>
          <strong>Response Time:</strong> We typically respond within 24-48
          hours during business days.
        </li>
      </ul>

      <h3>🔐 Data & Privacy</h3>
      <p>
        We take your data privacy and security seriously. All data is encrypted
        and stored securely with institution-based isolation. You can view our
        full{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy here
        </a>
        .
      </p>
      <p>
        For privacy-related inquiries or data access requests, please contact us
        at the email above with "Privacy Request" in the subject line.
      </p>

      <h3>🛠️ Technical Issues</h3>
      <p>If you're experiencing technical difficulties with KIMS Surgilog:</p>
      <ul>
        <li>
          <strong>Web Dashboard Issues:</strong>
          <ul>
            <li>Clear your browser cache and cookies</li>
            <li>
              Try using a different browser (Chrome, Firefox, Safari, Edge)
            </li>
            <li>Ensure you're using a supported browser version</li>
            <li>Check your internet connection</li>
          </ul>
        </li>
        <li>
          <strong>Mobile App Issues:</strong>
          <ul>
            <li>Make sure you are using the latest version of the app</li>
            <li>Try restarting your device</li>
            <li>Check your internet connection</li>
            <li>Log out and log back in</li>
          </ul>
        </li>
        <li>
          <strong>General Troubleshooting:</strong>
          <ul>
            <li>Verify your login credentials are correct</li>
            <li>Check if your institution account is active</li>
            <li>Ensure you have the appropriate permissions for your role</li>
            <li>Contact us with a detailed description of the issue</li>
            <li>Include screenshots or error messages if possible</li>
          </ul>
        </li>
      </ul>

      <h3>👥 Account & Access Issues</h3>
      <p>Common account-related questions:</p>
      <ul>
        <li>
          <strong>Forgot Password:</strong> Use the "Forgot Password" feature on
          the login page, or contact your institution administrator.
        </li>
        <li>
          <strong>Can't Access Institution:</strong> Verify that you've been
          assigned to the institution and have the correct role permissions.
          Contact your institution administrator if needed.
        </li>
        <li>
          <strong>Multiple Institutions:</strong> You can switch between
          institutions using the institution selector. Each institution
          maintains separate data and permissions.
        </li>
        <li>
          <strong>Role Permissions:</strong> If you can't access certain
          features, verify your role assignment with your institution
          administrator.
        </li>
      </ul>

      <h3>📋 Using KIMS Surgilog</h3>
      <p>Frequently asked questions about features:</p>
      <ul>
        <li>
          <strong>Form Submissions:</strong> Residents can submit forms based on
          available templates. Ensure you've selected the correct institution
          and that the form is not restricted by your resident level.
        </li>
        <li>
          <strong>Review Process:</strong> Tutors can review and approve/reject
          submissions. Check your review queue in the Submissions section.
        </li>
        <li>
          <strong>Level Restrictions:</strong> Some forms and field options may
          be restricted based on your resident level (R1-R5). Contact your
          administrator if you believe you should have access.
        </li>
        <li>
          <strong>File Uploads:</strong> Supported file types include images
          (JPG, PNG) and documents. Ensure files are not too large (recommended
          max: 10MB).
        </li>
      </ul>

      <h3>🏥 Institution Administration</h3>
      <p>For institution administrators and super admins who need help with:</p>
      <ul>
        <li>Setting up new institutions</li>
        <li>Managing users and roles</li>
        <li>Creating form templates</li>
        <li>Configuring resident levels</li>
        <li>System configuration and customization</li>
      </ul>
      <p>
        Please contact us with your specific requirements, and we'll provide
        detailed guidance or arrange a consultation.
      </p>

      <h3>📤 Feature Requests & Feedback</h3>
      <p>
        We'd love to hear your ideas! Your feedback helps us improve KIMS
        Surgilog. Email us with:
      </p>
      <ul>
        <li>Suggestions for new features</li>
        <li>Improvements to existing features</li>
        <li>User experience feedback</li>
        <li>Bug reports (please include steps to reproduce)</li>
      </ul>
      <p>
        Please include "Feature Request" or "Feedback" in your email subject
        line.
      </p>

      <h3>📚 Documentation & Resources</h3>
      <p>
        For detailed documentation about KIMS Surgilog features, API
        documentation, and implementation guides, please refer to the
        documentation files available in your institution's resources or contact
        your system administrator.
      </p>

      <h3>🔒 Security Concerns</h3>
      <p>
        If you notice any security issues or suspect unauthorized access to your
        account:
      </p>
      <ul>
        <li>Change your password immediately</li>
        <li>Contact us immediately at the support email</li>
        <li>Include "Security Issue" in the subject line</li>
        <li>Do not share sensitive information via email</li>
      </ul>

      <p style={{ marginTop: 30, fontStyle: "italic", color: "#666" }}>
        Thank you for using KIMS Surgilog to support your medical training and
        education journey. We're committed to providing you with the best
        possible experience.
      </p>
    </div>
  );
}

export default Support;
