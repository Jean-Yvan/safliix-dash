'use client';

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Film,
  Clapperboard,
  Users,
  CreditCard,
  BarChart2,
  Megaphone,
  Shield,
  Settings
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "SaFliixboard", icon: LayoutDashboard },
  { href: "/dashboard/films", label: "Film", icon: Film },
  { href: "/dashboard/series", label: "Série", icon: Clapperboard },
  { href: "/dashboard/users", label: "Utilisateur", icon: Users },
  { href: "/dashboard/subscriptions", label: "Abonnement", icon: CreditCard },
  { href: "/dashboard/stats", label: "Statistique", icon: BarChart2 },
  { href: "/dashboard/pub", label: "Pub", icon: Megaphone },
  { href: "/dashboard/security", label: "Sécurité", icon: Shield },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];



const SidebarItem = ({
  href,
  children,
  icon: Icon,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
  pathname: string;
}) => {
  const isActive = pathname === href || pathname.startsWith(href);

  return (
    <li>
      <a
        href={href}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
          isActive ? "text-primary font-semibold" : "hover:text-white"
        }`}
      >
        {/* Barre verticale gauche */}
        <div className={`w-1 h-6 rounded-tr-lg rounded-br-lg bg-primary transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
        
        {/* Icône + texte */}
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {children}
        </div>
      </a>
    </li>
  );
};




export default function Sidebar() {
	const pathname = usePathname();
  return (
    <div className="w-64 h-full p-4">
      <ul className="menu w-56">
				{items.map((item,index) => <SidebarItem 
					key={index} 
					href={item.href}
					pathname={pathname} 
					icon={item.icon}>
						<span>{item.label}</span>
					</SidebarItem>)}
      </ul>
    </div>
  );
}