import PropTypes from "prop-types";

export default function Alert({ children }) {
  return (
    <div className={"bg-slate-800 border border-white/10 rounded-md p-3 mt-5 text-slate-400 items-center gap-2 inline-flex"}>
      {children}
    </div>
  )
}

Alert.propTypes = {
  children: PropTypes.node,
}