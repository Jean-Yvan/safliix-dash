'use client';

import Header from "@/ui/components/header";
import DataTable from "@/ui/components/dataTable";
import { Person,columns } from "./mapper";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api/users";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { formatApiError } from "@/lib/api/errors";
import { useToast } from "@/ui/components/toast/ToastProvider";

const placeholderAvatar = "/gildas.png";

export default function Page() {
  const [personnes, setPersonnes] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await usersApi.list({ page: 1, pageSize: 20 }, accessToken);
        if (cancelled) return;
        console.dir(res, {depth:2});
        const mapped: Person[] = res.items.map((u, idx) => ({
          nom: u.name,
          numero: idx + 1,
          tel: u.phone || "",
          mail: u.email || "",
          status: (u.status || "").toLowerCase(),
          genre: "-",
          date: u.createdAt || "",
          imgProfileUrl: u.avatar || placeholderAvatar,
        }));
        setPersonnes(mapped);
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        const friendly = formatApiError(err);
        setError(friendly.message);
        toast.error({ title: "Utilisateurs", description: friendly.message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [accessToken, toast]);

  return (
    <div className="">
      <Header title="Utilisateurs"/>
      {loading && <div className="alert alert-info text-sm mt-3">Chargement des utilisateurs...</div>}
      {error && <div className="alert alert-error text-sm mt-3">{error}</div>}
      <div className="mt-4">
       <DataTable data={personnes} columns={columns} />
       {!loading && !error && personnes.length === 0 && (
        <p className="text-sm text-white/70 mt-3">Aucun utilisateur.</p>
       )}
      </div>
  </div>
);
} 
