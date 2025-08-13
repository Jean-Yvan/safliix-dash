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
  Settings,
  Monitor
} from "lucide-react";
import Link from "next/link";

const items = [
  { href: "/dashboard", label: "SaFliixboard", icon: LayoutDashboard },
  { href: "/dashboard/films", label: "Film", icon: Film },
  { href: "/dashboard/series", label: "Série", icon: Clapperboard },
  { href: "/dashboard/users", label: "Utilisateur", icon: Users },
  { href: "/dashboard/subscriptions", label: "Abonnement", icon: CreditCard },
  { href: "/dashboard/stats", label: "Statistique",submenus:[
    { href: "/dashboard/stats/films", label: "Films", icon: Film },
    { href: "/dashboard/stats/revenu", label: "Revenu", icon: Clapperboard },
    { href: "/dashboard/stats/users", label: "Utilisateurs", icon: Users },
    { href: "/dashboard/stats/pub", label: "Pub", icon: Monitor },
  ], icon: BarChart2 },
  { href: "/dashboard/pub", label: "Pub", icon: Megaphone },
  { href: "/dashboard/security", label: "Sécurité", icon: Shield },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];



const SidebarItem = ({
  href,
  children,
  icon: Icon,
  pathname,
  submenus = []
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
  pathname: string;
  submenus?: { href: string; label: string; icon: React.ElementType }[];
}) => {
  const hasSubmenus = submenus.length > 0;
  /* const isActive = hasSubmenus
    ? submenus.some(sub => pathname === sub.href || pathname.startsWith(sub.href))
    : pathname === href || pathname.startsWith(href);
 */

  const isActive = () => {
    if(hasSubmenus){
      return submenus.some(sub => pathname === sub.href || pathname.startsWith(sub.href));
    }else {
      if(href == "/dashboard"){
        return href == pathname;
      }else{
        return pathname.startsWith(href);
      }
    }
  }

  return (
    <li className="relative">
      {hasSubmenus ? (
        <div
          className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
            isActive() ? "text-primary font-semibold" : "hover:text-white"
          }`}
        >
          {/* Barre verticale gauche */}
          <div className={`w-1 h-6 rounded-tr-lg rounded-br-lg bg-primary transition-all duration-200 ${isActive() ? "opacity-100" : "opacity-0"}`} />
          {/* Icône + texte */}
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {children}
          </div>
        </div>
      ) : (
        <Link
          href={href}
          className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
            isActive() ? "text-primary font-semibold" : "hover:text-white"
          }`}
        >
          {/* Barre verticale gauche */}
          <div className={`w-1 h-6 rounded-tr-lg rounded-br-lg bg-primary transition-all duration-200 ${isActive() ? "opacity-100" : "opacity-0"}`} />
          {/* Icône + texte */}
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {children}
          </div>
        </Link>
      )}
      {/* Render submenu if available */}
      {hasSubmenus && (
        <ul className="ml-8 mt-2 space-y-1">
          {submenus.map((submenu, idx) => {
            const SubIcon = submenu.icon;
            const subActive = pathname === submenu.href || pathname.startsWith(submenu.href);
            return (
              <li key={idx}>
                <a
                  href={submenu.href}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                    subActive ? "text-primary font-semibold" : "hover:text-white"
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  {submenu.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
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
          submenus={item.submenus || []} 
					icon={item.icon}>
						<span>{item.label}</span>
					</SidebarItem>)}
      </ul>
    </div>
  );
}