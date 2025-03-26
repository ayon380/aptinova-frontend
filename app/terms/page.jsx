"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
              <span className="text-md-on-surface text-2xl font-bold">
                AptInova
              </span>
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
              <h2 className="text-xl font-semibold mb-4 text-md-on-surface">
                Contents
              </h2>
              <ul className="space-y-2">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "acceptance", label: "Acceptance of Terms" },
                  { id: "eligibility", label: "Eligibility" },
                  { id: "accounts", label: "Accounts" },
                  { id: "services", label: "Platform Services" },
                  { id: "content", label: "User Content" },
                  { id: "conduct", label: "Prohibited Conduct" },
                  { id: "intellectual", label: "Intellectual Property" },
                  { id: "payments", label: "Payments" },
                  { id: "termination", label: "Termination" },
                  { id: "disclaimer", label: "Disclaimer" },
                  { id: "limitation", label: "Limitation of Liability" },
                  { id: "disputes", label: "Dispute Resolution" },
                  { id: "changes", label: "Changes to Terms" },
                  { id: "contact", label: "Contact Us" },
                ].map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-full transition-colors ${
                        activeSection === section.id
                          ? "bg-md-primary-container text-md-on-primary-container font-medium"
                          : "text-md-on-surface hover:bg-md-surface-variant"
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
                Terms of Service
              </motion.h1>
              <p className="text-md-on-surface-variant mb-4">
                Last Updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <section id="overview" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Overview
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    Welcome to AptInova. These Terms of Service govern your use
                    of our platform, including our website, mobile applications,
                    and all related services (collectively, the "Platform").
                    Please read these terms carefully before using our Platform.
                  </p>
                  <p>
                    Our Platform connects job seekers with employers and
                    provides tools to streamline the hiring process. By using
                    our Platform, you agree to these terms and our Privacy
                    Policy.
                  </p>
                </div>
              </section>

              <section id="acceptance" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Acceptance of Terms
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    By accessing or using the Platform, you agree to be bound by
                    these Terms of Service. If you do not agree to these terms,
                    you must not access or use the Platform.
                  </p>
                  <p>
                    We may modify these terms at any time, and such
                    modifications shall be effective immediately upon posting
                    the modified terms on the Platform. Your continued use of
                    the Platform means that you accept and agree to the modified
                    terms.
                  </p>
                </div>
              </section>

              <section id="eligibility" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Eligibility
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    You must be at least 18 years old to use our Platform. By
                    using the Platform, you represent and warrant that:
                  </p>
                  <ul>
                    <li>You are at least 18 years old;</li>
                    <li>
                      You have the legal capacity to enter into a binding
                      agreement;
                    </li>
                    <li>
                      You are not barred from using the Platform under
                      applicable law;
                    </li>
                    <li>
                      You will use the Platform in compliance with these Terms
                      and all applicable laws and regulations.
                    </li>
                  </ul>
                  <p>
                    If you are using the Platform on behalf of a company or
                    organization, you represent and warrant that you have the
                    authority to bind that entity to these Terms.
                  </p>
                </div>
              </section>

              <section id="accounts" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Accounts
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Registration
                  </h3>
                  <p>
                    To access certain features of the Platform, you must
                    register for an account. When you register, you must provide
                    accurate and complete information. You are responsible for
                    maintaining the confidentiality of your account credentials.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Account Types
                  </h3>
                  <p>
                    We offer different types of accounts for different users:
                  </p>
                  <ul>
                    <li>
                      <strong>Candidate Account:</strong> For job seekers
                      looking for employment opportunities.
                    </li>
                    <li>
                      <strong>Employer Account:</strong> For employers and HR
                      professionals posting jobs and managing hiring.
                    </li>
                    <li>
                      <strong>Organization Account:</strong> For companies
                      managing multiple employer accounts.
                    </li>
                  </ul>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Account Security
                  </h3>
                  <p>
                    You are responsible for all activities that occur under your
                    account. You must:
                  </p>
                  <ul>
                    <li>Maintain the security of your account credentials;</li>
                    <li>
                      Immediately notify us of any unauthorized use of your
                      account;
                    </li>
                    <li>
                      Ensure that you log out from your account at the end of
                      each session.
                    </li>
                  </ul>
                  <p>
                    We recommend using passkeys or other strong authentication
                    methods to secure your account.
                  </p>
                </div>
              </section>

              <section id="services" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Platform Services
                </h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl mb-4 border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <h3 className="text-xl font-medium text-md-on-surface mb-2">
                      For Candidates
                    </h3>
                    <p>
                      Our Platform provides candidates with services including:
                    </p>
                    <ul>
                      <li>Creating and managing professional profiles</li>
                      <li>Searching and applying for job opportunities</li>
                      <li>Skill assessments and development</li>
                      <li>Communication with potential employers</li>
                      <li>Career resources and guidance</li>
                    </ul>

                    <h3 className="text-xl font-medium text-md-on-surface mt-4 mb-2">
                      For Employers
                    </h3>
                    <p>
                      Our Platform provides employers with services including:
                    </p>
                    <ul>
                      <li>Posting and managing job listings</li>
                      <li>Candidate search and applicant tracking</li>
                      <li>Application review and candidate assessment tools</li>
                      <li>Interview scheduling and management</li>
                      <li>Analytics and reporting on recruitment activities</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-2">
                    Service Limitations
                  </h3>
                  <p className="text-md-on-primary-container mb-4">
                    While we strive to provide high-quality services, we do not
                    guarantee:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-md-on-primary-container">
                    <li>
                      That candidates will find employment through the Platform
                    </li>
                    <li>
                      That employers will find suitable candidates for all
                      positions
                    </li>
                    <li>The accuracy of information provided by users</li>
                    <li>Uninterrupted or error-free service</li>
                    <li>
                      That the results from using our services will meet your
                      expectations
                    </li>
                  </ul>
                </div>
              </section>

              <section id="content" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  User Content
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Your Content
                  </h3>
                  <p>
                    When you submit content to our Platform (including resumes,
                    job postings, profiles, messages, etc.), you grant us a
                    non-exclusive, worldwide, royalty-free license to use, copy,
                    modify, distribute, and display that content in connection
                    with the services we provide to you and other users.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Content Responsibility
                  </h3>
                  <p>
                    You are solely responsible for any content you post on the
                    Platform. You represent and warrant that:
                  </p>
                  <ul>
                    <li>
                      You own or have obtained all necessary rights to the
                      content you post;
                    </li>
                    <li>
                      Your content does not infringe upon the rights of any
                      third party;
                    </li>
                    <li>
                      Your content does not violate any applicable laws or
                      regulations;
                    </li>
                    <li>Your content is accurate and not misleading.</li>
                  </ul>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Content Moderation
                  </h3>
                  <p>
                    We reserve the right to review, monitor, and remove any
                    content that violates these Terms or that we find
                    objectionable for any reason, without prior notice.
                  </p>
                </div>
              </section>

              <section id="conduct" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Prohibited Conduct
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>You agree not to:</p>
                  <ul>
                    <li>
                      Use the Platform for any illegal purpose or in violation
                      of any laws;
                    </li>
                    <li>
                      Post false, inaccurate, misleading, deceptive, or
                      offensive content;
                    </li>
                    <li>
                      Impersonate any person or entity or misrepresent your
                      affiliation with a person or entity;
                    </li>
                    <li>
                      Interfere with or disrupt the Platform or servers or
                      networks connected to the Platform;
                    </li>
                    <li>
                      Attempt to gain unauthorized access to any part of the
                      Platform;
                    </li>
                    <li>
                      Use any robot, spider, scraper, or other automated means
                      to access the Platform;
                    </li>
                    <li>
                      Collect or harvest any information about other users
                      without their consent;
                    </li>
                    <li>
                      Publish, post, upload, distribute or disseminate any
                      inappropriate, profane, defamatory, infringing, obscene,
                      indecent or unlawful content;
                    </li>
                    <li>
                      Discriminate against or harass anyone based on race,
                      gender, religion, nationality, disability, sexual
                      orientation, or age;
                    </li>
                    <li>Distribute viruses, worms, or other malicious code;</li>
                    <li>
                      Engage in any other conduct that restricts or inhibits
                      anyone's use or enjoyment of the Platform.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="intellectual" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Intellectual Property
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Our Intellectual Property
                  </h3>
                  <p>
                    The Platform and its original content, features, and
                    functionality are owned by AptInova and are protected by
                    international copyright, trademark, patent, trade secret,
                    and other intellectual property or proprietary rights laws.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Limited License
                  </h3>
                  <p>
                    We grant you a limited, non-exclusive, non-transferable
                    license to use the Platform for your personal or internal
                    business purposes, subject to these Terms.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Trademarks
                  </h3>
                  <p>
                    "AptInova" and all related logos, product and service names,
                    and designs are trademarks of AptInova or its affiliates.
                    You may not use such marks without our prior written
                    permission.
                  </p>
                </div>
              </section>

              <section id="payments" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Payments
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Subscription Plans
                  </h3>
                  <p>
                    We offer various subscription plans for different users.
                    Details of the features included in each plan and current
                    pricing are available on our website.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Payment Processing
                  </h3>
                  <p>
                    Payments are processed through our third-party payment
                    processors. By providing payment information, you represent
                    that you are authorized to use the payment method and you
                    authorize us to charge your payment method for the total
                    amount of your subscription or purchase.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Recurring Billing
                  </h3>
                  <p>
                    For subscription services, you will be billed in advance on
                    a recurring basis, depending on your subscription cycle
                    (monthly, annually, etc.). You can cancel your subscription
                    at any time through your account settings or by contacting
                    our customer support team.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Refunds
                  </h3>
                  <p>
                    Our refund policy is detailed on our website. Generally,
                    subscriptions are non-refundable except as required by law
                    or as specifically stated in our refund policy.
                  </p>
                </div>
              </section>

              <section id="termination" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Termination
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Termination by You
                  </h3>
                  <p>
                    You may terminate your account at any time by following the
                    instructions on our Platform or by contacting our customer
                    support team.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Termination by Us
                  </h3>
                  <p>
                    We may terminate or suspend your account and access to the
                    Platform immediately, without prior notice or liability, for
                    any reason, including, without limitation, if you breach
                    these Terms.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Effect of Termination
                  </h3>
                  <p>
                    Upon termination, your right to use the Platform will
                    immediately cease. All provisions of these Terms which by
                    their nature should survive termination shall survive
                    termination, including, without limitation, ownership
                    provisions, warranty disclaimers, indemnity, and limitations
                    of liability.
                  </p>
                </div>
              </section>

              <section id="disclaimer" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Disclaimer
                </h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
                      BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND,
                      WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
                      THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                      PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>
                      WE MAKE NO WARRANTY THAT (i) THE PLATFORM WILL MEET YOUR
                      REQUIREMENTS, (ii) THE PLATFORM WILL BE UNINTERRUPTED,
                      TIMELY, SECURE, OR ERROR-FREE, (iii) THE RESULTS THAT MAY
                      BE OBTAINED FROM THE USE OF THE PLATFORM WILL BE ACCURATE
                      OR RELIABLE, OR (iv) THE QUALITY OF ANY PRODUCTS,
                      SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR
                      OBTAINED BY YOU THROUGH THE PLATFORM WILL MEET YOUR
                      EXPECTATIONS.
                    </p>
                  </div>
                </div>
              </section>

              <section id="limitation" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Limitation of Liability
                </h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl border border-md-outline">
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      IN NO EVENT SHALL APTINOVA, ITS OFFICERS, DIRECTORS,
                      EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT,
                      INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL
                      DAMAGES WHATSOEVER RESULTING FROM (i) ERRORS, MISTAKES, OR
                      INACCURACIES OF CONTENT, (ii) PERSONAL INJURY OR PROPERTY
                      DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR
                      ACCESS TO AND USE OF THE PLATFORM, (iii) ANY UNAUTHORIZED
                      ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL
                      PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
                      THEREIN, (iv) ANY INTERRUPTION OR CESSATION OF
                      TRANSMISSION TO OR FROM THE PLATFORM, (v) ANY BUGS,
                      VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH MAY BE
                      TRANSMITTED TO OR THROUGH THE PLATFORM BY ANY THIRD PARTY,
                      AND/OR (vi) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR
                      ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF
                      YOUR USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR
                      OTHERWISE MADE AVAILABLE VIA THE PLATFORM, WHETHER BASED
                      ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY,
                      AND WHETHER OR NOT THE COMPANY IS ADVISED OF THE
                      POSSIBILITY OF SUCH DAMAGES.
                    </p>
                    <p>
                      THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE
                      FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE
                      JURISDICTION. YOU SPECIFICALLY ACKNOWLEDGE THAT APTINOVA
                      SHALL NOT BE LIABLE FOR USER CONTENT OR THE DEFAMATORY,
                      OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY AND THAT
                      THE RISK OF HARM OR DAMAGE FROM THE FOREGOING RESTS
                      ENTIRELY WITH YOU.
                    </p>
                  </div>
                </div>
              </section>

              <section id="disputes" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Dispute Resolution
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Governing Law
                  </h3>
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with the laws of the State of California, without regard to
                    its conflict of law provisions.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Arbitration
                  </h3>
                  <p>
                    Any dispute arising from or relating to these Terms or your
                    use of the Platform shall be resolved through binding
                    arbitration in San Francisco, California, in accordance with
                    the rules of the American Arbitration Association.
                  </p>

                  <h3 className="text-xl font-medium mt-4 text-md-on-surface">
                    Class Action Waiver
                  </h3>
                  <p>
                    You agree that any dispute resolution proceedings will be
                    conducted only on an individual basis and not in a class,
                    consolidated, or representative action.
                  </p>
                </div>
              </section>

              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Changes to Terms
                </h2>
                <div className="prose prose-slate text-md-on-surface-variant">
                  <p>
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. We will provide notice of
                    any significant changes by posting the new Terms on the
                    Platform, updating the "Last Updated" date at the top of
                    these Terms, and/or by sending you an email.
                  </p>
                  <p>
                    Your continued use of the Platform after any such changes
                    constitutes your acceptance of the new Terms. If you do not
                    agree to the new Terms, you must stop using the Platform.
                  </p>
                </div>
              </section>

              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-md-on-surface">
                  Contact Us
                </h2>
                <div className="bg-md-surface-container-high p-6 rounded-3xl border border-md-outline">
                  <p className="text-md-on-surface mb-4">
                    If you have any questions about these Terms, please contact
                    us at:
                  </p>
                  <div className="space-y-2 text-md-on-surface">
                    <p>
                      <strong>AptInova, Inc.</strong>
                    </p>
                    <p>123 Technology Drive</p>
                    <p>San Francisco, CA 94107</p>
                    <p>Email: legal@aptinova.com</p>
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
              <h3 className="text-xl font-bold mb-4 text-md-on-surface">
                AptInova
              </h3>
              <p className="text-md-on-surface-variant">
                Modern hiring solutions for candidates and companies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">
                For Candidates
              </h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li>
                  <Link href="/jobs" className="hover:text-md-primary">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/candidate/register"
                    className="hover:text-md-primary"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/candidates"
                    className="hover:text-md-primary"
                  >
                    Career Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">
                For Employers
              </h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li>
                  <Link
                    href="/employer/register"
                    className="hover:text-md-primary"
                  >
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-md-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/employers"
                    className="hover:text-md-primary"
                  >
                    Hiring Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-md-on-surface mb-4">Legal</h4>
              <ul className="space-y-2 text-md-on-surface-variant">
                <li>
                  <Link href="/privacy" className="hover:text-md-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-md-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-md-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-md-outline-variant text-center text-md-on-surface-variant">
            <p>
              © {new Date().getFullYear()} AptInova, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for mobile scroll to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-6 bottom-6 z-40 h-14 w-14 rounded-full bg-md-primary text-md-on-primary shadow-lg flex items-center justify-center md:hidden"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
}
