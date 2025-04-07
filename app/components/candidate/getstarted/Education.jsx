import React, { useState } from 'react'; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', currentlyStudying: false }] });

function EducationSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific education entry
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...form.education]; // Create a copy of the array
    // Create a copy of the specific entry object
    const updatedEntry = { ...newEducation[index], [field]: value };

    // If 'currentlyStudying' is checked, clear the endDate
    if (field === 'currentlyStudying' && value === true) {
      updatedEntry.endDate = '';
    }

    newEducation[index] = updatedEntry; // Update the entry in the copied array

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      education: newEducation,
    }));
  };

  // Adds a new empty education entry to the form state
  const addEducationEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      education: [
        ...prevForm.education,
        // Default structure for a new entry
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          currentlyStudying: false,
        },
      ],
    }));
  };

  // Removes an education entry at a specific index
  const removeEducationEntry = (index) => {
    // Filter out the entry at the given index
    const newEducation = form.education.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      education: newEducation,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Education
      </label>

      <div className="space-y-6">
        {/* Map through each education entry */}
        {form.education.map((edu, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Grid layout for Institution, Degree, Field of Study */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Institution Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`edu-institution-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={edu.institution} // Controlled component value
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`edu-institution-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Institution
                </label>
              </div>

              {/* Degree Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`edu-degree-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={edu.degree} // Controlled component value
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`edu-degree-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Degree
                </label>
              </div>

              {/* Field of Study Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`edu-fieldOfStudy-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={edu.fieldOfStudy} // Controlled component value
                  onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`edu-fieldOfStudy-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Field of Study
                </label>
              </div>
            </div>

            {/* Grid layout for Dates and Currently Studying Checkbox */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
              {/* Start Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`edu-startDate-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={edu.startDate} // Controlled component value
                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)} // Update state on change
                  // Add max attribute to prevent future dates if needed
                />
                <label
                  htmlFor={`edu-startDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Start Date
                </label>
              </div>

              {/* End Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`edu-endDate-${index}`} // Unique ID
                  // Conditionally required if not currently studying
                  required={!edu.currentlyStudying}
                  className={`block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface ${edu.currentlyStudying ? 'opacity-50 cursor-not-allowed' : ''}`} // Styling, disable visually if studying
                  placeholder=" " // Needed for floating label effect
                  value={edu.endDate} // Controlled component value
                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)} // Update state on change
                  disabled={edu.currentlyStudying} // Disable input if currently studying
                  // Add min attribute based on startDate if needed
                />
                <label
                  htmlFor={`edu-endDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  End Date
                </label>
              </div>

              {/* Currently Studying Checkbox */}
              <div className="flex items-center space-x-2 pb-1">
                 <input
                    type="checkbox"
                    id={`edu-currentlyStudying-${index}`} // Unique ID
                    className="h-5 w-5 rounded border-md-outline text-md-primary focus:ring-md-primary" // Styling for checkbox
                    checked={edu.currentlyStudying} // Controlled component checked state
                    onChange={(e) => handleEducationChange(index, 'currentlyStudying', e.target.checked)} // Update state on change
                 />
                 <label
                    htmlFor={`edu-currentlyStudying-${index}`} // Connect label to checkbox
                    className="text-md-on-surface-variant" // Styling for label
                 >
                    Currently Studying
                 </label>
              </div>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeEducationEntry(index)} // Call remove function on click
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
          onClick={addEducationEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Education
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     education: [
//       { institution: 'University of Example', degree: 'BSc', fieldOfStudy: 'Computer Science', startDate: '2018-09-01', endDate: '2022-06-30', currentlyStudying: false },
//       { institution: 'Online Masters', degree: 'MSc', fieldOfStudy: 'Data Science', startDate: '2023-01-15', endDate: '', currentlyStudying: true }
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-3xl mx-auto"> {/* Increased max-width slightly for 3 columns */}
//       {/* ... other form sections ... */}
//       <EducationSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default EducationSection; // Or export App if it's the main component
