import React, { useEffect, useRef, useState } from "react";
import "./Profiles.css";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

export const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] =
    useState<string>("default-avatar.png");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>();
  const [bio, setBio] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data?.user);
        console.log(user);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const setCredentials = () => {
      setName(user?.user_metadata?.full_name);
      setEmail(user?.email);
      setBio(user?.user_metadata?.bio);
    };
    setCredentials();
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, bio, profileImage });
  };

  const handleCancel = () => {};

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Your Profile</h2>

      <div className="profile-picture-section">
        <img src={profileImage} alt="Profile" className="profile-picture" />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <button
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload New
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Bio:
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <div className="button-group">
          <button type="submit" className="save-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
