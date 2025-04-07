import React, { useState } from "react"; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ publications: [{ title: '', description: '', link: '' }] });

function PublicationsSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific publication entry
  const handlePublicationChange = (index, field, value) => {
    const newPublications = [...form.publications]; // Create a copy of the array
    // Create a copy of the specific entry object and update the field
    newPublications[index] = { ...newPublications[index], [field]: value };

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      publications: newPublications,
    }));
  };

  // Adds a new empty publication entry to the form state
  const addPublicationEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      publications: [
        ...prevForm.publications,
        // Default structure for a new entry
        { title: "", description: "", link: "" },
      ],
    }));
  };

  // Removes a publication entry at a specific index
  const removePublicationEntry = (index) => {
    // Filter out the entry at the given index
    const newPublications = form.publications.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      publications: newPublications,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Publications
      </label>

      <div className="space-y-6">
        {/* Map through each publication entry */}
        {form.publications.map((pub, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Grid layout for Title and Link */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`pub-title-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={pub.title} // Controlled component value
                  onChange={(e) =>
                    handlePublicationChange(index, "title", e.target.value)
                  } // Update state on change
                />
                <label
                  htmlFor={`pub-title-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Title
                </label>
              </div>

              {/* Link Input */}
              <div className="relative">
                <input
                  type="text" // Using text, but could use type="url" for basic validation
                  id={`pub-link-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={pub.link} // Controlled component value
                  onChange={(e) =>
                    handlePublicationChange(index, "link", e.target.value)
                  } // Update state on change
                />
                <label
                  htmlFor={`pub-link-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Link (URL)
                </label>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <textarea
                id={`pub-description-${index}`} // Unique ID
                required // Mark as required
                rows="3" // Set initial rows
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for textarea
                placeholder=" " // Needed for floating label effect
                value={pub.description} // Controlled component value
                onChange={(e) =>
                  handlePublicationChange(index, "description", e.target.value)
                } // Update state on change
              />
              <label
                htmlFor={`pub-description-${index}`} // Connect label to textarea
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Description
              </label>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end">
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removePublicationEntry(index)} // Call remove function on click
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
          onClick={addPublicationEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Publication
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     publications: [
//       { title: 'My Awesome Paper', description: 'A detailed description of the paper.', link: 'https://example.com/paper' },
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-2xl mx-auto">
//       {/* ... other form sections ... */}
//       <PublicationsSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default PublicationsSection; // Or export App if it's the main component
