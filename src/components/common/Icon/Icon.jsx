import {
  ArrowLeft, Award, Ban, Bell, Bot, Calendar, Camera, ChevronRight, CircleCheck, Clapperboard,
  Compass, Crown, Flag, Flame, Gem, Gift, Globe, Hand, Handshake, Heart, HeartCrack, History,
  Hourglass, House, Image, Infinity as InfinityIcon, Lock, LogOut, Mail, MailOpen, MapPin, Medal,
  MessageCircle, Monitor, Moon, Newspaper, Palette, PenLine, Plus, QrCode, Receipt, Rocket,
  ScanLine, Search, Settings, Share2, Shield, ShoppingBag, Smartphone, Smile, Sparkles, Star,
  Target, TriangleAlert, Trophy, User, UserPlus, Users, X, Zap,
} from 'lucide-react'

// Íconos monocromáticos (como AppIcons del mobile, que no usa emojis).
// Los nombres coinciden con los del mobile: flame, gem, shield, chat, pin…
const ICONS = {
  // Mismos nombres que mobilemutuals/lib/core/theme/app_icons.dart
  flame: Flame,
  gem: Gem,
  shield: Shield,
  check: CircleCheck,
  mail: MailOpen,
  camera: Camera,
  scan: ScanLine,
  chat: MessageCircle,
  compass: Compass,
  pin: MapPin,
  receipt: Receipt,
  target: Target,
  trophy: Trophy,
  medal: Medal,
  bolt: Zap,
  handshake: Handshake,
  lock: Lock,
  feed: Newspaper,
  bag: ShoppingBag,
  star: Star,
  sparkle: Sparkles,
  avatar: Smile,
  film: Clapperboard,
  history: History,
  settings: Settings,
  search: Search,
  // Extra para la web
  home: House,
  users: Users,
  user: User,
  userPlus: UserPlus,
  bell: Bell,
  heart: Heart,
  heartCrack: HeartCrack,
  calendar: Calendar,
  gift: Gift,
  rocket: Rocket,
  alert: TriangleAlert,
  hourglass: Hourglass,
  wave: Hand,
  envelope: Mail,
  qr: QrCode,
  share: Share2,
  plus: Plus,
  close: X,
  globe: Globe,
  infinity: InfinityIcon,
  pen: PenLine,
  palette: Palette,
  phone: Smartphone,
  monitor: Monitor,
  android: Bot,
  ban: Ban,
  flag: Flag,
  crown: Crown,
  award: Award,
  image: Image,
  moon: Moon,
  logout: LogOut,
  back: ArrowLeft,
  chevron: ChevronRight,
}


// <Icon name="flame" /> — hereda el color del texto. filled rellena el ícono (p. ej. el corazón).
export default function Icon({ name, size = 18, strokeWidth = 2, filled = false, label, className = '', ...props }) {
  const Component = ICONS[name] ?? Sparkles
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? 'currentColor' : 'none'}
      className={`icon ${className}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      {...props}
    />
  )
}
