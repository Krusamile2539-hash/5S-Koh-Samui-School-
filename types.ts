
export interface Score {
  criterionId: string;
  criterionName: string;
  score: number;
  photo?: string; // photo URL from Firebase Storage, kept for historical data
}

export interface Inspection {
  id: string;
  date: string; // ISO string
  timeSlot: 'morning' | 'evening';
  classroom: string;
  inspector: string;
  inspectorId: string; // Teacher's code
  scores: Score[];
  totalScore: number;
}

export type SchoolLevel = 'junior' | 'senior';

export interface ClassroomScore {
    classroom: string;
    score: number;
    level: SchoolLevel;
}

export interface Teacher {
  code: string;
  name: string;
}
