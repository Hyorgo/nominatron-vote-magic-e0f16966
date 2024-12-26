import { useState, useEffect } from "react";

export const useEmailSession = () => {
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    const handleEmailValidated = (event: CustomEvent) => {
      setUserEmail(event.detail.email);
    };

    window.addEventListener('emailValidated', handleEmailValidated as EventListener);

    return () => {
      window.removeEventListener('emailValidated', handleEmailValidated as EventListener);
    };
  }, []);

  return { userEmail };
};