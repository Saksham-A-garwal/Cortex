import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setChats } from "../Store/chatSlice";
import { useAuth } from "./useAuth"; // Notice how we use our other custom hook inside here!

export const useChats = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Push the fresh database data into the Redux Cloud
        dispatch(setChats(response.data.chats));
      } catch (error) {
        console.error("Error occurred while getting the chats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [token, dispatch]);
  return { isLoading };
};
