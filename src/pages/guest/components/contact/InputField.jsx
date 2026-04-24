import React from 'react';

const InputField = ({ label, type = 'text', id, placeholder, required, isTextArea }) => {
  const baseClasses = "w-full rounded-md border border-gray-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm";
  
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          name={id}
          rows="4"
          required={required}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
};

export default InputField;
