import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/useAuthHook';
import { FaUserEdit, FaCamera, FaEdit } from 'react-icons/fa'; // Import icons for edit and camera, now including FaEdit

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser, isLoading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false); // Controls modal visibility

  // Redirect if user is not logged in after AuthContext finishes loading
  useEffect(() => {
    if (!authLoading && !user) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'You need to be logged in to view your profile.',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/login');
      });
    } else if (user) {
      // Populate form data when user context changes or modal opens
      // This also acts as a reset when closing the modal via cancel or successful save
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageFileChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  // Handle opening edit modal
  const openEditModal = () => {
    setShowEditProfileModal(true);
    setPasswordChangeMode(false); // Reset password change mode when opening modal
    setProfileImageFile(null); // Clear selected image file when opening modal
    // Ensure modal fields are populated with current user data
    setProfileData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setShowEditProfileModal(false);
    setPasswordChangeMode(false); // Reset password change mode
    setProfileImageFile(null); // Clear selected image file on cancel
    // Reset form data to current user's data from context on cancel
    setProfileData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !token) {
      Swal.fire('Error', 'Not authenticated. Please log in.', 'error');
      setLoading(false);
      return;
    }

    const { name, email, currentPassword, newPassword, confirmNewPassword } = profileData;

    const updatePayload = {
      name,
      email,
    };

    if (passwordChangeMode) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        Swal.fire('Warning', 'Please fill all password fields to change password.', 'warning');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        Swal.fire('Error', 'New passwords do not match!', 'error');
        setLoading(false);
        return;
      }
      updatePayload.password = newPassword;
    }

    try {
      const res = await fetch('https://mongodb-assignment-4-e-commerce-site.onrender.com/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (res.ok) {
        updateUser(data, data.token);
        Swal.fire('Success', 'Profile updated successfully!', 'success');
        handleCloseEditModal(); // Close modal after successful save
      } else {
        Swal.fire('Error', data.message || 'Failed to update profile.', 'error');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Swal.fire('Error', 'Server error during profile update. Check console for details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    setLoading(true);

    if (!user || !token) {
      Swal.fire('Error', 'Not authenticated. Please log in.', 'error');
      setLoading(false);
      return;
    }
    if (!profileImageFile) {
      Swal.fire('Warning', 'Please select an image to upload.', 'warning');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', profileImageFile); // 'profileImage' must match the field name in multer middleware

    try {
      const res = await fetch('https://mongodb-assignment-4-e-commerce-site.onrender.com/auth/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // No 'Content-Type' header for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user, data.token); // Update AuthContext with new image URL and new token
        Swal.fire('Success', 'Profile picture updated successfully!', 'success');
        setProfileImageFile(null); // Clear the file input
      } else {
        Swal.fire('Error', data.message || 'Failed to upload profile picture.', 'error');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('Error', 'Server error during image upload. Check console for details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 transition-colors duration-300 font-inter">
      <Navbar />
      <div className="flex-grow max-w-5xl mx-auto px-4 py-16 w-full"> {/* Increased max-width */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center dark:text-white">
          Your Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800 dark:shadow-2xl transition-colors duration-300 border border-gray-200 dark:border-gray-700"> {/* Sharper shadow, border */}
          {/* Profile Header: Image and Name */}
          <div className="flex flex-col items-center mb-10"> {/* More vertical spacing */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-6 border-blue-500 dark:border-blue-600 shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-300"> {/* Larger image, bolder border, shadow, hover effect */}
              <img
                src={user.profileImage || 'https://placehold.co/160x160/A0AEC0/FFFFFF?text=AVATAR'} // Adjusted placeholder size
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/160x160/A0AEC0/FFFFFF?text=AVATAR' }} // Fallback on error
              />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2> {/* Larger name, less margin-bottom */}
            <p className="text-gray-600 dark:text-gray-300 text-lg">{user.email}</p> {/* Larger email */}
          </div>

          {/* --- Read-Only Profile Information Display --- */}
          <div className="space-y-6"> {/* Increased space-y */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-200 dark:border-gray-700"> {/* Bolder border */}
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 dark:text-white"> {/* Added flex and gap for icon */}
                <FaUserEdit className="text-blue-500 dark:text-blue-400" /> Personal Information
              </h3>
              <button
                type="button"
                onClick={openEditModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg font-semibold transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Increased gap */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Name</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</p> {/* Larger, bolder text */}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.email}</p> {/* Larger, bolder text */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* --- Edit Profile Modal --- */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"> {/* Darker overlay, fade-in */}
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-95 animate-scale-in
                          dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Edit Your Profile
                </h2>
                <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
                    aria-label="Close modal"
                >
                    &times; {/* Times icon for close */}
                </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="modalName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Name</label>
                <input
                  type="text"
                  id="modalName"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="modalEmail" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Email Address</label>
                <input
                  type="email"
                  id="modalEmail"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Password Change Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Change Password</h3>
                <button
                  type="button"
                  onClick={() => setPasswordChangeMode(!passwordChangeMode)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200 mb-4 shadow font-semibold flex items-center gap-2 w-full sm:w-auto" // Added w-full sm:w-auto
                >
                  <FaEdit /> {passwordChangeMode ? 'Cancel Password Change' : 'Change Password'}
                </button>

                {passwordChangeMode && (
                  <div className="space-y-4 animate-fade-in"> {/* Added fade-in animation */}
                    {/* Current Password Field */}
                    <div>
                      <label htmlFor="modalCurrentPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Current Password</label>
                      <input
                        type="password"
                        id="modalCurrentPassword"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter current password"
                      />
                    </div>
                    {/* New Password Field */}
                    <div>
                      <label htmlFor="modalNewPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">New Password</label>
                      <input
                        type="password"
                        id="modalNewPassword"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    {/* Confirm New Password Field */}
                    <div>
                      <label htmlFor="modalConfirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Confirm New Password</label>
                      <input
                        type="password"
                        id="modalConfirmNewPassword"
                        name="confirmNewPassword"
                        value={profileData.confirmNewPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Image Upload Section (inside modal) */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
                    <FaCamera className="text-blue-500 dark:text-blue-400" /> Update Profile Picture
                </h3>
                {/* Ensure the container for file input and upload button is responsive */}
                <div className="flex flex-col sm:flex-row items-center gap-4"> {/* Added gap for spacing */}
                  <input
                    type="file"
                    id="profileImageInputModal"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="flex-grow w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-blue-800 dark:file:text-blue-100 dark:hover:file:bg-blue-700"
                  />
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-2"
                    disabled={loading || !profileImageFile}
                  >
                    {loading ? 'Uploading...' : <><FaCamera /> Upload Image</>}
                  </button>
                </div>
                {profileImageFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Selected: {profileImageFile.name}</p>
                )}
              </div>

              {/* Save/Cancel Buttons for Modal - Made responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="w-full sm:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition-colors duration-200 font-semibold shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : <><FaEdit /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;