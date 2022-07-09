import { useState, useCallback } from 'react';

function useInputs(initialForm) {
  const [form, setForm] = useState(initialForm);
  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((form) => ({ ...form, [name]: value }));
    },
    [form],
  );
  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return [form, onChange, reset, setForm];
}

export default useInputs;
