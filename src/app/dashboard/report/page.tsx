'use client';

import { useEffect, useState } from 'react';
import { Download,AlertCircle } from 'lucide-react';
import { reportsApi } from '@/lib/api/reports';
import { useAccessToken } from '@/lib/auth/useAccessToken';
import { formatApiError } from '@/lib/api/errors';
import { useToast } from '@/ui/components/toast/ToastProvider';

type ReportItem = { id: string; name: string; status?: string };

const ReportSelectionCard = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const accessToken = useAccessToken();
  const toast = useToast();

  const toggleReport = (report: string) => {
    setSelectedReports(prev => 
      prev.includes(report) 
        ? prev.filter(r => r !== report) 
        : [...prev, report]
    );
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await reportsApi.list(accessToken);
        if (cancelled) return;
        setReports(res.items);
      } catch (err) {
        if (cancelled) return;
        const friendly = formatApiError(err);
        setError(friendly.message);
        toast.error({ title: "Rapports", description: friendly.message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [accessToken, toast]);

  const handleGenerate = async () => {
    if (!selectedReports.length) return;
    setGenerating(true);
    try {
      await reportsApi.download(selectedReports[0], accessToken); // Placeholder: first selected
      toast.success({ title: "Rapports", description: "Téléchargement démarré." });
    } catch (err) {
      const friendly = formatApiError(err);
      toast.error({ title: "Rapports", description: friendly.message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-2 bg-neutral mx-2">
      <div className="rounded-xl shadow-lg overflow-hidden">
        <div className="text-primary-content p-6">
          <h1 className="text-2xl font-bold text-primary">Exportation rapport général</h1>
        </div>
        <div className='bg-white p-4  text-black rounded-xl flex items-center gap-2'>
          <AlertCircle className='w-10 h-10 text-primary'/>
          <div>
            <h4 className='text-bold'>Important</h4>
            <p className="">Veuillez sélectionner uniquement les rapports que vous souhaitez intégrer dans votre rapport général</p>
          </div>
        </div>
        {loading && <div className="alert alert-info text-sm mt-3 mx-4">Chargement des rapports...</div>}
        {error && <div className="alert alert-error text-sm mt-3 mx-4">{error}</div>}
        <div className="divide-y divide-gray-300">
          {reports.map((report) => (
            <div 
              key={report.id}
              className={`p-6 hover:bg-base-200 transition-colors cursor-pointer ${
                selectedReports.includes(report.id) ? 'bg-base-200' : ''
              }`}
              onClick={() => toggleReport(report.id)}
            >
              <div className='w-full flex items-center justify-between'>
                <div className="flex items-center">
                  <Download className="w-10 h-8 mr-2 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">{report.name}</h2>
                    <p className="text-sm opacity-75">{report.status || ""}</p>
                  </div>
                  
                </div>
                <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => toggleReport(report.id)}
                    className="checkbox checkbox-primary mr-4"
                  />
              </div>

              
            </div>
          ))}
          {!loading && !error && reports.length === 0 && (
            <div className="p-4 text-sm text-white/70">Aucun rapport disponible.</div>
          )}
        </div>
        <div className="bg-base-300 p-4 flex justify-end">
          <button 
            className="btn btn-primary"
            disabled={selectedReports.length === 0 || generating}
            onClick={handleGenerate}
          >
            {generating ? "Génération..." : `Générer le rapport (${selectedReports.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportSelectionCard;
