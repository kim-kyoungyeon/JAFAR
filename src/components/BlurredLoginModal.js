import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import "../styles/BlurredLoginModal.css";
const FormInput = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
}) => (
  <div className="form-group">
    <label htmlFor={id} className="label">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
    />
    {error && (
      <p className="error-message">
        <AlertCircle className="error-icon" />
        {error}
      </p>
    )}
  </div>
);

const SubmitButton = ({ isSubmitting }) => (
  <button type="submit" className="submit-button" disabled={isSubmitting}>
    {isSubmitting ? "물의 호흡 제 1형 ..." : "MINAMIMORI!!"}
  </button>
);

const useLoginForm = (initialState, validate, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. 전집중 호흡 다시하기 ");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return { formData, errors, isSubmitting, handleChange, handleSubmit };
};

export default function BlurredLoginModal({ isOpen, onLoginSuccess, onClose }) {
  const initialSTate = { email: "", password: "" };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = "Email 주소는 필수입니다";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email 형식 오류 ";
    }
    if (!data.password) {
      errors.password = "Password는 필수입니다";
    }
    return errors;
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submit", data);
    onLoginSuccess();
  };

  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useLoginForm(initialSTate, validateForm, onSubmit);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">전집중 호흡!</h2>
          <p className="card-description">하나노코큐</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="form">
            <FormInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aladin@lamp.com"
              label="user email"
              errror={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              label="Secret Password Power!!"
              error={errors.password}
            />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
    </div>
  );
}
