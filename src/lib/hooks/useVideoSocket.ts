import { useEffect } from "react";
import { videoSocket } from "@/lib/socket/socket-client";
import { useAccessToken } from "@/lib/auth/useAccessToken";

// Définition de l'interface pour la progression (doit correspondre au Backend)
export interface VideoProgressPayload {
  s3Key: string;
  stage: string;
  progress: number;
  status: "pending" | "running" | "completed" | "failed";
  updatedAt: string;
  message?: string;
}

// Typage des rooms pour éviter les erreurs de saisie
export type ProgressRoom = "films_room" | "episodes_room";

/**
 * Hook pour s'abonner aux mises à jour de progression vidéo via Socket.io
 * @param room La "salle" à rejoindre (films ou épisodes)
 * @param onUpdate Callback exécuté à chaque mise à jour reçue
 */
export const useVideoSocket = (
  room: ProgressRoom,
  onUpdate: (data: VideoProgressPayload) => void
) => {
  const accessToken = useAccessToken();

  useEffect(() => {
    if (!accessToken) return;

    // Configuration de l'authentification
    videoSocket.auth = { token: accessToken };

    // Connexion manuelle si nécessaire
    if (!videoSocket.connected) {
      videoSocket.connect();
    }

    // Gestion des événements de connexion
    const onConnect = () => {
      console.log(`📡 Connecté au namespace video-progress - Room: ${room}`);
      videoSocket.emit("join_room", room);
    };

    const onDisconnect = () => {
      console.log("❌ Socket déconnecté");
    };

    // Écouteurs d'événements
    videoSocket.on("connect", onConnect);
    videoSocket.on("disconnect", onDisconnect);
    videoSocket.on("progress_update", onUpdate);

    // Si le socket est déjà connecté lors du changement de room/page
    if (videoSocket.connected) {
      videoSocket.emit("join_room", room);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      videoSocket.emit("leave_room", room);
      videoSocket.off("connect", onConnect);
      videoSocket.off("disconnect", onDisconnect);
      videoSocket.off("progress_update", onUpdate);
    };
  }, [accessToken, room, onUpdate]);

  return videoSocket;
};