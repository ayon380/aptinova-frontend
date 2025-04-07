import React, { useState } from 'react'; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ achievements: [{ title: '', description: '', date: '' }] });

function AchievementsSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific achievement entry
  const handleAchievementChange = (index, field, value) => {
    const newAchievements = [...form.achievements]; // Create a copy of the array
    // Create a copy of the specific entry object and update the field
    newAchievements[index] = { ...newAchievements[index], [field]: value };

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      achievements: newAchievements,
    }));
  };

  // Adds a new empty achievement entry to the form state
  const addAchievementEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      achievements: [
        ...prevForm.achievements,
        // Default structure for a new entry
        { title: '', description: '', date: '' },
      ],
    }));
  };

  // Removes an achievement entry at a specific index
  const removeAchievementEntry = (index) => {
    // Filter out the entry at the given index
    const newAchievements = form.achievements.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      achievements: newAchievements,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Achievements
      </label>

      <div className="space-y-6">
        {/* Map through each achievement entry */}
        {form.achievements.map((ach, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Grid layout for Title and Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  id={`ach-title-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={ach.title} // Controlled component value
                  onChange={(e) => handleAchievementChange(index, 'title', e.target.value)} // Update state on change
                />
                <label
                  htmlFor={`ach-title-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Title
                </label>
              </div>

              {/* Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`ach-date-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={ach.date} // Controlled component value
                  onChange={(e) => handleAchievementChange(index, 'date', e.target.value)} // Update state on change
                   // Add max attribute to prevent future dates if needed, e.g., max={new Date().toISOString().split("T")[0]}
                />
                <label
                  htmlFor={`ach-date-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Date Achieved
                </label>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <textarea
                id={`ach-description-${index}`} // Unique ID
                required // Mark as required
                rows="3" // Set initial rows
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for textarea
                placeholder=" " // Needed for floating label effect
                value={ach.description} // Controlled component value
                onChange={(e) => handleAchievementChange(index, 'description', e.target.value)} // Update state on change
              />
              <label
                htmlFor={`ach-description-${index}`} // Connect label to textarea
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Description
              </label>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end">
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeAchievementEntry(index)} // Call remove function on click
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
          onClick={addAchievementEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Achievement
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     achievements: [
//       { title: 'Project Completion', description: 'Successfully launched the X project ahead of schedule.', date: '2024-03-15' },
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-2xl mx-auto">
//       {/* ... other form sections ... */}
//       <AchievementsSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default AchievementsSection; // Or export App if it's the main component
