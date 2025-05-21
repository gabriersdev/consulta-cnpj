import PropTypes from "prop-types";

export default function Arial ({children}) {
  return <span className={"arial"}>{children}</span>
}

Arial.propTypes = {
  children: PropTypes.node,
}