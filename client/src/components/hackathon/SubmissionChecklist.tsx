import { Circle, CircleDot } from 'lucide-react';

interface ChecklistItem {
  label: string;
  required: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { label: 'GitHub repository (public)', required: true },
  { label: 'Live demo or deployed link', required: true },
  { label: 'Project description (max 300 words)', required: true },
  { label: 'Video walkthrough (3 min max)', required: false },
  { label: 'Slide deck / presentation', required: false },
];

interface SubmissionChecklistProps {
  items?: ChecklistItem[];
}

export default function SubmissionChecklist({ items = DEFAULT_CHECKLIST }: SubmissionChecklistProps) {
  return (
    <div className="border border-gray-800 bg-gray-900/40 p-4">
      <h4 className="font-space font-bold text-xs text-orange-400 mb-3">SUBMISSION CHECKLIST</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {item.required ? (
              <CircleDot className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0" strokeDasharray="4 2" />
            )}
            <span className={`font-space text-xs ${item.required ? 'text-gray-300' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="font-space text-[10px] text-gray-600 mt-3">● Required · ○ Optional</p>
    </div>
  );
}
