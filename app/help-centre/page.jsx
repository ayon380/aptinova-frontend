"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HelpCentre = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeCategory, setActiveCategory] = useState("general");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-md-background min-h-dvh">
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
                Help Topics
              </h2>
              <ul className="space-y-2">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "accounts", label: "Account Management" },
                  { id: "candidates", label: "For Candidates" },
                  { id: "employers", label: "For Employers" },
                  { id: "billing", label: "Billing & Payments" },
                  { id: "privacy", label: "Privacy & Security" },
                  { id: "technical", label: "Technical Issues" },
                  { id: "contact", label: "Contact Support" },
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
                Help Centre
              </motion.h1>
              <p className="text-md-on-surface-variant mb-8">
                Find answers to common questions, learn how to use our platform,
                and get in touch with our support team.
              </p>

              <section id="overview" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Getting Started
                    </h3>
                    <p className="text-md-on-surface-variant mb-4">
                      New to AptInova? Learn how to set up your account and
                      explore our key features.
                    </p>
                    <button
                      onClick={() => scrollToSection("accounts")}
                      className="text-md-primary hover:text-md-primary-container font-medium"
                    >
                      Learn more →
                    </button>
                  </div>
                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Popular Resources
                    </h3>
                    <ul className="space-y-2 text-md-on-surface-variant">
                      <li className="flex items-start">
                        <span className="text-md-primary mr-2">•</span>
                        <Link
                          href="#account-creation"
                          onClick={() => scrollToSection("accounts")}
                          className="hover:text-md-primary"
                        >
                          Creating and setting up your account
                        </Link>
                      </li>
                      <li className="flex items-start">
                        <span className="text-md-primary mr-2">•</span>
                        <Link
                          href="#profile-optimization"
                          onClick={() => scrollToSection("candidates")}
                          className="hover:text-md-primary"
                        >
                          Optimizing your candidate profile
                        </Link>
                      </li>
                      <li className="flex items-start">
                        <span className="text-md-primary mr-2">•</span>
                        <Link
                          href="#job-posting"
                          onClick={() => scrollToSection("employers")}
                          className="hover:text-md-primary"
                        >
                          Posting a job listing
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-md-primary-container p-6 rounded-3xl mb-6">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-3">
                    Need immediate assistance?
                  </h3>
                  <p className="text-md-on-primary-container mb-4">
                    Our support team is ready to help you with any questions or
                    issues.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="px-4 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-on-primary-container hover:text-md-primary-container transition-colors"
                    >
                      Contact Support
                    </button>
                    <Link
                      href="mailto:support@aptinova.com"
                      className="px-4 py-2 border border-md-primary text-md-on-primary-container rounded-full hover:bg-md-on-primary-container hover:text-md-primary transition-colors"
                    >
                      Email Us
                    </Link>
                  </div>
                </div>
              </section>

              <section id="accounts" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Account Management
                </h2>

                <div className="space-y-6">
                  <div
                    id="account-creation"
                    className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline"
                  >
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Creating an Account
                    </h3>
                    <div className="prose prose-slate text-md-on-surface-variant">
                      <p>To create an AptInova account:</p>
                      <ol className="list-decimal list-inside pl-4 space-y-2">
                        <li>Click "Sign Up" at the top of the page</li>
                        <li>
                          Choose your account type (Candidate or Employer)
                        </li>
                        <li>Enter your email address and create a password</li>
                        <li>
                          Verify your email address by clicking the link in the
                          confirmation email
                        </li>
                        <li>Complete your profile information</li>
                      </ol>
                      <p className="mt-4">
                        We recommend using passkeys or enabling two-factor
                        authentication for enhanced security.
                      </p>
                    </div>
                  </div>

                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Managing Account Settings
                    </h3>
                    <div className="prose prose-slate text-md-on-surface-variant">
                      <p>
                        You can manage your account settings by clicking on your
                        profile icon in the top-right corner and selecting
                        "Settings". From there, you can:
                      </p>
                      <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>Update your personal information</li>
                        <li>Change your password</li>
                        <li>Manage notification preferences</li>
                        <li>Update privacy settings</li>
                        <li>Link social media accounts</li>
                        <li>Manage connected applications</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Account Recovery
                    </h3>
                    <div className="prose prose-slate text-md-on-surface-variant">
                      <p>
                        If you've forgotten your password or are having trouble
                        accessing your account:
                      </p>
                      <ol className="list-decimal list-inside pl-4 space-y-2">
                        <li>Click "Sign In" at the top of the page</li>
                        <li>Select "Forgot password?"</li>
                        <li>
                          Enter the email address associated with your account
                        </li>
                        <li>
                          Follow the instructions sent to your email to reset
                          your password
                        </li>
                      </ol>
                      <p className="mt-4">
                        If you no longer have access to your email, please
                        contact our support team for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="candidates" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  For Candidates
                </h2>

                <div className="mb-6">
                  <div className="bg-md-surface-container-low p-4 rounded-2xl mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-md-on-surface">
                        Frequently Asked Questions
                      </h3>
                      <div className="flex gap-2">
                        {["general", "applications", "assessments"].map(
                          (category) => (
                            <button
                              key={category}
                              onClick={() => setActiveCategory(category)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                activeCategory === category
                                  ? "bg-md-primary-container text-md-on-primary-container"
                                  : "text-md-on-surface-variant hover:bg-md-surface-variant"
                              }`}
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {activeCategory === "general" && (
                    <div className="space-y-4">
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          Is it free to apply for jobs on AptInova?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          Yes, creating a candidate account and applying for
                          jobs on AptInova is completely free. We don't charge
                          candidates for any of our basic services.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          Can employers see when I view their job listings?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          No, employers cannot see when you view their job
                          listings. They will only be notified when you submit
                          an application.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          How do I make my profile private?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          Go to Settings &gt; Privacy, where you can control who
                          can view your profile, contact you, and see your
                          activity. You can set your profile to "Private" to
                          hide it from employer searches.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeCategory === "applications" && (
                    <div className="space-y-4">
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          How do I know if my application was received?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          After submitting an application, you'll receive a
                          confirmation email. You can also check the status of
                          all your applications in the "Applications" section of
                          your dashboard.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          Can I edit my application after submitting?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          Once submitted, applications cannot be edited.
                          However, you can withdraw your application and submit
                          a new one if the job is still open.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          How many jobs can I apply to?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          There is no limit to the number of jobs you can apply
                          to on AptInova. However, we recommend focusing on
                          positions that best match your skills and experience.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeCategory === "assessments" && (
                    <div className="space-y-4">
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          What types of assessments might I need to take?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          Depending on the role, employers may require technical
                          skills assessments, personality assessments, or
                          job-specific tests. These requirements will be clearly
                          stated in the job description.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          Can I retake an assessment if I'm not satisfied with
                          my results?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          Most assessments have a cooling-off period before they
                          can be retaken, typically 30 days. This policy varies
                          by assessment type and employer preferences.
                        </p>
                      </div>
                      <div className="bg-md-surface-container-high p-5 rounded-2xl border border-md-outline">
                        <h4 className="font-medium text-md-on-surface">
                          Are assessment results shared with all employers?
                        </h4>
                        <p className="text-md-on-surface-variant mt-2">
                          By default, assessment results are only shared with
                          the employer who requested them. However, you can opt
                          to add certain assessment certifications to your
                          profile to showcase your skills to other employers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  id="profile-optimization"
                  className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mt-8"
                >
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Optimizing Your Profile
                  </h3>
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      A complete and optimized profile increases your chances of
                      being discovered by employers. Here are some tips:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                      <li>
                        <strong>Professional photo:</strong> Add a clear,
                        professional headshot
                      </li>
                      <li>
                        <strong>Detailed experience:</strong> Include specific
                        accomplishments and metrics from previous roles
                      </li>
                      <li>
                        <strong>Skills section:</strong> Add relevant skills
                        that match your target positions
                      </li>
                      <li>
                        <strong>Portfolio:</strong> Include samples of your work
                        when applicable
                      </li>
                      <li>
                        <strong>Education & certifications:</strong> List all
                        relevant qualifications
                      </li>
                      <li>
                        <strong>Keywords:</strong> Include industry-specific
                        keywords throughout your profile
                      </li>
                    </ul>
                    <p className="mt-4">
                      Remember to keep your profile updated as you gain new
                      skills and experiences.
                    </p>
                  </div>
                </div>
              </section>

              <section id="employers" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  For Employers
                </h2>

                <div
                  id="job-posting"
                  className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mb-6"
                >
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Posting a Job
                  </h3>
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>To create an effective job posting:</p>
                    <ol className="list-decimal list-inside pl-4 space-y-2">
                      <li>From your dashboard, click "Post a Job"</li>
                      <li>
                        Fill in the job details (title, location, type, salary
                        range)
                      </li>
                      <li>
                        Write a compelling job description including
                        responsibilities and requirements
                      </li>
                      <li>Add screening questions if desired</li>
                      <li>
                        Select any assessments you want candidates to complete
                      </li>
                      <li>Review and publish your listing</li>
                    </ol>
                    <p className="mt-4">
                      For best results, be specific about requirements but avoid
                      overly restrictive criteria that might exclude qualified
                      candidates.
                    </p>
                  </div>
                </div>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mb-6">
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Managing Applications
                  </h3>
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      AptInova's Applicant Tracking System helps you efficiently
                      manage candidates:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                      <li>View all applications in your dashboard</li>
                      <li>
                        Filter candidates by skills, experience, or assessment
                        scores
                      </li>
                      <li>Add notes and ratings for each candidate</li>
                      <li>
                        Move candidates through your customized hiring pipeline
                      </li>
                      <li>Schedule interviews directly through the platform</li>
                      <li>Send automated or personalized communications</li>
                    </ul>
                    <p className="mt-4">
                      Pro tip: Use the batch actions feature to manage multiple
                      candidates simultaneously, saving you valuable time.
                    </p>
                  </div>
                </div>

                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-3">
                    Employer Resources
                  </h3>
                  <p className="text-md-on-primary-container mb-4">
                    Access additional resources to optimize your recruiting
                    process:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/resources/hiring-guide"
                      className="px-4 py-3 bg-md-surface text-md-on-surface rounded-xl hover:bg-md-surface-container-high transition-colors"
                    >
                      <span className="font-medium">Hiring Best Practices</span>
                      <p className="text-sm text-md-on-surface-variant mt-1">
                        Comprehensive guide to effective hiring
                      </p>
                    </Link>
                    <Link
                      href="/resources/interview-templates"
                      className="px-4 py-3 bg-md-surface text-md-on-surface rounded-xl hover:bg-md-surface-container-high transition-colors"
                    >
                      <span className="font-medium">Interview Templates</span>
                      <p className="text-sm text-md-on-surface-variant mt-1">
                        Role-specific interview questions
                      </p>
                    </Link>
                  </div>
                </div>
              </section>

              <section id="billing" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Billing & Payments
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Subscription Plans
                    </h3>
                    <div className="prose prose-slate text-md-on-surface-variant">
                      <p>
                        AptInova offers several subscription tiers for
                        employers:
                      </p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>
                          <strong>Basic:</strong> For occasional hiring needs
                        </li>
                        <li>
                          <strong>Professional:</strong> For regular recruiting
                        </li>
                        <li>
                          <strong>Enterprise:</strong> For high-volume hiring
                        </li>
                      </ul>
                      <p className="mt-3">
                        View detailed plan comparisons on our{" "}
                        <Link
                          href="/pricing"
                          className="text-md-primary hover:underline"
                        >
                          Pricing page
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                  <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                    <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                      Payment Methods
                    </h3>
                    <div className="prose prose-slate text-md-on-surface-variant">
                      <p>We accept the following payment methods:</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Major credit cards (Visa, Mastercard, Amex)</li>
                        <li>PayPal</li>
                        <li>ACH bank transfers (US only)</li>
                        <li>Wire transfers (for annual Enterprise plans)</li>
                      </ul>
                      <p className="mt-3">
                        All transactions are securely processed and encrypted.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Billing FAQ
                  </h3>
                  <div className="space-y-4">
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        How do I update my payment information?
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Go to Settings &gt; Billing & Payments &gt; Payment
                        Methods to update your card information or add a new
                        payment method.
                      </p>
                    </div>
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        When will I be charged?
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        For monthly subscriptions, you'll be charged on the same
                        date each month. For annual subscriptions, you'll be
                        charged once per year on your subscription anniversary.
                      </p>
                    </div>
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        How do I get a receipt or invoice?
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Receipts and invoices are automatically emailed to your
                        billing email address. You can also download them from
                        Settings &gt; Billing & Payments &gt; Payment History.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface">
                        What is your refund policy?
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        We offer a 14-day money-back guarantee for new
                        subscriptions. After this period, subscriptions are
                        non-refundable. Please review our full refund policy in
                        our Terms of Service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="privacy" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Privacy & Security
                </h2>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mb-6">
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Data Protection
                  </h3>
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      AptInova takes data protection seriously. Here's how we
                      protect your information:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                      <li>All data is encrypted in transit and at rest</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>
                        Strict access controls for employee access to user data
                      </li>
                      <li>
                        Compliance with GDPR, CCPA, and other privacy
                        regulations
                      </li>
                      <li>
                        Optional two-factor authentication for all accounts
                      </li>
                    </ul>
                    <p className="mt-4">
                      For detailed information, please review our{" "}
                      <Link
                        href="/privacy"
                        className="text-md-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Securing Your Account
                  </h3>
                  <div className="prose prose-slate text-md-on-surface-variant">
                    <p>
                      We recommend the following best practices to keep your
                      account secure:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                      <li>
                        Use a unique, strong password for your AptInova account
                      </li>
                      <li>Enable two-factor authentication</li>
                      <li>
                        Use passkeys for passwordless authentication when
                        available
                      </li>
                      <li>
                        Regularly review your account activity for unauthorized
                        access
                      </li>
                      <li>Log out when using shared or public computers</li>
                      <li>
                        Keep your email account secure, as it's used for account
                        recovery
                      </li>
                    </ul>
                    <p className="mt-4">
                      If you suspect unauthorized access to your account, change
                      your password immediately and contact our support team.
                    </p>
                  </div>
                </div>
              </section>

              <section id="technical" className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Technical Issues
                </h2>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mb-6">
                  <h3 className="text-xl font-medium mb-3 text-md-on-surface">
                    Common Technical Problems
                  </h3>
                  <div className="space-y-4">
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        The page isn't loading or is showing errors
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Try clearing your browser cache and cookies, then reload
                        the page. If problems persist, try using a different
                        browser or device.
                      </p>
                    </div>
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        I can't upload my resume or documents
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Ensure your file is in a supported format (PDF, DOCX,
                        TXT) and is under the 5MB size limit. If you're still
                        having trouble, try converting your file to PDF format.
                      </p>
                    </div>
                    <div className="border-b border-md-outline-variant pb-3">
                      <h4 className="font-medium text-md-on-surface">
                        The mobile app is crashing
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Ensure you have the latest version of the app installed.
                        Try closing all background apps, restarting your device,
                        and reopening the app. If issues persist, reinstall the
                        app.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface">
                        I'm not receiving emails from AptInova
                      </h4>
                      <p className="text-md-on-surface-variant mt-2">
                        Check your spam/junk folder. Add support@aptinova.com to
                        your safe senders list. Verify your email address is
                        correct in your account settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-md-primary-container p-6 rounded-3xl">
                  <h3 className="text-xl font-medium text-md-on-primary-container mb-3">
                    System Requirements
                  </h3>
                  <div className="space-y-4 text-md-on-primary-container">
                    <p>
                      For the optimal experience when using AptInova, please
                      ensure your system meets these requirements:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Web Browser</h4>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                          <li>Chrome (latest 2 versions)</li>
                          <li>Firefox (latest 2 versions)</li>
                          <li>Safari (latest 2 versions)</li>
                          <li>Edge (latest 2 versions)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Mobile Apps</h4>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                          <li>iOS 14 or later</li>
                          <li>Android 9.0 or later</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-md-on-surface">
                  Contact Support
                </h2>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline mb-6">
                  <h3 className="text-xl font-medium mb-4 text-md-on-surface">
                    Support Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-md-outline-variant rounded-xl">
                      <div className="text-md-primary mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        Email Support
                      </h4>
                      <p className="text-sm text-md-on-surface-variant mb-3">
                        Response within 24 hours
                      </p>
                      <Link
                        href="mailto:support@aptinova.com"
                        className="text-md-primary hover:underline text-sm"
                      >
                        support@aptinova.com
                      </Link>
                    </div>
                    <div className="p-4 border border-md-outline-variant rounded-xl">
                      <div className="text-md-primary mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        Live Chat
                      </h4>
                      <p className="text-sm text-md-on-surface-variant mb-3">
                        Available 9am-5pm PT, Mon-Fri
                      </p>
                      <button className="text-md-primary hover:underline text-sm">
                        Start Chat
                      </button>
                    </div>
                    <div className="p-4 border border-md-outline-variant rounded-xl">
                      <div className="text-md-primary mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        Phone Support
                      </h4>
                      <p className="text-sm text-md-on-surface-variant mb-3">
                        Premium & Enterprise plans only
                      </p>
                      <Link
                        href="tel:+15551234567"
                        className="text-md-primary hover:underline text-sm"
                      >
                        +1 (555) 123-4567
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-md-surface-container-high p-6 rounded-2xl border border-md-outline">
                  <h3 className="text-xl font-medium mb-4 text-md-on-surface">
                    Submit a Support Request
                  </h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-md-on-surface mb-1 text-sm"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-md-on-surface mb-1 text-sm"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-md-on-surface mb-1 text-sm"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface"
                        placeholder="Support request subject"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-md-on-surface mb-1 text-sm"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface"
                      >
                        <option value="">Select a category</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="technical">Technical Problems</option>
                        <option value="feature">Feature Requests</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-md-on-surface mb-1 text-sm"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows="5"
                        className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface"
                        placeholder="Describe your issue in detail"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        htmlFor="attachments"
                        className="block text-md-on-surface mb-1 text-sm"
                      >
                        Attachments (optional)
                      </label>
                      <input
                        type="file"
                        id="attachments"
                        className="w-full px-4 py-2 rounded-lg bg-md-surface border border-md-outline text-md-on-surface text-sm"
                      />
                      <p className="text-xs text-md-on-surface-variant mt-1">
                        Max file size: 5MB. Accepted formats: PNG, JPG, PDF
                      </p>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-md-primary text-md-on-primary rounded-full hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
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
};

export default HelpCentre;
