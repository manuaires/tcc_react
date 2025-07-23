import { Link } from "react-router-dom";

export default function Button({ link, text, children }) {
  const linkClass =
    "group flex items-center font-semibold justify-center py-1 px-3 text-md font-light text-[#fdf6ed] relative";

  const underlineClass =
    "absolute left-0 -bottom-1 w-full h-0.5 bg-[#fdf6ed] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 rounded";

  return (
    <li>
      <Link to={link} className={linkClass}>
        {children ? children : text}
        <span className={underlineClass}></span>
      </Link>
    </li>
  );
}
