import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";

export function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    profilePicture: "",
    bio: "",
    currentPassword: "",
    password: "", 
  });
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      try {
        const userData = await getUser(token);
        setForm((prev) => ({
          ...prev,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          profilePicture: userData.profilePicture,
          bio: userData.bio,
          password: "",
          currentPassword: "",
        }));
      } catch (err) {
        setError("Could not load user data.");
      }
    }

    fetchUser();
  }, [token]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = { ...form };
    const isChangingPassword =
      Boolean(payload.currentPassword?.trim()) &&
      Boolean(payload.password?.trim());

    if (!isChangingPassword) {
      delete payload.currentPassword;
      delete payload.password;
    }

    try {
      const result = await updateUser(payload, token);
      setMessage(result.message);
      setError("");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        password: "",
      }));
    } catch (err) {
      setError("Failed to update profile");
      setMessage("");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteUser(token);
        localStorage.removeItem("token");
        navigate("/signup");
      } catch (err) {
        setError("Failed to delete account");
      }
    }
  };

  return (
    <>
      <Header onThemeChange={toggleTheme}/>
      <EditProfileForm
        theme={theme}
        form={form}
        error={error}
        message={message}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}
