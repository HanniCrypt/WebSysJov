import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

function HRProfile() {
  const { user, setUser } = useOutletContext();
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          avatar: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      await axios.post(
        `${API_URL}updateAvatar`,
        {
          avatar: user.avatar,
        },
        {
          withCredentials: true,
        }
      );

      setShowModal(false);
      // window.location.reload(); 
    } catch (error) {
      console.error("Failed to update avatar", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden mt-10">
      {/* HEADER */}
      <div className="bg-[#260058] h-40 relative">
        <div className="absolute -bottom-12 left-6 group">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl text-white font-bold">
            {user?.avatar ? (
              <img
                src={`data:image/jpeg;base64,${user?.avatar}`}
                alt="Avatar"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              "A"
            )}
          </div>
        </div>
      </div>

      {/* USER INFO */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.username}
            </h1>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <span className="font-medium">User ID:</span> {user?.user_id}
          </div>
          <div>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(user?.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update Avatar</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            {user?.avatar ? (
              <img
                src={`data:image/jpeg;base64,${user?.avatar}`}
                alt="Avatar"
                className="rounded-full w-32 h-32 object-cover"
              />
            ) : (
              "A"
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarUpdate}
                className="px-4 py-2 bg-[#260058] text-white rounded hover:bg-[#3e0091]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRProfile;
