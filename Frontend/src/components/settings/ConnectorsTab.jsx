import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../utils/apiError";
import { Check, Unplug } from "lucide-react";

const toastStyle = { style: { background: "#18181b", color: "#fff" } };

const ConnectorsTab = () => {
  const [connectors, setConnectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadConnectors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/connectors");
      setConnectors(response.data.connectors);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load connectors."), toastStyle);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnectors();
  }, []);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected) {
      toast.success(`Connected to ${connected}.`, toastStyle);
      loadConnectors();
    } else if (error) {
      toast.error("Failed to connect. Please try again.", toastStyle);
    }

    if (connected || error) {
      const next = new URLSearchParams(searchParams);
      next.delete("connected");
      next.delete("error");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async (id) => {
    try {
      const response = await api.get(`/api/connectors/${id}/start`);
      window.location.href = response.data.url;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to start connection."), toastStyle);
    }
  };

  const disconnect = async (id) => {
    try {
      await api.delete(`/api/connectors/${id}`);
      setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, connected: false } : c)));
      toast.success("Disconnected.", toastStyle);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to disconnect."), toastStyle);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-50">Connectors</h1>
        <ul className="text-sm text-secondary-text mt-2 space-y-1 list-disc list-inside">
          <li>Lets Cortex use tools from other services on your behalf, inside any chat</li>
          <li>Each connector needs your explicit sign-in and approval before it's usable</li>
          <li>Disconnect at any time to revoke access immediately</li>
        </ul>
      </div>

      {isLoading ? (
        <p className="text-secondary-text text-sm">Loading...</p>
      ) : connectors.length === 0 ? (
        <p className="text-secondary-text text-sm">No connectors available yet.</p>
      ) : (
        <ul className="space-y-3">
          {connectors.map((connector) => (
            <li
              key={connector.id}
              className="bg-zinc-950 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-50">{connector.name}</p>
                <p className="text-xs text-secondary-text mt-1">{connector.description}</p>
              </div>

              {connector.connected ? (
                <button
                  onClick={() => disconnect(connector.id)}
                  className="shrink-0 flex items-center gap-1.5 bg-zinc-900 hover:bg-red-600 border border-white/10 hover:border-red-500 text-secondary-text hover:text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  <Check size={16} className="text-green-400" />
                  Connected
                </button>
              ) : (
                <button
                  onClick={() => connect(connector.id)}
                  className="shrink-0 flex items-center gap-1.5 bg-accent hover:opacity-90 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  <Unplug size={16} />
                  Connect
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectorsTab;
