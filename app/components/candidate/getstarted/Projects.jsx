import React, { useState } from "react"; // Assuming useState is used in the parent

// Mock setForm function for demonstration purposes
// In your actual component, you would use the setForm from your state management (e.g., useState)
// const [form, setForm] = useState({ projects: [{ title: '', description: '', technologies: '', link: '', startDate: '', endDate: '' }] });

function ProjectsSection({ form, setForm }) {
  // --- Helper Functions ---

  // Handles changes in any input field for a specific project entry
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...form.projects]; // Create a copy of the array
    // Create a copy of the specific entry object and update the field
    newProjects[index] = { ...newProjects[index], [field]: value };

    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      projects: newProjects,
    }));
  };

  // Adds a new empty project entry to the form state
  const addProjectEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      projects: [
        ...prevForm.projects,
        // Default structure for a new entry
        {
          title: "",
          description: "",
          technologies: "", // Stored as comma-separated string
          link: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  // Removes a project entry at a specific index
  const removeProjectEntry = (index) => {
    // Filter out the entry at the given index
    const newProjects = form.projects.filter((_, i) => i !== index);
    // Update the main form state
    setForm((prevForm) => ({
      ...prevForm,
      projects: newProjects,
    }));
  };

  // --- JSX ---
  return (
    <div>
      {/* Section Label */}
      <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
        Projects
      </label>

      <div className="space-y-6">
        {/* Map through each project entry */}
        {form.projects.map((proj, index) => (
          <div
            key={index} // Unique key for each mapped element
            className="p-6 border border-md-outline-variant rounded-3xl text-xl space-y-4 bg-md-surface-container-high" // Styling for the entry container
          >
            {/* Title Input (Full Width) */}
            <div className="relative">
              <input
                type="text"
                id={`proj-title-${index}`} // Unique ID
                required // Mark as required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                placeholder=" " // Needed for floating label effect
                value={proj.title} // Controlled component value
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                } // Update state on change
              />
              <label
                htmlFor={`proj-title-${index}`} // Connect label to input
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Project Title
              </label>
            </div>

            {/* Grid layout for Dates and Link */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Start Date Input */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`proj-startDate-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={proj.startDate} // Controlled component value
                  onChange={(e) =>
                    handleProjectChange(index, "startDate", e.target.value)
                  } // Update state on change
                />
                <label
                  htmlFor={`proj-startDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Start Date
                </label>
              </div>

              {/* End Date Input (Optional) */}
              <div className="relative">
                <input
                  type="date" // Use date type
                  id={`proj-endDate-${index}`} // Unique ID
                  // Not strictly required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling
                  placeholder=" " // Needed for floating label effect
                  value={proj.endDate} // Controlled component value
                  onChange={(e) =>
                    handleProjectChange(index, "endDate", e.target.value)
                  } // Update state on change
                  // Add min attribute based on startDate if needed
                />
                <label
                  htmlFor={`proj-endDate-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  End Date (Optional)
                </label>
              </div>

              {/* Link Input */}
              <div className="relative">
                <input
                  type="text" // Could be type="url"
                  id={`proj-link-${index}`} // Unique ID
                  required // Mark as required
                  className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                  placeholder=" " // Needed for floating label effect
                  value={proj.link} // Controlled component value
                  onChange={(e) =>
                    handleProjectChange(index, "link", e.target.value)
                  } // Update state on change
                />
                <label
                  htmlFor={`proj-link-${index}`} // Connect label to input
                  className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
                >
                  Project Link
                </label>
              </div>
            </div>

            {/* Technologies Input (Full Width) */}
            <div className="relative">
              <input
                type="text"
                id={`proj-technologies-${index}`} // Unique ID
                required // Mark as required
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for input
                placeholder=" " // Needed for floating label effect
                value={proj.technologies} // Controlled component value (comma-separated string)
                onChange={(e) =>
                  handleProjectChange(index, "technologies", e.target.value)
                } // Update state on change
              />
              <label
                htmlFor={`proj-technologies-${index}`} // Connect label to input
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Technologies (comma-separated)
              </label>
            </div>

            {/* Description Textarea (Full Width) */}
            <div className="relative">
              <textarea
                id={`proj-description-${index}`} // Unique ID
                required // Mark as required
                rows="4" // Set initial rows (slightly more for project description)
                className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface" // Styling for textarea
                placeholder=" " // Needed for floating label effect
                value={proj.description} // Controlled component value
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                } // Update state on change
              />
              <label
                htmlFor={`proj-description-${index}`} // Connect label to textarea
                className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary" // Styling for floating label
              >
                Description
              </label>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button" // Important: Prevent form submission
                onClick={() => removeProjectEntry(index)} // Call remove function on click
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
          onClick={addProjectEntry} // Call add function on click
          className="text-md-primary hover:text-md-primary-container font-medium" // Styling for add button
        >
          + Add Project
        </button>
      </div>
    </div>
  );
}

// Example Usage (replace with your actual component structure)
// function App() {
//   const [form, setForm] = useState({
//     // ... other form fields
//     projects: [
//       { title: 'Portfolio Website', description: 'Created a personal portfolio using React and Tailwind.', technologies: 'React,Tailwind CSS,JavaScript', link: 'https://example.com', startDate: '2024-01-01', endDate: '2024-02-28' },
//       { title: 'Data Analysis Tool', description: 'Ongoing project to build a tool for data visualization.', technologies: 'Python,Pandas,Flask', link: 'https://github.com/user/repo', startDate: '2024-03-01', endDate: '' }
//     ],
//     // ... other form fields
//   });

//   return (
//     <form className="p-8 max-w-3xl mx-auto"> {/* Increased max-width slightly */}
//       {/* ... other form sections ... */}
//       <ProjectsSection form={form} setForm={setForm} />
//       {/* ... submit button etc ... */}
//     </form>
//   );
// }

export default ProjectsSection; // Or export App if it's the main component
