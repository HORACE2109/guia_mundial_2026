
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Facebook, Twitter, Instagram, Trophy, Plus, Trash2, Lock, Check, ImageOff, Edit2, Settings, X, Save, Upload, Camera, Star, Medal, Shield, ChevronDown, ChevronUp, PlayCircle, LogOut, RefreshCw, Users, Eye, EyeOff, MapPin, Database } from 'lucide-react';
import Countdown from './components/Countdown';
import TeamModal from './components/TeamModal';
import NewsModal from './components/NewsModal';
import HistoryModal from './components/HistoryModal';
import VenueModal from './components/VenueModal';
import VenueCard from './components/VenueCard';
import AdBanner from './components/AdBanner';
import TriviaGame from './components/TriviaGame';
import FanPulse from './components/FanPulse';
import AuthModal from './components/AuthModal';
import FeaturedNews from './components/FeaturedNews';
import GroupsSection from './components/GroupsSection';
import StandingsSection from './components/StandingsSection'; 
import BracketSection from './components/BracketSection'; 
import NewsTicker from './components/NewsTicker';
import { Team, NewsItem, Venue, HistoryEvent, AdZone, GameQuestion, PollConfig, FeaturedNewsItem, WorldCupGroup, BracketMatch, GroupStanding, StandingTeam } from './types';
import { supabase } from './src/supabaseClient'; // Cliente Supabase

// ==========================================
// 🟢 CONFIGURACIÓN INICIAL
// ==========================================
const DEFAULT_LOGO_URL = "https://cdn-icons-png.flaticon.com/512/8637/8637106.png"; 

// --- DATOS INICIALES ---

const INITIAL_FEATURED_NEWS: FeaturedNewsItem = {
  active: true,
  title: "¡EL MUNDO MIRA HACIA NORTEAMÉRICA!",
  subtitle: "La FIFA confirma todos los detalles para el sorteo final. Se esperan sorpresas en la conformación de los 12 grupos.",
  imageUrl: "https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?auto=format&fit=crop&w=1920&q=80",
};

const INITIAL_GROUPS: WorldCupGroup[] = Array.from({ length: 12 }, (_, i) => ({
    id: String.fromCharCode(65 + i), 
    teams: [
        { name: "", flag: "" },
        { name: "", flag: "" },
        { name: "", flag: "" },
        { name: "", flag: "" }
    ]
}));

// Relleno parcial de demo
INITIAL_GROUPS[0].teams = [
    { name: "México", flag: "https://flagcdn.com/w40/mx.png" },
    { name: "Francia", flag: "https://flagcdn.com/w40/fr.png" },
    { name: "Corea del Sur", flag: "https://flagcdn.com/w40/kr.png" },
    { name: "Egipto", flag: "https://flagcdn.com/w40/eg.png" }
]; 
INITIAL_GROUPS[1].teams = [
    { name: "Canadá", flag: "https://flagcdn.com/w40/ca.png" },
    { name: "Alemania", flag: "https://flagcdn.com/w40/de.png" },
    { name: "Senegal", flag: "https://flagcdn.com/w40/sn.png" },
    { name: "Perú", flag: "https://flagcdn.com/w40/pe.png" }
];

// INICIALIZACIÓN DE TABLA DE POSICIONES (Vacía por defecto, basada en 12 grupos)
const INITIAL_STANDINGS: GroupStanding[] = Array.from({ length: 12 }, (_, i) => {
    // Equipos vacíos por defecto
    const emptyTeams: StandingTeam[] = Array.from({ length: 4 }, (__, ti) => ({
        id: `t${i}${ti}`,
        name: "Equipo " + (ti + 1),
        flag: "",
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0
    }));

    return {
        id: String.fromCharCode(65 + i),
        teams: emptyTeams
    };
});
// Relleno Demo para Grupo A
INITIAL_STANDINGS[0].teams = [
    { id: 'mx', name: "México", flag: "https://flagcdn.com/w40/mx.png", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0 },
    { id: 'fr', name: "Francia", flag: "https://flagcdn.com/w40/fr.png", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0 },
    { id: 'kr', name: "Corea Sur", flag: "https://flagcdn.com/w40/kr.png", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0 },
    { id: 'eg', name: "Egipto", flag: "https://flagcdn.com/w40/eg.png", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0 }
];


const INITIAL_BRACKET: BracketMatch[] = [
    { id: 'qf1', label: 'Cuartos 1', team1: {name: 'Ganador 8vo 1'}, team2: {name: 'Ganador 8vo 2'} },
    { id: 'qf2', label: 'Cuartos 2', team1: {name: 'Ganador 8vo 3'}, team2: {name: 'Ganador 8vo 4'} },
    { id: 'sf1', label: 'Semifinal 1', team1: {name: 'TBD'}, team2: {name: 'TBD'} },
    { id: 'final', label: 'GRAN FINAL', team1: {name: 'Finalista 1'}, team2: {name: 'Finalista 2'} },
    { id: 'sf2', label: 'Semifinal 2', team1: {name: 'TBD'}, team2: {name: 'TBD'} },
    { id: 'qf3', label: 'Cuartos 3', team1: {name: 'Ganador 8vo 5'}, team2: {name: 'Ganador 8vo 6'} },
    { id: 'qf4', label: 'Cuartos 4', team1: {name: 'Ganador 8vo 7'}, team2: {name: 'Ganador 8vo 8'} },
];

const INITIAL_NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "Se define el calendario oficial",
    summary: "La FIFA ha revelado las fechas y horarios de los 104 partidos que se disputarán en las 16 sedes.",
    content: "La espera ha terminado. La FIFA reveló este domingo el calendario completo de la Copa Mundial 2026, destacando que el partido inaugural se jugará el 11 de junio en el Estadio Azteca de la Ciudad de México.\n\nEste torneo será histórico no solo por ser el primero con 48 equipos, sino por la logística que implica mover a selecciones y aficionados a través de tres países: Canadá, México y Estados Unidos.\n\nLa gran final está programada para el 19 de julio en el MetLife Stadium de Nueva York/Nueva Jersey, terminando con especulaciones sobre si Dallas o Los Ángeles albergarían el evento cumbre.",
    date: "20 Oct, 2025",
    imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=6qF_fzI4v94"
  },
  {
    id: 2,
    title: "La tecnología del balón 2026",
    summary: "Adidas presenta el prototipo del balón oficial con sensores de movimiento mejorados para el fuera de juego.",
    content: "Adidas ha vuelto a revolucionar el mercado con la presentación de su nuevo esférico para el 2026. Bautizado provisionalmente como 'Terra', el balón incorpora una unidad de medición inercial (IMU) en su centro.\n\nEste sensor envía datos del balón a la sala de videooperaciones 500 veces por segundo, lo que permite una detección del punto de golpeo muy precisa.\n\nCombinado con la tecnología semiautomatizada para la detección del fuera de juego, promete reducir las pausas del VAR a cuestión de segundos.",
    date: "18 Oct, 2025",
    imageUrl: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Fan Fest en Ciudad de México",
    summary: "El Zócalo se prepara para recibir a más de 100,000 aficionados durante la inauguración.",
    content: "El Gobierno de la Ciudad de México ha confirmado que el Zócalo capitalino será la sede principal del FIFA Fan Festival durante el mundial.\n\nSe instalarán pantallas gigantes de 8K, zonas de comida con gastronomía de los 48 países participantes y escenarios para conciertos diarios.\n\nSe espera una afluencia récord, superando lo visto en Rusia 2018 y Qatar 2022, aprovechando la pasión local por el fútbol.",
    date: "15 Oct, 2025",
    imageUrl: "https://images.unsplash.com/photo-1568194157720-8bbe71144617?auto=format&fit=crop&w=800&q=80",
  },
];

const INITIAL_VENUES_DATA: Venue[] = [
  {
    id: 1,
    name: "Estadio Azteca",
    city: "Ciudad de México",
    country: "México",
    capacity: "87,523",
    imageUrl: "https://images.unsplash.com/photo-1679947632898-9b6c426ba736?auto=format&fit=crop&w=800&q=80",
    cityDescription: "El templo del fútbol mexicano. Será el primer estadio en albergar tres Copas del Mundo.",
    climate: "22°C",
    altitude: "2,240m",
    timezone: "UTC-6"
  },
  {
    id: 2,
    name: "MetLife Stadium",
    city: "New York / NJ",
    country: "USA",
    capacity: "82,500",
    imageUrl: "https://images.unsplash.com/photo-1550690991-31dbd0c212db?auto=format&fit=crop&w=800&q=80",
    cityDescription: "Un gigante de acero situado en los pantanos de Nueva Jersey. Sede de la Gran Final.",
    climate: "25°C",
    altitude: "10m",
    timezone: "UTC-5"
  },
  {
    id: 3,
    name: "BC Place",
    city: "Vancouver",
    country: "Canadá",
    capacity: "54,500",
    imageUrl: "https://images.unsplash.com/photo-1566888596782-c7f41cc1813c?auto=format&fit=crop&w=800&q=80",
    cityDescription: "Joya arquitectónica moderna entre montañas y mar.",
    climate: "18°C",
    altitude: "70m",
    timezone: "UTC-8"
  },
  {
    id: 4,
    name: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    capacity: "70,240",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/SoFi_Stadium_interior_during_Super_Bowl_LVI.jpg/640px-SoFi_Stadium_interior_during_Super_Bowl_LVI.jpg",
    cityDescription: "El estadio más caro y tecnológico del mundo, con una pantalla 360 grados.",
    climate: "28°C",
    altitude: "35m",
    timezone: "UTC-8"
  },
  {
    id: 5,
    name: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    capacity: "80,000",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cowboys_Stadium_internal_1.jpg/640px-Cowboys_Stadium_internal_1.jpg",
    cityDescription: "Una catedral del deporte con techo retráctil en el corazón de Texas.",
    climate: "30°C",
    altitude: "180m",
    timezone: "UTC-6"
  },
  {
    id: 6,
    name: "BMO Field",
    city: "Toronto",
    country: "Canadá",
    capacity: "45,000",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/BMO_Field_2016_East_Stand.jpg/640px-BMO_Field_2016_East_Stand.jpg",
    cityDescription: "El hogar del fútbol canadiense a orillas del Lago Ontario.",
    climate: "20°C",
    altitude: "76m",
    timezone: "UTC-5"
  }
];

const INITIAL_TEAMS_DATA: Team[] = [
  { 
    id: 'mex', name: 'México', code: 'mx', fifaAbbr: 'MEX', ranking: 14, squadValue: '€215M', titles: 0, participations: 17, primaryColor: 'green',
    squad: [], description: 'Será el primer país en albergar el Mundial por tercera vez. El Tri busca romper la maldición del quinto partido en casa.',
    coachName: 'Javier Aguirre', coachImage: ''
  },
  { 
    id: 'usa', name: 'USA', code: 'us', fifaAbbr: 'USA', ranking: 11, squadValue: '€348M', titles: 0, participations: 11, primaryColor: 'blue',
    squad: [], description: 'La generación dorada (Pulisic, Reyna, McKennie) llega en su punto de madurez ideal para hacer historia.',
    coachName: 'Mauricio Pochettino', coachImage: ''
  },
  { 
    id: 'can', name: 'Canadá', code: 'ca', fifaAbbr: 'CAN', ranking: 48, squadValue: '€190M', titles: 0, participations: 2, primaryColor: 'red',
    squad: [], description: 'Con Alphonso Davies a la cabeza, Canadá quiere demostrar que su crecimiento futbolístico es una realidad.',
    coachName: 'Jesse Marsch', coachImage: ''
  },
  { 
    id: 'arg', name: 'Argentina', code: 'ar', fifaAbbr: 'ARG', ranking: 1, squadValue: '€780M', titles: 3, participations: 18, primaryColor: 'blue',
    squad: [], description: 'El vigente campeón del mundo lidera las eliminatorias de CONMEBOL con comodidad y buscará el bicampeonato.',
    coachName: 'Lionel Scaloni', coachImage: ''
  },
  { 
    id: 'fra', name: 'Francia', code: 'fr', fifaAbbr: 'FRA', ranking: 2, squadValue: '€1.2B', titles: 2, participations: 16, primaryColor: 'blue',
    squad: [], description: 'Subcampeón actual. Con Mbappé en su prime, Francia es la potencia europea a vencer en las eliminatorias UEFA.',
    coachName: 'Didier Deschamps', coachImage: ''
  },
  { 
    id: 'bra', name: 'Brasil', code: 'br', fifaAbbr: 'BRA', ranking: 5, squadValue: '€940M', titles: 5, participations: 22, primaryColor: 'yellow',
    squad: [], description: 'A pesar de un momento irregular, la Canarinha nunca ha faltado a una cita mundialista y busca su sexta estrella.',
    coachName: 'Dorival Júnior', coachImage: ''
  }
];

const FULL_HISTORY_DATA: HistoryEvent[] = [
    { 
        year: 2022, host: "Qatar", champion: "Argentina", bestPlayer: "Lionel Messi", topScorer: "Kylian Mbappé",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lionel_Messi_WC2022.jpg/640px-Lionel_Messi_WC2022.jpg",
        description: "La consagración definitiva de Lionel Messi. En la que es considerada la mejor final de la historia, Argentina venció a Francia en los penales tras un electrizante 3-3."
    },
    { 
        year: 2018, host: "Rusia", champion: "Francia", bestPlayer: "Luka Modric", topScorer: "Harry Kane",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2018_FIFA_World_Cup_Final%2C_France_v_Croatia_15.jpg/640px-2018_FIFA_World_Cup_Final%2C_France_v_Croatia_15.jpg",
        description: "Francia demostró un poderío físico y una eficacia letal liderada por un joven Kylian Mbappé."
    },
    { 
        year: 2014, host: "Brasil", champion: "Alemania", bestPlayer: "Lionel Messi", topScorer: "James Rodríguez",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Gotze_goal.jpg/640px-Gotze_goal.jpg",
        description: "Alemania se coronó como la primera selección europea en ganar en América. Recordado por el 7-1 a Brasil."
    },
     { 
        year: 2010, host: "Sudáfrica", champion: "España", bestPlayer: "Diego Forlán", topScorer: "Thomas Müller",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Iniesta_Goal_2010.jpg/640px-Iniesta_Goal_2010.jpg",
        description: "El primer mundial en suelo africano vio a España alzar su primera copa con su estilo 'Tiki-Taka'."
    },
    { 
        year: 2006, host: "Alemania", champion: "Italia", bestPlayer: "Zinedine Zidane", topScorer: "Miroslav Klose",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Italy_World_Cup_2006_winners.jpg/640px-Italy_World_Cup_2006_winners.jpg",
        description: "Italia ganó su cuarto título con una defensa impenetrable. Zidane se despidió con un cabezazo."
    },
    { 
        year: 2002, host: "Corea / Japón", champion: "Brasil", bestPlayer: "Oliver Kahn", topScorer: "Ronaldo",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ronaldo_vs_Germany_2002.jpg/640px-Ronaldo_vs_Germany_2002.jpg",
        description: "El renacimiento de Ronaldo Nazário, quien anotó 8 goles para el pentacampeonato."
    },
    { 
        year: 1998, host: "Francia", champion: "Francia", bestPlayer: "Ronaldo", topScorer: "Davor Suker",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Zidane_1998.jpg/640px-Zidane_1998.jpg",
        description: "Zidane se convirtió en leyenda con dos goles en la final ante Brasil."
    },
    { 
        year: 1994, host: "Estados Unidos", champion: "Brasil", bestPlayer: "Romário", topScorer: "Hristo Stoichkov",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Baggio_1994.jpg/640px-Baggio_1994.jpg",
        description: "Brasil rompió una sequía de 24 años tras penales contra Italia."
    },
    { 
        year: 1990, host: "Italia", champion: "Alemania Fed.", bestPlayer: "Salvatore Schillaci", topScorer: "Salvatore Schillaci",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Matthaus_World_Cup_1990.jpg/640px-Matthaus_World_Cup_1990.jpg",
        description: "Alemania ganó 1-0 a Argentina con un penal polémico de Brehme."
    },
    { 
        year: 1986, host: "México", champion: "Argentina", bestPlayer: "Diego Maradona", topScorer: "Gary Lineker",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Maradona_World_Cup_1986_holding_trophy.jpg/640px-Maradona_World_Cup_1986_holding_trophy.jpg",
        description: "El mundial de Diego Maradona y la 'Mano de Dios'."
    }
];

const INITIAL_ADS: AdZone[] = [
    { id: 1, active: false, layout: 'full', image1: '', link1: '', image2: '', link2: '' },
    { id: 2, active: false, layout: 'full', image1: '', link1: '', image2: '', link2: '' },
    { id: 3, active: false, layout: 'full', image1: '', link1: '', image2: '', link2: '' },
];

const INITIAL_QUESTIONS: GameQuestion[] = [
    { id: 1, question: "¿Quién es el máximo goleador en la historia de los mundiales?", options: ["Pelé", "Miroslav Klose", "Ronaldo Nazario", "Lionel Messi"], correctAnswerIndex: 1 },
    { id: 2, question: "¿Qué país ha ganado más copas del mundo?", options: ["Alemania", "Italia", "Argentina", "Brasil"], correctAnswerIndex: 3 },
    { id: 3, question: "¿En qué año se jugó el primer mundial?", options: ["1924", "1930", "1934", "1950"], correctAnswerIndex: 1 },
    { id: 4, question: "¿Cuántos países serán anfitriones del Mundial 2026?", options: ["1", "2", "3", "4"], correctAnswerIndex: 2 },
    { id: 5, question: "¿En qué mundial ocurrió 'La Mano de Dios'?", options: ["1982", "1986", "1990", "1994"], correctAnswerIndex: 1 },
];

