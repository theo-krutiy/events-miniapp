import { createContext } from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import ExtensionIcon from '@mui/icons-material/Extension';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SchoolIcon from '@mui/icons-material/School';
import Groups3Icon from '@mui/icons-material/Groups3';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';


const categoriesSet = {
  "Street market": <StorefrontIcon />,
  "Sport": <SportsFootballIcon />,
  "Games": <ExtensionIcon />,
  "Activities": <TheaterComedyIcon />,
  "Dating": <PeopleIcon />,
  "Psy": <PsychologyIcon />,
  "Charity help": <LocalHospitalIcon />,
  "Drinks": <LocalBarIcon />,
  "Study": <SchoolIcon />,
  "Work": <Groups3Icon />,
  "Travel": <PublicIcon />,
  "Other":  <SearchIcon />
}

export const CategoriesContext = createContext(categoriesSet)