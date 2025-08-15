'use client';

import { useState } from "react";
import UploadBox from "@/ui/specific/films/components/uploadBox";

export default function AddSeasonForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [number, setNumber] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [serieId, setSerieId] = useState("");
  const [poster, setPoster] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("number", String(number));
    formData.append("title", title);
    formData.append("serieId", serieId);
    if (poster) formData.append("poster", poster);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 bg-neutral rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Ajouter une nouvelle saison</h2>

      {/* Numéro de saison */}
      <div>
        <label className="block mb-1 text-sm font-medium">Numéro de saison</label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Titre de saison */}
      <div>
        <label className="block mb-1 text-sm font-medium">Titre (optionnel)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Titre de la saison"
        />
      </div>

      {/* Série */}
      <div>
        <label className="block mb-1 text-sm font-medium">ID de la série</label>
        <input
          type="text"
          value={serieId}
          onChange={(e) => setSerieId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Upload poster */}
      <div>
        <label className="block mb-1 text-sm font-medium">Affiche (poster)</label>
        <UploadBox />
      </div>

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Enregistrer
      </button>
    </form>
  );
}
