export interface NavItem { label: string; href?: string }
export interface SiteNavigation {
  home: string;
  links: NavItem[];
  contact: string;
  index?: string;
}
