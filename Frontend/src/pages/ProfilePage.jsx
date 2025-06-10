import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/useAuthHook';
import { FaUserEdit, FaCamera, FaEdit } from 'react-icons/fa';

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
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

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
    setPasswordChangeMode(false);
    setProfileImageFile(null);
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
    setPasswordChangeMode(false);
    setProfileImageFile(null);
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
        handleCloseEditModal();
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
    formData.append('profileImage', profileImageFile);

    try {
      const res = await fetch('https://mongodb-assignment-4-e-commerce-site.onrender.com/auth/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user, data.token);
        Swal.fire('Success', 'Profile picture updated successfully!', 'success');
        setProfileImageFile(null);
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
      <div className="flex-grow max-w-5xl mx-auto px-4 py-16 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center dark:text-white sm:text-5xl lg:text-6xl">
          {/* Added responsive font sizes for the main heading */}
          Your Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 dark:bg-gray-800 dark:shadow-2xl transition-colors duration-300 border border-gray-200 dark:border-gray-700">
          {/* Increased padding on small screens */}
          {/* Profile Header: Image and Name */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 sm:border-6 border-blue-500 dark:border-blue-600 shadow-xl sm:shadow-2xl mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
              {/* Adjusted image size and border for small screens */}
              <img
                src={user.profileImage || 'https://placehold.co/160x160/A0AEC0/FFFFFF?text=AVATAR'}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x160/A0AEC0/FFFFFF?text=AVATAR' }}
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-center">
              {/* Adjusted font size for name on small screens */}
              {user.name}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">{user.email}</p>
            {/* Adjusted font size for email on small screens */}
          </div>

          {/* --- Read-Only Profile Information Display --- */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
              {/* Changed to flex-col on small, then flex-row on sm+ */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 dark:text-white">
                <FaUserEdit className="text-blue-500 dark:text-blue-400" /> Personal Information
              </h3>
              <button
                type="button"
                onClick={openEditModal}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg font-semibold transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-6">
              {/* Adjusted gaps for small screens */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Name</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{user.name}</p>
                {/* Adjusted font size for display name */}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{user.email}</p>
                {/* Adjusted font size for display email */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* --- Edit Profile Modal --- */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm sm:max-w-lg shadow-2xl transform scale-95 animate-scale-in
                             dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
            {/* Adjusted modal max-width for small screens, reduced initial padding */}
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Edit Your Profile
              </h2>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl sm:text-3xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
              {/* Reduced initial space-y */}
              {/* Name Field */}
              <div>
                <label htmlFor="modalName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Name</label>
                <input
                  type="text"
                  id="modalName"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
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
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                  required
                />
              </div>

              {/* Password Change Section */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* Reduced initial padding-top */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-white">Change Password</h3>
                <button
                  type="button"
                  onClick={() => setPasswordChangeMode(!passwordChangeMode)}
                  className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-purple-700 transition-colors duration-200 mb-3 sm:mb-4 shadow font-semibold flex items-center gap-2 w-full justify-center sm:w-auto"
                >
                  <FaEdit /> {passwordChangeMode ? 'Cancel Password Change' : 'Change Password'}
                </button>

                {passwordChangeMode && (
                  <div className="space-y-3 sm:space-y-4 animate-fade-in">
                    {/* Reduced initial space-y */}
                    {/* Current Password Field */}
                    <div>
                      <label htmlFor="modalCurrentPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Current Password</label>
                      <input
                        type="password"
                        id="modalCurrentPassword"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
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
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
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
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Image Upload Section (inside modal) */}
              <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 dark:text-white">
                  <FaCamera className="text-blue-500 dark:text-blue-400" /> Update Profile Picture
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  {/* Adjusted gap */}
                  <input
                    type="file"
                    id="profileImageInputModal"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="flex-grow w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-blue-800 dark:file:text-blue-100 dark:hover:file:bg-blue-700 text-base"
                  />
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition-colors duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center gap-2"
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
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-5 sm:mt-6">
                {/* Changed to flex-col-reverse for mobile (cancel on top) */}
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