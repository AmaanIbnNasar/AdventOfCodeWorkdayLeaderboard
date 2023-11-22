import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StarProps = {
  starIcon: IconProp;
  colour: string;
};

const Star: React.FC<StarProps> = ({ starIcon, colour }) => {
  return <FontAwesomeIcon icon={starIcon} style={{ color: colour }} />;
};

export default Star;
