import { Home, Settings, Image, Type, Layout, FileText, Award, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Accueil",
    icon: Home,
    items: [
      { title: "Logo & Année", href: "#home-settings" },
      { title: "Contenu", href: "#home-content" },
      { title: "Texte défilant", href: "#scrolling-text" },
      { title: "Arrière-plans", href: "#backgrounds" },
    ],
  },
  {
    title: "Compétition",
    icon: Award,
    items: [
      { title: "Catégories", href: "#categories" },
      { title: "Nominés", href: "#nominees" },
    ],
  },
  {
    title: "Paramètres",
    icon: Settings,
    items: [
      { title: "Logo", href: "#logo" },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>
              <section.icon className="w-4 h-4 mr-2" />
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.hash === item.href}
                    >
                      <a href={item.href}>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}