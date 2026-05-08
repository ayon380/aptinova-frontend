// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    profilePicture: "",
    department: "",
    resume: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          profilePicture: userData.profilePicture || "",
          department: userData.department || "",
          resume: userData.resume || "",
        });
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401")) {
          localStorage.removeItem("authToken");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
        
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setUpdateSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {updateSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Profile updated successfully!
        </div>
      )}

      <div className="flex items-center mb-6">
        {formData.profilePicture ? (
          <Image
            src={formData.profilePicture}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl text-gray-500">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://example.com/your-image.jpg"
          />
        </div>

        {(user?.type === "hr" || user?.type === "hrManager") && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {user?.type === "candidate" && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Resume URL</label>
            <input
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/your-resume.pdf"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {updateLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          router.push("/login");
        }}
        className="w-full mt-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
      >
        Logout
      </button>
    </div>
  );
}
