import PropTypes from "prop-types";

export default function Grid({children}) {
  return (
    <div className={"group grid max-w-sm items-start gap-6 md:mx-auto lg:mx-auto lg:max-w-none lg:grid-cols-4"}>
      {children}
    </div>
  )
}

Grid.propTypes = {
  children: PropTypes.node,
}