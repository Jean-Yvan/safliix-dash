'use client';

import { useState } from 'react';
import { Download,AlertCircle } from 'lucide-react';

const ReportSelectionCard = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const toggleReport = (report: string) => {
    setSelectedReports(prev => 
      prev.includes(report) 
        ? prev.filter(r => r !== report) 
        : [...prev, report]
    );
  };

  const reports = [
    { id: 'finances', label: 'Finances', description: 'Rapport détaillé des finances' },
    { id: 'users', label: 'Utilisateurs', description: 'Rapport détaillé des utilisateurs' },
    { id: 'movies', label: 'Films', description: 'Rapport détaillé des films' },
    { id: 'series', label: 'Série', description: 'Rapport détaillé des séries' },
    { id: 'ads', label: 'Pub', description: 'Rapport détaillé des pubs' },
  ];

  return (
    <div className="p-2 bg-neutral mx-2">
      {/* Card Container */}
      <div className="rounded-xl shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="text-primary-content p-6">
          <h1 className="text-2xl font-bold text-primary">Exportation rapport général</h1>
    
        </div>
        <div className='bg-white p-4  text-black rounded-xl flex items-center gap-2'>
          <AlertCircle className='w-10 h-10 text-primary'/>
          <div>
            <h4 className='text-bold'>Important</h4>
            <p className="">Veuillez sélectionner uniquement les rapports que vous souhaitez intégrer dans votre rapport général</p>
          </div>
        </div>{/* Card Body */}
        {/* Reports List */}
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
                    <h2 className="text-lg font-semibold">{report.label}</h2>
                    <p className="text-sm opacity-75">{report.description}</p>
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
        </div>

        {/* Card Footer */}
        <div className="bg-base-300 p-4 flex justify-end">
          <button 
            className="btn btn-primary"
            disabled={selectedReports.length === 0}
          >
            Générer le rapport ({selectedReports.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportSelectionCard;