import type { EventType } from "@/backend";
import {
  BookOpen,
  Coffee,
  Dumbbell,
  Film,
  Footprints,
  Gamepad2,
  Globe,
  Music,
  Plane,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const EVENT_TYPE_ICONS: Record<EventType, LucideIcon> = {
  restaurant: Utensils,
  cinema: Film,
  coffee: Coffee,
  walking: Footprints,
  sport: Dumbbell,
  gaming: Gamepad2,
  study: BookOpen,
  concert: Music,
  travel: Plane,
  virtual: Globe,
  other: Sparkles,
};

type EventTypeIconProps = {
  eventType?: EventType | string | null;
  className?: string;
};

export function EventTypeIcon({ eventType, className }: EventTypeIconProps) {
  if (!eventType || !(eventType in EVENT_TYPE_ICONS)) return null;

  const Icon = EVENT_TYPE_ICONS[eventType as EventType];
  return <Icon className={className} aria-hidden="true" />;
}
