import React, { useState } from 'react'; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ certifications: [{ title: '', issuer: '', issueDate: '' }] });

function CertificationsSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific certification entry
  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...form.certifications]; // Create a copy of the array
    // Create a copy of the specific entry object and update the field
    newCertifications[index] = { ...newCertifications[index], [field]: value };

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      certifications: newCertifications,
    }));
  };

  // Adds a new empty certification entry to the form state
  const addCertificationEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      certifications: [
        ...prevForm.certifications,
        // Default structure for a new entry
        { title: '', issuer: '', issueDate: '' },
      ],
    }));
  };

  // Removes a certification entry at a specific index
  const removeCertificationEntry = (index) => {
    // Filter out the entry at the given index
    const newCertifications = form.certifications.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      certifications: newCertifications,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Certifications
      </label>

      <div className="space-y-6">
        {/* Map through each certification entry */}
        {form.certifications.map((cert, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Grid layout for Title and Issuer */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`cert-title-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={cert.title} // Controlled component value
                  onChange={(e) => handleCertificationChange(index, 'title', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`cert-title-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Title
                </label>
              </div>

              {/* Issuer Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`cert-issuer-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={cert.issuer} // Controlled component value
                  onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`cert-issuer-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Issuer
                </label>
              </div>
            </div>

            {/* Layout for Date and Remove Button */}
            <div className="flex items-center justify-between">
               {/* Issue Date Input */}
              <div className="relative w-1/3"> {/* Adjust width as needed */}
                <input
                  type="date" // Use date type
                  id={`cert-issueDate-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={cert.issueDate} // Controlled component value
                  onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)} // Update state on change
                   // Add max attribute to prevent future dates if needed, e.g., max={new Date().toISOString().split("T")[0]}
                />
                <label
                  htmlFor={`cert-issueDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Issue Date
                </label>
              </div>

              {/* Remove Button */}
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeCertificationEntry(index)} // Call remove function on click
                className="text-md-error hover:text-md-error rounded-3xl text-xl px-4 py-1" // Styling for remove button
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <button
          type="button" // Important: Prevent form submission
          onClick={addCertificationEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Certification
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     certifications: [
//       { title: 'React Certified Developer', issuer: 'React Org', issueDate: '2023-10-20' },
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-2xl mx-auto">
//       {/* ... other form sections ... */}
//       <CertificationsSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default CertificationsSection; // Or export App if it's the main component
