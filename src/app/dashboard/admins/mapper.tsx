import { ColumnConfig } from "@/ui/components/dataTable";
import Link from "next/link";


export type Admin = {
  id:string;
  nom: string;
  numero: number;
  tel: string;
  mail: string;
  status: 'actif' | 'inactif';
  role: string;
  genre: 'H' | 'F' | '-';
  date: string; // ex: '2025-06-30'
  imgProfileUrl: string;
};

export const columns : ColumnConfig<Admin>[] = [
  {
    key: 'nom',
    header: 'NOM',
    render: (admin : Admin) => (
      <Link href={`/dashboard/admins/${admin.id}`} className="flex items-center gap-3 hover:text-primary">
        <div className="avatar">
          <div className="mask mask-squircle h-12 w-12">
            <img src={admin.imgProfileUrl} alt={admin.nom} />
          </div>
        </div>
        <div>
          <div className="font-bold">{admin.nom}</div>
          <p className="text-xs text-primary">Voir les détails</p>
        </div>
      </Link>
    ),
  },
  { key: 'numero', header: 'NUMERO' },
  { key: 'tel', header: 'TEL', className: 'text-primary' },
  { key: 'mail', header: 'MAIL', className: 'text-primary' },
  {
    key: 'status',
    header: 'STATUS',
    render: (admin : Admin) => (
      <span className={`badge ${admin.status === 'actif' ? 'badge-success' : 'badge-error'}`}>
        {admin.status}
      </span>
    ),
  },
  {
    key: 'genre',
    header: 'GENRE',
    render: (admin : Admin) => <span className="badge badge-ghost badge-sm">{admin.genre}</span>,
  },
  
  { key: 'date', header: 'DATE' },
];
