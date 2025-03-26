"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-md-background h-dvh">
      {/* Header */}
      <header className="bg-md-surface-container py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-md-on-surface text-2xl font-bold">AptInova</span>
            </Link>
            <Link 
              href="/auth/login" 
              className="px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="md:w-64 mb-8 md:mb-0">
            <div className="bg-md-surface-container p-4 rounded-3xl sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-md-on-surface">Contents</h2>
              <ul className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'collection', label: 'Information We Collect' },
                  { id: 'candidates', label: 'For Candidates' },
                  { id: 'employers', label: 'For Employers & HR' },
                  { id: 'organizations', label: 'For Organizations' },
                  { id: 'usage', label: 'How We Use Information' },
                  { id: 'sharing', label: 'Information Sharing' },
                  { id: 'security', label: 'Security Measures' },
                  { id: 'rights', label: 'Your Rights' },
                  { id: 'changes', label: 'Changes to Policy' },
                  { id: 'contact', label: 'Contact Us' }
                ].map(section => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-full transition-colors ${
                        activeSection === section.id
                          ? 'bg-md-primary-container text-md-on-primary-container font-medium'
                          : 'text-md-on-surface hover:bg-md-surface-variant'
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-md-surface-container p-6 md:p-8 rounded-3xl">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-6 text-md-on-surface"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Privacy Policy
              </motion.h1>
              <p className="text-md-on-surface-variant mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <section id="overview" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Overview</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    At AptInova, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. 
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
                  </p>
                  <p>
                    We reserve the right to make changes to this Privacy Policy at any time and for any reason. 
                    We will alert you about any changes by updating the "Last Updated" date of this privacy policy.
                  </p>
                </div>
              </section>

              <section id="collection" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Information We Collect</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>We may collect information about you in a variety of ways. The information we may collect via the Platform includes:</p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Personal Data</h3>
                  <p>
                    Personally identifiable information, such as your name, email address, telephone number, and demographic information that you voluntarily give to us when you register with the Platform or when you choose to participate in various activities related to the Platform. 
                    You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Platform.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Derivative Data</h3>
                  <p>
                    Information our servers automatically collect when you access the Platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Platform.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Financial Data</h3>
                  <p>
                    Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase a subscription. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor.
                  </p>
                </div>
              </section>

              <section id="candidates" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">For Candidates</h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl mb-4 border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <h3 className="text-xl font-medium text-md-on-surface mb-2">Profile Information</h3>
                    <p>
                      When you create a candidate profile, we collect information such as your name, email address, phone number, professional title, work experience, education history, skills, certifications, and other career-related information.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Resume and Documents</h3>
                    <p>
                      We collect any resumes, CVs, cover letters, or other documents you upload to our platform. These documents may contain additional personal information beyond what is in your profile.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Job Application Data</h3>
                    <p>
                      When you apply for jobs through our platform, we collect information about the positions you apply for, your application status, and any responses or assessments you provide during the application process.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Passkeys and Authentication</h3>
                    <p>
                      We collect information related to passkeys and other authentication methods you use to secure your account, including device information used during authentication.
                    </p>
                  </div>
                </div>
                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-2">Candidate Privacy Commitments</h3>
                  <ul className="list-disc list-inside space-y-2 text-md-on-primary-container">
                    <li>We will never sell your personal information to third parties.</li>
                    <li>You maintain control over your profile visibility settings.</li>
                    <li>You can request deletion of your account and associated data at any time.</li>
                    <li>We implement appropriate measures to protect your resume and personal information.</li>
                    <li>You can opt out of promotional communications while still receiving essential service notifications.</li>
                  </ul>
                </div>
              </section>

              <section id="employers" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">For Employers & HR Professionals</h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl mb-4 border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <h3 className="text-xl font-medium text-md-on-surface mb-2">Company Information</h3>
                    <p>
                      When you register as an employer or HR professional, we collect information about your company, such as company name, industry, size, location, and company description.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Job Postings</h3>
                    <p>
                      We collect information about job postings you create, including job titles, descriptions, requirements, salary ranges, and other position details.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Applicant Review Data</h3>
                    <p>
                      We collect data related to your interactions with applicants, such as interview scheduling, notes, ratings, and hiring decisions.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Payment Information</h3>
                    <p>
                      For paid services, we collect payment information, which is processed securely by our payment processors.
                    </p>
                  </div>
                </div>
                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-2">Employer Privacy Commitments</h3>
                  <ul className="list-disc list-inside space-y-2 text-md-on-primary-container">
                    <li>We implement secure access controls for your recruitment team members.</li>
                    <li>We provide tools to help you comply with relevant data protection regulations.</li>
                    <li>Candidate data is only available to authorized members of your organization.</li>
                    <li>We maintain audit logs of recruitment activities to ensure accountability.</li>
                    <li>You can define data retention periods for candidate information.</li>
                  </ul>
                </div>
              </section>

              <section id="organizations" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">For Organizations</h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl mb-4 border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <h3 className="text-xl font-medium text-md-on-surface mb-2">Organizational Data</h3>
                    <p>
                      We collect information about your organization's structure, departments, hiring needs, and recruitment processes to customize our platform for your use.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">User Management</h3>
                    <p>
                      We collect information about users within your organization, including roles, permissions, and account activities.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Analytics and Reporting</h3>
                    <p>
                      We collect data for analytics and reporting purposes, such as recruitment metrics, hiring funnel statistics, and platform usage patterns.
                    </p>
                    
                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">Integration Data</h3>
                    <p>
                      If you use our platform integrations with other services (such as HRIS systems), we may collect relevant data needed for those integrations to function properly.
                    </p>
                  </div>
                </div>
                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-2">Organization Privacy Commitments</h3>
                  <ul className="list-disc list-inside space-y-2 text-md-on-primary-container">
                    <li>We offer enterprise-grade security features for organizational accounts.</li>
                    <li>You maintain control over data sharing across departments or business units.</li>
                    <li>We provide tools for demonstrating compliance with data protection regulations.</li>
                    <li>You can set customized data retention policies aligned with your organizational requirements.</li>
                    <li>We support secure Single Sign-On (SSO) options for enterprise authentication.</li>
                  </ul>
                </div>
              </section>

              <section id="usage" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">How We Use Your Information</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:</p>
                  
                  <ul>
                    <li>Create and manage your account.</li>
                    <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                    <li>Create and manage your account.</li>
                    <li>Deliver targeted advertising, newsletters, and other information regarding promotions and the Platform to you.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Enable user-to-user communications.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Platform.</li>
                    <li>Generate a personal profile about you to make future visits to the Platform more personalized.</li>
                    <li>Increase the efficiency and operation of the Platform.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Platform.</li>
                    <li>Notify you of updates to the Platform.</li>
                    <li>Offer new products, services, mobile applications, and/or recommendations to you.</li>
                    <li>Perform other business activities as needed.</li>
                    <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                    <li>Process payments and refunds.</li>
                    <li>Request feedback and contact you about your use of the Platform.</li>
                    <li>Resolve disputes and troubleshoot problems.</li>
                    <li>Respond to product and customer service requests.</li>
                    <li>Send you a newsletter.</li>
                  </ul>
                </div>
              </section>

              <section id="sharing" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Information Sharing</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">By Law or to Protect Rights</h3>
                  <p>
                    If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Third-Party Service Providers</h3>
                  <p>
                    We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Marketing Communications</h3>
                  <p>
                    With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Interactions with Other Users</h3>
                  <p>
                    If you interact with other users of the Platform, those users may see your name, profile photo, and descriptions of your activity.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Online Postings</h3>
                  <p>
                    When you post comments, contributions or other content to the Platform, your posts may be viewed by all users and may be publicly distributed outside the Platform in perpetuity.
                  </p>
                </div>
              </section>

              <section id="security" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Security Measures</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                  </p>
                  <p>
                    Our security measures include:
                  </p>
                  <ul>
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Strong authentication mechanisms, including support for passkeys</li>
                    <li>Regular security training for all staff members</li>
                    <li>Access controls that limit data access to authorized personnel</li>
                    <li>Monitoring systems to detect unusual activities</li>
                    <li>Disaster recovery and business continuity plans</li>
                  </ul>
                </div>
              </section>

              <section id="rights" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Your Rights</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Access</h3>
                  <p>
                    You have the right to request information about the personal data we hold about you and to access that data.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Rectification</h3>
                  <p>
                    You are entitled to have your data corrected if it is inaccurate or incomplete.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Erasure</h3>
                  <p>
                    You have the right to request the deletion or removal of your personal data where there is no compelling reason for its continued processing.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Restrict Processing</h3>
                  <p>
                    You have the right to 'block' or suppress processing of personal data.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Data Portability</h3>
                  <p>
                    You have the right to obtain and reuse your personal data for your own purposes across different services.
                  </p>
                  
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">Right to Object</h3>
                  <p>
                    You have the right to object to processing based on legitimate interests or the performance of a task in the public interest/exercise of official authority, direct marketing, and processing for purposes of scientific/historical research and statistics.
                  </p>
                </div>
              </section>

              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Changes to This Privacy Policy</h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. If we make material changes to this privacy policy, we will notify you by email or by posting a notice on our website prior to the effective date of the changes.
                  </p>
                  <p>
                    Your continued use of the Platform after any modification to the Privacy Policy will constitute your acceptance of such modification.
                  </p>
                </div>
              </section>

              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">Contact Us</h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl border border-md-outline">
                  <p className="text-md-on-surface mb-4">
                    If you have questions or comments about this Privacy Policy, please contact us at:
                  </p>
                  <div className="space-y-2 text-md-on-surface">
                    <p><strong>AptInova, Inc.</strong></p>
                    <p>123 Technology Drive</p>
                    <p>San Francisco, CA 94107</p>
                    <p>Email: privacy@aptinova.com</p>
                    <p>Phone: (555) 123-4567</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-md-surface-container py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-md-on-surface">AptInova</h3>
              <p className="text-md-on-surface-variant">
                Modern hiring solutions for candidates and companies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">For Candidates</h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li><Link href="/jobs" className="hover:text-md-primary">Browse Jobs</Link></li>
                <li><Link href="/candidate/register" className="hover:text-md-primary">Create Account</Link></li>
                <li><Link href="/resources/candidates" className="hover:text-md-primary">Career Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">For Employers</h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li><Link href="/employer/register" className="hover:text-md-primary">Post Jobs</Link></li>
                <li><Link href="/pricing" className="hover:text-md-primary">Pricing</Link></li>
                <li><Link href="/resources/employers" className="hover:text-md-primary">Hiring Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">Legal</h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li><Link href="/privacy" className="hover:text-md-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-md-primary">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-md-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-md-outline-variant text-center text-md-on-surface-variant">
            <p>© {new Date().getFullYear()} AptInova, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for mobile scroll to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-6 bottom-6 z-40 h-14 w-14 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center md:hidden"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}
