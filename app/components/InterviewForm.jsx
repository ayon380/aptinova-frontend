import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function InterviewForm({ onSubmit, onCancel, attendees }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: 30,
    location: "",
    type: "online",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            ...formData,
            attendees,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      onSubmit({
        ...formData,
        eventId: data.eventId,
      });
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-md-surface rounded-3xl shadow-lg max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-md-outline">
          <h2 className="text-2xl font-semibold text-md-on-surface">Schedule Interview</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-high"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative">
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              required
            />
            <label
              htmlFor="date"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Date
            </label>
          </div>

          <div className="relative">
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              required
            />
            <label
              htmlFor="time"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Time
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
              min="15"
              required
            />
            <label
              htmlFor="duration"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Duration (minutes)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["online", "in-person"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`
                    px-6 py-3 rounded-3xl transition-colors duration-200
                    ${
                      formData.type === type
                        ? "bg-md-primary-container text-md-on-primary-container"
                        : "border border-md-outline-variant text-md-on-surface hover:bg-md-surface-variant"
                    }
                  `}
                  onClick={() =>
                    setFormData({ ...formData, type: type })
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
              placeholder=" "
            />
            <label
              htmlFor="location"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              {formData.type === "online" ? "Meeting Link" : "Location"}
            </label>
          </div>

          <div className="relative">
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="block w-full px-6 pt-6 pb-1 rounded-3xl text-xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface resize-none h-32"
              placeholder=" "
            />
            <label
              htmlFor="notes"
              className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
            >
              Notes
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-3xl border border-md-outline text-md-on-surface hover:bg-md-surface-variant transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="px-6 py-2.5 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              Schedule
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
