import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useDispatch } from "react-redux";
import { setChats } from "../store/chatSlice";
import { useAuth } from "./useAuth";

export const useChats = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      setIsLoading(true);

      try {
        const response = await api.get(
          `/api/chats`
        );

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
