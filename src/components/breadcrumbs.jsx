import { Breadcrumbs } from "@material-tailwind/react";
 
export function BreadcrumbsDefault(props) {
  return (
    <Breadcrumbs>
      <a href="#" className="opacity-60">
        {props.home}
      </a>
      <a href="#" className="opacity-60">
        {props.page}
      </a>
      <a href="#">{props.subpage}</a>
    </Breadcrumbs>
  );
}