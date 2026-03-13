import {
  Rocket,
  Heart,
  Crown,
  Gamepad2,
  Mic,
  Pizza,
  MonitorPlay,
  Sparkles,
  Wind,
  Camera,
  PartyPopper,
  Dice5,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Heart,
  Crown,
  Gamepad2,
  Mic,
  Pizza,
  MonitorPlay,
  Sparkles,
  Wind,
  Camera,
  PartyPopper,
  Dice5,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Rocket;
}
