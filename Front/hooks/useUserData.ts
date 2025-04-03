// hooks/useUserData.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserData = () => {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [name, email, id] = await AsyncStorage.multiGet([
        'userName',
        'userEmail',
        'userId'
      ]);
      
      if (name[1] && id[1]) {
        setUserData({
          name: name[1],
          email: email[1] || '',
          id: id[1]
        });
      }
    };

    loadData();
  }, []);

  return userData;
};