"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slice/userSlice';

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          dispatch(setUser({
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            workSpaces: user.workSpaces || [],
            isAuthenticated: true,
            planType: null,
            avatar: user.avatar
          }));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();
  }, [dispatch]);
};