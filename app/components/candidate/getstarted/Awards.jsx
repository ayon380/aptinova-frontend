import React, { useState } from 'react'; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ awards: [{ title: '', issuer: '' }] });

function AwardsSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific award entry
  const handleAwardChange = (index, field, value) => {
    const newAwards = [...form.awards]; // Create a copy of the array
    // Create a copy of the specific entry object and update the field
    newAwards[index] = { ...newAwards[index], [field]: value };

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      awards: newAwards,
    }));
  };

  // Adds a new empty award entry to the form state
  const addAwardEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      awards: [
        ...prevForm.awards,
        // Default structure for a new entry
        { title: '', issuer: '' },
      ],
    }));
  };

  // Removes an award entry at a specific index
  const removeAwardEntry = (index) => {
    // Filter out the entry at the given index
    const newAwards = form.awards.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      awards: newAwards,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Awards
      </label>

      <div className="space-y-6">
        {/* Map through each award entry */}
        {form.awards.map((award, index) => (
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
                  id={`award-title-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={award.title} // Controlled component value
                  onChange={(e) => handleAwardChange(index, 'title', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`award-title-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Award Title
                </label>
              </div>

              {/* Issuer Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`award-issuer-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={award.issuer} // Controlled component value
                  onChange={(e) => handleAwardChange(index, 'issuer', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`award-issuer-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Issuer
                </label>
              </div>
            </div>

             {/* Remove Button - Placed below inputs */}
            <div className="flex justify-end pt-2"> {/* Added padding-top */}
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeAwardEntry(index)} // Call remove function on click
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
          onClick={addAwardEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Award
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     awards: [
//       { title: 'Employee of the Month', issuer: 'Example Corp' },
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-2xl mx-auto">
//       {/* ... other form sections ... */}
//       <AwardsSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default AwardsSection; // Or export App if it's the main component
