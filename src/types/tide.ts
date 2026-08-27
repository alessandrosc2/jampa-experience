export type TideType = 'low' | 'high';

export type TideCondition = 'excelente' | 'boa' | 'regular' | 'alta';

export interface TideHour {
  hour: string; // "10:02"
  fullHour: string; // "10:02:00"
  level: number; // 0.31
  type: TideType;
  isBestForPiscinas?: boolean;
}

export interface TideDay {
  dateStr: string; // "2026-08-27"
  dayNumber: number; // 27
  monthNumber: number; // 8
  year: number; // 2026
  weekdayName: string; // "Quinta-feira"
  shortWeekday: string; // "Qui"
  formattedDate: string; // "27/08"
  isToday: boolean;
  isTomorrow: boolean;
  hours: TideHour[];
  minTide: TideHour;
  maxTide: TideHour;
  condition: TideCondition;
  conditionLabel: string;
  conditionDesc: string;
  bestWindow: string; // "08:30 às 11:30"
  moonPhase: string;
  moonIcon: string;
}

export interface TideForecast {
  harborName: string;
  state: string;
  meanLevel: number;
  days: TideDay[];
  currentStatus: {
    estimatedLevel: number;
    trend: 'subindo' | 'baixando';
    nextTide: TideHour;
    timeRemainingText: string;
  };
  updatedAt: string;
  source: 'live_api' | 'cached' | 'fallback';
  officialUrl: string;
}
