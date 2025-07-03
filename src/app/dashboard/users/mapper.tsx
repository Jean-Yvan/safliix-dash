import { ColumnConfig } from "@/ui/components/dataTable";


export type Person = {
  nom: string;
  numero: number;
  tel: string;
  mail: string;
  status: 'actif' | 'inactif';
  genre: 'H' | 'F' | '-';
  date: string; // ex: '2025-06-30'
  imgProfileUrl: string;
};

export const columns : ColumnConfig<Person>[] = [
  {
    key: 'nom',
    header: 'NOM',
    render: (person : Person) => (
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="mask mask-squircle h-12 w-12">
            <img src={person.imgProfileUrl} alt={person.nom} />
          </div>
        </div>
        <div>
          <div className="font-bold">{person.nom}</div>
        </div>
      </div>
    ),
  },
  { key: 'numero', header: 'NUMERO' },
  { key: 'tel', header: 'TEL', className: 'text-primary' },
  { key: 'mail', header: 'MAIL', className: 'text-primary' },
  {
    key: 'status',
    header: 'STATUS',
    render: (person : Person) => (
      <span className={`badge ${person.status === 'actif' ? 'badge-success' : 'badge-error'}`}>
        {person.status}
      </span>
    ),
  },
  {
    key: 'genre',
    header: 'GENRE',
    render: (person : Person) => <span className="badge badge-ghost badge-sm">{person.genre}</span>,
  },
  {
    key: 'numero',
    header: 'TOP USER',
    render: (person : Person) =>
      person.numero <= 3 ? (
        <span className="badge badge-primary">Top</span>
      ) : (
        <span className="badge badge-ghost">-</span>
      ),
  },
  { key: 'date', header: 'DATE' },
];
