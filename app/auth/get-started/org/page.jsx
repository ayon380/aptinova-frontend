"use client";
import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FormProgress } from "@/app/components/FormProgress";
import { useRouter, useSearchParams } from "next/navigation";

const orgSteps = [
  "Basic Info",
  "Company Details",
  "Location & Contact",
  "Additional Info",
  "Subscription Plan",
];

// Main component wrapper
export default function OrganizationSignupWrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-md-background">
          <div className="animate-spin rounded-3xl h-12 w-12 border-t-4 border-b-4 border-md-primary"></div>
        </div>
      }
    >
      <OrganizationSignup />
    </Suspense>
  );
}

// Main component logic
function OrganizationSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    subdomain: "",
    website: "",
    phone: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    headquarters: "",
    type: "startup",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    contactPerson: {
      name: "",
      position: "",
      email: "",
      phone: "",
    },
    description: "",
    benefits: [],
    culture: [],
    subscriptionPlan: "free",
  });
  const router = useRouter();
  const [user, setUser] = useState({});
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [subdomainMessage, setSubdomainMessage] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [payment, setPayment] = useState({
    status: "pending",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const checkSubdomainAvailability = async (subdomain) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/domains/check-availability/${subdomain}`
      );
      setSubdomainAvailable(response.data.available);
      setSubdomainMessage(response.data.message);
    } catch (error) {
      console.error("Error checking subdomain availability:", error);
      setSubdomainAvailable(null);
      setSubdomainMessage("Failed to check subdomain availability.");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      setForm({ ...form, logo: file });
      setSelectedLogo(file.name);
    } else {
      alert("Please upload a .png file.");
    }
  };

  useEffect(() => {
    if (user.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const nextStep = () => {
    setFormError(null);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, orgSteps.length - 1));
      window.scrollTo(0, 0);
    } else {
      setFormError("Please fill in all required fields to continue");
    }
  };

  const prevStep = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const initializePayment = async () => {
    try {
      setPayment({ status: "processing" });

      let planPrice = 0;
      if (form.subscriptionPlan === "startup") {
        planPrice = 49;
      } else if (form.subscriptionPlan === "enterprise") {
        planPrice = 199;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-subscription`,
        {
          userType: "hrManager",
          userId: user.id || "021e33f6-87e2-4c5d-bac5-f0227ea7d3e2",
          tier: form.subscriptionPlan.toUpperCase(),
          totalCount: 12,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const subscriptionId = response.data.subscription.id;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "Aptinova",
        description: `${
          form.subscriptionPlan.charAt(0).toUpperCase() +
          form.subscriptionPlan.slice(1)
        } Plan Subscription`,
        handler: function (response) {
          setPayment({
            subscriptionId: subscriptionId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            status: "completed",
          });

          handleSubmitAfterPayment(response.razorpay_payment_id);
        },
        prefill: {
          name: form.companyName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#7E57C2",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPayment({
        status: "failed",
        error: error.response?.data?.message || "Payment initialization failed",
      });
    }
  };

  const handleSubmitAfterPayment = async (paymentId) => {
    const formData = new FormData();
    formData.append("companyName", form.companyName);
    formData.append("email", form.email);
    formData.append("subdomain", form.subdomain);
    formData.append("website", form.website);
    formData.append("phone", form.phone);
    formData.append("industry", form.industry);
    formData.append("companySize", form.companySize);
    formData.append("foundedYear", form.foundedYear);
    formData.append("headquarters", form.headquarters);
    formData.append("type", form.type);
    formData.append("address", form.address);
    formData.append("city", form.city);
    formData.append("country", form.country);
    formData.append("zipCode", form.zipCode);
    formData.append("contactPerson", JSON.stringify(form.contactPerson));
    formData.append("description", form.description);
    formData.append("linkedin", form.linkedin || "");
    formData.append("twitter", form.twitter || "");
    formData.append("benefits", JSON.stringify(form.benefits));
    formData.append("culture", JSON.stringify(form.culture));
    formData.append("subscriptionPlan", form.subscriptionPlan);
    formData.append("paymentId", paymentId);
    if (form.logo) {
      formData.append("logo", form.logo);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get-started/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        router.push("/dashboard");
      } else {
        setFormError(
          "Failed to create organization: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      setFormError(
        "An error occurred: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError(null);

    if (
      form.subscriptionPlan !== "free" &&
      form.subscriptionPlan !== "contact"
    ) {
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setShowPaymentModal(true);
        };
        document.body.appendChild(script);
      } else {
        setShowPaymentModal(true);
      }
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("companyName", form.companyName);
    formData.append("email", form.email);
    formData.append("subdomain", form.subdomain);
    formData.append("website", form.website);
    formData.append("phone", form.phone);
    formData.append("industry", form.industry);
    formData.append("companySize", form.companySize);
    formData.append("foundedYear", form.foundedYear);
    formData.append("headquarters", form.headquarters);
    formData.append("type", form.type);
    formData.append("address", form.address);
    formData.append("city", form.city);
    formData.append("country", form.country);
    formData.append("zipCode", form.zipCode);
    formData.append("contactPerson", JSON.stringify(form.contactPerson));
    formData.append("description", form.description);
    formData.append("linkedin", form.linkedin || "");
    formData.append("twitter", form.twitter || "");
    formData.append("benefits", JSON.stringify(form.benefits));
    formData.append("culture", JSON.stringify(form.culture));
    formData.append("subscriptionPlan", form.subscriptionPlan);
    if (form.logo) {
      formData.append("logo", form.logo);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get-started/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        router.push("/dashboard");
      } else {
        setFormError(
          "Failed to create organization: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      setFormError(
        "An error occurred: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    let planName, planPrice;
    if (form.subscriptionPlan === "startup") {
      planName = "Startup Plan";
      planPrice = "$49/month";
    } else if (form.subscriptionPlan === "enterprise") {
      planName = "Enterprise Plan";
      planPrice = "$199/month";
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-md-surface-container p-8 rounded-3xl shadow-lg max-w-md w-full">
          <h3 className="text-2xl font-semibold text-md-on-surface mb-4">
            Complete {planName} Subscription
          </h3>

          <p className="text-md-on-surface-variant mb-6">
            You&apos;ve selected the {planName}. Click the button below to
            process your payment of {planPrice}.
          </p>

          {payment.status === "failed" && (
            <div className="mb-4 p-4 rounded-lg bg-md-error-container text-md-on-error-container">
              <p>Payment failed: {payment.error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => {
                setShowPaymentModal(false);
              }}
              className="px-6 py-3 rounded-3xl text-md-on-surface-variant bg-md-surface-variant hover:bg-md-surface-container-high transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              onClick={initializePayment}
              disabled={payment.status === "processing"}
              className="px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200"
            >
              {payment.status === "processing" ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : payment.status === "failed" ? (
                "Retry Payment"
              ) : (
                "Setup Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Company Information
        </h3>

        <div className="relative">
          <input
            type="text"
            id="companyName"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <label
            htmlFor="companyName"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Company Name
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="subdomain"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.subdomain}
            onChange={(e) => {
              setForm({ ...form, subdomain: e.target.value });
              checkSubdomainAvailability(e.target.value);
            }}
          />
          <label
            htmlFor="subdomain"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Subdomain
          </label>
          {subdomainAvailable !== null && (
            <p
              className={`text-sm mt-2 ${
                subdomainAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {subdomainMessage}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            type="url"
            id="website"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <label
            htmlFor="website"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Company Website
          </label>
        </div>

        <div className="relative">
          <input
            type="tel"
            id="phone"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <label
            htmlFor="phone"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Phone Number
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderCompanyDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Company Details
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <select
              id="industry"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            >
              <option value=""></option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
            </select>
            <label
              htmlFor="industry"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Industry
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-md-on-surface-variant"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 0 010 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="companySize"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              value={form.companySize}
              onChange={(e) =>
                setForm({ ...form, companySize: e.target.value })
              }
            >
              <option value=""></option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
            <label
              htmlFor="companySize"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Company Size
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-md-on-surface-variant"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 0 010 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            id="foundedYear"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.foundedYear}
            onChange={(e) => setForm({ ...form, foundedYear: e.target.value })}
          />
          <label
            htmlFor="foundedYear"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Founded Year
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="headquarters"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.headquarters}
            onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
          />
          <label
            htmlFor="headquarters"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Headquarters
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-4">
            Company Type
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["startup", "enterprise", "agency", "other"].map((type) => (
              <button
                key={type}
                type="button"
                className={`px-6 py-3 rounded-3xl transition-colors duration-200 ${
                  form.type === type
                    ? "bg-md-primary-container text-md-on-primary-container"
                    : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                }`}
                onClick={() =>
                  setForm({
                    ...form,
                    type: type,
                  })
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderLocationContact = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Location & Contact Information
        </h3>

        <div className="relative">
          <input
            type="text"
            id="address"
            required
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <label
            htmlFor="address"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Street Address
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="relative">
            <input
              type="text"
              id="city"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <label
              htmlFor="city"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              City
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="country"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <label
              htmlFor="country"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Country
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="zipCode"
              required
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
            />
            <label
              htmlFor="zipCode"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Zip Code
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold text-md-on-surface mb-4">
            Primary Contact Person
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                id="contactName"
                required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
                value={form.contactPerson.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactPerson: {
                      ...form.contactPerson,
                      name: e.target.value,
                    },
                  })
                }
              />
              <label
                htmlFor="contactName"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Contact Name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="contactPosition"
                required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
                value={form.contactPerson.position}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactPerson: {
                      ...form.contactPerson,
                      position: e.target.value,
                    },
                  })
                }
              />
              <label
                htmlFor="contactPosition"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Position
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            <div className="relative">
              <input
                type="email"
                id="contactEmail"
                required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
                value={form.contactPerson.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactPerson: {
                      ...form.contactPerson,
                      email: e.target.value,
                    },
                  })
                }
              />
              <label
                htmlFor="contactEmail"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="tel"
                id="contactPhone"
                required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
                placeholder=" "
                value={form.contactPerson.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactPerson: {
                      ...form.contactPerson,
                      phone: e.target.value,
                    },
                  })
                }
              />
              <label
                htmlFor="contactPhone"
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
              >
                Phone
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAdditionalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Additional Information
        </h3>

        <div className="relative">
          <textarea
            id="description"
            className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface h-32 resize-none"
            placeholder=" "
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label
            htmlFor="description"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Company Description
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            Company Logo
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-md-outline-variant border-dashed rounded-3xl bg-md-surface-container-high">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-md-on-surface-variant"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-md-on-surface-variant justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-3xl px-6 py-2 bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-md-primary"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".png"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
              {selectedLogo && (
                <p className="text-xs text-md-on-surface-variant mt-2">
                  Selected file: {selectedLogo}
                </p>
              )}
              <p className="text-xs text-md-on-surface-variant">
                PNG up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <input
              type="url"
              id="linkedin"
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.linkedin || ""}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
            <label
              htmlFor="linkedin"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              LinkedIn Profile URL
            </label>
          </div>

          <div className="relative">
            <input
              type="url"
              id="twitter"
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              value={form.twitter || ""}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            />
            <label
              htmlFor="twitter"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Twitter Profile URL
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSubscriptionPlan = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-md-surface-container p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-3xl font-semibold text-md-on-surface mb-6">
          Choose Your Subscription Plan
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              form.subscriptionPlan === "free"
                ? "border-md-primary bg-md-primary-container"
                : "border-md-outline-variant"
            }`}
            onClick={() => setForm({ ...form, subscriptionPlan: "free" })}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-md-on-surface">Free</h3>
              {form.subscriptionPlan === "free" && (
                <div className="w-6 h-6 rounded-full bg-md-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-md-on-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-md-on-surface">$0</span>
              <span className="text-md-on-surface-variant">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">Up to 3 job postings</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Basic company profile
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">Email support</span>
              </li>
            </ul>
          </div>

          <div
            className={`border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              form.subscriptionPlan === "startup"
                ? "border-md-primary bg-md-primary-container"
                : "border-md-outline-variant"
            }`}
            onClick={() => setForm({ ...form, subscriptionPlan: "startup" })}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-md-on-surface">
                Startup
              </h3>
              {form.subscriptionPlan === "startup" && (
                <div className="w-6 h-6 rounded-full bg-md-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-md-on-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-md-on-surface">$49</span>
              <span className="text-md-on-surface-variant">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Up to 10 job postings
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Enhanced company profile
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Priority email support
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">Basic analytics</span>
              </li>
            </ul>
          </div>

          <div
            className={`border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              form.subscriptionPlan === "enterprise"
                ? "border-md-primary bg-md-primary-container"
                : "border-md-outline-variant"
            }`}
            onClick={() => setForm({ ...form, subscriptionPlan: "enterprise" })}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-md-on-surface">
                Enterprise
              </h3>
              {form.subscriptionPlan === "enterprise" && (
                <div className="w-6 h-6 rounded-full bg-md-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-md-on-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-md-on-surface">
                $199
              </span>
              <span className="text-md-on-surface-variant">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Unlimited job postings
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Premium company profile
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">
                  Dedicated account manager
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-md-on-surface">API access</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 border border-dashed border-md-outline-variant rounded-3xl bg-md-surface-container-high">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setForm({ ...form, subscriptionPlan: "contact" })}
          >
            <div className="mr-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  form.subscriptionPlan === "contact"
                    ? "border-md-primary bg-md-primary"
                    : "border-md-outline"
                }`}
              >
                {form.subscriptionPlan === "contact" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-md-on-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-md-on-surface">
                Mid Size Enterprise
              </h3>
              <p className="text-md-on-surface-variant">
                Contact our sales team for a custom quote tailored to your
                specific needs
              </p>
            </div>
          </div>

          {form.subscriptionPlan === "contact" && (
            <div className="mt-6 pl-10">
              <p className="text-md-on-surface-variant mb-4">
                A member of our sales team will contact you shortly after your
                registration is complete to discuss your specific requirements
                and provide a custom quote.
              </p>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-md-primary mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-md-on-surface">
                  Call us: (123) 456-7890
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderCompanyDetails();
      case 2:
        return renderLocationContact();
      case 3:
        return renderAdditionalInfo();
      case 4:
        return renderSubscriptionPlan();
      default:
        return null;
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return form.companyName.length > 0;
      case 1:
        return form.industry.length > 0 && form.companySize.length > 0;
      case 2:
        return (
          form.address.length > 0 &&
          form.city.length > 0 &&
          form.country.length > 0 &&
          form.contactPerson.name.length > 0
        );
      case 3:
        return form.description.length > 0;
      case 4:
        return !!form.subscriptionPlan;
      default:
        return false;
    }
  };

  useEffect(() => {
    localStorage.setItem("authToken", token);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <div className="flex h-dvh bg-md-background">
      <div className="hidden md:flex md:w-1/3 bg-md-primary p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-3xl bg-md-on-primary opacity-5"></div>
          <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-3xl bg-md-on-primary opacity-5"></div>
          <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-3xl bg-md-on-primary opacity-5"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-md-on-primary flex items-center justify-center">
              <span className="text-md-primary text-2xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-primary text-2xl font-bold">Aptinova</h1>
          </div>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="mb-8 max-w-md">
            <h2 className="text-3xl font-bold text-md-on-primary mb-4">
              Register Your Company
            </h2>
            <p className="text-md-on-primary opacity-80 text-lg">
              Join our platform and start hiring top talent
            </p>
          </div>

          <div className="w-64 h-64 relative mb-8">
            <div className="wavy-line absolute bottom-0 w-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-48 h-48 text-md-on-primary opacity-90 blob"
              >
                <path
                  fill="currentColor"
                  d="M45.7,-64.2C58.9,-53.9,69.2,-39.6,75.6,-23.2C82,-6.8,84.6,11.8,78.9,27.2C73.3,42.6,59.4,54.7,44.1,63.5C28.8,72.3,12,77.8,-3.9,83C-19.7,88.2,-39.5,93,-55.8,85.3C-72,77.6,-84.7,57.5,-87,37.1C-89.3,16.8,-81.1,-3.7,-72.5,-21.5C-63.9,-39.2,-54.8,-54.1,-42,-64.4C-29.1,-74.8,-12.6,-80.6,2.3,-83.7C17.2,-86.8,32.4,-74.5,45.7,-64.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <FormProgress steps={orgSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="relative z-10 text-md-on-primary opacity-70 text-sm">
          &copy; {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_APP_NAME || "Aptinova"} All rights reserved.
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col">
        <div className="md:hidden bg-md-surface px-6 py-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-3xl bg-md-primary flex items-center justify-center">
              <span className="text-md-on-primary text-xl font-bold">A</span>
            </div>
            <h1 className="text-md-on-surface text-xl font-bold">Aptinova</h1>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-md-on-surface">
              Register Your Company
            </h2>
            <p className="text-md-on-surface-variant text-sm mt-1">
              Step {currentStep + 1} of {orgSteps.length}:{" "}
              {orgSteps[currentStep]}
            </p>
          </div>

          <FormProgress steps={orgSteps} currentStep={currentStep} />
        </div>

        <div className="flex-grow md:mt-20 overflow-auto p-4 md:p-8 bg-md-background">
          <div className="max-w-3xl mx-auto mb-24 md:mb-0">
            {formError && (
              <div className="mb-6 p-4 rounded-3xl bg-md-error-container text-md-on-error-container">
                <p>{formError}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>

              <div className="flex justify-between pt-6 sticky bottom-0 bg-md-background p-4 -mx-4 md:static md:bg-transparent md:p-0 md:mx-0 border-t md:border-0 border-md-outline-variant">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className={`px-6 py-3 rounded-3xl text-md-on-surface-variant bg-md-surface-variant hover:bg-md-surface-container-high transition-colors duration-200 ${
                    currentStep === 0 ? "opacity-0 pointer-events-none" : ""
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={
                    currentStep === orgSteps.length - 1
                      ? handleSubmit
                      : nextStep
                  }
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {currentStep === orgSteps.length - 1
                        ? "Submitting..."
                        : "Next..."}
                    </span>
                  ) : currentStep === orgSteps.length - 1 ? (
                    "Complete Registration"
                  ) : (
                    "Next Step"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {renderPaymentModal()}
    </div>
  );
}
