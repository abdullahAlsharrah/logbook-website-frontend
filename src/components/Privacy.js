import React from "react";

function Privacy() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Privacy Policy for KIMS Surgilog</h2>
      <p>
        <strong>Effective Date:</strong> January 1, 2025
      </p>
      <p>
        <strong>Last Updated:</strong> January 1, 2025
      </p>

      <p>
        Thank you for using <strong>KIMS Surgilog</strong>, a comprehensive
        and secure digital logbook management system that helps medical
        training institutions, residents, tutors, and administrators manage
        clinical cases, procedures, and learning experiences. Your privacy is
        important to us, and this policy explains how we handle your data.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        KIMS Surgilog <strong>does not collect</strong> any of the following:
      </p>
      <ul>
        <li>IP addresses</li>
        <li>Device information</li>
        <li>Location data</li>
        <li>Advertising or usage analytics</li>
        <li>Background activity tracking</li>
        <li>Third-party tracking cookies</li>
        <li>Biometric data</li>
      </ul>
      <p>
        The only data we collect is what you{" "}
        <strong>intentionally enter into the system</strong>, such as:
      </p>
      <ul>
        <li>User account information (name, username, email, phone)</li>
        <li>Clinical cases and procedures</li>
        <li>Form submissions and logbook entries</li>
        <li>Learning notes and documentation</li>
        <li>Evaluation requests, feedback, and review comments</li>
        <li>Institution and role assignments</li>
        <li>Resident level assignments (R1-R5)</li>
        <li>File uploads (images, documents) related to training activities</li>
      </ul>

      <h3>2. Where Your Data is Stored</h3>
      <p>
        All user-submitted entries are stored securely in our{" "}
        <strong>cloud-based database</strong> to ensure:
      </p>
      <ul>
        <li>Your data is backed up and protected against loss</li>
        <li>
          You can access your logbook from different devices (mobile app, web
          dashboard)
        </li>
        <li>
          Supervisors, tutors, and program administrators (within your
          institution) can review your entries as authorized
        </li>
        <li>Data is isolated between institutions for privacy and security</li>
        <li>Multi-institution users can maintain separate data per institution</li>
      </ul>
      <p>
        We use <strong>secure encryption protocols (SSL/TLS)</strong> to protect
        your data both in transit and at rest. All passwords are hashed using
        industry-standard bcrypt encryption.
      </p>

      <h3>3. How We Use Your Data</h3>
      <p>We only use the data you provide to:</p>
      <ul>
        <li>Help you keep track of your medical training and logbook entries</li>
        <li>Support supervisor and tutor evaluation and review processes</li>
        <li>
          Maintain a structured logbook aligned with your academic and training
          requirements
        </li>
        <li>Enable institution administrators to manage users, forms, and submissions</li>
        <li>Facilitate communication through notifications and announcements</li>
        <li>Ensure proper access control based on roles and resident levels</li>
      </ul>
      <p>
        We <strong>do not</strong> use your data for:
      </p>
      <ul>
        <li>Marketing or advertising purposes</li>
        <li>Third-party analytics or tracking</li>
        <li>Sharing with external parties</li>
        <li>Commercial data mining or profiling</li>
      </ul>

      <h3>4. Age Restriction and User Eligibility</h3>
      <p>
        KIMS Surgilog is designed for use by medical training institutions and
        their authorized users, including medical residents, tutors, and
        administrators. Users must be at least 18 years of age or have
        appropriate institutional authorization to use the system.
      </p>
      <p>
        The system is intended for professional medical training purposes and
        requires institutional affiliation or authorization to access.
      </p>

      <h3>5. Data Access and Control</h3>
      <p>You have the right to:</p>
      <ul>
        <li>View and edit any data you've entered</li>
        <li>Access your submission history and logbook entries</li>
        <li>Request deletion of your account and associated data (subject to institutional policies)</li>
        <li>Export your data in a portable format (upon request)</li>
        <li>Contact us if you need help managing or exporting your entries</li>
        <li>Request information about what data is stored about you</li>
      </ul>
      <p>
        <strong>Note:</strong> Some data may be retained for institutional
        record-keeping purposes even after account deletion, in accordance with
        your institution's policies and applicable regulations.
      </p>
      <p>
        To make a request, contact us at:{" "}
        <strong>obgyn.kims.kuwait@gmail.com</strong>
      </p>

      <h3>6. Security Measures</h3>
      <p>We are committed to protecting your data through:</p>
      <ul>
        <li>
          <strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest
        </li>
        <li>
          <strong>Authentication:</strong> JWT-based secure authentication with password hashing (bcrypt)
        </li>
        <li>
          <strong>Access Control:</strong> Role-based access control ensures users only access authorized data
        </li>
        <li>
          <strong>Data Isolation:</strong> Institution-based data isolation prevents cross-institution data access
        </li>
        <li>
          <strong>Secure Servers:</strong> All data is stored on secure, monitored servers
        </li>
        <li>
          <strong>No Third-Party Sharing:</strong> We do not share or sell your information to any third parties
        </li>
        <li>
          <strong>Regular Security Updates:</strong> We maintain and update security measures regularly
        </li>
      </ul>

      <h3>7. Changes to This Policy</h3>
      <p>
        If we make significant updates to this Privacy Policy, we will notify
        you via the app or email.
      </p>

      <h3>8. Contact Us</h3>
      <p>For questions, concerns, or privacy-related inquiries, please reach out to:</p>
      <p>
        <strong>Email:</strong> obgyn.kims.kuwait@gmail.com
      </p>
      <p>
        <strong>Application Name:</strong> KIMS Surgilog
      </p>
      <p>
        <strong>Developer/Company Name:</strong> aksharrah
      </p>
      <p>
        We will respond to your inquiries within a reasonable timeframe, typically
        within 5-7 business days.
      </p>
    </div>
  );
}

export default Privacy;
