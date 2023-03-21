import { useState } from 'react';

export default function useForm(callback, initValue) {
  const [inputs, setInputs] = useState(initValue);

  // function that manages the submit event
  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    callback();
  };

  // function have manages the event where the user gives some input
  const handleInputChange = e => {
    e.persist();
    const { name, type, checked, value } = e.target;
    const eachValue = type === 'checkbox' ? checked : value;
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: eachValue
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
    setInputs
  };
}
