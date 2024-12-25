import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

export function AdminBreadcrumbs() {
  const location = useLocation();
  const hash = location.hash.replace("#", "");
  const path = hash.split("-");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;
          const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return isLast ? (
            <BreadcrumbItem key={segment}>
              <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={segment}>
              <BreadcrumbLink href={`#${segment}`}>{formattedSegment}</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}