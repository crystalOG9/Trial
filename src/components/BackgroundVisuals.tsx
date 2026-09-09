"use client";

import { WorkflowNetwork } from "@/components/DynamicWorkflowNetwork";

export function BackgroundVisuals() {
  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[#030712]" />
      <WorkflowNetwork />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHptLTIwIDBoLTF2NjBoMVYwem0tMjAgMGgtMXY2MGgxVjB6bS0xOSAwSDB2NjBoMVYwek0wIDYwaDYwdi0xSDB2MXptMC0yMGg2MHYtMUgwdjF6bTAtMjBoNjB2LTFIMHYxem0wLTE5aDYwVjBIMHYxeiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-40"
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(3,7,18,0.55)_100%)]" />
    </>
  );
}
