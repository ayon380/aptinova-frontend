import React, { useState } from 'react'; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ workExperience: [{ company: '', position: '', startDate: '', endDate: '', isPresent: false, description: '' }] });

function WorkExperienceSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific work experience entry
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...form.workExperience]; // Create a copy of the array
    // Create a copy of the specific entry object
    const updatedEntry = { ...newExperience[index], [field]: value };

    // If 'isPresent' is checked, clear the endDate
    if (field === 'isPresent' && value === true) {
      updatedEntry.endDate = '';
    }

    newExperience[index] = updatedEntry; // Update the entry in the copied array

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      workExperience: newExperience,
    }));
  };

  // Adds a new empty work experience entry to the form state
  const addExperienceEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      workExperience: [
        ...prevForm.workExperience,
        // Default structure for a new entry
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isPresent: false,
          description: '',
        },
      ],
    }));
  };

  // Removes a work experience entry at a specific index
  const removeExperienceEntry = (index) => {
    // Filter out the entry at the given index
    const newExperience = form.workExperience.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      workExperience: newExperience,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Work Experience
      </label>

      <div className="space-y-6">
        {/* Map through each work experience entry */}
        {form.workExperience.map((exp, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Grid layout for Company and Position */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Company Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`company-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={exp.company} // Controlled component value
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`company-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Company
                </label>
              </div>

              {/* Position Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`position-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={exp.position} // Controlled component value
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`position-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Position
                </label>
              </div>
            </div>

            {/* Grid layout for Dates and Present Checkbox */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
              {/* Start Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`startDate-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={exp.startDate} // Controlled component value
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} // Update state on change
                  // Add max attribute to prevent future dates if needed, e.g., max={new Date().toISOString().split("T")[0]}
                />
                <label
                  htmlFor={`startDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Start Date
                </label>
              </div>

              {/* End Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`endDate-${index}`} // Unique ID
                  // Conditionally required if 'isPresent' is false
                  required={!exp.isPresent}
                  className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface ${exp.isPresent ? 'opacity-50 cursor-not-allowed' : ''}`} // Styling, disable visually if present
                  placeholder=" " // Needed for floating label effect
                  value={exp.endDate} // Controlled component value
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} // Update state on change
                  disabled={exp.isPresent} // Disable input if 'isPresent' is checked
                  // Add min attribute based on startDate if needed, e.g., min={exp.startDate}
                />
                <label
                  htmlFor={`endDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  End Date
                </label>
              </div>

              {/* Present Checkbox */}
              <div className="flex items-center space-x-2 pb-1">
                 <input
                    type="checkbox"
                    id={`isPresent-${index}`} // Unique ID
                    className="h-5 w-5 rounded border-md-outline text-md-primary focus:ring-md-primary" // Styling for checkbox
                    checked={exp.isPresent} // Controlled component checked state
                    onChange={(e) => handleExperienceChange(index, 'isPresent', e.target.checked)} // Update state on change
                 />
                 <label
                    htmlFor={`isPresent-${index}`} // Connect label to checkbox
                    className="text-md-on-surface-variant" // Styling for label
                 >
                    Present
                 </label>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <textarea
                id={`description-${index}`} // Unique ID
                required // Mark as required
                rows="3" // Set initial rows
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for textarea
                placeholder=" " // Needed for floating label effect
                value={exp.description} // Controlled component value
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} // Update state on change
              />
              <label
                htmlFor={`description-${index}`} // Connect label to textarea
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Description
              </label>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end">
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeExperienceEntry(index)} // Call remove function on click
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
          onClick={addExperienceEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Work Experience
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     workExperience: [
//       { company: 'Example Corp', position: 'Developer', startDate: '2020-01-15', endDate: '2022-05-31', isPresent: false, description: 'Developed cool things.' },
//       { company: 'Another Inc', position: 'Senior Dev', startDate: '2022-06-01', endDate: '', isPresent: true, description: 'Developing more cool things.' }
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-2xl mx-auto">
//       {/* ... other form sections ... */}
//       <WorkExperienceSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default WorkExperienceSection; // Or export App if it's the main component