const INITIAL_POLL_CONFIG: PollConfig = {
    question: "¿QUIÉN GANARÁ EL 2026?",
    options: [
        { id: 'opt1', label: '🇦🇷 Argentina', color: 'bg-sky-400', votes: 450 },
        { id: 'opt2', label: '🇧🇷 Brasil', color: 'bg-yellow-400', votes: 320 },
        { id: 'opt3', label: '🇫🇷 Francia', color: 'bg-blue-600', votes: 280 },
        { id: 'opt4', label: '🌎 Otro', color: 'bg-gray-500', votes: 150 }
    ]
};

interface EditState {
  isOpen: boolean;
  type: 'logo' | 'venue' | 'history' | 'header' | null;
  targetId?: number;
  currentUrl: string;
}

const App: React.FC = () => {
  // ... (Estados sin cambios)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false); 
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showAllVenues, setShowAllVenues] = useState(false);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState<HistoryEvent | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  const usePersistedState = <T,>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    });
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  };

  const [headerBg, setHeaderBg] = usePersistedState('wc2026_header_bg', "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&w=1920&q=80");
  const [customLogo, setCustomLogo] = usePersistedState('wc2026_logo', DEFAULT_LOGO_URL);
  
  const [featuredNews, setFeaturedNews] = usePersistedState('wc2026_featured', INITIAL_FEATURED_NEWS);
  const [newsData, setNewsData] = usePersistedState('wc2026_news', INITIAL_NEWS_DATA);
  const [venuesData, setVenuesData] = usePersistedState('wc2026_venues', INITIAL_VENUES_DATA);
  const [teamsData, setTeamsData] = usePersistedState('wc2026_teams', INITIAL_TEAMS_DATA);
  const [historyData, setHistoryData] = usePersistedState('wc2026_history', FULL_HISTORY_DATA);
  
  const [groupsData, setGroupsData] = usePersistedState('wc2026_groups', INITIAL_GROUPS);
  const [isGroupsSectionActive, setIsGroupsSectionActive] = usePersistedState('wc2026_groups_active', true);

  // --- ESTADOS DE TABLA DE POSICIONES ---
  const [standingsData, setStandingsData] = usePersistedState('wc2026_standings', INITIAL_STANDINGS);
  const [isStandingsActive, setIsStandingsActive] = usePersistedState('wc2026_standings_active', true);

  const [bracketData, setBracketData] = usePersistedState('wc2026_bracket', INITIAL_BRACKET);
  const [isBracketActive, setIsBracketActive] = usePersistedState('wc2026_bracket_active', true);
  
  const [adZones, setAdZones] = usePersistedState('wc2026_ads', INITIAL_ADS);
  
  const [showCountdown, setShowCountdown] = usePersistedState('wc2026_show_countdown', true);
  
  const [tickerText, setTickerText] = usePersistedState('wc2026_ticker', "BIENVENIDOS A LA GUÍA MUNDIAL 2026 • TODA LA INFORMACIÓN EN UN SOLO LUGAR • MÉXICO, ESTADOS UNIDOS Y CANADÁ");

  const [gameQuestions, setGameQuestions] = usePersistedState('wc2026_questions', INITIAL_QUESTIONS);
  const [pollConfig, setPollConfig] = usePersistedState('wc2026_poll_config', INITIAL_POLL_CONFIG);
  const [hasVoted, setHasVoted] = usePersistedState('wc2026_user_voted', false);

  const [newNews, setNewNews] = useState({ title: '', summary: '', content: '', imageUrl: '', videoUrl: '' });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null); 
  
  const [visibleNewsCount, setVisibleNewsCount] = useState(6);

  const [logoError, setLogoError] = useState(false);
  const [editModal, setEditModal] = useState<EditState>({ isOpen: false, type: null, currentUrl: '' });
  const [tempUrlInput, setTempUrlInput] = useState('');
  const modalFileRef = useRef<HTMLInputElement>(null);
  const newsFileRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  // ... (Mismos handlers)

  const handleAdminClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isAdminMode) {
        setIsAdminMode(false);
    } else {
        setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
      setIsAdminMode(true);
  };

  const handleTeamClick = (team: Team) => { setSelectedTeam(team); setIsTeamModalOpen(true); };
  const handleAddTeam = () => {
    setSelectedTeam({ id: Date.now().toString(), name: 'Nueva Selección', code: '', fifaAbbr: 'N/A', ranking: 0, squadValue: '-', titles: 0, participations: 0, primaryColor: 'gray', description: 'Descripción...', squad: [], coachName: '', coachImage: '' });
    setIsTeamModalOpen(true);
  };
  const handleDeleteTeam = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm('¿Eliminar selección?')) setTeamsData(prev => prev.filter(t => t.id !== id));
  };
  const handleTeamUpdate = (updatedTeam: Team) => {
    setTeamsData(prev => {
        const exists = prev.find(t => t.id === updatedTeam.id);
        return exists ? prev.map(t => t.id === updatedTeam.id ? updatedTeam : t) : [...prev, updatedTeam];
    });
    setSelectedTeam(updatedTeam);
  };

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setIsNewsModalOpen(true);
  };

  const handleLoadMoreNews = () => {
    setVisibleNewsCount(prev => prev + 6);
  };

  const handleEditNews = (e: React.MouseEvent, news: NewsItem) => {
      e.stopPropagation();
      setNewNews({
          title: news.title,
          summary: news.summary,
          content: news.content || '',
          imageUrl: news.imageUrl,
          videoUrl: news.videoUrl || ''
      });
      setEditingNewsId(news.id);
      window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const handleDeleteNews = (e: React.MouseEvent, id: number) => { 
      e.stopPropagation(); 
      e.preventDefault();
      if(window.confirm('¿Borrar noticia permanentemente?')) {
          setNewsData(prev => prev.filter(i => i.id !== id)); 
          if (editingNewsId === id) cancelEditNews();
      }
  };

  const cancelEditNews = () => {
      setNewNews({ title: '', summary: '', content: '', imageUrl: '', videoUrl: '' });
      setEditingNewsId(null);
  };
  
  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewNews({ ...newNews, imageUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title) return;

    if (editingNewsId) {
        setNewsData(prev => prev.map(item => item.id === editingNewsId ? {
            ...item,
            title: newNews.title,
            summary: newNews.summary,
            content: newNews.content,
            imageUrl: newNews.imageUrl,
            videoUrl: newNews.videoUrl
        } : item));
        alert("Noticia actualizada");
    } else {
        const newItem: NewsItem = {
            id: Date.now(),
            title: newNews.title,
            summary: newNews.summary,
            content: newNews.content || newNews.summary, 
            date: new Date().toLocaleDateString(),
            imageUrl: newNews.imageUrl || "https://via.placeholder.com/800x600",
            videoUrl: newNews.videoUrl
        };
        setNewsData([newItem, ...newsData]);
    }
    setNewNews({ title: '', summary: '', content: '', imageUrl: '', videoUrl: '' });
    setEditingNewsId(null);
  };

  const handleHistoryClick = (event: HistoryEvent) => {
      setSelectedHistoryEvent(event);
      setIsHistoryModalOpen(true);
  };

  const handleHistoryUpdate = (updatedEvent: HistoryEvent) => {
      setHistoryData(prev => {
          const exists = prev.find(e => e.year === updatedEvent.year);
          return exists ? prev.map(e => e.year === updatedEvent.year ? updatedEvent : e) : [updatedEvent, ...prev].sort((a,b) => b.year - a.year);
      });
      setSelectedHistoryEvent(updatedEvent);
  };

  const handleAddHistory = () => {
      const newEvent: HistoryEvent = {
          year: new Date().getFullYear(),
          host: 'Nuevo Anfitrión',
          champion: 'Nuevo Campeón',
          bestPlayer: 'Mejor Jugador',
          imageUrl: 'https://via.placeholder.com/800x600'
      };
      setSelectedHistoryEvent(newEvent);
      setIsHistoryModalOpen(true);
  };
  
  const handleDeleteHistory = (e: React.MouseEvent, year: number) => {
      e.stopPropagation();
      if(confirm("¿Borrar este mundial del registro?")) {
          setHistoryData(prev => prev.filter(h => h.year !== year));
      }
  }

  const handleEditVenue = (venue: Venue) => {
      if(isAdminMode) {
          setSelectedVenue(venue);
          setIsVenueModalOpen(true);
      }
  };

  const handleAddVenue = () => {
      const newVenue: Venue = {
          id: Date.now(),
          name: 'Nuevo Estadio',
          city: 'Ciudad',
          country: 'País',
          capacity: '0',
          imageUrl: 'https://via.placeholder.com/800x600',
          cityDescription: 'Descripción...',
          climate: '-',
          altitude: '-',
          timezone: 'UTC'
      };
      setSelectedVenue(newVenue);
      setIsVenueModalOpen(true);
  };

  const handleVenueUpdate = (updatedVenue: Venue) => {
      setVenuesData(prev => {
          const exists = prev.find(v => v.id === updatedVenue.id);
          return exists ? prev.map(v => v.id === updatedVenue.id ? updatedVenue : v) : [...prev, updatedVenue];
      });
  };

  const handleDeleteVenue = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if(confirm("¿Borrar esta sede?")) {
          setVenuesData(prev => prev.filter(v => v.id !== id));
      }
  };

  const handleAdUpdate = (updatedZone: AdZone) => setAdZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));

  const openEditModal = (type: 'logo' | 'venue' | 'history' | 'header', currentUrl: string, id?: number) => {
    setTempUrlInput(currentUrl);
    setEditModal({ isOpen: true, type, targetId: id, currentUrl });
  };
  const handleSaveEdit = () => { if (tempUrlInput.trim()) applyImageChange(tempUrlInput); };
  const applyImageChange = (url: string) => {
    if (editModal.type === 'logo') setCustomLogo(url);
    else if (editModal.type === 'header') setHeaderBg(url);
    setEditModal({ ...editModal, isOpen: false });
    setLogoError(false);
  };
  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setTempUrlInput(reader.result as string); applyImageChange(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleVote = (optionId: string) => {
    const newOptions = pollConfig.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt);
    setPollConfig({ ...pollConfig, options: newOptions });
    setHasVoted(true);
  };

  const visibleNews = newsData.slice(0, visibleNewsCount);
  const visibleHistory = showAllHistory ? historyData : historyData.slice(0, 6);
  const visibleVenues = showAllVenues ? venuesData : venuesData.slice(0, 3);

  return (
    <div className="min-h-screen bg-wc-black text-gray-100 font-sans selection:bg-wc-green selection:text-black">
      
      {/* Admin Bar */}
      {isAdminMode && (
        <div className="fixed bottom-0 left-0 w-full bg-[#00eaff] text-black z-[90] px-4 py-3 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,234,255,0.3)] animate-slide-up border-t-4 border-white">
          <div className="flex items-center gap-3">
            <Settings className="animate-spin-slow" size={24}/>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Modo Edición Activo</p>
              <div className="flex items-center gap-2">
                  <p className="text-xs opacity-80 font-bold">Tienes control total.</p>
                  {/* Indicador de Conexión (Simulado) */}
                  <span className="flex items-center gap-1 text-[10px] bg-white/20 px-2 rounded-full border border-black/10">
                      <Database size={8} className="text-green-600" fill="currentColor"/> DB: ONLINE
                  </span>
              </div>
            </div>
          </div>
          <button onClick={(e) => handleAdminClick(e)} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2 border-2 border-black shadow-lg">
              <LogOut size={12} /> SALIR
          </button>
        </div>
      )}

      {/* Image Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-wc-blue rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Edit2 size={20}/> Editar Imagen</h3>
              <button onClick={() => setEditModal({...editModal, isOpen: false})} className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 hover:border-wc-green cursor-pointer text-center" onClick={() => modalFileRef.current?.click()}>
                <Upload size={32} className="mx-auto mb-2 text-wc-green"/>
                <p className="font-bold text-white">Subir desde PC</p>
                <input type="file" ref={modalFileRef} className="hidden" accept="image/*" onChange={handleModalFileUpload}/>
              </div>
              <div className="text-center text-xs text-gray-500 font-bold uppercase">- O -</div>
              <input type="text" value={tempUrlInput} onChange={(e) => setTempUrlInput(e.target.value)} className="w-full bg-black border border-zinc-700 rounded p-3 text-white" placeholder="Pegar enlace URL..."/>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditModal({...editModal, isOpen: false})} className="px-4 py-2 rounded text-gray-300 hover:bg-white/10">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 flex items-center gap-2 shadow-lg"><Save size={18}/> Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* === HEADER === */}
      <header className="relative min-h-[75vh] flex flex-col justify-center items-center overflow-hidden pb-10">
        <div className="absolute inset-0 z-0">
          <img src={headerBg} alt="Header" className="w-full h-full object-cover"/>
          
          {/* DEGRADADOS CINEMATOGRÁFICOS MULTICAPA */}
          {/* 1. Oscurecimiento General */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* 2. Vignette Radial (Sombra en las esquinas) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80"></div>
          {/* 3. Bottom Fade (Fundido hacia el contenido inferior) */}
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0a0a0a] via-black/80 to-transparent"></div>
          
        </div>
        
        {/* News Ticker Overlay */}
        <div className="absolute top-0 left-0 w-full z-20">
             <NewsTicker text={tickerText} isAdminMode={isAdminMode} onUpdate={setTickerText} />
        </div>

        {isAdminMode && (
            <>
              <button onClick={() => openEditModal('header', headerBg)} className="absolute top-16 right-6 z-50 bg-white text-black border-2 border-zinc-800 px-6 py-2 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all">
                  <Edit2 size={14} /> EDITAR PORTADA
              </button>
              <button 
                onClick={() => setShowCountdown(!showCountdown)}
                className={`absolute top-16 left-6 z-50 px-6 py-2 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 transition-all border-2 border-white hover:scale-105 ${showCountdown ? 'bg-[#a3ff00] text-black' : 'bg-red-600 text-white'}`}
              >
                {showCountdown ? <><Eye size={14}/> RELOJ VISIBLE</> : <><EyeOff size={14}/> RELOJ OCULTO</>}
              </button>
            </>
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-12">
          <div className={`relative mb-6 p-4 rounded-xl bg-black/20 backdrop-blur-sm border transition-all group ${isAdminMode ? 'border-wc-blue cursor-pointer hover:bg-black/40' : 'border-white/10'}`} onClick={() => isAdminMode && openEditModal('logo', customLogo)}>
            {isAdminMode && <div className="absolute -top-3 -right-3 bg-zinc-800 text-white p-2 rounded-full z-30 border-2 border-white"><Edit2 size={16} /></div>}
            {!logoError ? (
               <img src={customLogo} alt="Logo" className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" onError={() => setLogoError(true)}/>
            ) : (
               <div className="flex flex-col items-center justify-center h-24 w-64 text-red-400"><ImageOff size={32}/><span className="text-xs">Error Logo</span></div>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
            GUÍA MUNDIAL <span className="text-wc-green">2026</span>
          </h1>
          <p className="text-2xl md:text-4xl text-gray-200 mb-8 font-black uppercase italic tracking-tighter drop-shadow-md">
              MÉXICO • ESTADOS UNIDOS • CANADÁ
          </p>
          {showCountdown && <Countdown />}
        </div>
      </header>

      {/* === NOTICIA PRINCIPAL === */}
      <FeaturedNews 
        data={featuredNews} 
        isAdminMode={isAdminMode} 
        onUpdate={setFeaturedNews}
      />

      <AdBanner zone={adZones[0]} isAdminMode={isAdminMode} onUpdate={handleAdUpdate} />

      {/* === NOTICIAS === */}
      <section className="py-8 md:py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            ÚLTIMAS <span className="text-wc-green">NOTICIAS</span>
          </h2>
        </div>
        
        {isAdminMode && (
          <div className="mb-10 bg-zinc-900 border border-wc-blue p-6 rounded-xl animate-fade-in shadow-[0_0_20px_rgba(0,234,255,0.05)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-wc-blue font-bold flex items-center gap-2 text-xl">
                    {editingNewsId ? <><Edit2 size={24} /> Editando Noticia</> : <><Plus size={24} /> Nueva Noticia</>}
                </h3>
                {editingNewsId && (
                    <button onClick={cancelEditNews} className="text-xs text-white hover:text-red-400 flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-600">
                        <X size={12}/> Cancelar Edición
                    </button>
                )}
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <input 
                type="text" placeholder="Título de la noticia" value={newNews.title} 
                onChange={(e) => setNewNews({...newNews, title: e.target.value})} 
                className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-wc-blue outline-none transition-colors font-bold text-lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea 
                    placeholder="BAJADA / COPETE: Este texto aparece en la tarjeta (resumen) y destacado al inicio de la nota." 
                    value={newNews.summary} 
                    onChange={(e) => setNewNews({...newNews, summary: e.target.value})} 
                    className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white h-32 focus:border-wc-blue outline-none transition-colors resize-none"
                  />
                  <textarea 
                    placeholder="CUERPO DE LA NOTICIA: Aquí va el RESTO de la nota. NO vuelvas a pegar la bajada aquí." 
                    value={newNews.content} 
                    onChange={(e) => setNewNews({...newNews, content: e.target.value})} 
                    className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white h-32 focus:border-wc-blue outline-none transition-colors resize-none"
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Imagen de Portada</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="URL de la imagen" 
                            value={newNews.imageUrl} 
                            onChange={(e) => setNewNews({...newNews, imageUrl: e.target.value})} 
                            className="flex-grow bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-wc-blue outline-none"
                        />
                        <div 
                            onClick={() => newsFileRef.current?.click()}
                            className="bg-zinc-800 text-white px-4 rounded border border-zinc-700 hover:bg-zinc-700 flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <Upload size={20} />
                        </div>
                        <input type="file" ref={newsFileRef} className="hidden" accept="image/*" onChange={handleNewsImageUpload} />
                    </div>
                </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><PlayCircle size={12} /> Video Youtube (Opcional)</label>
                    <input 
                        type="text" 
                        placeholder="Ej: https://www.youtube.com/watch?v=..." 
                        value={newNews.videoUrl} 
                        onChange={(e) => setNewNews({...newNews, videoUrl: e.target.value})} 
                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-wc-blue outline-none"
                    />
                </div>
              </div>

              {/* BOTÓN PUBLICAR - ALTO CONTRASTE (FONDO AZUL / TEXTO BLANCO) */}
              <button type="submit" className={`w-full font-black px-6 py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] bg-blue-600 text-white hover:bg-blue-500 border border-blue-400`}>
                {editingNewsId ? <><RefreshCw size={20} /> ACTUALIZAR NOTICIA</> : <><Check size={20} /> PUBLICAR NOTICIA</>}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleNews.map((news) => (
            <article 
                key={news.id} 
                onClick={() => handleNewsClick(news)}
                className={`group relative bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 hover:border-wc-blue/50 transition-all hover:-translate-y-2 cursor-pointer hover:shadow-[0_0_30px_rgba(0,234,255,0.1)] ${editingNewsId === news.id ? 'ring-2 ring-yellow-500 opacity-50 pointer-events-none' : ''}`}
            >
              {isAdminMode && (
                  <div className="absolute top-2 left-2 z-50 flex gap-2">
                      <button 
                        onClick={(e) => handleEditNews(e, news)} 
                        className="bg-white text-black p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-transform shadow-xl border border-black/10"
                      >
                        <Edit2 size={16}/>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteNews(e, news.id)} 
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 hover:scale-110 transition-transform shadow-xl border border-white/20"
                      >
                        <Trash2 size={16}/>
                      </button>
                  </div>
              )}
              <div className="h-48 overflow-hidden relative">
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute top-3 right-3 bg-black/70 text-xs font-bold px-2 py-1 rounded text-white backdrop-blur-sm">{news.date}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-wc-blue leading-tight">{news.title}</h3>
                <p className="text-gray-300 text-base line-clamp-3 mb-4">{news.summary}</p>
                <div className="text-wc-green text-sm font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Leer completa <ChevronRight size={16} className="ml-1"/>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {visibleNewsCount < newsData.length && (
            <div className="flex justify-center mt-12">
                <button 
                    onClick={handleLoadMoreNews}
                    className="bg-zinc-800 text-white px-8 py-3 rounded-full font-bold hover:bg-wc-blue hover:text-black transition-colors shadow-lg flex items-center gap-2 group"
                >
                    <Plus size={18} />
                    VER NOTICIAS ANTERIORES
                    <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform"/>
                </button>
            </div>
        )}

      </section>

      {/* === TRIVIA GAME === */}
      <section className="py-8 px-4 bg-black/50 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto">
            <TriviaGame 
                questions={gameQuestions} 
                isAdminMode={isAdminMode} 
                onUpdateQuestions={setGameQuestions}
            />
        </div>
      </section>

      {/* === FASE DE GRUPOS === */}
      <GroupsSection 
         groups={groupsData}
         isActive={isGroupsSectionActive}
         isAdminMode={isAdminMode}
         onUpdate={setGroupsData}
         onToggleActive={setIsGroupsSectionActive}
      />

      {/* === TABLA DE POSICIONES (NUEVO) === */}
      <StandingsSection
         standings={standingsData}
         isActive={isStandingsActive}
         isAdminMode={isAdminMode}
         onUpdate={setStandingsData}
         onToggleActive={setIsStandingsActive}
      />

      <AdBanner zone={adZones[1]} isAdminMode={isAdminMode} onUpdate={handleAdUpdate} />
      
      {/* === FASE FINAL (BRACKET) === */}
      <BracketSection 
         matches={bracketData}
         isActive={isBracketActive}
         isAdminMode={isAdminMode}
         onUpdate={setBracketData}
         onToggleActive={setIsBracketActive}
      />

      {/* === SEDES (ESTADIOS) === */}
      <section className="py-8 bg-zinc-900/30 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="px-4 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                    SEDES & <span className="text-wc-green">ESTADIOS</span>
                </h2>
                <p className="text-gray-300 text-2xl md:text-3xl mt-4 font-black italic tracking-tighter uppercase drop-shadow-md">
                    LOS ESCENARIOS DONDE SE ESCRIBIRÁ LA HISTORIA.
                </p>
              </div>
              {isAdminMode && (
                  <button onClick={handleAddVenue} className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-full font-black flex items-center gap-2 hover:bg-blue-500 shadow-lg transition-all border border-blue-400">
                      <Plus size={20} /> AGREGAR SEDE
                  </button>
              )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleVenues.map((venue) => (
               <div key={venue.id} onClick={() => handleEditVenue(venue)} className={`relative ${isAdminMode ? 'cursor-pointer' : ''}`}>
                   {isAdminMode && (
                       <div className="absolute top-2 left-2 z-30 bg-red-600 text-white p-2 rounded-full hover:bg-red-800 shadow-lg" onClick={(e) => handleDeleteVenue(e, venue.id)}>
                           <Trash2 size={14} />
                       </div>
                   )}
                   <VenueCard venue={venue} isAdminMode={isAdminMode} onUpdateImage={() => handleEditVenue(venue)} />
               </div>
            ))}
          </div>

          {/* Botón Ver Más Sedes */}
          <div className="flex justify-center mt-8">
            {!showAllVenues && venuesData.length > 3 && (
                <button 
                    onClick={() => setShowAllVenues(true)} 
                    className="bg-zinc-800 text-white px-8 py-3 rounded-full font-bold hover:bg-wc-blue hover:text-black transition-colors shadow-lg flex items-center gap-2 group"
                >
                    <MapPin size={18} />
                    SEGUIR VIAJANDO POR LAS SEDES
                    <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform"/>
                </button>
            )}
             {showAllVenues && (
                <button 
                    onClick={() => setShowAllVenues(false)} 
                    className="bg-zinc-800 text-gray-400 px-6 py-3 rounded-full font-bold hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    Ver menos sedes <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform"/>
                </button>
            )}
          </div>

        </div>
      </section>

      {/* === FAN PULSE (ENCUESTA) === */}
      <FanPulse 
        config={pollConfig} 
        isAdminMode={isAdminMode} 
        onUpdateConfig={setPollConfig} 
        hasVoted={hasVoted} 
        onVote={handleVote} 
      />

      <AdBanner zone={adZones[2]} isAdminMode={isAdminMode} onUpdate={handleAdUpdate} />

      {/* === EQUIPOS === */}
      <section className="py-12 px-4 max-w-7xl mx-auto relative">
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-wc-blue/20 border border-wc-blue/30 px-4 py-1.5 rounded-full mb-4 shadow-[0_0_15px_rgba(0,234,255,0.1)]">
              <Users size={16} className="text-wc-blue" />
              <span className="text-wc-blue font-black tracking-widest uppercase text-xs">Los Protagonistas</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
             EQUIPOS <span className="text-wc-green">CLASIFICADOS</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
          {teamsData.map((team) => (
            <div key={team.id} onClick={() => handleTeamClick(team)} className="bg-zinc-800/40 hover:bg-zinc-800 border border-white/5 hover:border-wc-green/50 p-6 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center group relative">
              {isAdminMode && <button onClick={(e) => handleDeleteTeam(e, team.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 z-20"><Trash2 size={16}/></button>}
              <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden border-4 border-zinc-900 shadow-lg group-hover:scale-110 transition-transform">
                {team.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <img src={`https://flagcdn.com/h120/${team.code}.png`} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150?text=?"}/>}
              </div>
              <h3 className="text-xl font-bold text-white">{team.name}</h3>
            </div>
          ))}
          {isAdminMode && (
              <div onClick={handleAddTeam} className="bg-zinc-900/20 hover:bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-wc-blue p-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center group min-h-[200px]">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-white transition-colors"><Plus size={32} className="text-gray-500 group-hover:text-black"/></div>
                  <h3 className="text-lg font-bold text-gray-500 group-hover:text-white">Agregar Selección</h3>
              </div>
          )}
        </div>
      </section>

      {/* === HISTORIA === */}
      <section className="py-12 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="px-4 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-center md:text-left">
                LÍNEA DE <span className="text-wc-purple">HISTORIA</span>
            </h2>
             {isAdminMode && (
                  <button onClick={handleAddHistory} className="mt-4 md:mt-0 bg-purple-600 text-white px-6 py-2 rounded-full font-black flex items-center gap-2 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all border border-purple-400">
                      <Plus size={20} /> AGREGAR MUNDIAL
                  </button>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleHistory.map((event) => (
              <div 
                key={event.year} 
                onClick={() => handleHistoryClick(event)}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 relative flex flex-col cursor-pointer shadow-lg"
              >
                 {isAdminMode && (
                    <button onClick={(e) => handleDeleteHistory(e, event.year)} className="absolute top-2 left-2 z-30 bg-red-600/80 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"><Trash2 size={14}/></button>
                 )}

                 <div className="h-48 relative overflow-hidden">
                    <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <span className="text-5xl font-black text-white/20 absolute -top-8 right-4">{event.year}</span>
                        <div className="relative z-10">
                            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-1">{event.host}</span>
                            <div className="flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /><h3 className="text-2xl font-bold text-white">{event.champion}</h3></div>
                        </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Botón de Ver Más / Ver Menos Historia */}
          <div className="flex justify-center">
            {!showAllHistory && historyData.length > 6 && (
                <button 
                    onClick={() => setShowAllHistory(true)} 
                    className="bg-zinc-800 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-600 transition-colors flex items-center gap-2 group"
                >
                    <RefreshCw size={18} /> Seguir repasando la historia <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform"/>
                </button>
            )}
             {showAllHistory && (
                <button 
                    onClick={() => setShowAllHistory(false)} 
                    className="bg-zinc-800 text-gray-400 px-6 py-3 rounded-full font-bold hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    Ver menos <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform"/>
                </button>
            )}
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-black py-12 px-4 border-t border-zinc-800 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-black text-white tracking-tighter">GUÍA MUNDIAL 2026</h2>
            <p className="text-gray-500 text-sm mt-2">Diseñado para fanáticos.</p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-wc-blue"><Twitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><Facebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-pink-600"><Instagram size={24} /></a>
            
            {/* BOTÓN ADMIN FANTASMA (Camuflado) */}
            <button 
              onDoubleClick={(e) => handleAdminClick(e)} 
              className={`p-2 rounded-full transition-colors duration-500 ${isAdminMode ? 'text-wc-blue hover:text-white' : 'text-black cursor-default hover:text-black'}`}
              title={isAdminMode ? "Salir Modo Admin" : ""}
            >
                {isAdminMode ? <LogOut size={16} /> : <Lock size={16} />}
            </button>
          </div>
        </div>
      </footer>

      {/* MODALES */}
      <TeamModal isOpen={isTeamModalOpen} team={selectedTeam} onClose={() => setIsTeamModalOpen(false)} isAdminMode={isAdminMode} onSave={handleTeamUpdate} />
      <NewsModal isOpen={isNewsModalOpen} news={selectedNews} onClose={() => setIsNewsModalOpen(false)} />
      <HistoryModal isOpen={isHistoryModalOpen} event={selectedHistoryEvent} onClose={() => setIsHistoryModalOpen(false)} onSave={handleHistoryUpdate} isAdminMode={isAdminMode} />
      <VenueModal isOpen={isVenueModalOpen} venue={selectedVenue} onClose={() => setIsVenueModalOpen(false)} onSave={handleVenueUpdate} isAdminMode={isAdminMode} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLoginSuccess} />

    </div>
  );
};

export default App;
