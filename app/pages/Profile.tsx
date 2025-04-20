import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Profile: React.FC = () => {
  let user = JSON.parse(localStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: user.username || '',
    profileImageURL: user.profileImageURL || '',
    userType: user.usertype || '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/profile/${user.username}`);
        const fetchedData = {
          name: res.data.Name || '',
          email: res.data.Email || '',
          profileImageURL: res.data.ProfileImageURL || '',
        };
        setProfile(prev => ({
          ...prev,
          ...fetchedData,
        }));
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Failed to load profile.');
      }
    };
    fetchProfile();
  }, [user.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setProfile(prev => ({ ...prev, profileImageURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        username: profile.username,
        name: profile.name,
        email: profile.email,
        profileImageURL: profile.profileImageURL,
        userType: profile.userType,
      };

      await axios.put(`https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/profile/update`, updatedData);
      setMessage(' Profile updated successfully!');

      // Update localStorage and user object
      const updatedUser = { ...user, profileImageURL: profile.profileImageURL };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      user = updatedUser; // Update in-memory reference too
      window.dispatchEvent(new Event('storage')); // For global sync if needed
    } catch (err) {
      console.error('Update error:', err);
      setMessage(' Failed to update profile.');
    }
  };

  return (
    <div className="account-form">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={profile.username} disabled />

        <label>User Type:</label>
        <input type="text" name="userType" value={profile.userType} disabled />

        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleInputChange} />

        <label>Email:</label>
        <input type="email" name="email" value={profile.email} onChange={handleInputChange} />

        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {(previewImage || profile.profileImageURL) && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={previewImage || profile.profileImageURL}
              alt="Preview"
              width={100}
              height={100}
              style={{ borderRadius: '50%' }}
            />
          </div>
        )}

        <input type="submit" value="Update Profile"/>
      </form>
      {message && <p>{message}</p>}
                  {/* Back button */}
      <div className="backButn" style={{ marginTop: "20px" }}>
        <Link to="/menu">{"<-- Back"}</Link>
      </div>
    </div>
  );
};

export default Profile;
