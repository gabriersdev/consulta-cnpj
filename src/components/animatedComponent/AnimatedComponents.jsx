import PropTypes from "prop-types";
import AnimatedComponent from "./AnimatedComponent.jsx";
import {AnimatePresence} from "framer-motion";

const AnimatedComponents = ({children}) => {
  let ret;

  ret = Array.isArray(children) ? children.map((child, key) => {
    return (
      <AnimatePresence mode={"wait"} key={key}>
        <AnimatedComponent>
          {child}
        </AnimatedComponent>
      </AnimatePresence>
    )
  }) : (
    <AnimatePresence mode={"wait"}>
      <AnimatedComponent>
        {children}
      </AnimatedComponent>
    </AnimatePresence>
  )
  
  return <>{ret}</>;
};

AnimatedComponents.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AnimatedComponents;
