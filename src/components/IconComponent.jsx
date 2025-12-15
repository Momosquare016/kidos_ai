import {
  FaPaw, FaPalette, FaLeaf, FaRocket, FaDragon,
  FaFlask, FaLandmark, FaGlobeAmericas, FaCalculator, FaLaptopCode,
  FaCode, FaCogs, FaBook, FaUsers, FaSeedling,
  FaVolumeUp, FaPaintBrush, FaSortNumericUp, FaShapes, FaClone,
  FaRandom, FaEquals, FaMapMarkedAlt, FaMicroscope, FaHistory,
  FaPuzzlePiece, FaBrain, FaComments, FaAtom, FaPenFancy
} from 'react-icons/fa';

const iconMap = {
  FaPaw, FaPalette, FaLeaf, FaRocket, FaDragon,
  FaFlask, FaLandmark, FaGlobeAmericas, FaCalculator, FaLaptopCode,
  FaCode, FaCogs, FaBook, FaUsers, FaSeedling,
  FaVolumeUp, FaPaintBrush, FaSortNumericUp, FaShapes, FaClone,
  FaRandom, FaEquals, FaMapMarkedAlt, FaMicroscope, FaHistory,
  FaPuzzlePiece, FaBrain, FaComments, FaAtom, FaPenFancy
};

function IconComponent({ name }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon />;
}

export default IconComponent;
