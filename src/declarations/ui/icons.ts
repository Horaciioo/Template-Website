import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Facebook,
  Filter,
  Github,
  Globe,
  Heart,
  Home,
  Inbox,
  Info,
  Instagram,
  Languages,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Moon,
  Phone,
  Quote,
  Scale,
  Search,
  SearchX,
  Send,
  Shield,
  Sparkles,
  Star,
  Sun,
  Tag,
  Trash2,
  TrendingUp,
  Twitter,
  Upload,
  User,
  Users,
  X,
  Youtube,
  Zap,
} from 'lucide-react'

/**
 * Icon registry
 * @type {Object}
 */

export const ICONS = {
  home: Home,
  menu: Menu,
  close: X,
  check: Check,
  search: Search,
  searchEmpty: SearchX,
  filter: Filter,
  inbox: Inbox,
  copy: Copy,
  download: Download,
  upload: Upload,
  delete: Trash2,
  send: Send,
  quote: Quote,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
  zap: Zap,
  trend: TrendingUp,
  users: Users,
  user: User,
  tag: Tag,
  scale: Scale,
  shield: Shield,
  globe: Globe,
  language: Languages,
  calendar: Calendar,
  clock: Clock,
  mail: Mail,
  phone: Phone,
  location: MapPin,
  spinner: Loader2,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: Ban,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  themeLight: Sun,
  themeDark: Moon,
  themeSystem: Monitor,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  x: Twitter,
} as const satisfies Record<string, LucideIcon>

/**
 * Icon name
 * @typedef {keyof typeof ICONS} IconName
 */

export type IconName = keyof typeof ICONS

/**
 * Icon pixel sizes
 * @type {Object}
 */

export const ICON_SIZES = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
} as const

/**
 * Icon size name
 * @typedef {keyof typeof ICON_SIZES} IconSize
 */

export type IconSize = keyof typeof ICON_SIZES
